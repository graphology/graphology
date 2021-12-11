/**
 * Graphology Modularity
 * ======================
 *
 * Implementation of network modularity for graphology.
 *
 * Modularity is a bit of a tricky problem because there are a wide array
 * of different definitions and implementations. The current implementation
 * try to stay true to Newman's original definition and consider both the
 * undirected & directed case as well as the weighted one. The current
 * implementation should also be aligned with Louvain algorithm's definition
 * of the metric.
 *
 * Regarding the directed version, one has to understand that the undirected
 * version's is basically considering the graph as a directed one where all
 * edges would be mutual.
 *
 * There is one exception to this, though: self loops. To conform with density's
 * definition, as used in modularity's one, and to keep true to the matrix
 * formulation of modularity, one has to note that self-loops only count once
 * in both the undirected and directed cases. This means that a k-clique with
 * one node having a self-loop will not have the same modularity in the
 * undirected and mutual case. Indeed, in both cases the modularity of a
 * k-clique with one loop and minus one internal edge should be equal.
 *
 * This also means that, as with the naive density formula regarding loops,
 * one should increment M when considering a loop. Also, to remain coherent
 * in this regard, degree should not be multiplied by two because of the loop
 * else it will have too much importance regarding the considered proportions.
 *
 * Hence, here are the retained formulas:
 *
 * For dense weighted undirected network:
 * --------------------------------------
 *
 * Q = 1/2m * [ ∑ij[Aij - (di.dj / 2m)] * ∂(ci, cj) ]
 *
 * where:
 *  - i & j being a pair of nodes
 *  - m is the sum of edge weights
 *  - Aij being the weight of the ij edge (or 0 if absent)
 *  - di being the weighted degree of node i
 *  - ci being the community to which belongs node i
 *  - ∂ is Kronecker's delta function (1 if x = y else 0)
 *
 * For dense weighted directed network:
 * ------------------------------------
 *
 * Qd = 1/m * [ ∑ij[Aij - (dini.doutj / m)] * ∂(ci, cj) ]
 *
 * where:
 *  - dini is the in degree of node i
 *  - douti is the out degree of node i
 *
 * For sparse weighted undirected network:
 * ---------------------------------------
 *
 * Q = ∑c[ (∑cinternal / 2m) - (∑ctotal / 2m)² ]
 *
 * where:
 *  - c is a community
 *  - ∑cinternal is the total weight of a community internal edges
 *  - ∑ctotal is the total weight of edges connected to a community
 *
 * For sparse weighted directed network:
 * -------------------------------------
 *
 * Qd = ∑c[ (∑cinternal / m) - (∑cintotal * ∑couttotal / m²) ]
 *
 * where:
 *  - ∑cintotal is the total weight of edges pointing towards a community
 *  - ∑couttotal is the total weight of edges going from a community
 *
 * Note that dense version run in O(N²) while sparse version runs in O(V). So
 * the dense version is mostly here to guarantee the validity of the sparse one.
 * As such it is not used as default.
 *
 * For undirected delta computation:
 * ---------------------------------
 *
 * ∆Q = (dic / 2m) - ((∑ctotal * di) / 2m²)
 *
 * where:
 *  - dic is the degree of the node in community c
 *
 * For directed delta computation:
 * -------------------------------
 *
 * ∆Qd = (dic / m) - (((douti * ∑cintotal) + (dini * ∑couttotal)) / m²)
 *
 * Gephi's version of undirected delta computation:
 * ------------------------------------------------
 *
 * ∆Qgephi = dic - (di * Ztot) / 2m
 *
 * Note that the above formula is erroneous and should really be:
 *
 * ∆Qgephi = dic - (di * Ztot) / m
 *
 * because then: ∆Qgephi = ∆Q * 2m
 *
 * It is used because it is faster to compute. Since Gephi's error is only by
 * a constant factor, it does not make the result incorrect.
 *
 * [Latex]
 *
 * Sparse undirected
 * Q = \sum_{c} \bigg{[} \frac{\sum\nolimits_{c\,in}}{2m} - \left(\frac{\sum\nolimits_{c\,tot}}{2m}\right )^2 \bigg{]}
 *
 * Sparse directed
 * Q_d = \sum_{c} \bigg{[} \frac{\sum\nolimits_{c\,in}}{m} - \frac{\sum_{c\,tot}^{in}\sum_{c\,tot}^{out}}{m^2} \bigg{]}
 *
 * [Articles]
 * M. E. J. Newman, « Modularity and community structure in networks »,
 * Proc. Natl. Acad. Sci. USA, vol. 103, no 23, 2006, p. 8577–8582
 * https://dx.doi.org/10.1073%2Fpnas.0601602103
 *
 * Newman, M. E. J. « Community detection in networks: Modularity optimization
 * and maximum likelihood are equivalent ». Physical Review E, vol. 94, no 5,
 * novembre 2016, p. 052315. arXiv.org, doi:10.1103/PhysRevE.94.052315.
 * https://arxiv.org/pdf/1606.02319.pdf
 *
 * Blondel, Vincent D., et al. « Fast unfolding of communities in large
 * networks ». Journal of Statistical Mechanics: Theory and Experiment,
 * vol. 2008, no 10, octobre 2008, p. P10008. DOI.org (Crossref),
 * doi:10.1088/1742-5468/2008/10/P10008.
 * https://arxiv.org/pdf/0803.0476.pdf
 *
 * Nicolas Dugué, Anthony Perez. Directed Louvain: maximizing modularity in
 * directed networks. [Research Report] Université d’Orléans. 2015. hal-01231784
 * https://hal.archives-ouvertes.fr/hal-01231784
 *
 * R. Lambiotte, J.-C. Delvenne and M. Barahona. Laplacian Dynamics and
 * Multiscale Modular Structure in Networks,
 * doi:10.1109/TNSE.2015.2391998.
 * https://arxiv.org/abs/0812.1770
 *
 * [Links]:
 * https://math.stackexchange.com/questions/2637469/where-does-the-second-formula-of-modularity-comes-from-in-the-louvain-paper-the
 * https://www.quora.com/How-is-the-formula-for-Louvain-modularity-change-derived
 * https://github.com/gephi/gephi/blob/master/modules/StatisticsPlugin/src/main/java/org/gephi/statistics/plugin/Modularity.java
 * https://github.com/igraph/igraph/blob/eca5e809aab1aa5d4eca1e381389bcde9cf10490/src/community.c#L906
 */
var resolveDefaults = require('graphology-utils/defaults');
var isGraph = require('graphology-utils/is-graph');
var inferType = require('graphology-utils/infer-type');
var getters = require('graphology-utils/getters');

var DEFAULTS = {
  getNodeCommunity: 'community',
  getEdgeWeight: 'weight',
  resolution: 1
};

function collectForUndirectedDense(graph, options) {
  var communities = new Array(graph.order);
  var weightedDegrees = new Float64Array(graph.order);
  var weights = {};
  var M = 0;

  var getEdgeWeight = getters.createEdgeWeightGetter(
    options.getEdgeWeight
  ).fromEntry;
  var getNodeCommunity = getters.createNodeValueGetter(
    options.getNodeCommunity
  ).fromEntry;

  // Collecting communities
  var i = 0;
  var ids = {};
  graph.forEachNode(function (node, attr) {
    ids[node] = i;
    communities[i++] = getNodeCommunity(node, attr);
  });

  // Collecting weights
  graph.forEachUndirectedEdge(function (edge, attr, source, target, sa, ta, u) {
    var weight = getEdgeWeight(edge, attr, source, target, sa, ta, u);

    M += weight;
    weights[edge] = weight;

    weightedDegrees[ids[source]] += weight;

    // NOTE: we double degree only if we don't have a loop
    if (source !== target) weightedDegrees[ids[target]] += weight;
  });

  return {
    weights: weights,
    communities: communities,
    weightedDegrees: weightedDegrees,
    M: M
  };
}

function collectForDirectedDense(graph, options) {
  var communities = new Array(graph.order);
  var weightedInDegrees = new Float64Array(graph.order);
  var weightedOutDegrees = new Float64Array(graph.order);
  var weights = {};
  var M = 0;

  var getEdgeWeight = getters.createEdgeWeightGetter(
    options.getEdgeWeight
  ).fromEntry;
  var getNodeCommunity = getters.createNodeValueGetter(
    options.getNodeCommunity
  ).fromEntry;

  // Collecting communities
  var i = 0;
  var ids = {};
  graph.forEachNode(function (node, attr) {
    ids[node] = i;
    communities[i++] = getNodeCommunity(node, attr);
  });

  // Collecting weights
  graph.forEachDirectedEdge(function (edge, attr, source, target, sa, ta, u) {
    var weight = getEdgeWeight(edge, attr, source, target, sa, ta, u);

    M += weight;
    weights[edge] = weight;

    weightedOutDegrees[ids[source]] += weight;
    weightedInDegrees[ids[target]] += weight;
  });

  return {
    weights: weights,
    communities: communities,
    weightedInDegrees: weightedInDegrees,
    weightedOutDegrees: weightedOutDegrees,
    M: M
  };
}

function undirectedDenseModularity(graph, options) {
  var resolution = options.resolution;

  var result = collectForUndirectedDense(graph, options);

  var communities = result.communities;
  var weightedDegrees = result.weightedDegrees;

  var M = result.M;

  var nodes = graph.nodes();

  var i, j, l, Aij, didj, e;

  var S = 0;

  var M2 = M * 2;

  for (i = 0, l = graph.order; i < l; i++) {
    // NOTE: it is important to parse the whole matrix here, diagonal and
    // lower part included. A lot of implementation differ here because
    // they process only a part of the matrix
    for (j = 0; j < l; j++) {
      // NOTE: Kronecker's delta
      // NOTE: we could go from O(n^2) to O(avg.C^2)
      if (communities[i] !== communities[j]) continue;

      e = graph.undirectedEdge(nodes[i], nodes[j]);

      Aij = result.weights[e] || 0;
      didj = weightedDegrees[i] * weightedDegrees[j];

      // We add twice if we have a self loop
      if (i === j && typeof e !== 'undefined')
        S += (Aij - (didj / M2) * resolution) * 2;
      else S += Aij - (didj / M2) * resolution;
    }
  }

  return S / M2;
}

function directedDenseModularity(graph, options) {
  var resolution = options.resolution;

  var result = collectForDirectedDense(graph, options);

  var communities = result.communities;
  var weightedInDegrees = result.weightedInDegrees;
  var weightedOutDegrees = result.weightedOutDegrees;

  var M = result.M;

  var nodes = graph.nodes();

  var i, j, l, Aij, didj, e;

  var S = 0;

  for (i = 0, l = graph.order; i < l; i++) {
    // NOTE: it is important to parse the whole matrix here, diagonal and
    // lower part included. A lot of implementation differ here because
    // they process only a part of the matrix
    for (j = 0; j < l; j++) {
      // NOTE: Kronecker's delta
      // NOTE: we could go from O(n^2) to O(avg.C^2)
      if (communities[i] !== communities[j]) continue;

      e = graph.directedEdge(nodes[i], nodes[j]);

      Aij = result.weights[e] || 0;
      didj = weightedInDegrees[i] * weightedOutDegrees[j];

      // Here we multiply by two to simulate iteration through lower part
      S += Aij - (didj / M) * resolution;
    }
  }

  return S / M;
}

function collectCommunitesForUndirected(graph, options) {
  var communities = {};
  var totalWeights = {};
  var internalWeights = {};

  var getNodeCommunity = getters.createNodeValueGetter(
    options.getNodeCommunity
  ).fromEntry;

  graph.forEachNode(function (node, attr) {
    var community = getNodeCommunity(node, attr);
    communities[node] = community;

    if (typeof community === 'undefined')
      throw new Error(
        'graphology-metrics/modularity: the "' +
          node +
          '" node is not in the partition.'
      );

    totalWeights[community] = 0;
    internalWeights[community] = 0;
  });

  return {
    communities: communities,
    totalWeights: totalWeights,
    internalWeights: internalWeights
  };
}

function collectCommunitesForDirected(graph, options) {
  var communities = {};
  var totalInWeights = {};
  var totalOutWeights = {};
  var internalWeights = {};

  var getNodeCommunity = getters.createNodeValueGetter(
    options.getNodeCommunity
  ).fromEntry;

  graph.forEachNode(function (node, attr) {
    var community = getNodeCommunity(node, attr);
    communities[node] = community;

    if (typeof community === 'undefined')
      throw new Error(
        'graphology-metrics/modularity: the "' +
          node +
          '" node is not in the partition.'
      );

    totalInWeights[community] = 0;
    totalOutWeights[community] = 0;
    internalWeights[community] = 0;
  });

  return {
    communities: communities,
    totalInWeights: totalInWeights,
    totalOutWeights: totalOutWeights,
    internalWeights: internalWeights
  };
}

function undirectedSparseModularity(graph, options) {
  var resolution = options.resolution;

  var result = collectCommunitesForUndirected(graph, options);

  var M = 0;

  var totalWeights = result.totalWeights;
  var internalWeights = result.internalWeights;
  var communities = result.communities;

  var getEdgeWeight = getters.createEdgeWeightGetter(
    options.getEdgeWeight
  ).fromEntry;

  graph.forEachUndirectedEdge(function (
    edge,
    edgeAttr,
    source,
    target,
    sa,
    ta,
    u
  ) {
    var weight = getEdgeWeight(edge, edgeAttr, source, target, sa, ta, u);

    M += weight;

    var sourceCommunity = communities[source];
    var targetCommunity = communities[target];

    totalWeights[sourceCommunity] += weight;
    totalWeights[targetCommunity] += weight;

    if (sourceCommunity !== targetCommunity) return;

    internalWeights[sourceCommunity] += weight * 2;
  });

  var Q = 0;
  var M2 = M * 2;

  for (var C in internalWeights)
    Q +=
      internalWeights[C] / M2 - Math.pow(totalWeights[C] / M2, 2) * resolution;

  return Q;
}

function directedSparseModularity(graph, options) {
  var resolution = options.resolution;

  var result = collectCommunitesForDirected(graph, options);

  var M = 0;

  var totalInWeights = result.totalInWeights;
  var totalOutWeights = result.totalOutWeights;
  var internalWeights = result.internalWeights;
  var communities = result.communities;

  var getEdgeWeight = getters.createEdgeWeightGetter(
    options.getEdgeWeight
  ).fromEntry;

  graph.forEachDirectedEdge(function (
    edge,
    edgeAttr,
    source,
    target,
    sa,
    ta,
    u
  ) {
    var weight = getEdgeWeight(edge, edgeAttr, source, target, sa, ta, u);

    M += weight;

    var sourceCommunity = communities[source];
    var targetCommunity = communities[target];

    totalOutWeights[sourceCommunity] += weight;
    totalInWeights[targetCommunity] += weight;

    if (sourceCommunity !== targetCommunity) return;

    internalWeights[sourceCommunity] += weight;
  });

  var Q = 0;

  for (var C in internalWeights)
    Q +=
      internalWeights[C] / M -
      ((totalInWeights[C] * totalOutWeights[C]) / Math.pow(M, 2)) * resolution;

  return Q;
}

// NOTE: the formula is a bit unclear here but nodeCommunityDegree should be
// given as the edges count * 2
function undirectedModularityDelta(
  M,
  communityTotalWeight,
  nodeDegree,
  nodeCommunityDegree
) {
  return (
    nodeCommunityDegree / (2 * M) -
    (communityTotalWeight * nodeDegree) / (2 * (M * M))
  );
}

function directedModularityDelta(
  M,
  communityTotalInWeight,
  communityTotalOutWeight,
  nodeInDegree,
  nodeOutDegree,
  nodeCommunityDegree
) {
  return (
    nodeCommunityDegree / M -
    (nodeOutDegree * communityTotalInWeight +
      nodeInDegree * communityTotalOutWeight) /
      (M * M)
  );
}

function denseModularity(graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/modularity: given graph is not a valid graphology instance.'
    );

  if (graph.size === 0)
    throw new Error(
      'graphology-metrics/modularity: cannot compute modularity of an empty graph.'
    );

  if (graph.multi)
    throw new Error(
      'graphology-metrics/modularity: cannot compute modularity of a multi graph. Cast it to a simple one beforehand.'
    );

  var trueType = inferType(graph);

  if (trueType === 'mixed')
    throw new Error(
      'graphology-metrics/modularity: cannot compute modularity of a mixed graph.'
    );

  options = resolveDefaults(options, DEFAULTS);

  if (trueType === 'directed') return directedDenseModularity(graph, options);

  return undirectedDenseModularity(graph, options);
}

function sparseModularity(graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/modularity: given graph is not a valid graphology instance.'
    );

  if (graph.size === 0)
    throw new Error(
      'graphology-metrics/modularity: cannot compute modularity of an empty graph.'
    );

  if (graph.multi)
    throw new Error(
      'graphology-metrics/modularity: cannot compute modularity of a multi graph. Cast it to a simple one beforehand.'
    );

  var trueType = inferType(graph);

  if (trueType === 'mixed')
    throw new Error(
      'graphology-metrics/modularity: cannot compute modularity of a mixed graph.'
    );

  options = resolveDefaults(options, DEFAULTS);

  if (trueType === 'directed') return directedSparseModularity(graph, options);

  return undirectedSparseModularity(graph, options);
}

var modularity = sparseModularity;

modularity.sparse = sparseModularity;
modularity.dense = denseModularity;
modularity.undirectedDelta = undirectedModularityDelta;
modularity.directedDelta = directedModularityDelta;

module.exports = modularity;
