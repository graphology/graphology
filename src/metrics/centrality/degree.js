/**
 * Graphology Degree Centrality
 * =============================
 *
 * Function computing degree centrality.
 */
var isGraph = require('graphology-utils/is-graph');

/**
 * Asbtract function to perform any kind of degree centrality.
 *
 * Intuitively, the degree centrality of a node is the fraction of nodes it
 * is connected to.
 *
 * @param  {boolean} assign           - Whether to assign the result to the nodes.
 * @param  {string}  method           - Method of the graph to get the degree.
 * @param  {Graph}   graph            - A graphology instance.
 * @param  {object}  [options]        - Options:
 * @param  {object}    [attributes]   - Custom attribute names:
 * @param  {string}      [centrality] - Name of the attribute to assign.
 * @return {object|void}
 */
function abstractDegreeCentrality(assign, method, graph, options) {
  var name = method + 'Centrality';

  if (!isGraph(graph))
    throw new Error('graphology-centrality/' + name + ': the given graph is not a valid graphology instance.');

  if (method !== 'degree' && graph.type === 'undirected')
    throw new Error('graphology-centrality/' + name + ': cannot compute ' + method + ' centrality on an undirected graph.');

  // Solving options
  options = options || {};

  var attributes = options.attributes || {};

  var centralityAttribute = attributes.centrality || name;

  // Variables
  var order = graph.order,
      nodes = graph.nodes(),
      getDegree = graph[method].bind(graph),
      centralities = {};

  if (order === 0)
    return assign ? undefined : centralities;

  var s = 1 / (order - 1);

  // Iteration variables
  var node,
      centrality,
      i;

  for (i = 0; i < order; i++) {
    node = nodes[i];
    centrality = getDegree(node) * s;

    if (assign)
      graph.setNodeAttribute(node, centralityAttribute, centrality);
    else
      centralities[node] = centrality;
  }

  return assign ? undefined : centralities;
}

/**
 * Building various functions to export.
 */
var degreeCentrality = abstractDegreeCentrality.bind(null, false, 'degree'),
    inDegreeCentrality = abstractDegreeCentrality.bind(null, false, 'inDegree'),
    outDegreeCentrality = abstractDegreeCentrality.bind(null, false, 'outDegree');

degreeCentrality.assign = abstractDegreeCentrality.bind(null, true, 'degree');
inDegreeCentrality.assign = abstractDegreeCentrality.bind(null, true, 'inDegree');
outDegreeCentrality.assign = abstractDegreeCentrality.bind(null, true, 'outDegree');

/**
 * Exporting.
 */
degreeCentrality.degreeCentrality = degreeCentrality;
degreeCentrality.inDegreeCentrality = inDegreeCentrality;
degreeCentrality.outDegreeCentrality = outDegreeCentrality;
module.exports = degreeCentrality;
