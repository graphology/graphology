/**
 * Graphology Layout Quality - Stress
 * ===================================
 *
 * Function computing the layout quality metric named "stress".
 * It is basically the sum of normalized deltas between graph topology distances
 * and 2d space distances of the layout.
 *
 * [Article]:
 * Rahman, Md Khaledur, et al. « BatchLayout: A Batch-Parallel Force-Directed
 * Graph Layout Algorithm in Shared Memory ».
 * http://arxiv.org/abs/2002.08233.
 */
var isGraph = require('graphology-utils/is-graph'),
  undirectedSingleSourceLength =
    require('graphology-shortest-path/unweighted').undirectedSingleSourceLength;

function euclideanDistance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

module.exports = function stress(graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/layout-quality/stress: given graph is not a valid graphology instance.'
    );

  if (graph.order === 0)
    throw new Error(
      'graphology-metrics/layout-quality/stress: cannot compute stress for a null graph.'
    );

  var nodes = new Array(graph.order),
    entries = new Array(graph.order),
    i = 0;

  // We choose an arbitrary large distance for when two nodes cannot be
  // connected because they belong to different connected components
  // and because we cannot deal with Infinity in our computations
  // This is what most papers recommend anyway
  var maxDistance = graph.order * 4;

  graph.forEachNode(function (node, attr) {
    nodes[i] = node;
    entries[i++] = attr;
  });

  var j, l, p1, p2, shortestPaths, dij, wij, cicj;

  var sum = 0;

  for (i = 0, l = graph.order; i < l; i++) {
    shortestPaths = undirectedSingleSourceLength(graph, nodes[i]);

    p1 = entries[i];

    for (j = i + 1; j < l; j++) {
      p2 = entries[j];

      // NOTE: dij should be 0 since we don't consider self-loops
      dij = shortestPaths[nodes[j]];

      // Target is in another castle
      if (typeof dij === 'undefined') dij = maxDistance;

      cicj = euclideanDistance(p1, p2);
      wij = 1 / (dij * dij);

      sum += wij * Math.pow(cicj - dij, 2);
    }
  }

  return sum;
};
