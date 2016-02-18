# API Specs Proposition n°1

This first proposition will assume that we allow anything as nodes & edges' value (solution n°2 of issue #18).

## Note

This is a WIP draft.

## Post Scriptum

After writing this proposition, here is one additional remark about the "everything can be a node etc.": it makes querying the graph through ids difficult. For instance, there is no way to retrieve n nodes in the graph by id in `O(1)` or to check if a node exists in the graph by id. So, if your nodes are scalars, it's not a problem but it's quite rarely the case.

One alternative is to add nodes by providing both a key and their value like `graph.addNode(key, value)` where it can be polymorphic `graph.addNode(key)` if the key and the value are the same thing (because scalar). Note that this is actually [networkx](http://networkx.readthedocs.org/en/networkx-1.11/tutorial/tutorial.html)'s solution.

## Instantiation

```js
import Graph from 'graph';

const graph = new Graph();
// Will describe constructor polymorphisms later
```

## Properties

### #.order (read-only)

The number of nodes in the graph.

```js
graph.order
```

### #.size (read-only)

The number of edges in the graph.

```js
graph.size
```

### #.nodes (read-only)

Array of the graph's nodes following insertion order.

```js
graph.nodes.forEach(node => console.log(node));
```

Note: internally, implementations will most likely store the nodes & edges in an object or a map. So this array should probably provided through a cached getter (quite performant + can ensure read-only).

### #.edges (read-only)

Array of the graph's edges following insertion order.

```js
graph.edges.forEach(node => console.log(edge));
```

Note: internally, implementations will most likely store the nodes & edges in an object or a map. So this array should probably provided through a cached getter (quite performant + can ensure read-only)..

## Write methods

### #.addNode

Adds an arbitrary node to the graph.

Solution n°1:

```js
graph.addNode(node);
```

Solution n°2:

```js
graph.addNode(id, node);
// or if node is scalar equivalent of:
graph.addNode(node);
```

This has to be thoroughly discussed.

### #.addEdge

Adds an edge between two nodes in the graph.

If no value is specified, then it will be set by default to an empty object `{}`.

If either source or target are not nodes in the graph, will throw.

```js
graph.addEdge(source, target, [value]);
```

### #.addUndirectedEdge

Same as `#.addEdge` but with an undirected edge.

### #.dropNode

Drops a node of the graph.

If the node does not exist in the graph, will throw.

Will also remove any edge having either this node as source or target.

```js
graph.dropNode(node);
```

### #.dropEdge

Drops an edge from the graph.

If the edge does not exist in the graph, will throw.

```js
graph.dropEdge(edge);
```

### #.clear

Completely clears the graph by dropping every node & edge.

```js
graph.clear();
```

## Read methods

### #.degree / #.inDegree / #.outDegree

Returns the degree of the given node and including or not loops.

What to do if the node does not exist in the graph?

Should the loops flag be `true` or `false` by default?

```js
graph.degree(node, [loops]);
```

### #.neigbors

Returns an array of the given's node neighbors.

Will throw if the node does not exist in the graph.

```js
graph.neighbors(node);
```

### #.allEdges / #.outEdges / #.inEdges

Retrieves the edges attached to the given node.

Will throw if the node does not exist in the graph.

```js
graph.allEdges(node);
```

### #.hasEdge

Returns whether at least one edge exists between the given source & target.

Will throw if either the source or target is not a node in the graph.

```js
graph.hasEdge(source, target, [directed=true]);
```

### #.source

Returns the source of the given edge.

Will throw if the edge does not exist in the graph.

```js
graph.source(edge);
```

### #.target

Returns the target of the given edge.

Will throw if the edge does not exist in the graph.

```js
graph.target(edge);
```

### #.toString

Should return a useful string describing the graph.

```js
graph.toString();
// Note that the `toString` method is used by JavaScript to coerce to string
console.log('' + graph);
// equals
console.log(graph.toString());
```

### #.toJSON

Should return a standard object to be serialized.

```js
graph.toJSON();
// Note that the `toJSON` method is used by JSON.stringify
JSON.stringify(graph);
```

## Events & specialized setters

### Event emitting

The `Graph` object should extend an event emitter.

We should probably stick to the node.js [events](https://nodejs.org/api/events.html) specs (or at least a subset of it).

### Specialized setters

Specialized setters are setters whose used is absolutely not required but can be used nonetheless to trigger localized events required by some algorithms and/or rendering libraries to process things in a performant fashion.

#### #.setNodeProperty

Sets a specific node property. Will throw if the target node is not an object.

```js
graph.setNodeProperty(node, key, value);
```

#### #.setEdgeProperty

Sets a specific edge property. Will throw if the target edge's value is not an object.

```js
graph.setEdgeProperty(edge, key, value);
```

### Events

#### addNode

Is emitted whenever a node is added to the graph.

```js
graph.on('addNode', node => {});
```

#### addEdge

Is emitted whenever an edge is added to the graph.

```js
graph.on('addEdge', (source, target, value) => {});
```

#### dropNode

Is emitted whenever a node is dropped from the graph.

```js
graph.on('dropNode', (node) => {});
```

#### dropEdge

Is emitted whenever an edge is dropped from the graph.

```js
graph.on('dropEdge', (source, target, value) => {});
```

#### clear

Is emitted whenever the graph is cleared.

```js
graph.on('clear' () => {});
```

#### setNodeProperty

Is emitted whenever a node property is edited through the use of `#.setNodeProperty`.

```js
graph.on('setNodeProperty', (node, key) => {});
```

#### setEdgeProperty

Is emitted whenever an edge's value property is edited through the use of `#.setEdgeProperty`.

```js
graph.on('setEdgeProperty', (edge, key) => {});
```

## Static methods

### Graph.from

This method should return a `Graph` instance from various JavaScript iterables.

The idea is to mimick [`Array.from`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/from).

However, I am not sure this method would serve a purpose if the constructor is polymorphic enough.

```js
var graph = Graph.from(iterable);
```

## Miscellaneous ideas

* Method to import batch (similar to constructor polymorphism).
* Method to import batch nodes.
* Method to import batch edges.
* Adjacency.
* Density.
* Setting attributes to the graph itself?
