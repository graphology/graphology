/**
 * Graphology Sparsification Utils
 * ================================
 *
 * Miscellaneous utils used by graphology-sparsification.
 */
exports.createAssignFunction = function (fn, graph, options) {
  const name = (options || {}).edgeRedundantAttribute || 'redundant';

  const edges = fn(graph, options);

  for (let i = 0, l = edges.length; i < l; i++) {
    graph.setEdgeAttribute(edges[i], name, true);
  }
};

exports.createPruneFunction = function (fn, graph, options) {
  const edges = fn(graph, options);

  for (let i = 0, l = edges.length; i < l; i++) {
    graph.dropEdge(edges[i]);
  }
};
