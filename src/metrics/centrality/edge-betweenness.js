/**
 * Graphology Betweenness Centrality
 * ==================================
 *
 * Function computing betweenness centrality.
 */
var isGraph = require('graphology-utils/is-graph');
var lib = require('graphology-shortest-path/indexed-brandes');
var resolveDefaults = require('graphology-utils/defaults');

var createUnweightedIndexedBrandes = lib.createUnweightedIndexedBrandes;
var createDijkstraIndexedBrandes = lib.createDijkstraIndexedBrandes;

/**
 * Defaults.
 */

var DEFAULTS = {
  edgeCentralityAttribute: 'betweennessCentrality',
  getEdgeWeight: 'weight',
  normalized: true
};

/**
 * Abstract function computing edge beetweenness centrality for the given graph.
 *
 * @param  {boolean}   assign                      - Assign the results to node attributes?
 * @param  {Graph}     graph                       - Target graph.
 * @param  {object}    [options]                   - Options:
 * @param  {object}    [edgeCentralityAttribute] - Name of the attribute to assign.
 * @param  {string}    [getEdgeWeight]           - Name of the weight attribute or getter function.
 * @param  {boolean}   [normalized]              - Should the centrality be normalized?
 * @param  {object}
 */
function abstractEdgeBetweennessCentrality(assign, graph, options) {
  if (!isGraph(graph)) {
    throw new Error(
      'graphology-centrality/edge-beetweenness-centrality: the given graph is not a valid graphology instance.'
    );
  }

  // Solving options
  options = resolveDefaults(options, DEFAULTS);

  var outputName = options.edgeCentralityAttribute;
  var normalized = options.normalized;

  var brandes = options.getEdgeWeight
    ? createDijkstraIndexedBrandes(graph, options.getEdgeWeight)
    : createUnweightedIndexedBrandes(graph);

  var order = graph.order;
  var result, S, P, sigma, coefficient, i, j, m, v, c, w, wn;

  var delta = new Float64Array(order);
  var edgeCentralities = {};

  graph.forEachEdge(function (edge) {
    edgeCentralities[edge] = 0.0;
  });

  var nodes = brandes.index.nodes;

  // Iterating over each node
  for (i = 0; i < order; i++) {
    result = brandes(i);

    S = result[0];
    P = result[1];
    sigma = result[2];

    // Accumulating
    j = S.size;

    while (j--) delta[S.items[S.size - j]] = 0;

    // accumulate edges
    while (S.size !== 0) {
      w = S.pop();
      coefficient = (1 + delta[w]) / sigma[w];
      wn = nodes[w];
      for (j = 0, m = P[w].length; j < m; j++) {
        v = P[w][j];
        c = sigma[v] * coefficient;

        // TODO: this is hardly optimal, but the good
        // solution implies to add some variant of the
        // neighboorhood index and brandes routine which
        // will be quite time-consuming.
        var vw = graph.edge(nodes[v], wn);
        edgeCentralities[vw] += c;

        delta[v] += c;
      }
    }
  }

  // Rescaling
  var scale = null;

  if (normalized) scale = order <= 1 ? null : 1 / (order * (order - 1));
  else scale = graph.type === 'undirected' ? 0.5 : null;

  if (scale !== null) {
    graph.forEachEdge(function (edge) {
      edgeCentralities[edge] *= scale;
    });
  }

  if (assign) {
    return graph.updateEachEdgeAttributes(function (edge, attr) {
      attr[outputName] = edgeCentralities[edge];
      return attr;
    });
  }

  return edgeCentralities;
}

/**
 * Exporting.
 */
var edgeBetweennessCentrality = abstractEdgeBetweennessCentrality.bind(
  null,
  false
);
edgeBetweennessCentrality.assign = abstractEdgeBetweennessCentrality.bind(
  null,
  true
);

module.exports = edgeBetweennessCentrality;
