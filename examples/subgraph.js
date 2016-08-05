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
  const sub = new Graph();

  //-- First solution
  nodes.forEach(node => {
    sub.importNode(graph.exportNode(node));

    // Iterating through out edges
    graph.forEachOutEdges(node, edge => {
      sub.importEdge(graph.exportEdge(edge));
    });

    // Iterating through undirected edges
    graph.forEachUndirectedEdge(node, edge => {
      if (!sub.hasEdge(edge))
        sub.importEdge(graph.exportEdge(edge));
    });
  });

  //-- Second solution
  sub.importNodes(graph.exportNodes(nodes));
  sub.importEdges(graph.directedEdges());
  sub.importEdges(graph.undirectedEdges());

  return sub;
}
