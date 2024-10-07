/**
 * Graphology Topological Sort
 * ============================
 *
 * Function that fully connects each of a node's in-neighbors to its
 * out-neighbors, so that the node can be dropped while preserving its
 * neighbors' relative order with one another.
 *
 * If an edge already exists between a particular pair of nodes, a new
 * edge is not created, even in a MultiGraph. The new edges have no
 * attributes even if attributes were present on the edges connecting
 * through the bypassed node.

 * This function is m*n in time and space, where m is the node's in-degree
 * and n is the node's out-degree.
 */
const {NotFoundGraphError} = require("graphology");
module.exports = function bypassNode(graph, node) {
  if (graph.getNodeAttributes(node) === undefined) {
    throw new NotFoundGraphError(`Node '${node}' not found`);
  }

  let currentSource;

  const connectCurrentSourceTo = graph.multi
    ? (target) => {
      if (graph.edges(currentSource, target).length === 0) {
        graph.addEdge(currentSource, target);
      }
    }
    : (target) => {
      graph.mergeEdge(currentSource, target);
    };

  graph.forEachInboundNeighbor(node, (source) => {
    currentSource = source;
    graph.forEachOutboundNeighbor(node, connectCurrentSourceTo);
  });
}
