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
 * Signature n°1 - computing weighted degree for every node:
 *
 * @param  {string}  name            - Name of the implemented function.
 * @param  {boolean} assign          - Whether to assign the result to the nodes.
 * @param  {string}  method          - Method of the graph to get the edges.
 * @param  {Graph}   graph           - A graphology instance.
 * @param  {object}  [options]       - Options:
 * @param  {object}    [attributes]    - Custom attribute names:
 * @param  {string}      [weight]         - Name of the weight attribute.
 * @param  {string}      [weightedDegree] - Name of the attribute to set.
 *
 * Signature n°2 - computing weighted degree for a single node:
 *
 * @param  {string}  name            - Name of the implemented function.
 * @param  {boolean} assign          - Whether to assign the result to the nodes.
 * @param  {string}  edgeGetter      - Graph's method used to get edges.
 * @param  {Graph}   graph           - A graphology instance.
 * @param  {any}     node            - Key of node.
 * @param  {object}  [options]       - Options:
 * @param  {object}    [attributes]    - Custom attribute names:
 * @param  {string}      [weight]         - Name of the weight attribute.
 * @param  {string}      [weightedDegree] - Name of the attribute to set.
 *
 * @return {object|void}
 */
function abstractWeightedDegree(name, assign, edgeGetter, graph, options) {
  if (!isGraph(graph))
    throw new Error('graphology-metrics/' + name + ': the given graph is not a valid graphology instance.');

  if (edgeGetter !== 'edges' && graph.type === 'undirected')
    throw new Error('graphology-metrics/' + name + ': cannot compute ' + name + ' on an undirected graph.');

  var singleNode = null;

  // Solving arguments
  if (arguments.length === 5 && typeof arguments[4] !== 'object') {
    singleNode = arguments[4];
  }
  else if (arguments.length === 6) {
    singleNode = arguments[4];
    options = arguments[5];
  }

  // Solving options
  options = options || {};

  var attributes = options.attributes || {};

  var weightAttribute = attributes.weight || DEFAULT_WEIGHT_ATTRIBUTE,
      weightedDegreeAttribute = attributes.weightedDegree || name;

  var edges,
      d,
      w,
      i,
      l;

  // Computing weighted degree for a single node
  if (singleNode) {
    edges = graph[edgeGetter](singleNode);
    d = 0;

    for (i = 0, l = edges.length; i < l; i++) {
      w = graph.getEdgeAttribute(edges[i], weightAttribute);

      if (typeof w === 'number')
        d += w;
    }

    if (assign) {
      graph.setNodeAttribute(singleNode, weightedDegreeAttribute, d);
      return;
    }
    else {
      return d;
    }
  }

  // Computing weighted degree for every node
  // TODO: it might be more performant to iterate on the edges here.
  var nodes = graph.nodes(),
      node,
      weightedDegrees = {},
      j,
      m;

  for (i = 0, l = nodes.length; i < l; i++) {
    node = nodes[i];
    edges = graph[edgeGetter](node);
    d = 0;

    for (j = 0, m = edges.length; j < m; j++) {
      w = graph.getEdgeAttribute(edges[j], weightAttribute);

      if (typeof w === 'number')
        d += w;
    }

    if (assign)
      graph.setNodeAttribute(node, weightedDegreeAttribute, d);
    else
      weightedDegrees[node] = d;
  }

  if (!assign)
    return weightedDegrees;
}

/**
 * Building various functions to export.
 */
var weightedDegree = abstractWeightedDegree.bind(null, 'weightedDegree', false, 'edges'),
    weightedInDegree = abstractWeightedDegree.bind(null, 'weightedInDegree', false, 'inEdges'),
    weightedOutDegree = abstractWeightedDegree.bind(null, 'weightedOutDegree', false, 'outEdges');

weightedDegree.assign = abstractWeightedDegree.bind(null, 'weightedDegree', true, 'edges');
weightedInDegree.assign = abstractWeightedDegree.bind(null, 'weightedInDegree', true, 'inEdges');
weightedOutDegree.assign = abstractWeightedDegree.bind(null, 'weightedOutDegree', true, 'outEdges');

/**
 * Exporting.
 */
weightedDegree.weightedDegree = weightedDegree;
weightedDegree.weightedInDegree = weightedInDegree;
weightedDegree.weightedOutDegree = weightedOutDegree;
module.exports = weightedDegree;
