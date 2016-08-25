## Exemple: Subgraphs

```js
function subgraph(graph, nodes) {
  const sub = graph.emptyCopy(),
        nodesSet = new Set(nodes),
        edges = [];

  // Importing the nodes:
  sub.importNodes(graph.exportNodes(nodes));

  // Keeping the relevant edges:
  nodes.forEach(node => {

    // An edge is deemed relevant if both its end are attached to
    // one of the subgraph's nodes.
    const relevantEdges = graph.outboundEdges(node).filter(edge => {
      const target = graph.relatedNode(node, edge);

      return nodeSet.has(target);
    });

    edges = edges.concat(relevantEdges);
  });

  graph.importEdges(graph.exportEdges(edges));

  return sub;
}
```
