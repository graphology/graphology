/**
 * Graphology Union Operator
 * ==========================
 */
var isGraph = require('graphology-utils/is-graph');

/**
 * Function returning the union of two given graphs.
 *
 * @param  {Graph} G - The first graph.
 * @param  {Graph} H - The second graph.
 * @return {Graph}
 */
module.exports = function union(G, H) {
  if (!isGraph(G) || !isGraph(H))
    throw new Error('graphology-operators/union: invalid graph.');

  if (G.multi !== H.multi)
    throw new Error(
      'graphology-operators/union: both graph should be simple or multi.'
    );

  var R = G.copy();
  R.import(H, true);

  return R;
};
