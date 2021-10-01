/**
 * Graphology Krackhardt Kite Graph Generator
 * ===========================================
 *
 * Function generating the Krackhardt kite graph.
 */
var isGraphConstructor = require('graphology-utils/is-graph-constructor'),
    mergeStar = require('graphology-utils/merge-star');

/**
 * Data.
 */
var ADJACENCY = [
  ['Andre', 'Beverley', 'Carol', 'Diane', 'Fernando'],
  ['Beverley', 'Andre', 'Ed', 'Garth'],
  ['Carol', 'Andre', 'Diane', 'Fernando'],
  ['Diane', 'Andre', 'Beverley', 'Carol', 'Ed', 'Fernando', 'Garth'],
  ['Ed', 'Beverley', 'Diane', 'Garth'],
  ['Fernando', 'Andre', 'Carol', 'Diane', 'Garth', 'Heather'],
  ['Garth', 'Beverley', 'Diane', 'Ed', 'Fernando', 'Heather'],
  ['Heather', 'Fernando', 'Garth', 'Ike'],
  ['Ike', 'Heather', 'Jane'],
  ['Jane', 'Ike']
];

/**
 * Function generating the Krackhardt kite graph.
 *
 * @param  {Class} GraphClass - The Graph Class to instantiate.
 * @return {Graph}
 */
module.exports = function krackhardtKite(GraphClass) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/social/krackhardt-kite: invalid Graph constructor.');

  var graph = new GraphClass(),
      i,
      l;

  for (i = 0, l = ADJACENCY.length; i < l; i++)
    mergeStar(graph, ADJACENCY[i]);

  return graph;
};
