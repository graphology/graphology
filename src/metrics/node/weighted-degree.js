/**
 * Graphology Weighted Degree
 * ===========================
 *
 * Function computing the weighted degree of nodes. The weighted degree is the
 * sum of a node's edges' weights.
 */
var isGraph = require('graphology-utils/is-graph');

/**
 * Defaults.
 */
var DEFAULT_WEIGHT_ATTRIBUTE = 'weight';

/**
 * Asbtract function to perform any kind of weighted degree.
 *
 * @param  {string}          name          - Name of the implemented function.
 * @param  {string}          method        - Method of the graph to get the edges.
 * @param  {Graph}           graph         - A graphology instance.
 * @param  {string}          node          - Target node.
 * @param  {string|function} getEdgeWeight - Name of edge weight attribute or getter function.
 *
 * @return {number}
 */
function abstractWeightedDegree(name, method, graph, node, getEdgeWeight) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/' +
        name +
        ': the given graph is not a valid graphology instance.'
    );

  getEdgeWeight = getEdgeWeight || DEFAULT_WEIGHT_ATTRIBUTE;

  var d = 0;

  graph[method](node, function (e, a, s, t, sa, ta, u) {
    var w =
      typeof getEdgeWeight === 'function'
        ? getEdgeWeight(e, a, s, t, sa, ta, u)
        : a[getEdgeWeight];

    if (typeof w !== 'number' || isNaN(w)) w = 1;

    d += w;
  });

  return d;
}

/**
 * Exports.
 */
exports.weightedDegree = abstractWeightedDegree.bind(
  null,
  'weightedDegree',
  'forEachEdge'
);
exports.weightedInDegree = abstractWeightedDegree.bind(
  null,
  'weightedInDegree',
  'forEachInEdge'
);
exports.weightedOutDegree = abstractWeightedDegree.bind(
  null,
  'weightedOutDegree',
  'forEachOutEdge'
);
exports.weightedInboundDegree = abstractWeightedDegree.bind(
  null,
  'weightedInboundDegree',
  'forEachInboundEdge'
);
exports.weightedOutboundDegree = abstractWeightedDegree.bind(
  null,
  'weightedOutboundDegree',
  'forEachOutboundEdge'
);
exports.weightedUndirectedDegree = abstractWeightedDegree.bind(
  null,
  'weightedUndirectedDegree',
  'forEachUndirectedEdge'
);
exports.weightedDirectedDegree = abstractWeightedDegree.bind(
  null,
  'weightedDirectedDegree',
  'forEachDirectedEdge'
);
