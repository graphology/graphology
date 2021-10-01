/**
 * Graphology Florentine Families Graph Generator
 * ===============================================
 *
 * Function generating the Florentine Families graph.
 *
 * [Reference]:
 * Ronald L. Breiger and Philippa E. Pattison
 * Cumulated social roles: The duality of persons and their algebras,1
 * Social Networks, Volume 8, Issue 3, September 1986, Pages 215-256
 */
var isGraphConstructor = require('graphology-utils/is-graph-constructor');

/**
 * Data.
 */
var EDGES = [
  ['Acciaiuoli', 'Medici'],
  ['Castellani', 'Peruzzi'],
  ['Castellani', 'Strozzi'],
  ['Castellani', 'Barbadori'],
  ['Medici', 'Barbadori'],
  ['Medici', 'Ridolfi'],
  ['Medici', 'Tornabuoni'],
  ['Medici', 'Albizzi'],
  ['Medici', 'Salviati'],
  ['Salviati', 'Pazzi'],
  ['Peruzzi', 'Strozzi'],
  ['Peruzzi', 'Bischeri'],
  ['Strozzi', 'Ridolfi'],
  ['Strozzi', 'Bischeri'],
  ['Ridolfi', 'Tornabuoni'],
  ['Tornabuoni', 'Guadagni'],
  ['Albizzi', 'Ginori'],
  ['Albizzi', 'Guadagni'],
  ['Bischeri', 'Guadagni'],
  ['Guadagni', 'Lamberteschi']
];

/**
 * Function generating the florentine families graph.
 *
 * @param  {Class} GraphClass - The Graph Class to instantiate.
 * @return {Graph}
 */
module.exports = function florentineFamilies(GraphClass) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/social/florentine-families: invalid Graph constructor.');

  var graph = new GraphClass(),
      edge,
      i,
      l;

  for (i = 0, l = EDGES.length; i < l; i++) {
    edge = EDGES[i];

    graph.mergeEdge(edge[0], edge[1]);
  }

  return graph;
};
