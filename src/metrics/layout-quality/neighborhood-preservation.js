/**
 * Graphology Layout Quality - Neighborhood Preservation
 * ======================================================
 *
 * Function computing the layout quality metric named "neighborhood preservation".
 * It is basically the average of overlap coefficient between node neighbors in
 * the graph and equivalent k-nn in the 2d layout space.
 *
 * [Article]:
 * Rahman, Md Khaledur, et al. « BatchLayout: A Batch-Parallel Force-Directed
 * Graph Layout Algorithm in Shared Memory ».
 * http://arxiv.org/abs/2002.08233.
 */
var isGraph = require('graphology-utils/is-graph'),
    KDTree = require('mnemonist/kd-tree'),
    intersectionSize = require('mnemonist/set').intersectionSize;

module.exports = function neighborhoodPreservation(graph) {
  if (!isGraph(graph))
    throw new Error('graphology-metrics/layout-quality/neighborhood-preservation: given graph is not a valid graphology instance.');

  if (graph.order === 0)
    throw new Error('graphology-metrics/layout-quality/neighborhood-preservation: cannot compute stress for a null graph.');

  if (graph.size === 0)
    return 0;

  var axes = [new Float64Array(graph.order), new Float64Array(graph.order)],
      i = 0;

  graph.forEachNode(function(node, attr) {
    axes[0][i] = attr.x;
    axes[1][i++] = attr.y;
  });

  var tree = KDTree.fromAxes(axes, graph.nodes());

  var sum = 0;

  graph.forEachNode(function(node, attr) {
    var neighbors = new Set(graph.neighbors(node));

    // If node has no neighbors or is connected to every other node
    if (neighbors.size === 0 || neighbors.size === graph.order - 1) {
      sum += 1;
      return;
    }

    var knn = tree.kNearestNeighbors(neighbors.size + 1, [attr.x, attr.y]);
    knn = new Set(knn.slice(1));

    var I = intersectionSize(neighbors, knn);

    // Computing overlap coefficient
    sum += I / knn.size;
  });

  return sum / graph.order;
};
