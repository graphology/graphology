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

  graph.forEachEdge(function (key, attr, source, target, _sa, _ta, undirected) {
    if (undirected) {
      // Import undirected edge
      copyEdge(reversed, true, key, source, target, attr);
    } else {
      // Reverse directed edge
      copyEdge(reversed, false, key, target, source, attr);
    }
  });

  return reversed;
};
