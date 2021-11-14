/**
 * Graphology Operators To Mixed Caster
 * =====================================
 *
 * Function used to cast any graph to a mixed one.
 */
var isGraph = require('graphology-utils/is-graph');
var copyEdge = require('graphology-utils/add-edge').copyEdge;

module.exports = function toMixed(graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-operators/to-mixed: expecting a valid graphology instance.'
    );

  var mixedGraph = graph.emptyCopy({type: 'mixed'});

  // TODO: do this faster when #.copy get options arg
  graph.forEachEdge(function (e, a, s, t, sa, ta, u) {
    copyEdge(mixedGraph, u, e, s, t, a);
  });

  return mixedGraph;
};
