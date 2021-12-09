/**
 * Graphology Weighted Size
 * =========================
 *
 * Function returning the sum of the graph's edges' weights.
 */
var isGraph = require('graphology-utils/is-graph');
var createEdgeWeightGetter =
  require('graphology-utils/getters').createEdgeWeightGetter;

/**
 * Defaults.
 */
var DEFAULT_WEIGHT_ATTRIBUTE = 'weight';

/**
 * Weighted size function.
 *
 * @param  {Graph}  graph                    - Target graph.
 * @param  {string|function} [getEdgeWeight] - Name of the weight attribute or getter function.
 * @return {number}
 */
module.exports = function weightedSize(graph, getEdgeWeight) {
  // Handling errors
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/weighted-size: the given graph is not a valid graphology instance.'
    );

  getEdgeWeight = createEdgeWeightGetter(
    getEdgeWeight || DEFAULT_WEIGHT_ATTRIBUTE
  ).fromEntry;

  var size = 0;

  graph.forEachEdge(function (e, a, s, t, sa, ta, u) {
    size += getEdgeWeight(e, a, s, t, sa, ta, u);
  });

  return size;
};
