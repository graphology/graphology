/**
 * Subgraph helper
 * ================
 *
 * @Yomguithereal
 *
 * Function returning a subgraph from the given graph and set of nodes.
 */
import Graph from 'graph';

export default function subgraph(graph, nodes) {
  const sub = new Graph(),
        nodeSet = new Set(nodes);

  nodes.forEach(node => {
    sub.importNode(graph.exportNode(node));

    // Iterating through edges
    const relevantEdges = graph.filterOutboundEdges(nodes, edge => {
      const target = graph.target(edge);

      return nodeSet.has(target);
    });

    graph.importEdges(graph.exportEdges(relevantEdges));
  });

  return sub;
}
