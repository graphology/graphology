/**
 * Graphology Operators To Directed Caster
 * ==========================================
 *
 * Function used to cast any graph to a directed one.
 */
var isGraph = require('graphology-utils/is-graph');

module.exports = function toDirected(graph, options) {
  if (!isGraph(graph))
    throw new Error('graphology-operators/to-directed: expecting a valid graphology instance.');

  if (typeof options === 'function')
    options = {mergeEdge: options};

  options = options || {};

  var mergeEdge = typeof options.mergeEdge === 'function' ?
    options.mergeEdge :
    null;

  if (graph.type === 'directed')
    return graph.copy();

  var directedGraph = graph.emptyCopy({type: 'directed'});

  // Adding directed edges
  graph.forEachDirectedEdge(function(edge, attr, source, target) {
    directedGraph.addDirectedEdge(
      source,
      target,
      Object.assign({}, attr)
    );
  });

  // Merging undirected edges
  graph.forEachUndirectedEdge(function(edge, attr, source, target) {
    var existingOutEdge = graph.type === 'mixed' && directedGraph.edge(source, target),
        existingInEdge = graph.type === 'mixed' && directedGraph.edge(target, source);

    if (existingOutEdge) {
      directedGraph.replaceEdgeAttributes(
        existingOutEdge,
        mergeEdge(directedGraph.getEdgeAttributes(existingOutEdge), attr)
      );
    }
    else {
      directedGraph.addDirectedEdge(
        source,
        target,
        Object.assign({}, attr)
      );
    }

    if (existingInEdge) {
      directedGraph.replaceEdgeAttributes(
        existingInEdge,
        mergeEdge(directedGraph.getEdgeAttributes(existingInEdge), attr)
      );
    }
    else {
      directedGraph.addDirectedEdge(
        target,
        source,
        Object.assign({}, attr)
      );
    }
  });

  return directedGraph;
};
