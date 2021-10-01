/**
 * Graphology Ladder Graph Generator
 * ==================================
 *
 * Function generating ladder graphs.
 */
var isGraphConstructor = require('graphology-utils/is-graph-constructor'),
    mergePath = require('graphology-utils/merge-path'),
    range = require('lodash/range');

/**
 * Generates a ladder graph of length n (order will therefore be 2 * n).
 *
 * @param  {Class}  GraphClass - The Graph Class to instantiate.
 * @param  {number} length     - Length of the ladder.
 * @return {Graph}
 */
module.exports = function ladder(GraphClass, length) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/classic/ladder: invalid Graph constructor.');

  var graph = new GraphClass();

  mergePath(graph, range(length));
  mergePath(graph, range(length, length * 2));

  for (var i = 0; i < length; i++)
    graph.addEdge(i, i + length);

  return graph;
};
