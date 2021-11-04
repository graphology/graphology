/**
 * Graphology Operators To Simple Caster
 * ======================================
 *
 * Function used to cast a multi graph to a simple one.
 */
var isGraph = require('graphology-utils/is-graph');
var copyEdge = require('graphology-utils/add-edge').copyEdge;

module.exports = function toSimple(multiGraph) {
  if (!isGraph(multiGraph))
    throw new Error(
      'graphology-operators/to-simple: expecting a valid graphology instance.'
    );

  // The graph is not multi. We just return a plain copy
  if (!multiGraph.multi) return multiGraph.copy();

  // Creating a tweaked empty copy
  var graph = multiGraph.emptyCopy({multi: false});

  // Then we need to process edges
  multiGraph.forEachDirectedEdge(function (edge, attr, source, target) {
    if (graph.hasDirectedEdge(source, target)) return;

    copyEdge(graph, false, edge, source, target, attr);
  });

  multiGraph.forEachUndirectedEdge(function (edge, attr, source, target) {
    if (graph.hasUndirectedEdge(source, target)) return;

    copyEdge(graph, true, edge, source, target, attr);
  });

  return graph;
};
