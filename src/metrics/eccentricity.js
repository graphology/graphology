/**
 * Graphology Eccentricity
 * ========================
 *
 * Functions used to compute the eccentricity of each node of a given graph.
 */
var isGraph = require('graphology-utils/is-graph');
var singleSourceLength =
  require('graphology-shortest-path/unweighted').singleSourceLength;

module.exports = function eccentricity(graph, node) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/eccentricity: given graph is not a valid graphology instance.'
    );

  if (graph.size === 0) return Infinity;

  var ecc = -Infinity;

  var lengths = singleSourceLength(graph, node);

  var otherNode;

  var pathLength,
    l = 0;

  for (otherNode in lengths) {
    pathLength = lengths[otherNode];

    if (pathLength > ecc) ecc = pathLength;

    l++;
  }

  if (l < graph.order) return Infinity;

  return ecc;
};
