/**
 * Highlight Neighbors Example
 * ============================
 *
 * @Yomguithereal
 *
 * Highlighting neighbors of the clicked node using a rendering engine such
 * as sigma.
 */
import Graph from 'graph';
import sigma from 'sigma';

// Creating our graph (we'll assume it's hydrated with external data)
const graph = new Graph(data);

// Instantiating sigma
const sigInst = new sigma(graph, {
  settings: {
    edgeColor: 'source'
  }
});

// Click handler
function clickHandler({data: {node}}) {

  // Creating a set of the node & its neighbors
  const nodesToHighlight = new Set([node].concat(graph.neighbors(node)));

  // Iterating through nodes
  graph.forEachNode(node => {
    const color = nodesToHighlight.has(node) ?
      graph.getNodeAttribute(node, 'originalColor') :
      '#ccc';

    graph.setNodeAttribute(node, 'color', color);
  });

  sigInst.refresh();
}

sigInst.on('clickNode', clickHandler);
