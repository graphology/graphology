/**
 * Graphology Operators To Undirected Caster
 * ==========================================
 *
 * Function used to cast any graph to an undirected one.
 */
var isGraph = require('graphology-utils/is-graph');

module.exports = function toUndirected(graph, options) {
  if (!isGraph(graph))
    throw new Error('graphology-operators/to-undirected: expecting a valid graphology instance.');

  if (typeof options === 'function')
    options = {mergeEdge: options};

  options = options || {};

  var mergeEdge = typeof options.mergeEdge === 'function' ?
    options.mergeEdge :
    null;

  if (graph.type === 'undirected')
    return graph.copy();

  var undirectedGraph = graph.emptyCopy({type: 'undirected'});

  // Adding undirected edges
  graph.forEachUndirectedEdge(function(edge, attr, source, target) {
    undirectedGraph.addUndirectedEdge(
      source,
      target,
      Object.assign({}, attr)
    );
  });

  // Merging directed edges
  graph.forEachDirectedEdge(function(edge, attr, source, target) {
    var existingEdge = undirectedGraph.edge(source, target);

    if (existingEdge) {
      // We need to merge
      if (mergeEdge)
        undirectedGraph.replaceEdgeAttributes(
          existingEdge,
          mergeEdge(undirectedGraph.getEdgeAttributes(existingEdge), attr)
        );

      return;
    }

    undirectedGraph.addUndirectedEdge(
      source,
      target,
      Object.assign({}, attr)
    );
  });

  return undirectedGraph;
};
