/**
 * Graphology Girvan-Newman Graph Generator
 * =========================================
 *
 * Function generating graphs liks the one used to test the Girvan-Newman
 * community algorithm.
 *
 * [Reference]:
 * http://www.pnas.org/content/99/12/7821.full.pdf
 *
 * [Article]:
 * Community Structure in  social and biological networks.
 * Girvan Newman, 2002. PNAS June, vol 99 n 12
 */
var isGraphConstructor = require('graphology-utils/is-graph-constructor');

/**
 * Generates a binomial graph graph with n nodes.
 *
 * @param  {Class}    GraphClass    - The Graph Class to instantiate.
 * @param  {object}   options       - Options:
 * @param  {number}     zOut        - zOut parameter.
 * @param  {function}   rng         - Custom RNG function.
 * @return {Graph}
 */
module.exports = function girvanNewman(GraphClass, options) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/random/girvan-newman: invalid Graph constructor.');

  var zOut = options.zOut,
      rng = options.rng || Math.random;

  if (typeof zOut !== 'number')
    throw new Error('graphology-generators/random/girvan-newman: invalid `zOut`. Should be a number.');

  if (typeof rng !== 'function')
    throw new Error('graphology-generators/random/girvan-newman: invalid `rng`. Should be a function.');

  var pOut = zOut / 96,
      pIn = (16 - pOut * 96) / 31,
      graph = new GraphClass(),
      random,
      i,
      j;

  for (i = 0; i < 128; i++)
    graph.addNode(i);

  for (i = 0; i < 128; i++) {
    for (j = i + 1; j < 128; j++) {
      random = rng();

      if (i % 4 === j % 4) {
        if (random < pIn)
          graph.addEdge(i, j);
      }
      else {
        if (random < pOut)
          graph.addEdge(i, j);
      }
    }
  }

  return graph;
};
