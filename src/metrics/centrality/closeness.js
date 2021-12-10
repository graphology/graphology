/**
 * Graphology Closeness Centrality
 * ================================
 *
 * JavaScript implementation of the closeness centrality
 *
 * [References]:
 * https://en.wikipedia.org/wiki/Closeness_centrality
 *
 * Linton C. Freeman: Centrality in networks: I.
 * Conceptual clarification. Social Networks 1:215-239, 1979.
 * https://doi.org/10.1016/0378-8733(78)90021-7
 *
 * pg. 201 of Wasserman, S. and Faust, K.,
 * Social Network Analysis: Methods and Applications, 1994,
 * Cambridge University Press.
 */
var isGraph = require('graphology-utils/is-graph');
var resolveDefaults = require('graphology-utils/defaults');
var FixedDeque = require('mnemonist/fixed-deque');
var SparseSet = require('mnemonist/sparse-set');
var NeighborhoodIndex =
  require('graphology-indices/neighborhood').NeighborhoodIndex;

// TODO: can be computed for a single node
// TODO: weighted
// TODO: abstract the single source indexed shortest path in lib
// TODO: what about self loops?
// TODO: refactor a BFSQueue working on integer ranges in graphology-indices?

/**
 * Defaults.
 */
var DEFAULTS = {
  nodeCentralityAttribute: 'closenessCentrality',
  wassermanFaust: false
};

/**
 * Helpers.
 */
function IndexedBFS(graph) {
  this.index = new NeighborhoodIndex(graph, 'inbound');
  this.queue = new FixedDeque(Array, graph.order);
  this.seen = new SparseSet(graph.order);
}

IndexedBFS.prototype.fromNode = function (i) {
  var index = this.index;
  var queue = this.queue;
  var seen = this.seen;

  seen.clear();
  queue.clear();

  seen.add(i);
  queue.push([i, 0]);

  var item, n, d, j, l, neighbor;

  var total = 0;
  var count = 0;

  while (queue.size !== 0) {
    item = queue.shift();
    n = item[0];
    d = item[1];

    if (d !== 0) {
      total += d;
      count += 1;
    }

    l = index.starts[n + 1];

    for (j = index.starts[n]; j < l; j++) {
      neighbor = index.neighborhood[j];

      if (seen.has(neighbor)) continue;

      seen.add(neighbor);
      queue.push([neighbor, d + 1]);
    }
  }

  return [count, total];
};

/**
 * Abstract function computing the closeness centrality of a graph's nodes.
 *
 * @param  {boolean}  assign        - Should we assign the result to nodes.
 * @param  {Graph}    graph         - Target graph.
 * @param  {?object}  option        - Options:
 * @param  {?string}   nodeCentralityAttribute - Name of the centrality attribute to assign.
 * @param  {?boolean}  wassermanFaust - Whether to compute the Wasserman & Faust
 *                                      variant of the metric.
 * @return {object|undefined}
 */
function abstractClosenessCentrality(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/centrality/closeness: the given graph is not a valid graphology instance.'
    );

  options = resolveDefaults(options, DEFAULTS);

  var wassermanFaust = options.wassermanFaust;

  var bfs = new IndexedBFS(graph);

  var N = graph.order;

  var i, result, count, total, closeness;

  var mapping = new Float64Array(N);

  for (i = 0; i < N; i++) {
    result = bfs.fromNode(i);
    count = result[0];
    total = result[1];

    closeness = 0;

    if (total > 0 && N > 1) {
      closeness = count / total;

      if (wassermanFaust) {
        closeness *= count / (N - 1);
      }
    }

    mapping[i] = closeness;
  }

  if (assign) {
    return bfs.index.assign(options.nodeCentralityAttribute, mapping);
  }

  return bfs.index.collect(mapping);
}

/**
 * Exporting.
 */
var closenessCentrality = abstractClosenessCentrality.bind(null, false);
closenessCentrality.assign = abstractClosenessCentrality.bind(null, true);

module.exports = closenessCentrality;
