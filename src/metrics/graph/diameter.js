/**
 * Graphology Diameter
 * ========================
 *
 * Functions used to compute the diameter of the given graph.
 */
var isGraph = require('graphology-utils/is-graph');
var eccentricity = require('../node/eccentricity.js');

module.exports = function diameter(graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/diameter: given graph is not a valid graphology instance.'
    );

  if (graph.size === 0) return Infinity;

  var max = -Infinity;

  graph.someNode(function (node) {
    var e = eccentricity(graph, node);

    if (e > max) max = e;

    // If the graph is not connected, its diameter is infinite
    return max === Infinity;
  });

  return max;
};
