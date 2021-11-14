/**
 * Graphology Operators To Multi Caster
 * =====================================
 *
 * Function used to cast any graph to a multi one.
 */
var isGraph = require('graphology-utils/is-graph');
var copyEdge = require('graphology-utils/add-edge').copyEdge;

module.exports = function toMulti(graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-operators/to-multi: expecting a valid graphology instance.'
    );

  var multiGraph = graph.emptyCopy({multi: true});

  // TODO: do this faster when #.copy get options arg
  graph.forEachEdge(function (e, a, s, t, sa, ta, u) {
    copyEdge(multiGraph, u, e, s, t, a);
  });

  return multiGraph;
};
