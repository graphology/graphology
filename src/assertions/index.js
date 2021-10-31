/**
 * Graphology Assertions
 * ======================
 *
 * Various assertions concerning graphs.
 */
var isEqual = require('lodash/isEqual');

/**
 * Function returning whether the given graphs have the same nodes.
 *
 * @param  {Graph}   G - First graph.
 * @param  {Graph}   H - Second graph.
 * @return {boolean}
 */
function haveSameNodes(G, H) {
  if (G.order !== H.order) return false;

  return G.everyNode(function (node) {
    return H.hasNode(node);
  });
}

/**
 * Function returning whether the given graphs have the same nodes & if these
 * nodes have the same attributes.
 *
 * @param  {Graph}   G - First graph.
 * @param  {Graph}   H - Second graph.
 * @return {boolean}
 */
function haveSameNodesDeep(G, H) {
  if (G.order !== H.order) return false;

  return G.everyNode(function (node, attr) {
    if (!H.hasNode(node)) return false;

    return isEqual(attr, H.getNodeAttributes(node));
  });
}

/**
 * Function returning whether the given graphs are identical.
 *
 * @param  {Graph}   G - First graph.
 * @param  {Graph}   H - Second graph.
 * @return {boolean}
 */
function areSameGraphs(G, H) {
  if (G.multi || H.multi)
    throw new Error(
      'graphology-assertions.areSameGraphs: not implemented for multigraphs yet!'
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
  if (!haveSameNodes(G, H)) return false;

  var sameDirectedEdges = false;
  var sameUndirectedEdges = false;

  // In the simple case we don't need refining
  sameDirectedEdges = G.everyDirectedEdge(function (_e, _ea, source, target) {
    return H.hasDirectedEdge(source, target);
  });

  if (!sameDirectedEdges) return false;

  sameUndirectedEdges = G.everyUndirectedEdge(function (
    _e,
    _ea,
    source,
    target
  ) {
    return H.hasUndirectedEdge(source, target);
  });

  if (!sameUndirectedEdges) return false;

  return true;
}

/**
 * Function returning whether the given graphs are identical and if their
 * node & edge attributes are identical also.
 *
 * @param  {Graph}   G - First graph.
 * @param  {Graph}   H - Second graph.
 * @return {boolean}
 */
function areSameGraphsDeep(G, H) {
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
  if (!haveSameNodesDeep(G, H)) return false;

  var sameDirectedEdges = false;
  var sameUndirectedEdges = false;

  // In the simple case we don't need refining
  sameDirectedEdges = G.everyDirectedEdge(function (_e, _ea, source, target) {
    if (!H.hasDirectedEdge(source, target)) return false;

    return isEqual(
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

    return isEqual(
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
exports.haveSameNodes = haveSameNodes;
exports.haveSameNodesDeep = haveSameNodesDeep;
exports.areSameGraphs = areSameGraphs;
exports.areSameGraphsDeep = areSameGraphsDeep;
