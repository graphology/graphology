/**
 * Graphology Connected Caveman Graph Generator
 * =============================================
 *
 * Function generating connected caveman graphs.
 *
 * [Article]:
 * Watts, D. J. 'Networks, Dynamics, and the Small-World Phenomenon.'
 * Amer. J. Soc. 105, 493-527, 1999.
 */
var isGraphConstructor = require('graphology-utils/is-graph-constructor'),
    empty = require('../classic/empty.js');

/**
 * Function returning a connected caveman graph with desired properties.
 *
 * @param  {Class}    GraphClass    - The Graph Class to instantiate.
 * @param  {number}   l             - The number of cliques in the graph.
 * @param  {number}   k             - Size of the cliques.
 * @return {Graph}
 */
module.exports = function connectedCaveman(GraphClass, l, k) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/community/connected-caveman: invalid Graph constructor.');

  var m = l * k;

  var graph = empty(GraphClass, m);

  if (k < 2)
    return graph;

  var i,
      j,
      s;

  for (i = 0; i < m; i += k) {
    for (j = i; j < i + k; j++) {
      for (s = j + 1; s < i + k; s++) {
        if (j !== i || j !== s - 1)
          graph.addEdge(j, s);
      }
    }

    if (i > 0)
      graph.addEdge(i, (i - 1) % m);
  }

  graph.addEdge(0, m - 1);

  return graph;
};
