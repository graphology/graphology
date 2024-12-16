/**
 * Robust Randomness Variant of the Louvain Algorithm
 * ===================================================
 *
 * Variant of the Louvain implementation that is sufficiently random
 * to correctly sample the whole solution space.
 *
 * This means that:
 *    1. the graph traversal must be truly random
 *    2. the tie-breaker must not be deterministic
 */
var resolveDefaults = require('graphology-utils/defaults');
var isGraph = require('graphology-utils/is-graph');
var inferType = require('graphology-utils/infer-type');
var SparseMap = require('mnemonist/sparse-map');
var FisherYatesPermutation =
  require('pandemonium/fisher-yates-permutation').FisherYatesPermutation;

var indices = require('graphology-indices/louvain');

var UndirectedLouvainIndex = indices.UndirectedLouvainIndex;
var DirectedLouvainIndex = indices.DirectedLouvainIndex;

var DEFAULTS = {
  nodeCommunityAttribute: 'community',
  getEdgeWeight: 'weight',
  resolution: 1,
  rng: Math.random
};

function addWeightToCommunity(map, community, weight) {
  var currentWeight = map.get(community);

  if (typeof currentWeight === 'undefined') currentWeight = 0;

  currentWeight += weight;

  map.set(community, currentWeight);
}

var EPSILON = 1e-10;

function tieBreaker(rng, bestCommunity, currentCommunity, delta, bestDelta) {
  if (Math.abs(delta - bestDelta) < EPSILON) {
    if (bestCommunity === currentCommunity) {
      // NOTE: should we ensure we favor the current community to
      // properly sample the solution space?
      return false;
    } else {
      // Random tie-breaking
      return rng() < 0.5;
    }
  } else if (delta > bestDelta) {
    return true;
  }

  return false;
}

function robustRandomnessUndirectedLouvain(detailed, graph, options) {
  var index = new UndirectedLouvainIndex(graph, {
    getEdgeWeight: options.getEdgeWeight,
    keepDendrogram: detailed,
    resolution: options.resolution
  });

  // State variables
  var moveWasMade = true,
    localMoveWasMade = true;

  // Communities
  var currentCommunity, targetCommunity;
  var communities = new SparseMap(Float64Array, index.C);

  // Traversal
  var start, end, weight, ci, s, i, j, l;

  // Metrics
  var degree, targetCommunityDegree;

  // Moves
  var bestCommunity, bestDelta, deltaIsBetter, delta;

  // Details
  var deltaComputations = 0,
    nodesVisited = 0,
    moves = [],
    localMoves,
    currentMoves;

  var permutation = new FisherYatesPermutation(index.C, options.rng);

  while (moveWasMade) {
    l = index.C;

    moveWasMade = false;
    localMoveWasMade = true;

    localMoves = [];
    moves.push(localMoves);

    // Traditional Louvain iterative traversal of the graph
    while (localMoveWasMade) {
      localMoveWasMade = false;
      currentMoves = 0;

      permutation.reset();

      for (s = 0; s < l; s++) {
        i = permutation.permute();

        nodesVisited++;

        degree = 0;
        communities.clear();

        currentCommunity = index.belongings[i];

        start = index.starts[i];
        end = index.starts[i + 1];

        // Traversing neighbors
        for (; start < end; start++) {
          j = index.neighborhood[start];
          weight = index.weights[start];

          targetCommunity = index.belongings[j];

          // Incrementing metrics
          degree += weight;
          addWeightToCommunity(communities, targetCommunity, weight);
        }

        // Finding best community to move to
        bestDelta = index.fastDeltaWithOwnCommunity(
          i,
          degree,
          communities.get(currentCommunity) || 0,
          currentCommunity
        );
        bestCommunity = currentCommunity;

        for (ci = 0; ci < communities.size; ci++) {
          targetCommunity = communities.dense[ci];

          if (targetCommunity === currentCommunity) continue;

          targetCommunityDegree = communities.vals[ci];

          deltaComputations++;

          delta = index.fastDelta(
            i,
            degree,
            targetCommunityDegree,
            targetCommunity
          );

          deltaIsBetter = tieBreaker(
            options.rng,
            bestCommunity,
            currentCommunity,
            delta,
            bestDelta
          );

          if (deltaIsBetter) {
            bestDelta = delta;
            bestCommunity = targetCommunity;
          }
        }

        // Should we move the node?
        if (bestDelta < 0) {
          // NOTE: this is to allow nodes to move back to their own singleton
          // This code however only deals with modularity (e.g. the condition
          // about bestDelta < 0, which is the delta for moving back to
          // singleton wrt. modularity). Indeed, rarely, the Louvain
          // algorithm can produce such cases when a node would be better in
          // a singleton that in its own community when considering self loops
          // or a resolution != 1. In this case, delta with your own community
          // is indeed less than 0. To handle different metrics, one should
          // consider computing the delta for going back to singleton because
          // it might not be 0.
          bestCommunity = index.isolate(i, degree);

          // If the node was already in a singleton community, we don't consider
          // a move was made
          if (bestCommunity === currentCommunity) continue;
        } else {
          // If no move was made, we continue to next node
          if (bestCommunity === currentCommunity) {
            continue;
          } else {
            // Actually moving the node to a new community
            index.move(i, degree, bestCommunity);
          }
        }

        localMoveWasMade = true;
        currentMoves++;
      }

      localMoves.push(currentMoves);

      moveWasMade = localMoveWasMade || moveWasMade;
    }

    // We continue working on the induced graph
    if (moveWasMade) {
      index.zoomOut();
      permutation.shrink(index.C);
    }
  }

  var results = {
    index: index,
    deltaComputations: deltaComputations,
    nodesVisited: nodesVisited,
    moves: moves
  };

  return results;
}

function robustRandomnessDirectedLouvain(detailed, graph, options) {
  var index = new DirectedLouvainIndex(graph, {
    getEdgeWeight: options.getEdgeWeight,
    keepDendrogram: detailed,
    resolution: options.resolution
  });

  // State variables
  var moveWasMade = true,
    localMoveWasMade = true;

  // Communities
  var currentCommunity, targetCommunity;
  var communities = new SparseMap(Float64Array, index.C);

  // Traversal
  var start, end, offset, out, weight, ci, s, i, j, l;

  // Metrics
  var inDegree, outDegree, targetCommunityDegree;

  // Moves
  var bestCommunity, bestDelta, deltaIsBetter, delta;

  // Details
  var deltaComputations = 0,
    nodesVisited = 0,
    moves = [],
    localMoves,
    currentMoves;

  var permutation = new FisherYatesPermutation(index.C, options.rng);

  while (moveWasMade) {
    l = index.C;

    moveWasMade = false;
    localMoveWasMade = true;

    localMoves = [];
    moves.push(localMoves);

    // Traditional Louvain iterative traversal of the graph
    while (localMoveWasMade) {
      localMoveWasMade = false;
      currentMoves = 0;

      permutation.reset();

      for (s = 0; s < l; s++) {
        i = permutation.permute();

        nodesVisited++;

        inDegree = 0;
        outDegree = 0;
        communities.clear();

        currentCommunity = index.belongings[i];

        start = index.starts[i];
        end = index.starts[i + 1];
        offset = index.offsets[i];

        // Traversing neighbors
        for (; start < end; start++) {
          out = start < offset;
          j = index.neighborhood[start];
          weight = index.weights[start];

          targetCommunity = index.belongings[j];

          // Incrementing metrics
          if (out) outDegree += weight;
          else inDegree += weight;

          addWeightToCommunity(communities, targetCommunity, weight);
        }

        // Finding best community to move to
        bestDelta = index.deltaWithOwnCommunity(
          i,
          inDegree,
          outDegree,
          communities.get(currentCommunity) || 0,
          currentCommunity
        );
        bestCommunity = currentCommunity;

        for (ci = 0; ci < communities.size; ci++) {
          targetCommunity = communities.dense[ci];

          if (targetCommunity === currentCommunity) continue;

          targetCommunityDegree = communities.vals[ci];

          deltaComputations++;

          delta = index.delta(
            i,
            inDegree,
            outDegree,
            targetCommunityDegree,
            targetCommunity
          );

          deltaIsBetter = tieBreaker(
            options.rng,
            bestCommunity,
            currentCommunity,
            delta,
            bestDelta
          );

          if (deltaIsBetter) {
            bestDelta = delta;
            bestCommunity = targetCommunity;
          }
        }

        // Should we move the node?
        if (bestDelta < 0) {
          // NOTE: this is to allow nodes to move back to their own singleton
          // This code however only deals with modularity (e.g. the condition
          // about bestDelta < 0, which is the delta for moving back to
          // singleton wrt. modularity). Indeed, rarely, the Louvain
          // algorithm can produce such cases when a node would be better in
          // a singleton that in its own community when considering self loops
          // or a resolution != 1. In this case, delta with your own community
          // is indeed less than 0. To handle different metrics, one should
          // consider computing the delta for going back to singleton because
          // it might not be 0.
          bestCommunity = index.isolate(i, inDegree, outDegree);

          // If the node was already in a singleton community, we don't consider
          // a move was made
          if (bestCommunity === currentCommunity) continue;
        } else {
          // If no move was made, we continue to next node
          if (bestCommunity === currentCommunity) {
            continue;
          } else {
            // Actually moving the node to a new community
            index.move(i, inDegree, outDegree, bestCommunity);
          }
        }

        localMoveWasMade = true;
        currentMoves++;
      }

      localMoves.push(currentMoves);

      moveWasMade = localMoveWasMade || moveWasMade;
    }

    // We continue working on the induced graph
    if (moveWasMade) {
      index.zoomOut();
      permutation.shrink(index.C);
    }
  }

  var results = {
    index: index,
    deltaComputations: deltaComputations,
    nodesVisited: nodesVisited,
    moves: moves
  };

  return results;
}

/**
 * Function returning the communities mapping of the graph.
 *
 * @param  {boolean} assign             - Assign communities to nodes attributes?
 * @param  {boolean} detailed           - Whether to return detailed information.
 * @param  {Graph}   graph              - Target graph.
 * @param  {object}  options            - Options:
 * @param  {string}    nodeCommunityAttribute - Community node attribute name.
 * @param  {string}    getEdgeWeight          - Weight edge attribute name or getter function.
 * @param  {string}    deltaComputation       - Method to use to compute delta computations.
 * @param  {number}    resolution             - Resolution parameter.
 * @param  {function}  rng                    - RNG function to use.
 * @return {object}
 */
function robustRandomnessLouvain(assign, detailed, graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-communities-louvain: the given graph is not a valid graphology instance.'
    );

  var type = inferType(graph);

  if (type === 'mixed')
    throw new Error(
      'graphology-communities-louvain: cannot run the algorithm on a true mixed graph.'
    );

  // Attributes name
  options = resolveDefaults(options, DEFAULTS);

  // Empty graph case
  var c = 0;

  if (graph.size === 0) {
    if (assign) {
      graph.forEachNode(function (node) {
        graph.setNodeAttribute(node, options.nodeCommunityAttribute, c++);
      });

      return;
    }

    var communities = {};

    graph.forEachNode(function (node) {
      communities[node] = c++;
    });

    if (!detailed) return communities;

    return {
      communities: communities,
      count: graph.order,
      deltaComputations: 0,
      dendrogram: null,
      level: 0,
      modularity: NaN,
      moves: null,
      nodesVisited: 0,
      resolution: options.resolution
    };
  }

  var fn =
    type === 'undirected'
      ? robustRandomnessUndirectedLouvain
      : robustRandomnessDirectedLouvain;

  var results = fn(detailed, graph, options);

  var index = results.index;

  // Standard output
  if (!detailed) {
    if (assign) {
      index.assign(options.nodeCommunityAttribute);
      return;
    }

    return index.collect();
  }

  // Detailed output
  var output = {
    count: index.C,
    deltaComputations: results.deltaComputations,
    dendrogram: index.dendrogram,
    level: index.level,
    modularity: index.modularity(),
    moves: results.moves,
    nodesVisited: results.nodesVisited,
    resolution: options.resolution
  };

  if (assign) {
    index.assign(options.nodeCommunityAttribute);
    return output;
  }

  output.communities = index.collect();

  return output;
}

/**
 * Exporting.
 */
var fn = robustRandomnessLouvain.bind(null, false, false);
fn.assign = robustRandomnessLouvain.bind(null, true, false);
fn.detailed = robustRandomnessLouvain.bind(null, false, true);
fn.defaults = DEFAULTS;

module.exports = fn;
