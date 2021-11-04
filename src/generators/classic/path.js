/**
 * Graphology Path Graph Generator
 * ================================
 *
 * Function generating path graphs.
 */
var isGraphConstructor = require('graphology-utils/is-graph-constructor');

/**
 * Generates a path graph with n nodes.
 *
 * @param  {Class}  GraphClass - The Graph Class to instantiate.
 * @param  {number} order      - Number of nodes of the graph.
 * @return {Graph}
 */
module.exports = function path(GraphClass, order) {
  if (!isGraphConstructor(GraphClass))
    throw new Error(
      'graphology-generators/classic/path: invalid Graph constructor.'
    );

  var graph = new GraphClass();

  for (var i = 0; i < order - 1; i++) graph.mergeEdge(i, i + 1);

  return graph;
};
