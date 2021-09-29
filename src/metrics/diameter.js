/**
 * Graphology Diameter
 * ========================
 *
 * Functions used to compute the diameter of the given graph.
 */
var isGraph = require('graphology-utils/is-graph');
var eccentricity = require('./eccentricity.js');

module.exports = function diameter(graph) {
  if (!isGraph(graph))
    throw new Error('graphology-metrics/diameter: given graph is not a valid graphology instance.');

  if (graph.size === 0)
    return Infinity;

  var diameter = -Infinity, ecc = 0;
  var nodes = graph.nodes()

  for (var i = 0, l = nodes.length; i < l ; i++) {
    ecc = eccentricity(graph, nodes[i]);
    if (ecc > diameter)
      diameter = ecc;
    if (diameter === Infinity)
      break;
  }

  return diameter;
};
