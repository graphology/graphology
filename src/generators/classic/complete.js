/**
 * Graphology Complete Graph Generator
 * ====================================
 *
 * Function generating complete graphs.
 */
var isGraphConstructor = require('graphology-utils/is-graph-constructor');

/**
 * Generates a complete graph with n nodes.
 *
 * @param  {Class}  GraphClass - The Graph Class to instantiate.
 * @param  {number} order      - Number of nodes of the graph.
 * @return {Graph}
 */
module.exports = function complete(GraphClass, order) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/classic/complete: invalid Graph constructor.');

  var graph = new GraphClass();

  var i, j;

  for (i = 0; i < order; i++)
    graph.addNode(i);

  for (i = 0; i < order; i++) {
    for (j = i + 1; j < order; j++) {

      if (graph.type !== 'directed')
        graph.addUndirectedEdge(i, j);

      if (graph.type !== 'undirected') {
        graph.addDirectedEdge(i, j);
        graph.addDirectedEdge(j, i);
      }
    }
  }

  return graph;
};
