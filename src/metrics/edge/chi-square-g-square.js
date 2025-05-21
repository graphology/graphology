/**
 * CHI-square G-square tests
 * =========================
 *
 * Function computing the chi-square and g-square significance measures
 * for each edge in a given graph.
 * Thresholds to filter out edges which fails the significance test are provided but edges are not filtered by default.
 *
 */
var isGraph = require('graphology-utils/is-graph');
var createEdgeWeightGetter =
  require('graphology-utils/getters').createEdgeWeightGetter;

/**
 * Defaults.
 */
var DEFAULT_WEIGHT_ATTRIBUTE = 'weight';

/**
 * chiSquareGSquareMeasures
 * implementation copied from https://github.com/medialab/xan/blob/master/src/cmd/vocab.rs#L924-L1000
 * @param {chiSquare|gSquare} measure       - either chiSquare or gSquare measure to compute
 * @param {number} sourceWeightedDegree
 * @param {number} targetWeightedDegree
 * @param {number} edgeWeight
 * @param {number} sumAllEdgesWeights
 * @returns Record<edge, {chiSquare:number, gSquare:number}>
 */
function _chiSquareGSquareMeasures(
  measure,
  sourceWeightedDegree,
  targetWeightedDegree,
  edgeWeight,
  sumAllEdgesWeights
) {
  if (sumAllEdgesWeights <= 0)
    throw new Error('sumAllEdgesWeights has to be >0');

  if (sourceWeightedDegree <= 0)
    throw new Error('sourceWeightedDegree has to be >0');

  if (edgeWeight <= 0) throw new Error('edgeWeight has to be >0');

  if (targetWeightedDegree <= 0)
    throw new Error('sumAllEdgesWeights has to be >0');

  // This can be 0 if some item is present in all co-occurrences!
  var notGf = sumAllEdgesWeights - sourceWeightedDegree;
  var notNbTokensInDoc = sumAllEdgesWeights - targetWeightedDegree;

  var observed11 = edgeWeight;
  var observed12 = sourceWeightedDegree - edgeWeight;
  var observed21 = targetWeightedDegree - edgeWeight;
  // NOTE: with few co-occurrences, self loops can produce a negative outcome...
  var observed22 =
    sumAllEdgesWeights +
    edgeWeight -
    (sourceWeightedDegree + targetWeightedDegree);

  var expected11 =
    (sourceWeightedDegree * targetWeightedDegree) / sumAllEdgesWeights; // Cannot be 0

  if (edgeWeight < expected11) {
    // under-represented token, measure will be biased, let's ignore the token
    return undefined;
  }

  var expected12 =
    (sourceWeightedDegree * notNbTokensInDoc) / sumAllEdgesWeights;
  var expected21 = (targetWeightedDegree * notGf) / sumAllEdgesWeights;
  var expected22 = (notGf * notNbTokensInDoc) / sumAllEdgesWeights;

  if (measure === 'gSquare') {
    var gSquare11 = observed11 * Math.log(observed11 / expected11);
    var gSquare12 =
      observed12 === 0.0 ? 0.0 : observed12 * Math.log(observed12 / expected12);
    var gSquare21 =
      observed21 === 0.0 ? 0.0 : observed21 * Math.log(observed21 / expected21);
    // NOTE: in the case when observed_22 is negative, I am not entirely
    // sure it is mathematically sound to clamp to 0. But since this case
    // is mostly useless, I will allow it...
    var gSquare22 =
      observed22 <= 0.0 ? 0.0 : observed22 * Math.log(observed22 / expected22);
    var gSquare = 2.0 * (gSquare11 + gSquare12 + gSquare21 + gSquare22); // 2.0 * is here to adjust g2 in the same scale as chi2
    if (gSquare === Infinity) gSquare = gSquare11;

    return gSquare;
  }

  var chiSquare11 = Math.pow(observed11 - expected11, 2) / expected11;
  var chiSquare12 = Math.pow(observed12 - expected12, 2) / expected12;
  var chiSquare21 = Math.pow(observed21 - expected21, 2) / expected21;
  var chiSquare22 = Math.pow(observed22 - expected22, 2) / expected22;

  var chiSquare = chiSquare11 + chiSquare12 + chiSquare21 + chiSquare22;
  //  Dealing with degenerate cases that happen when the number
  //  of co-occurrences is very low, or when some item dominates
  //  the distribution.
  if (isNaN(chiSquare)) chiSquare = 0.0;

  if (chiSquare === Infinity) chiSquare = chiSquare11;

  return chiSquare;
}

/**
 * Asbtract function to perform chi-square adn g-square tests measures.
 *
 * @param {chiSquare|gSquare} measure       - either chiSquare or gSquare measure to compute
 * @param  {Graph}            graph         - A graphology instance.
 * @param  {string|function}  getEdgeWeight - Name of edge weight attribute or getter function.
 *
 */
function abstractChiSquareGSquare(assign, measure, graph, getEdgeWeight) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/chi-square: given graph is not a valid graphology instance.'
    );

  // TODO: this metric does not make sens on directed graph. Should we throw if applied on directed graph?
  getEdgeWeight = createEdgeWeightGetter(
    getEdgeWeight || DEFAULT_WEIGHT_ATTRIBUTE
  ).fromEntry;

  // calculating total weights and weighted degrees
  var totalWeights = 0;
  var weightedDegrees = {};

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

    // sum all weights
    totalWeights += weight;

    // compute nodes weighted degrees
    // TODO: we could optimize one lookup here because we see all of a source's
    // edges contiguously.
    weightedDegrees[source] = (weightedDegrees[source] || 0) + weight;

    // Avoiding self loops
    if (source !== target) {
      weightedDegrees[target] = (weightedDegrees[target] || 0) + weight;
    }
  });

  var edgeMeasures = {};

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

    // TODO: we could optimize the source lookup here
    var result = _chiSquareGSquareMeasures(
      measure,
      weightedDegrees[source],
      weightedDegrees[target],
      weight,
      totalWeights
    );

    edgeMeasures[edge] = result;

    // TODO: use graph.updateEachEdgeAttributes
    if (assign) {
      graph.setEdgeAttribute(edge, measure, result);
    }
  });

  return edgeMeasures;
}

abstractChiSquareGSquare.thresholds = {
  0.5: 0.45, // lowest significance
  0.1: 2.71, // very low significance
  0.05: 3.84, // low significance
  0.025: 5.02, // good significance
  0.01: 6.63, // high significance
  0.005: 7.88, // very high significance
  0.001: 10.83 // highest significance
};

module.exports = abstractChiSquareGSquare;
