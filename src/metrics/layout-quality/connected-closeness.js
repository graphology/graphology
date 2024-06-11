/**
 * Graphology Layout Quality - Connected-closeness
 * ============================================
 *
 * Function computing the layout quality metric named "connected-closeness",
 * designed to provide a quantified statement about the mediation of the topology by the node placement.
 *
 * [Article]:
 * Jacomy, M. (2023). Connected-closeness: A Visual Quantification of Distances in Network Layouts.
 * Journal of Graph Algorithms and Applications, 27(5), 341-404.
 * https://www.jgaa.info/index.php/jgaa/article/view/paper626
 */
var isGraph = require('graphology-utils/is-graph');

module.exports = function connectedCloseness(g, settings) {
  if (!isGraph(g))
    throw new Error(
      'graphology-metrics/layout-quality/connected-closeness: given graph is not a valid graphology instance.'
    );
};
