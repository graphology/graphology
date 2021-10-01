/**
 * Graphology Erdos-Renyi Graph Generator
 * =======================================
 *
 * Function generating binomial graphs.
 */
var isGraphConstructor = require('graphology-utils/is-graph-constructor'),
    density = require('graphology-metrics/density');

/**
 * Generates a binomial graph graph with n nodes.
 *
 * @param  {Class}    GraphClass    - The Graph Class to instantiate.
 * @param  {object}   options       - Options:
 * @param  {number}     order       - Number of nodes in the graph.
 * @param  {number}     probability - Probability for edge creation.
 * @param  {function}   rng         - Custom RNG function.
 * @return {Graph}
 */
function erdosRenyi(GraphClass, options) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/random/erdos-renyi: invalid Graph constructor.');

  var order = options.order,
      probability = options.probability,
      rng = options.rng || Math.random;

  var graph = new GraphClass();

  // If user gave a size, we need to compute probability
  if (typeof options.approximateSize === 'number') {
    var densityFunction = density[graph.type + 'Density'];
    probability = densityFunction(order, options.approximateSize);
  }

  if (typeof order !== 'number' || order <= 0)
    throw new Error('graphology-generators/random/erdos-renyi: invalid `order`. Should be a positive number.');

  if (typeof probability !== 'number' || probability < 0 || probability > 1)
    throw new Error('graphology-generators/random/erdos-renyi: invalid `probability`. Should be a number between 0 and 1. Or maybe you gave an `approximateSize` exceeding the graph\'s density.');

  if (typeof rng !== 'function')
    throw new Error('graphology-generators/random/erdos-renyi: invalid `rng`. Should be a function.');

  var i, j;

  for (i = 0; i < order; i++)
    graph.addNode(i);

  if (probability <= 0)
    return graph;

  for (i = 0; i < order; i++) {
    for (j = i + 1; j < order; j++) {
      if (graph.type !== 'directed') {
        if (rng() < probability)
          graph.addUndirectedEdge(i, j);
      }

      if (graph.type !== 'undirected') {

        if (rng() < probability)
          graph.addDirectedEdge(i, j);

        if (rng() < probability)
          graph.addDirectedEdge(j, i);
      }
    }
  }

  return graph;
}

/**
 * Generates a binomial graph graph with n nodes using a faster algorithm
 * for sparse graphs.
 *
 * @param  {Class}    GraphClass    - The Graph Class to instantiate.
 * @param  {object}   options       - Options:
 * @param  {number}     order       - Number of nodes in the graph.
 * @param  {number}     probability - Probability for edge creation.
 * @param  {function}   rng         - Custom RNG function.
 * @return {Graph}
 */
function erdosRenyiSparse(GraphClass, options) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/random/erdos-renyi: invalid Graph constructor.');

  var order = options.order,
      probability = options.probability,
      rng = options.rng || Math.random;

  var graph = new GraphClass();

  // If user gave a size, we need to compute probability
  if (typeof options.approximateSize === 'number') {
    var densityFunction = density[graph.type + 'Density'];
    probability = densityFunction(order, options.approximateSize);
  }

  if (typeof order !== 'number' || order <= 0)
    throw new Error('graphology-generators/random/erdos-renyi: invalid `order`. Should be a positive number.');

  if (typeof probability !== 'number' || probability < 0 || probability > 1)
    throw new Error('graphology-generators/random/erdos-renyi: invalid `probability`. Should be a number between 0 and 1. Or maybe you gave an `approximateSize` exceeding the graph\'s density.');

  if (typeof rng !== 'function')
    throw new Error('graphology-generators/random/erdos-renyi: invalid `rng`. Should be a function.');

  for (var i = 0; i < order; i++)
    graph.addNode(i);

  if (probability <= 0)
    return graph;

  var w = -1,
      lp = Math.log(1 - probability),
      lr,
      v;

  if (graph.type !== 'undirected') {
    v = 0;

    while (v < order) {
      lr = Math.log(1 - rng());
      w += 1 + ((lr / lp) | 0);

      // Avoiding self loops
      if (v === w) {
        w++;
      }

      while (v < order && order <= w) {
        w -= order;
        v++;

        // Avoiding self loops
        if (v === w)
          w++;
      }

      if (v < order)
        graph.addDirectedEdge(v, w);
    }
  }

  w = -1;

  if (graph.type !== 'directed') {
    v = 1;

    while (v < order) {
      lr = Math.log(1 - rng());

      w += 1 + ((lr / lp) | 0);

      while (w >= v && v < order) {
        w -= v;
        v++;
      }

      if (v < order)
        graph.addUndirectedEdge(v, w);
    }
  }

  return graph;
}

/**
 * Exporting.
 */
erdosRenyi.sparse = erdosRenyiSparse;
module.exports = erdosRenyi;
