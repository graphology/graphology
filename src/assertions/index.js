/**
 * Graphology Assertions
 * ======================
 *
 * Various assertions concerning graphs.
 */
var isEqual = require('lodash/isEqual');

exports.isGraph = require('graphology-utils/is-graph');
exports.isGraphConstructor = require('graphology-utils/is-graph-constructor');

/**
 * Function returning whether the given graphs have the same nodes.
 *
 * @param  {Graph}   G - First graph.
 * @param  {Graph}   H - Second graph.
 * @return {boolean}
 */
exports.hasSameNodes = function hasSameNodes(G, H) {
  if (G.order !== H.order) return false;

  return G.everyNode(function (node) {
    return H.hasNode(node);
  });
};

/**
 * Function returning whether the given graphs have the same edges.
 *
 * @param  {Graph}   G - First graph.
 * @param  {Graph}   H - Second graph.
 * @return {boolean}
 */
exports.hasSameEdges = function hasSameEdges(G, H) {
  if (
    G.directedSize !== H.directedSize ||
    G.undirectedSize !== H.undirectedSize
  )
    return false;

  // TODO: multi case
};

/**
 * Function returning whether the given graphs have the same nodes & if these
 * nodes have the same attributes.
 *
 * @param  {Graph}   G - First graph.
 * @param  {Graph}   H - Second graph.
 * @return {boolean}
 */
exports.hasSameNodesDeep = function hasSameNodesDeep(G, H) {
  if (G.order !== H.order) return false;

  return G.everyNode(function (node, attr) {
    if (!H.hasNode(node)) return false;

    return isEqual(attr, H.getNodeAttributes(node));
  });
};
