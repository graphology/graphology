/**
 * Graphology Assertions
 * ======================
 *
 * Various assertions concerning graphs.
 */
var deepEqual = require('fast-deep-equal/es6');

/**
 * Function returning whether the given graphs have the same nodes.
 *
 * @param  {boolean} deep - Whether to perform deep comparisons.
 * @param  {Graph}   G    - First graph.
 * @param  {Graph}   H    - Second graph.
 * @return {boolean}
 */
function abstractHaveSameNodes(deep, G, H) {
  if (G.order !== H.order) return false;

  return G.everyNode(function (node, attr) {
    if (!H.hasNode(node)) return false;

    if (!deep) return true;

    return deepEqual(attr, H.getNodeAttributes(node));
  });
}

/**
 * Function returning whether the given graphs are identical.
 *
 * @param  {boolean} deep - Whether to perform deep comparison.
 * @param  {Graph}   G    - First graph.
 * @param  {Graph}   H    - Second graph.
 * @return {boolean}
 */
function abstractAreSameGraphs(deep, G, H) {
  if (G.multi || H.multi)
    throw new Error(
      'graphology-assertions.areSameGraphsDeep: not implemented for multigraphs yet!'
    );

  // If two graphs don't have the same settings they cannot be identical
  if (G.type !== H.type || G.allowSelfLoops !== H.allowSelfLoops) return false;

  // If two graphs don't have the same number of typed edges, they cannot be identical
  if (
    G.directedSize !== H.directedSize ||
    G.undirectedSize !== H.undirectedSize
  )
    return false;

  // If two graphs don't have the same nodes they cannot be identical
  if (!abstractHaveSameNodes(deep, G, H)) return false;

  var sameDirectedEdges = false;
  var sameUndirectedEdges = false;

  // In the simple case we don't need refining
  sameDirectedEdges = G.everyDirectedEdge(function (_e, _ea, source, target) {
    if (!H.hasDirectedEdge(source, target)) return false;

    if (!deep) return true;

    return deepEqual(
      G.getDirectedEdgeAttributes(source, target),
      H.getDirectedEdgeAttributes(source, target)
    );
  });

  if (!sameDirectedEdges) return false;

  sameUndirectedEdges = G.everyUndirectedEdge(function (
    _e,
    _ea,
    source,
    target
  ) {
    if (!H.hasUndirectedEdge(source, target)) return false;

    if (!deep) return true;

    return deepEqual(
      G.getUndirectedEdgeAttributes(source, target),
      H.getUndirectedEdgeAttributes(source, target)
    );
  });

  if (!sameUndirectedEdges) return false;

  return true;
}

/**
 * Exporting.
 */
exports.isGraph = require('graphology-utils/is-graph');
exports.isGraphConstructor = require('graphology-utils/is-graph-constructor');
exports.haveSameNodes = abstractHaveSameNodes.bind(null, false);
exports.haveSameNodesDeep = abstractHaveSameNodes.bind(null, true);
exports.areSameGraphs = abstractAreSameGraphs.bind(null, false);
exports.areSameGraphsDeep = abstractAreSameGraphs.bind(null, true);
