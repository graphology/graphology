/**
 * Subgraph helper
 * ================
 *
 * @Yomguithereal
 *
 * Function returning a subgraph from the given graph and set of nodes.
 */
export default function subgraph(graph, nodes) {
  const sub = graph.createEmptyCopy(),
        nodeSet = new Set(nodes),
        edges = [];

  nodes.forEach(node => {
    sub.importNode(graph.exportNode(node));

    // Iterating through edges
    const relevantEdges = graph.filterOutboundEdges(node, edge => {
      const target = graph.otherNode(node, edge);

      return nodeSet.has(target);
    });

    edges.push.apply(edges, relevantEdges);
  });

  graph.importEdges(graph.exportEdges(edges));

  return sub;
}
