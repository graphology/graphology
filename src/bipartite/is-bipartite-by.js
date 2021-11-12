/**
 * Graphology Bipartion Checker
 * =============================
 *
 * Function returning whether the given graph is biparte according to some
 * partition criteria.
 */
const isGraph = require('graphology-utils/is-graph');

module.exports = function isBipartiteBy(graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-bipartite/is-bipartite-by: the given graph is not a valid graphology instance.'
    );
};
