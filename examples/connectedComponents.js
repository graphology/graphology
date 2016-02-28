/**
 * Connected Components Example
 * =============================
 *
 * @Yomguithereal
 *
 * Finding a graph's connected components. The function will return an array
 * of subgraphs.
 */

// Using proposition n°2
// NOTE: this version does not copy attributes into the components
export default function connectedComponents(graph) {
  const visitedNodes = new Set(),
        components = [];

  // NOTE: attempting this iterator scheme
  graph.forEachNode(node => {

    if (visitedNodes.has(node))
      return;

    const component = new Graph();

    visitedNodes.add(node);
    component.addNode(node);

    graph.forEachOutEdge(node, edge => {

      // NOTE: This feels somewhat clunky
      component.addEdge(
        edge,
        graph.source(edge),
        graph.target(edge)
      );
    });

    const walk = neighbor => {
      if (visitedNodes.has(neighbor))
        return;

      visitedNodes.add(neighbor);
      component.addNode(node);

      graph.forEachOutEdge(node, edge => {

        // NOTE: This feels somewhat clunky
        component.addEdge(
          edge,
          graph.source(edge),
          graph.target(edge)
        );
      });

      graph.forEachNeighbor(walk);
    };

    graph.forEachNeighbor(walk);
    components.push(components);
  });

  return components;
}
