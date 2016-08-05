/**
 * Connected Components Example
 * =============================
 *
 * @Yomguithereal
 *
 * Finding a graph's connected components. The function will return an array
 * of subgraphs.
 */
import Graph from 'graph';
import subgraph from 'graph/subgraph';

export function connectedComponentsNodes(graph) {
  const visitedNodes = new Set(),
        components = [];

  graph.forEachNode(node => {

    if (visitedNodes.has(node))
      return;

    const component = [];

    visitedNodes.add(node);
    component.push(node);

    const walk = neighbor => {
      if (visitedNodes.has(neighbor))
        return;

      visitedNodes.add(neighbor);
      component.push(neighbor);

      graph.forEachNeighbor(neighbor, walk);
    };

    graph.forEachNeighbor(node, walk);
    components.push(component);
  });

  return components;
}

export default function connectedComponents(graph) {
  const components = connectedComponentsNodes(graph);

  return components.map(nodes => subgraph(graph, nodes));
}
