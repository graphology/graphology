/**
 * CHI-square test
 * ===============
 *
 * Function computing the Simmelian strength, i.e. the number of triangles in
 * which an edge stands, for each edge in a given graph.
 */
var isGraph = require('graphology-utils/is-graph');
var weightedDegree = require('../node/weighted-degree');


/**
 * Defaults.
 */
var DEFAULT_WEIGHT_ATTRIBUTE = 'weight';


//   # compute_chi2_and_g2
// # test significance using chi2 and g2 metrics
// # implementation copied from https://github.com/medialab/xan/blob/master/src/cmd/vocab.rs#L924-L1000
// # gf = global frequency gf (total of token dimension row)
// # nb_token_in_doc = number of tokens in doc (total of doc dimension coloumn) 
// # tf = term frequency in document (token x document cell)
// # token_count = somme de tous les tf (grand total)
function chiSquareGSquareMeasures(sourceWeightedDegree, targetWeightedDegree, edgeWeight, sumAllEdgesWeights){
    
    if (sumAllEdgesWeights <= 0)
        throw new Error('token_count has to be >0')
    if (sourceWeightedDegree <= 0)
        throw new Error('gf has to be >0')
    if (edgeWeight <= 0)
        throw new Error('tf has to be >0')
    if (targetWeightedDegree <= 0)
        throw new Error('nb_tokens_in_doc has to be >0')

    // This can be 0 if some item is present in all co-occurrences!
    var notGf = sumAllEdgesWeights - sourceWeightedDegree
    var notNbTokensInDoc = sumAllEdgesWeights - targetWeightedDegree

    
    var observed11 = edgeWeight
    var observed12 = sourceWeightedDegree - edgeWeight
    var  observed21 = targetWeightedDegree - edgeWeight
    // NOTE: with few co-occurrences, self loops can produce a negative outcome...
    var observed22 = (sumAllEdgesWeights + edgeWeight) - (sourceWeightedDegree + targetWeightedDegree)

    var expected11 = (sourceWeightedDegree * targetWeightedDegree) / sumAllEdgesWeights // Cannot be 0

    if (edgeWeight < expected11){
        // under-represented token, measure will be biased, let's ignore the token
        return {chiSquare: undefined, gSquare: undefined}
    }

    var expected12 = (sourceWeightedDegree * notNbTokensInDoc)  / sumAllEdgesWeights
    var expected21 = (targetWeightedDegree * notGf) / sumAllEdgesWeights
    var expected22 = (notGf * notNbTokensInDoc) / sumAllEdgesWeights

    var chiSquare11 = Math.pow(observed11 - expected11, 2) / expected11
    var chiSquare12 = Math.pow(observed12 - expected12, 2) / expected12
    var chiSquare21 = Math.pow(observed21 - expected21, 2) / expected21
    var chiSquare22 = Math.pow(observed22 - expected22, 2) / expected22

    var gSquare11 = observed11 * Math.log(observed11 / expected11)
    var gSquare12 = observed12 === 0.0 ? 0.0 : observed12 * Math.log( (observed12 / expected12))
    var gSquare21 = observed21 === 0.0 ? 0.0 : observed21 * Math.log( (observed21 / expected21))

    // NOTE: in the case when observed_22 is negative, I am not entirely
    // sure it is mathematically sound to clamp to 0. But since this case
    // is mostly useless, I will allow it...
    var gSquare22 = observed22 <= 0.0 ? 0.0 : observed22 * Math.log( (observed22 / expected22))

    var chiSquare = chiSquare11 + chiSquare12 + chiSquare21 + chiSquare22
    var gSquare = 2.0 * (gSquare11 + gSquare12 + gSquare21 + gSquare22) // 2.0 * is here to adjust g2 in the same scale as chi2

    //  Dealing with degenerate cases that happen when the number
    //  of co-occurrences is very low, or when some item dominates
    //  the distribution.
    if (isNaN(chiSquare))
      chiSquare = 0.0

    if (chiSquare === Infinity)
        chiSquare = chiSquare11

    if (gSquare === Infinity)
        gSquare = gSquare11
    
    return {chiSquare:chiSquare, gSquare:gSquare}
}

/**
 * Asbtract function to perform chiSquare tests measures.
 *
 * @param  {Graph}           graph         - A graphology instance.
 * @param  {string|function} getEdgeWeight - Name of edge weight attribute or getter function.
 *
 */
function abstractChiSquareGSquare(assign, graph, getEdgeWeight) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/chi-square: given graph is not a valid graphology instance.'
    );

  // this metric does not make sens on directed graph. Should we throw if applied on directed graph?

  getEdgeWeight = getEdgeWeight || DEFAULT_WEIGHT_ATTRIBUTE;

  // calculating total weights and weighted degrees
  var totalWeights = 0
  var weightedDegrees = {}
  graph.forEachAssymetricAdjacencyEntry(function (
      source,
      target,
      sa,
      ta,
      edge,
      attr,
      undirected
    ) {
      // sum all weights
      totalWeights += typeof getEdgeWeight === 'function'
        ? getEdgeWeight(edge, attr, source, target, sa, ta, undirected)
        : attr[getEdgeWeight];
      
      // compute nodes weighted degrees
      [source, target].forEach(function (node) {
        if(!weightedDegrees[node])
          weightedDegrees[node] = weightedDegree.weightedDegree(graph, node, getEdgeWeight);
      })
    })

  var edgeChiSquareGSquareMeasures = {};
  graph.forEachAssymetricAdjacencyEntry(function (
      source,
      target,
      sa,
      ta,
      edge,
      attr,
      undirected
    ) {
      var weight =  typeof getEdgeWeight === 'function'
      ? getEdgeWeight(edge, attr, source, target, sa, ta, undirected)
      : attr[getEdgeWeight]
      var measures = chiSquareGSquareMeasures(
        weightedDegrees[source],
        weightedDegrees[target],
        weight, 
        totalWeights)
      edgeChiSquareGSquareMeasures[edge] = measures
      
      if(assign) {
        graph.setEdgeAttribute(edge, 'chiSquare', measures.chiSquare);
        graph.setEdgeAttribute(edge, 'gSquare', measures.gSquare);
      }
  })

  return edgeChiSquareGSquareMeasures
}

var chiSquareGSquare = abstractChiSquareGSquare.bind(null, false);
chiSquareGSquare.assign = abstractChiSquareGSquare.bind(null, true);
chiSquareGSquare.thresholds =  {
  'pValue<0.5': 0.45, // lowest significance
  'pValue<0.1': 2.71, // very low significance
  'pValue<0.05': 3.84, // low significance
  'pValue<0.025': 5.02, // good significance
  'pValue<0.01': 6.63, // high significance
  'pValue<0.005': 7.88, // very high significance
  'pValue<0.001': 10.83, // highest significance
};


module.exports = chiSquareGSquare;
