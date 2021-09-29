/**
 * Graphology Weighted Size
 * =========================
 *
 * Function returning the sum of the graph's edges' weights.
 */
var isGraph = require('graphology-utils/is-graph');

/**
 * Defaults.
 */
var DEFAULT_WEIGHT_ATTRIBUTE = 'weight';

/**
 * Weighted size function.
 *
 * @param  {Graph}  graph             - Target graph.
 * @param  {string} [weightAttribute] - Name of the weight attribute.
 * @return {number}
 */
module.exports = function weightedSize(graph, weightAttribute) {

  // Handling errors
  if (!isGraph(graph))
    throw new Error('graphology-metrics/weighted-size: the given graph is not a valid graphology instance.');

  weightAttribute = weightAttribute || DEFAULT_WEIGHT_ATTRIBUTE;

  var edges = graph.edges(),
      W = 0,
      w,
      i,
      l;

  for (i = 0, l = edges.length; i < l; i++) {
    w = graph.getEdgeAttribute(edges[i], weightAttribute);

    if (typeof w === 'number')
      W += w;
  }

  return W;
};
