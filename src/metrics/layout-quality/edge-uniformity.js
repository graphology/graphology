/**
 * Graphology Layout Quality - Edge Uniformity
 * ============================================
 *
 * Function computing the layout quality metric named "edge uniformity".
 * It is basically the normalized standard deviation of edge length.
 *
 * [Article]:
 * Rahman, Md Khaledur, et al. « BatchLayout: A Batch-Parallel Force-Directed
 * Graph Layout Algorithm in Shared Memory ».
 * http://arxiv.org/abs/2002.08233.
 */
var isGraph = require('graphology-utils/is-graph');

function euclideanDistance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

module.exports = function edgeUniformity(graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/layout-quality/edge-uniformity: given graph is not a valid graphology instance.'
    );

  if (graph.size === 0) return 0;

  var sum = 0,
    i = 0,
    l;

  var lengths = new Float64Array(graph.size);

  graph.forEachEdge(function (
    edge,
    attr,
    source,
    target,
    sourceAttr,
    targetAttr
  ) {
    var edgeLength = euclideanDistance(sourceAttr, targetAttr);

    lengths[i++] = edgeLength;
    sum += edgeLength;
  });

  var avg = sum / graph.size;

  var stdev = 0;

  for (i = 0, l = graph.size; i < l; i++)
    stdev += Math.pow(avg - lengths[i], 2);

  var metric = stdev / (graph.size * Math.pow(avg, 2));

  return Math.sqrt(metric);
};
