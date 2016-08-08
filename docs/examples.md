# Examples

## Creating a co-occurrence graph

In this example, we are going to create a simple co-occurrence graph of students working on projects:

```js
import {UndirectedGraph} from 'graph';

const graph = new UndirectedGraph();

// The projects's data is a collection of the following structure:
const projects = [
  {
    name: 'Rivia',
    date: '21/06/2013',
    team: [
      {id: 'john', name: 'John', surname: 'Cassidy'},
      {id: 'mary', name: 'Mary', surname: 'Bridget'},
      ...
    ]
  },
  ...
];

// Now let's iterate on the projects to fill our graph with students:
projects.forEach(project => {
  // TODO...
});

// Let's print our graph!
console.log(graph);
```

## Creating a subgraph

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
    const relevantEdges = graph.filterOutboundEdges(node, edge => {
      const target = graph.relatedNode(node, edge);

      return nodeSet.has(target);
    });

    edges = edges.concat(relevantEdges);
  });

  graph.importEdges(graph.exportEdges(edges));

  return sub;
}
```

## Reversing a graph

```js
function reverse(graph) {
  const reversed = graph.emptyCopy();

  // Importing the nodes:
  reversed.importNodes(graph.exportNodes());

  // Importing undirected edges:
  reversed.importEdges(graph.exportUndirectedEdges());

  // Reversing directed edges:
  graph.forEachDirectedEdge(edge => {
    const [source, target] = graph.extremities(edge);

    reversed.addDirectedEdgeWithKey(
      edge,
      target,
      source,
      graph.getAttributes(edge)
    );
  });
}
```
