/**
 * Graphology Random Clusters Graph Generator
 * ===========================================
 *
 * Function generating a graph containing the desired number of nodes & edges
 * and organized in the desired number of clusters.
 *
 * [Author]:
 * Alexis Jacomy
 */
var isGraphConstructor = require('graphology-utils/is-graph-constructor');

/**
 * Generates a random graph with clusters.
 *
 * @param  {Class}    GraphClass    - The Graph Class to instantiate.
 * @param  {object}   options       - Options:
 * @param  {number}     clusterDensity - Probability that an edge will link two
 *                                       nodes of the same cluster.
 * @param  {number}     order          - Number of nodes.
 * @param  {number}     size           - Number of edges.
 * @param  {number}     clusters       - Number of clusters.
 * @param  {function}   rng            - Custom RNG function.
 * @return {Graph}
 */
module.exports = function(GraphClass, options) {
  if (!isGraphConstructor(GraphClass))
    throw new Error('graphology-generators/random/clusters: invalid Graph constructor.');

  options = options || {};

  var clusterDensity = ('clusterDensity' in options) ? options.clusterDensity : 0.5,
      rng = options.rng || Math.random,
      N = options.order,
      E = options.size,
      C = options.clusters;

  if (typeof clusterDensity !== 'number' || clusterDensity > 1 || clusterDensity < 0)
    throw new Error('graphology-generators/random/clusters: `clusterDensity` option should be a number between 0 and 1.');

  if (typeof rng !== 'function')
    throw new Error('graphology-generators/random/clusters: `rng` option should be a function.');

  if (typeof N !== 'number' || N <= 0)
    throw new Error('graphology-generators/random/clusters: `order` option should be a positive number.');

  if (typeof E !== 'number' || E <= 0)
    throw new Error('graphology-generators/random/clusters: `size` option should be a positive number.');

  if (typeof C !== 'number' || C <= 0)
    throw new Error('graphology-generators/random/clusters: `clusters` option should be a positive number.');

  // Creating graph
  var graph = new GraphClass();

  // Adding nodes
  if (!N)
    return graph;

  // Initializing clusters
  var clusters = new Array(C),
      cluster,
      nodes,
      i;

  for (i = 0; i < C; i++)
    clusters[i] = [];

  for (i = 0; i < N; i++) {
    cluster = (rng() * C) | 0;
    graph.addNode(i, {cluster: cluster});
    clusters[cluster].push(i);
  }

  // Adding edges
  if (!E)
    return graph;

  var source,
      target,
      l;

  for (i = 0; i < E; i++) {

    // Adding a link between two random nodes
    if (rng() < 1 - clusterDensity) {
      source = (rng() * N) | 0;

      do {
        target = (rng() * N) | 0;
      } while (source === target);
    }

    // Adding a link between two nodes from the same cluster
    else {
      cluster = (rng() * C) | 0;
      nodes = clusters[cluster];
      l = nodes.length;

      if (!l || l < 2) {

        // TODO: in those case we may have fewer edges than required
        // TODO: check where E is over full clusterDensity
        continue;
      }

      source = nodes[(rng() * l) | 0];

      do {
        target = nodes[(rng() * l) | 0];
      } while (source === target);
    }

    if (!graph.multi)
      graph.mergeEdge(source, target);
    else
      graph.addEdge(source, target);
  }

  return graph;
};
