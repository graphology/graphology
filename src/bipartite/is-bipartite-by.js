/**
 * Graphology Bipartion Checker
 * =============================
 *
 * Function returning whether the given graph is biparte according to some
 * partition criterion.
 */
const isGraph = require('graphology-utils/is-graph');
const createNodeValueGetter =
  require('graphology-utils/getters').createNodeValueGetter;

module.exports = function isBipartiteBy(graph, getNodePartition) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-bipartite/is-bipartite-by: the given graph is not a valid graphology instance.'
    );

  getNodePartition = createNodeValueGetter(getNodePartition).fromEntry;

  const seenPartitions = [];

  return graph.everyNode((node, attr) => {
    const p1 = getNodePartition(node, attr);

    if (!seenPartitions.includes(p1)) {
      seenPartitions.push(p1);

      if (seenPartitions.length > 2) return false;
    }

    return graph.everyOutboundNeighbor(node, (neighbor, neighborAttr) => {
      const p2 = getNodePartition(neighbor, neighborAttr);

      return p1 !== p2;
    });
  });
};
