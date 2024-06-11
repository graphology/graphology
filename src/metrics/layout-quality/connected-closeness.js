/**
 * Graphology Layout Quality - Connected-closeness
 * ============================================
 *
 * Function computing the layout quality metric named "connected-closeness",
 * designed to provide a quantified statement about the mediation of the topology by the node placement.
 *
 * [Article]:
 * Jacomy, M. (2023). Connected-closeness: A Visual Quantification of Distances in Network Layouts.
 * Journal of Graph Algorithms and Applications, 27(5), 341-404.
 * https://www.jgaa.info/index.php/jgaa/article/view/paper626
 */
var isGraph = require('graphology-utils/is-graph');

module.exports = function connectedCloseness(g, settings) {
  if (!isGraph(g))
    throw new Error(
      'graphology-metrics/layout-quality/connected-closeness: given graph is not a valid graphology instance.'
    );
  
  if (g.size < 2) return {
    deltaMax: undefined,
    ePercentOfDeltaMax: undefined,
    pPercentOfDeltaMax: undefined,
    pEdgeOfDeltaMax: undefined,
    cMax: indicators_of_Delta_max.C
  };  
  
  // Default settings
	settings = settings || {}
	settings.epsilon = settings.epsilon || 0.03; // 3%
	settings.grid_size = settings.grid_size || 10; // This is an optimization thing, it's not the graphical grid

	const pairs_of_nodes_sampled = sample_pairs_of_nodes();
	const connected_pairs = g.edges().map(eid => {
	  const n1 = g.getNodeAttributes(g.source(eid));
	  const n2 = g.getNodeAttributes(g.target(eid));
	  const d = Math.sqrt(Math.pow(n1.x-n2.x, 2)+Math.pow(n1.y-n2.y, 2));
	  return d;
	})

	// Grid search for C_max
	
	let range = [0, Math.max(d3.max(pairs_of_nodes_sampled), d3.max(connected_pairs))];

	let C_max = 0;
	let distances_index = {};
	let Delta, old_C_max, C, i, target_index, indicators_over_Delta;
	do {
		for(i=0; i<=settings.grid_size; i++){
			Delta = range[0] + (range[1]-range[0]) * i / settings.grid_size;
			if (distances_index[Delta] === undefined) {
			  distances_index[Delta] = computeIndicators(Delta, g, pairs_of_nodes_sampled, connected_pairs);
			}
		}
		old_C_max = C_max;
		C_max = 0;
		indicators_over_Delta = Object.values(distances_index);
		indicators_over_Delta.forEach((indicators, i) => {
			C = indicators.C;
			if (C > C_max) {
				C_max = C;
				target_index = i;
			}
		});

		range = [
			indicators_over_Delta[Math.max(0, target_index-1)].Delta,
			indicators_over_Delta[Math.min(indicators_over_Delta.length-1, target_index+1)].Delta
		]
  } while ( (C_max-old_C_max)/C_max >= settings.epsilon/10 )
	
  const Delta_max = find_Delta_max(indicators_over_Delta, settings.epsilon);

  const indicators_of_Delta_max = computeIndicators(Delta_max, g, pairs_of_nodes_sampled, connected_pairs);
  
  // Resistance to misinterpretation
  if (indicators_of_Delta_max.C < 0.1) {
    return {
      deltaMax: undefined,
      ePercentOfDeltaMax: undefined,
      pPercentOfDeltaMax: undefined,
      pEdgeOfDeltaMax: undefined,
      cMax: indicators_of_Delta_max.C
    }
  } else {
    return {
      deltaMax: Delta_max,
      ePercentOfDeltaMax: indicators_of_Delta_max.E_percent,
      pPercentOfDeltaMax: indicators_of_Delta_max.p_percent,
      pEdgeOfDeltaMax: indicators_of_Delta_max.P_edge,
      cMax: indicators_of_Delta_max.C
    }    
  }

  // Internal methods

  // Compute indicators given a distance Delta
	function computeIndicators(Delta, g, pairs_of_nodes_sampled, connected_pairs) {
	  const connected_pairs_below_Delta = connected_pairs.filter(d => d<=Delta);
	  const pairs_below_Delta = pairs_of_nodes_sampled.filter(d => d<=Delta);

	  // Count of edges shorter than Delta
    // note: actual count
	  const E = connected_pairs_below_Delta.length;

	  // Proportion of edges shorter than Delta
    // note: actual count
	  const E_percent = E / connected_pairs.length;

	  // Count of node pairs closer than Delta
    // note: sampling-dependent
	  const p = pairs_below_Delta.length;

	  // Proportion of node pairs closer than Delta
    // note: sampling-dependent, but it cancels out
	  const p_percent = p / pairs_of_nodes_sampled.length;

	  // Connected closeness
	  const C = E_percent - p_percent;

	  // Probability that, considering two nodes closer than Delta, they are connected
    // note: p is sampling-dependent, so we have to normalize it here.
    const possible_edges_per_pair = g.undirected ? 1 : 2;
	  const P_edge = E / (possible_edges_per_pair * p * (g.order * (g.order-1)) / pairs_of_nodes_sampled.length);

	  return {
	    Delta,
	    E_percent,
	    p_percent,
	    P_edge, // Note: P_edge is complentary information, not strictly necessary
	    C
	  };
	}

	function sample_pairs_of_nodes(){
	  if (g.order<2) return [];
	  let samples = [];
	  let node1, node2, n1, n2, d, c;
	  const samples_count = g.size; // We want as many samples as edges
	  if (samples_count<1) return [];
	  for (let i=0; i<samples_count; i++) {
	    node1 = g.nodes()[Math.floor(Math.random()*g.order)]
	    do {
	      node2 = g.nodes()[Math.floor(Math.random()*g.order)]
	    } while (node1 == node2)
	    n1 = g.getNodeAttributes(node1);
	    n2 = g.getNodeAttributes(node2);
	    d = Math.sqrt(Math.pow(n1.x-n2.x, 2)+Math.pow(n1.y-n2.y, 2));
	    samples.push(d);
	  }
	  return samples;
	}

	function find_Delta_max(indicators_over_Delta, epsilon) {
	  const C_max = d3.max(indicators_over_Delta, d => d.C);
	  const Delta_max = d3.min(
	      indicators_over_Delta.filter(d => (
	        d.C >= (1-epsilon) * C_max
	      )
	    ),
	    d => d.Delta
	  );
	  return Delta_max;
	}
};
