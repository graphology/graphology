/**
 * Graphology Operators To Directed Caster
 * ========================================
 *
 * Function used to cast any graph to a directed one.
 */
var isGraph = require('graphology-utils/is-graph');
var copyEdge = require('graphology-utils/add-edge').copyEdge;

module.exports = function toDirected(graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-operators/to-directed: expecting a valid graphology instance.'
    );

  if (typeof options === 'function') options = {mergeEdge: options};

  options = options || {};

  var mergeEdge =
    typeof options.mergeEdge === 'function' ? options.mergeEdge : null;

  if (graph.type === 'directed') return graph.copy();

  var directedGraph = graph.emptyCopy({type: 'directed'});

  // Adding directed edges
  graph.forEachDirectedEdge(function (edge, attr, source, target) {
    copyEdge(directedGraph, false, edge, source, target, attr);
  });

  // Merging undirected edges
  graph.forEachUndirectedEdge(function (_, attr, source, target) {
    var existingOutEdge =
      !graph.multi &&
      graph.type === 'mixed' &&
      directedGraph.edge(source, target);

    var existingInEdge =
      !graph.multi &&
      graph.type === 'mixed' &&
      directedGraph.edge(target, source);

    if (existingOutEdge) {
      directedGraph.replaceEdgeAttributes(
        existingOutEdge,
        mergeEdge(directedGraph.getEdgeAttributes(existingOutEdge), attr)
      );
    } else {
      copyEdge(directedGraph, false, null, source, target, attr);
    }

    // Don't add self-loops twice
    if (source === target) return;

    if (existingInEdge) {
      directedGraph.replaceEdgeAttributes(
        existingInEdge,
        mergeEdge(directedGraph.getEdgeAttributes(existingInEdge), attr)
      );
    } else {
      copyEdge(directedGraph, false, null, target, source, attr);
    }
  });

  return directedGraph;
};
