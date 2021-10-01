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
var isGraph = require('graphology-utils/is-graph'),
    defaults = require('lodash/defaults');

/**
 * Defaults.
 */
var DEFAULTS = {
  attributes: {
    pagerank: 'pagerank',
    weight: 'weight'
  },
  alpha: 0.85,
  maxIterations: 100,
  tolerance: 1e-6,
  weighted: false
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
    throw new Error('graphology-pagerank: the given graph is not a valid graphology instance.');

  if (graph.multi)
    throw new Error('graphology-pagerank: the pagerank algorithm does not work with MultiGraphs.');

  options = defaults(options, DEFAULTS);

  var pagerankAttribute = options.attributes.pagerank,
      weightAttribute = options.attributes.weight,
      alpha = options.alpha,
      maxIterations = options.maxIterations,
      tolerance = options.tolerance,
      weighted = options.weighted;

  var N = graph.order,
      p = 1 / N,
      x = {};

  var danglingNodes = [];

  var nodes = graph.nodes(),
      edges,
      weights = {},
      degrees = {},
      weight,
      iteration = 0,
      dangleSum,
      xLast,
      neighbor,
      error,
      d,
      k,
      n,
      e,
      i,
      j,
      l,
      m;

  // Initialization
  for (i = 0; i < N; i++) {
    n = nodes[i];
    x[n] = p;

    if (weighted) {

      // Here, we need to factor in edges' weight
      d = 0;

      edges = graph
        .undirectedEdges()
        .concat(graph.outEdges(n));

      for (j = 0, m = edges.length; j < m; j++) {
        e = edges[j];
        d += graph.getEdgeAttribute(e, weightAttribute) || 1;
      }
    }
    else {
      d = graph.undirectedDegree(n) + graph.outDegree(n);
    }

    degrees[n] = d;

    if (d === 0)
      danglingNodes.push(n);
  }

  // Precompute normalized edge weights
  edges = graph.edges();
  for (i = 0, l = graph.size; i < l; i++) {
    e = edges[i];
    n = graph.source(e);

    d = degrees[n];

    weight = weighted ?
      (graph.getEdgeAttribute(e, weightAttribute) || 1) :
      1;

    weights[e] = weight / d;
  }

  // Performing the power iterations
  while (iteration < maxIterations) {
    xLast = x;
    x = {};

    for (k in xLast)
      x[k] = 0;

    dangleSum = 0;

    for (i = 0, l = danglingNodes.length; i < l; i++)
      dangleSum += xLast[danglingNodes[i]];

    dangleSum *= alpha;

    for (i = 0; i < N; i++) {
      n = nodes[i];
      edges = graph
        .undirectedEdges(n)
        .concat(graph.outEdges(n));

      for (j = 0, m = edges.length; j < m; j++) {
        e = edges[j];
        neighbor = graph.opposite(n, e);
        x[neighbor] += alpha * xLast[n] * weights[e];
      }

      x[n] += dangleSum * p + (1 - alpha) * p;
    }

    // Checking convergence
    error = 0;

    for (n in x)
      error += Math.abs(x[n] - xLast[n]);

    if (error < N * tolerance) {

      if (assign) {
        for (n in x)
          graph.setNodeAttribute(n, pagerankAttribute, x[n]);
      }

      return x;
    }

    iteration++;
  }

  throw Error('graphology-pagerank: failed to converge.');
}

/**
 * Exporting.
 */
var pagerank = abstractPagerank.bind(null, false);
pagerank.assign = abstractPagerank.bind(null, true);

module.exports = pagerank;
