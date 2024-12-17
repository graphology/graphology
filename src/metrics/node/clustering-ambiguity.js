/**
 * Graphology Clustering Ambiguity
 * ================================
 *
 * Functions used to compute the clustering ambiguity of all nodes of a given
 * graph and results of clustering runs and return all node's ambiguity mean.
 *
 * Formula can be found here: https://github.com/graphology/graphology/pull/419
 */
var isGraph = require('graphology-utils/is-graph');
var inferType = require('graphology-utils/infer-type');
var randomOrderedPair = require('pandemonium/random-ordered-pair');

// TODO: docs
// TODO: export
// TODO: assign variant

function processNodePair(
  n1,
  n2,
  n1Attr,
  n2Attr,
  clusterings,
  isEdge,
  nodePairs
) {
  if (nodePairs[n1] === undefined) nodePairs[n1] = {n2: true};
  else nodePairs[n1][n2] = true;

  if (!isEdge) {
    n1Attr.nonNeighborsMet += 1;
    n2Attr.nonNeighborsMet += 1;
  }

  var identicalCluster = 0;
  for (var i = 0; i < clusterings.length; i++)
    if (clusterings[i][n1] === clusterings[i][n2]) identicalCluster++;

  var ratio = identicalCluster / clusterings.length;
  if (identicalCluster === 0 || identicalCluster === clusterings.length) return;

  var entropy =
      ((ratio - 1) * Math.log(1 - ratio) - ratio * Math.log(ratio)) /
      Math.log(2),
    entropyAttr = 'entropy' + (isEdge ? 'Edges' : 'NonEdges');
  n1Attr[entropyAttr] += entropy;
  n2Attr[entropyAttr] += entropy;
}

/**
 * @param  {Graph}          graph         - A graphology instance.
 * @param  {array}          clusterings   - An array of clusterings as objects with nodes as keys and clusters as values
 *
 * @return {object}                       - A map of ambiguities computed for each node
 */
module.exports = function clusteringAmbiguity(graph, clusterings) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/node/clustering-ambiguity: given graph is not a valid graphology instance.'
    );

  if (graph.multi)
    throw new Error(
      'graphology-metrics/node/clustering-ambiguity: ambiguity is not implemented yet for multi graphs.'
    );

  if (inferType(graph) !== 'undirected')
    throw new Error(
      'graphology-metrics/node/clustering-ambiguity: ambiguity is not implemented yet for directed and mixt graphs.'
    );

  if (clusterings.length < 2)
    throw new Error(
      'graphology-metrics/node/clustering-ambiguity: given set of clusterings should have at least 2 clusterings.'
    );

  if (graph.order === 0) return {};

  // A perfect computation would require to run on all nodes with N² complexity
  // so we sample to reduce it to N*log(N).
  var sampleSize =
    graph.order * Math.min(graph.order, 5 * Math.log(graph.order));

  var nodePairs = {},
    donePairs = 0,
    nodes = [],
    attributes = {};

  graph.forEachNode(function (node) {
    nodes.push(node);
    attributes[node] = {
      entropyEdges: 0,
      entropyNonEdges: 0,
      nonNeighborsMet: 0
    };
  });

  // First compute all node pairs that are edges
  graph.forEachEdge(function (edge, edgeAttr, n1, n2) {
    if (n1 === n2) return;

    if (n1 < n2)
      processNodePair(
        n1,
        n2,
        attributes[n1],
        attributes[n2],
        clusterings,
        true,
        nodePairs
      );
    else
      processNodePair(
        n2,
        n1,
        attributes[n1],
        attributes[n2],
        clusterings,
        true,
        nodePairs
      );

    donePairs++;
  });

  var pair, n1, n2;

  // Then compute a sample of node pairs to complete
  while (donePairs < sampleSize) {
    pair = randomOrderedPair(nodes);
    n1 = pair[0];
    n2 = pair[1];

    if (nodePairs[n1] && nodePairs[n1][n2]) continue;

    processNodePair(
      n1,
      n2,
      attributes[n1],
      attributes[n2],
      clusterings,
      false,
      nodePairs
    );
    donePairs++;
  }

  var ambiguities = {};
  Object.keys(attributes).forEach(function (node) {
    var degree = graph.degree(node);
    if (attributes[node].nonNeighborsMet !== 0)
      ambiguities[node] =
        (attributes[node].entropyEdges +
          ((graph.order - degree) / attributes[node].nonNeighborsMet) *
            attributes[node].entropyNonEdges) /
        graph.order;
    else ambiguities[node] = attributes[node].entropyEdges / degree;
  });
  return ambiguities;
};
