# Examples

## Creating a co-occurrence graph

In this example, we are going to create a simple co-occurrence graph of students working on projects:

```js
import {UndirectedGraph} from 'graph';

const graph = new UndirectedGraph();

// The projects's data is a collection of the following structure
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

  // Adding the students to the graph first
  project.team.forEach(student => {

    // If the student is not yet in the graph, we add him/her
    // (we'll use its id as the node's key)
    if (!graph.hasNode(student.id))
      graph.addNode(student.id, {
        fullname: student.name + ' ' + student.surname,
        projects: 0
      });

    // Then we increment the number of projects the student worked on
    graph.updateNodeAttribute(student.id, 'projects', x => x + 1);
  });

  // Now let's link the students to one another when since they work on the same project
  graph.team.forEach((student, i) => {

    graph.team.slice(i + 1).forEach(colleague => {

      const edge = graph.getEdge(student.id, colleague.id);

      // If the edge does not exist yet, we create it
      if (!edge)
        edge = graph.addEdge(student.id, colleague.id, {
          weight: 0
        });

      // Increasing the weight of the relation between both students
      graph.updateEdgeAttribute(edge, 'weight', x => x + 1);
    });
  });
});

// Let's print our graph!
console.log(graph);
```

For a simpler way to handle seemingly duplicate nodes & edges and easily weight them etc. you can head towards the description of the `onDuplicateNode` & `onDuplicateEdge` option [here](instantiation.md#duplicate-elements).

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
