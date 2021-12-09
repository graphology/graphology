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
 * @param  {string}    [nodeCentralityAttribute] - Name of the attribute to assign.
 * @return {object|void}
 */
function abstractDegreeCentrality(assign, method, graph, options) {
  var name = method + 'Centrality';

  if (!isGraph(graph))
    throw new Error(
      'graphology-centrality/' +
        name +
        ': the given graph is not a valid graphology instance.'
    );

  if (method !== 'degree' && graph.type === 'undirected')
    throw new Error(
      'graphology-centrality/' +
        name +
        ': cannot compute ' +
        method +
        ' centrality on an undirected graph.'
    );

  // Solving options
  options = options || {};

  var centralityAttribute = options.nodeCentralityAttribute || name;

  var ratio = graph.order - 1;
  var getDegree = graph[method].bind(graph);

  if (assign) {
    graph.updateEachNodeAttributes(
      function (node, attr) {
        attr[centralityAttribute] = getDegree(node) / ratio;
        return attr;
      },
      {attributes: [centralityAttribute]}
    );

    return;
  }

  var centralities = {};

  graph.forEachNode(function (node) {
    centralities[node] = getDegree(node) / ratio;
  });

  return centralities;
}

/**
 * Building various functions to export.
 */
var degreeCentrality = abstractDegreeCentrality.bind(null, false, 'degree');
var inDegreeCentrality = abstractDegreeCentrality.bind(null, false, 'inDegree');
var outDegreeCentrality = abstractDegreeCentrality.bind(
  null,
  false,
  'outDegree'
);

degreeCentrality.assign = abstractDegreeCentrality.bind(null, true, 'degree');
inDegreeCentrality.assign = abstractDegreeCentrality.bind(
  null,
  true,
  'inDegree'
);
outDegreeCentrality.assign = abstractDegreeCentrality.bind(
  null,
  true,
  'outDegree'
);

/**
 * Exporting.
 */
exports.degreeCentrality = degreeCentrality;
exports.inDegreeCentrality = inDegreeCentrality;
exports.outDegreeCentrality = outDegreeCentrality;
