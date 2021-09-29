/**
 * Graphology Edge Adders
 * =======================
 *
 * Generic edge addition functions that can be used to avoid nasty repetitive
 * conditions.
 */

exports.addEdge = function addEdge(graph, undirected, key, source, target, attributes) {
  if (undirected) {
    if (key === null || key === undefined)
      graph.addUndirectedEdge(source, target, attributes);
    else
      graph.addUndirectedEdgeWithKey(key, source, target, attributes);
  }
  else {
    if (key === null || key === undefined)
      graph.addDirectedEdge(source, target, attributes);
    else
      graph.addDirectedEdgeWithKey(key, source, target, attributes);
  }
};

exports.copyEdge = function copyEdge(graph, undirected, key, source, target, attributes) {
  attributes = Object.assign({}, attributes);

  if (undirected) {
    if (key === null || key === undefined)
      graph.addUndirectedEdge(source, target, attributes);
    else
      graph.addUndirectedEdgeWithKey(key, source, target, attributes);
  }
  else {
    if (key === null || key === undefined)
      graph.addDirectedEdge(source, target, attributes);
    else
      graph.addDirectedEdgeWithKey(key, source, target, attributes);
  }
};

exports.mergeEdge = function mergeEdge(graph, undirected, key, source, target, attributes) {
  if (undirected) {
    if (key === null || key === undefined)
      graph.mergeUndirectedEdge(source, target, attributes);
    else
      graph.mergeUndirectedEdgeWithKey(key, source, target, attributes);
  }
  else {
    if (key === null || key === undefined)
      graph.mergeDirectedEdge(source, target, attributes);
    else
      graph.mergeDirectedEdgeWithKey(key, source, target, attributes);
  }
};

exports.updateEdge = function updateEdge(graph, undirected, key, source, target, attributes) {
  if (undirected) {
    if (key === null || key === undefined)
      graph.updateUndirectedEdge(source, target, attributes);
    else
      graph.updateUndirectedEdgeWithKey(key, source, target, attributes);
  }
  else {
    if (key === null || key === undefined)
      graph.updateDirectedEdge(source, target, attributes);
    else
      graph.updateDirectedEdgeWithKey(key, source, target, attributes);
  }
};
