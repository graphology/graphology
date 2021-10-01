/**
 * Graphology Operators To Simple Caster
 * ======================================
 *
 * Function used to cast a multi graph to a simple one.
 */
var isGraph = require('graphology-utils/is-graph');

module.exports = function toSimple(multiGraph) {
  if (!isGraph(multiGraph))
    throw new Error('graphology-operators/to-simple: expecting a valid graphology instance.');

  // The graph is not multi. We just return a plain copy
  if (!multiGraph.multi)
    return multiGraph.copy();

  // Creating a tweaked empty copy
  var graph = multiGraph.emptyCopy({multi: false});

  // Then we need to process edges
  multiGraph.forEachDirectedEdge(function(edge, attr, source, target) {
    if (graph.hasDirectedEdge(source, target))
      return;

    graph.importEdge(multiGraph.exportEdge(edge));
  });

  multiGraph.forEachUndirectedEdge(function(edge, attr, source, target) {
    if (graph.hasUndirectedEdge(source, target))
      return;

    graph.importEdge(multiGraph.exportEdge(edge));
  });

  return graph;
};
