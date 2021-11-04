/**
 * Graphology Revers Operator
 * ===========================
 */
var isGraph = require('graphology-utils/is-graph');
var copyEdge = require('graphology-utils/add-edge').copyEdge;

/**
 * Function reversing the given graph.
 *
 * @param  {Graph} graph - Target graph.
 * @return {Graph}
 */
module.exports = function reverse(graph) {
  if (!isGraph(graph))
    throw new Error('graphology-operators/reverse: invalid graph.');

  var reversed = graph.emptyCopy();

  // Importing undirected edges
  graph.forEachUndirectedEdge(function (key, attr, source, target) {
    copyEdge(reversed, true, key, source, target, attr);
  });

  // Reversing directed edges
  graph.forEachDirectedEdge(function (key, attr, source, target) {
    copyEdge(reversed, false, key, target, source, attr);
  });

  return reversed;
};
