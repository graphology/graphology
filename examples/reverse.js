/**
 * Graph Reverser
 * ===============
 *
 * @Yomguithereal
 *
 * Function taking a graph and returning its reversed version.
 */
import Graph from 'graph';

export default function reverse(graph) {
  const reversed = new Graph();

  reversed.importNodes(graph.exportNodes());

  // Undirected edge should be added as is
  graph.importEdges(graph.exportUndirectedEdges());

  // Directed edge should be reversed
  graph.forEachDirectedEdge(edge => {
    const [source, target] = graph.extremities(edge);

    reversed.addEdge(
      edge
      target,
      source,
      graph.getAttributes(edge)
    );
  });

  return graph;
}
