/**
 * Graphology Caveman Graph Generator
 * ===================================
 *
 * Function generating caveman graphs.
 *
 * [Article]:
 * Watts, D. J. 'Networks, Dynamics, and the Small-World Phenomenon.'
 * Amer. J. Soc. 105, 493-527, 1999.
 */
var isGraphConstructor = require('graphology-utils/is-graph-constructor'),
  empty = require('../classic/empty.js');

/**
 * Function returning a caveman graph with desired properties.
 *
 * @param  {Class}    GraphClass    - The Graph Class to instantiate.
 * @param  {number}   l             - The number of cliques in the graph.
 * @param  {number}   k             - Size of the cliques.
 * @return {Graph}
 */
module.exports = function caveman(GraphClass, l, k) {
  if (!isGraphConstructor(GraphClass))
    throw new Error(
      'graphology-generators/community/caveman: invalid Graph constructor.'
    );

  var m = l * k;

  var graph = empty(GraphClass, m);

  if (k < 2) return graph;

  var i, j, s;

  for (i = 0; i < m; i += k) {
    for (j = i; j < i + k; j++) {
      for (s = j + 1; s < i + k; s++) graph.addEdge(j, s);
    }
  }

  return graph;
};
