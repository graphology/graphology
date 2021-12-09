/**
 * Graphology Simple Size
 * =======================
 *
 * Function returning the simple size of a graph, i.e. the size it would have
 * if it we assume it is a simple graph.
 */
var isGraph = require('graphology-utils/is-graph');

/**
 * Simple size function.
 *
 * @param  {Graph}  graph - Target graph.
 * @return {number}
 */
module.exports = function simpleSize(graph) {
  // Handling errors
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/simple-size: the given graph is not a valid graphology instance.'
    );

  if (!graph.multi) return graph.size;

  var u = 0;
  var d = 0;

  function accumulateUndirected() {
    u++;
  }

  function accumulateDirected() {
    d++;
  }

  graph.forEachNode(function (node) {
    if (graph.type !== 'directed')
      graph.forEachUndirectedNeighbor(node, accumulateUndirected);

    if (graph.type !== 'undirected')
      graph.forEachOutNeighbor(node, accumulateDirected);
  });

  return u / 2 + d;
};
