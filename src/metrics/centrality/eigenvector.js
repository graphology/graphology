/**
 * Graphology Eigenvector Centrality
 * ==================================
 *
 * JavaScript implementation of the eigenvector centrality.
 *
 * [References]:
 * https://en.wikipedia.org/wiki/Eigenvector_centrality
 *
 * Phillip Bonacich. "Power and Centrality: A Family of Measures."
 * American Journal of Sociology, 92(5):1170–1182, 1986
 * http://www.leonidzhukov.net/hse/2014/socialnetworks/papers/Bonacich-Centrality.pdf
 *
 * Mark E. J. Newman.
 * Networks: An Introduct *
 * Oxford University Press, USA, 2010, pp. 169.
 */
var isGraph = require('graphology-utils/is-graph');
var resolveDefaults = require('graphology-utils/defaults');
var WeightedNeighborhoodIndex =
  require('graphology-indices/neighborhood').WeightedNeighborhoodIndex;

/**
 * Defaults.
 */
var DEFAULTS = {
  nodeCentralityAttribute: 'eigenvectorCentrality',
  getEdgeWeight: 'weight',
  maxIterations: 100,
  tolerance: 1e-6
};

/**
 * Helpers.
 */
function safeVariadicHypot(x) {
  var max = 0;
  var s = 0;

  for (var i = 0, l = x.length; i < l; i++) {
    var n = Math.abs(x[i]);

    if (n > max) {
      s *= (max / n) * (max / n);
      max = n;
    }
    s += n === 0 && max === 0 ? 0 : (n / max) * (n / max);
  }

  // NOTE: In case of numerical error we'll assume the norm is 1 in our case!
  return max === Infinity ? 1 : max * Math.sqrt(s);
}

/**
 * Abstract function computing the eigenvector centrality of a graph's nodes.
 *
 * @param  {boolean}  assign        - Should we assign the result to nodes.
 * @param  {Graph}    graph         - Target graph.
 * @param  {?object}  option        - Options:
 * @param  {?string}    nodeCentralityAttribute - Name of the centrality attribute to assign.
 * @param  {?string}    getEdgeWeight - Name of the weight algorithm or getter function.
 * @param  {?number}    maxIterations - Maximum number of iterations to perform.
 * @param  {?number}    tolerance     - Error tolerance when checking for convergence.
 * @return {object|undefined}
 */
function abstractEigenvectorCentrality(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/centrality/eigenvector: the given graph is not a valid graphology instance.'
    );

  options = resolveDefaults(options, DEFAULTS);

  var maxIterations = options.maxIterations;
  var tolerance = options.tolerance;

  var N = graph.order;

  var index = new WeightedNeighborhoodIndex(graph, options.getEdgeWeight);

  var i, j, l, w;

  var x = new Float64Array(graph.order);

  // Initializing
  for (i = 0; i < N; i++) {
    x[i] = 1 / N;
  }

  // Power iterations
  var iteration = 0;
  var error = 0;
  var neighbor, xLast, norm;
  var converged = false;

  while (iteration < maxIterations) {
    xLast = x;
    x = new Float64Array(xLast);

    for (i = 0; i < N; i++) {
      l = index.starts[i + 1];

      for (j = index.starts[i]; j < l; j++) {
        neighbor = index.neighborhood[j];
        w = index.weights[j];
        x[neighbor] += xLast[i] * w;
      }
    }

    norm = safeVariadicHypot(x);

    for (i = 0; i < N; i++) {
      x[i] /= norm;
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
    throw Error(
      'graphology-metrics/centrality/eigenvector: failed to converge.'
    );

  if (assign) {
    index.assign(options.nodeCentralityAttribute, x);
    return;
  }

  return index.collect(x);
}

/**
 * Exporting.
 */
var eigenvectorCentrality = abstractEigenvectorCentrality.bind(null, false);
eigenvectorCentrality.assign = abstractEigenvectorCentrality.bind(null, true);

module.exports = eigenvectorCentrality;
