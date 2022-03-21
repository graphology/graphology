/**
 * Graphology Edge Disparity
 * ==========================
 *
 * Function computing the disparity score of each edge in the given graph. This
 * score is typically used to extract the multiscale backbone of a weighted
 * graph.
 *
 * The formula from the paper (relying on integral calculus) can be simplified
 * to become:
 *
 *   disparity(u, v) = min(
 *     (1 - normalizedWeight(u, v)) ^ (degree(u) - 1)),
 *     (1 - normalizedWeight(v, u)) ^ (degree(v) - 1))
 *   )
 *
 *   where normalizedWeight(u, v) = weight(u, v) / weightedDegree(u)
 *   where weightedDegree(u) = sum(weight(u, v) for v in neighbors(u))
 *
 * This score can sometimes be found reversed likewise:
 *
 *   disparity(u, v) = max(
 *     1 - (1 - normalizedWeight(u, v)) ^ (degree(u) - 1)),
 *     1 - (1 - normalizedWeight(v, u)) ^ (degree(v) - 1))
 *   )
 *
 * so that higher score means better edges. I chose to keep the metric close
 * to the paper to keep the statistical test angle. This means that, in my
 * implementation at least, a low score for an edge means a high relevance and
 * increases its chances to be kept in the backbone.
 *
 * Note that this algorithm has no proper definition for directed graphs and
 * is only useful if edges have varying weights. This said, it could be
 * possible to compute the disparity score only based on edge direction, if
 * we drop the min part.
 *
 * [Article]:
 * Serrano, M. Ángeles, Marián Boguná, and Alessandro Vespignani. "Extracting
 * the multiscale backbone of complex weighted networks." Proceedings of the
 * national academy of sciences 106.16 (2009): 6483-6488.
 *
 * [Reference]:
 * https://www.pnas.org/content/pnas/106/16/6483.full.pdf
 * https://en.wikipedia.org/wiki/Disparity_filter_algorithm_of_weighted_network
 */
var isGraph = require('graphology-utils/is-graph');
var inferType = require('graphology-utils/infer-type');
var resolveDefaults = require('graphology-utils/defaults');
var createEdgeWeightGetter =
  require('graphology-utils/getters').createEdgeWeightGetter;

/**
 * Defaults.
 */
var DEFAULTS = {
  edgeDisparityAttribute: 'disparity',
  getEdgeWeight: 'weight'
};

// TODO: test without weight, to see what happens

function abstractDisparity(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/edge/disparity: the given graph is not a valid graphology instance.'
    );

  if (graph.multi || inferType(graph) === 'mixed')
    throw new Error(
      'graphology-metrics/edge/disparity: not defined for multi nor mixed graphs.'
    );

  options = resolveDefaults(options, DEFAULTS);

  var getEdgeWeight = createEdgeWeightGetter(options.getEdgeWeight).fromEntry;

  // Computing node weighted degrees
  var weightedDegrees = {};

  graph.forEachNode(function (node) {
    weightedDegrees[node] = 0;
  });

  graph.forEachEdge(function (edge, attr, source, target, sa, ta, undirected) {
    var weight = getEdgeWeight(edge, attr, source, target, sa, ta, undirected);

    weightedDegrees[source] += weight;
    weightedDegrees[target] += weight;
  });

  // Computing edge disparity
  var previous, previousDegree, previousWeightedDegree;

  var disparities = {};

  graph.forEachAssymetricAdjacencyEntry(function (
    source,
    target,
    sa,
    ta,
    edge,
    attr,
    undirected
  ) {
    var weight = getEdgeWeight(edge, attr, source, target, sa, ta, undirected);

    if (previous !== source) {
      previous = source;
      previousDegree = graph.degree(source);
      previousWeightedDegree = weightedDegrees[source];
    }

    var targetDegree = graph.degree(target);
    var targetWeightedDegree = weightedDegrees[target];

    var normalizedWeightPerSource = weight / previousWeightedDegree;
    var normalizedWeightPerTarget = weight / targetWeightedDegree;

    var sourceScore = Math.pow(
      1 - normalizedWeightPerSource,
      previousDegree - 1
    );

    var targetScore = Math.pow(1 - normalizedWeightPerTarget, targetDegree - 1);

    disparities[edge] = Math.min(sourceScore, targetScore);
  });

  if (assign) {
    graph.updateEachEdgeAttributes(
      function (edge, attr) {
        attr[options.edgeDisparityAttribute] = disparities[edge];
        return attr;
      },
      {attributes: [options.edgeDisparityAttribute]}
    );

    return;
  }

  return disparities;
}

var disparity = abstractDisparity.bind(null, false);
disparity.assign = abstractDisparity.bind(null, true);

/**
 * Exporting.
 */
module.exports = disparity;
