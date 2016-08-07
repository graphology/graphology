# Properties

## #.order

Number of nodes in the graph.

*Example*

```js
const graph = new Graph();

graph.addNode('John');
graph.addNode('Jack');

console.log(graph.order);
>>> 2
```

## #.size

Number of edges in the graph.

*Example*

```js
const graph = new Graph();

graph.addNode('John');
graph.addNode('Jack');

graph.addEdge('John', 'Jack');

console.log(graph.size);
>>> 1
```

## #.type

Type of the graph. One of `mixed`, `directed` or `undirected`.

*Example*

```js
const graph = new Graph();
console.log(graph.type);
>>> 'mixed'

const directedGraph = new DirectedGraph();
console.log(directedGraph.type);
>>> 'directed'
```

## #.multi

Whether the graph accepts parallel edges or not.

*Example*

```js
const graph = new Graph();
console.log(graph.multi);
>>> false

const multiGraph = new MultiGraph();
console.log(multiGraph.multi)
>>> true
```
