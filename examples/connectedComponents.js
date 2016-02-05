/**
 * Connected Components Example
 * =============================
 *
 * @Yomguithereal
 * Finding a graph's connected components. The function will return an array
 * of subgraphs.
 */

// Using solution n°1 from issue #8
function connectedComponents(graph) {
  const visitedNodes = new Set(),
        components = [];

  graph.nodes.forEach(node => {

    if (visitedNodes.has(node))
      return;

    const component = new Graph();

    visitedNodes.add(node);
    component.add(node);

    const walk = neighbour => {
      if (visitedNodes.has(neighbour))
        return;

      visitedNodes.add(neighbour);
      component.add(neighbour);
      graph.neighbours(neighbour).forEach(walk);
    };

    graph.neighbours(node).forEach(walk);

    components.push(component);
  });

  return components;
}

// Using solution n°3 from issue #8
function connectedComponents(graph) {
  const visitedNodes = new Set(),
        components = [];

  graph.nodes.forEach(node => {

    if (visitedNodes.has(node))
      return;

    const component = new Graph();

    visitedNodes.add(node);
    component.add(node);

    const walk = neighbour => {
      if (visitedNodes.has(neighbour))
        return;

      visitedNodes.add(neighbour);
      component.add(neighbour);
      neighbour.neighbours().forEach(walk);
    };

    node.neighbours().forEach(walk);

    components.push(component);
  });

  return components;
}
