# Properties

All the following properties are read-only and may not be changed by the user.

## #.order

Number of nodes in the graph.

*Example*

```js
const graph = new Graph();

graph.addNode('John');
graph.addNode('Jack');

graph.order;
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

graph.size;
>>> 1
```

## #.type

Type of the graph. One of `mixed`, `directed` or `undirected`.

*Example*

```js
const graph = new Graph();
graph.type;
>>> 'mixed'

const directedGraph = new DirectedGraph();
directedGraph.type;
>>> 'directed'
```

## #.multi

Whether the graph accepts parallel edges or not.

*Example*

```js
const graph = new Graph();
graph.multi;
>>> false

const multiGraph = new MultiGraph();
multiGraph.multi;
>>> true
```

## #.map

Whether the graph accepts references as keys.

```js
const graph = new Graph();
graph.map;
>>> false

const graphMap = new GraphMap();
graph.map;
>>> true
```

## #.allowSelfLoops

Whether the graph accepts self loops or not.

```js
const graph = new Graph();
graph.allowSelfLoops;
>>> true

const otherGraph = new Graph(null, {allowSelfLoops: false});
graph.allowSelfLoops;
>>> false
```
