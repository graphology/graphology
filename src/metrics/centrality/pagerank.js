/**
 * Graphology Pagerank
 * ====================
 *
 * JavaScript implementation of the pagerank algorithm for graphology.
 *
 * [Reference]:
 * Page, Lawrence; Brin, Sergey; Motwani, Rajeev and Winograd, Terry,
 * The PageRank citation ranking: Bringing order to the Web. 1999
 */
var isGraph = require('graphology-utils/is-graph');
var resolveDefaults = require('graphology-utils/defaults');
var WeightedNeighborhoodIndex =
  require('graphology-indices/neighborhood').WeightedNeighborhoodIndex;

/**
 * Defaults.
 */
var DEFAULTS = {
  nodePagerankAttribute: 'pagerank',
  getEdgeWeight: 'weight',
  alpha: 0.85,
  maxIterations: 100,
  tolerance: 1e-6
};

/**
 * Abstract function applying the pagerank algorithm to the given graph.
 *
 * @param  {boolean}  assign        - Should we assign the result to nodes.
 * @param  {Graph}    graph         - Target graph.
 * @param  {?object}  option        - Options:
 * @param  {?object}    attributes  - Custom attribute names:
 * @param  {?string}      pagerank  - Name of the pagerank attribute to assign.
 * @param  {?string}      weight    - Name of the weight algorithm.
 * @param  {?number}  alpha         - Damping parameter.
 * @param  {?number}  maxIterations - Maximum number of iterations to perform.
 * @param  {?number}  tolerance     - Error tolerance when checking for convergence.
 * @param  {?boolean} weighted      - Should we use the graph's weights.
 * @return {object|undefined}
 */
function abstractPagerank(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/centrality/pagerank: the given graph is not a valid graphology instance.'
    );

  options = resolveDefaults(options, DEFAULTS);

  var alpha = options.alpha;
  var maxIterations = options.maxIterations;
  var tolerance = options.tolerance;

  var pagerankAttribute = options.nodePagerankAttribute;

  var N = graph.order;
  var p = 1 / N;

  var index = new WeightedNeighborhoodIndex(graph, options.getEdgeWeight);

  var i, j, l, d;

  var x = new Float64Array(graph.order);

  // Normalizing edge weights & indexing dangling nodes
  var normalizedEdgeWeights = new Float64Array(index.weights.length);
  var danglingNodes = [];

  for (i = 0; i < N; i++) {
    x[i] = p;
    l = index.starts[i + 1];
    d = index.outDegrees[i];

    if (d === 0) danglingNodes.push(i);

    for (j = index.starts[i]; j < l; j++) {
      normalizedEdgeWeights[j] = index.weights[j] / d;
    }
  }

  // Power iterations
  var iteration = 0;
  var error = 0;
  var dangleSum, neighbor, xLast;
  var converged = false;

  while (iteration < maxIterations) {
    xLast = x;
    x = new Float64Array(graph.order); // TODO: it should be possible to swap two arrays to avoid allocations (bench)

    dangleSum = 0;

    for (i = 0, l = danglingNodes.length; i < l; i++)
      dangleSum += xLast[danglingNodes[i]];

    dangleSum *= alpha;

    for (i = 0; i < N; i++) {
      l = index.starts[i + 1];

      for (j = index.starts[i]; j < l; j++) {
        neighbor = index.neighborhood[j];
        x[neighbor] += alpha * xLast[i] * normalizedEdgeWeights[j];
      }

      x[i] += dangleSum * p + (1 - alpha) * p;
    }

    // Checking convergence
    error = 0;

    for (i = 0; i < N; i++) {
      error += Math.abs(x[i] - xLast[i]);
    }

    if (error < N * tolerance) {
      converged = true;
      break;
    }

    iteration++;
  }

  if (!converged)
    throw Error('graphology-metrics/centrality/pagerank: failed to converge.');

  if (assign) {
    index.assign(pagerankAttribute, x);
    return;
  }

  return index.collect(x);
}

/**
 * Exporting.
 */
var pagerank = abstractPagerank.bind(null, false);
pagerank.assign = abstractPagerank.bind(null, true);

module.exports = pagerank;
