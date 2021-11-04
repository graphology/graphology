/**
 * Graphology Disjoint Union Operator
 * ===================================
 */
var isGraph = require('graphology-utils/is-graph');
var copyNode = require('graphology-utils/add-node').copyNode;
var copyEdge = require('graphology-utils/add-edge').copyEdge;

/**
 * Function returning the disjoint union of two given graphs by giving new keys
 * to nodes & edges.
 *
 * @param  {Graph} G - The first graph.
 * @param  {Graph} H - The second graph.
 * @return {Graph}
 */
module.exports = function disjointUnion(G, H) {
  if (!isGraph(G) || !isGraph(H))
    throw new Error('graphology-operators/disjoint-union: invalid graph.');

  if (G.multi !== H.multi)
    throw new Error(
      'graphology-operators/disjoint-union: both graph should be simple or multi.'
    );

  var R = G.nullCopy();

  // TODO: in the spirit of this operator we should probably prefix something
  R.mergeAttributes(G.getAttributes());

  var labelsG = {};
  var labelsH = {};

  var i = 0;

  // Adding nodes
  G.forEachNode(function (key, attr) {
    labelsG[key] = i;

    copyNode(R, i, attr);

    i++;
  });

  H.forEachNode(function (key, attr) {
    labelsH[key] = i;

    copyNode(R, i, attr);

    i++;
  });

  // Adding edges
  i = 0;

  G.forEachEdge(function (key, attr, source, target, _s, _t, undirected) {
    copyEdge(
      R,
      undirected,
      i++,
      labelsG[source],
      labelsG[target],
      target,
      attr
    );
  });

  H.forEachEdge(function (key, attr, source, target, _s, _t, undirected) {
    copyEdge(
      R,
      undirected,
      i++,
      labelsH[source],
      labelsH[target],
      target,
      attr
    );
  });

  return R;
};
