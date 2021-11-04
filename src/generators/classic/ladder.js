/**
 * Graphology Ladder Graph Generator
 * ==================================
 *
 * Function generating ladder graphs.
 */
var isGraphConstructor = require('graphology-utils/is-graph-constructor');

/**
 * Generates a ladder graph of length n (order will therefore be 2 * n).
 *
 * @param  {Class}  GraphClass - The Graph Class to instantiate.
 * @param  {number} length     - Length of the ladder.
 * @return {Graph}
 */
module.exports = function ladder(GraphClass, length) {
  if (!isGraphConstructor(GraphClass))
    throw new Error(
      'graphology-generators/classic/ladder: invalid Graph constructor.'
    );

  var graph = new GraphClass();

  var i;

  for (i = 0; i < length - 1; i++) graph.mergeEdge(i, i + 1);
  for (i = length; i < length * 2 - 1; i++) graph.mergeEdge(i, i + 1);
  for (i = 0; i < length; i++) graph.addEdge(i, i + length);

  return graph;
};
