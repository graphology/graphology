# Mutation

## #.addNode

Adds a single node to the graph with optional attributes and returns the node.

*Example*

```js
// Adding a simple node:
const node = graph.addNode('John');

// Adding a node with attributes:
const node = graph.addNode('John', {
  age: 24,
  eyes: 'blue'
});
```

*Arguments*

* **node** <span class="code">any</span>: the node can be anything a JS object would accept as key or anything if handling a `GraphMap`.
* **attributes** <span class="code">[object]</span>: optional attributes.

## #.addEdge

Adds a single directed edge if the graph is `directed` or `mixed`, or an undirected edge if the graph is `undirected` and returns the edge.

*Example*

```js
graph.addNode('John');
graph.addNode('Jack');

// Adding a simple edge between John & Jack:
const edge = graph.addEdge('John', 'Jack');

// Adding an edge with attributes between John & Jack;
const edge = graph.addEdge('John', 'Jack', {
  type: 'KNOWS',
  weight: 0
});
```

*Arguments*

* **source** <span class="code">any</span>: the source node.
* **target** <span class="code">any</span>: the target node.
* **attributes** <span class="code">[object]</span>: optional attributes.

*Important*

This method is a convenience built on top of the [`#.addEdgeWithKey`](#addedgewithkey) method so that the user may add an edge in the graph without having to create a specific key for it.

Note that internally, because this key is still needed, the graph will generate one for you using a unique identifier. You remain free to customize the way those keys are generated through the [`edgeKeyGenerator`](./instantiation.md#arguments) option.

## #.addDirectedEdge

Adds a single directed edge to the graph.

Alias of [`#.addEdge`](#addedge) if the graph is `directed` or `mixed`.

## #.addUndirectedEdge

Adds a single undirected edge to the graph.

Alias of [`#.addEdge`](#addedge) if the graph is `undirected`.

## #.addEdgeWithKey

Adds a single directed edge if the graph is `directed` or `mixed`, or an undirected edge if the graph is `undirected`, using the provided key, and returns the edge.

This is quite useful when dealing with a `MultiGraph` if you need to retrieve precise edges since polling the graph using both the source & the target node might return several edges rather than only one.

*Example*

```js
graph.addNode('John');
graph.addNode('Jack');

// Adding a simple edge between John & Jack:
const edge = graph.addEdge('John->Jack', 'John', 'Jack');

// Adding an edge with attributes between John & Jack;
const edge = graph.addEdge('John->Jack', 'John', 'Jack', {
  type: 'KNOWS',
  weight: 0
});
```

*Arguments*

* **edge** <span class="code">any</span>: the edge can be anything a JS object would accept as key or anything if handling a `GraphMap`.
* **source** <span class="code">any</span>: the source node.
* **target** <span class="code">any</span>: the target node.
* **attributes** <span class="code">[object]</span>: optional attributes.

## #.addDirectedEdgeWithKey

Adds a single directed edge to the graph.

Alias of [`#.addEdgeWithKey`](#addedgewithkey) if the graph is `directed` or `mixed`.

## #.addUndirectedEdgeWithKey

Adds a single undirected edge to the graph.

Alias of [`#.addEdgeWithKey`](#addedgewithkey) if the graph is `undirected`.

## #.dropNode

Drops a single node & all its attached edges from the graph.

*Example*

```js
graph.addNode('John');
graph.dropNode('John');

graph.dropNode('Martha');
>>> Error "Martha not in the graph"
```

*Arguments*

* **node** <span class="code">any</span>: the node to drop.

## #.dropNodes

Drops every node or a [bunch](concepts.md#bunches) of nodes & all their attached edges from the graph.

Basically, without arguments, `#.dropNodes` is identical to `#.clear`.

*Example*

```js
graph.addNode('John');
graph.addNode('Martha');

// Dropping a bunch of nodes
graph.dropNodes(['John', 'Martha']);

// Dropping every node
graph.dropNodes();
```

*Arguments*

1. **None**: dropping every node.
2. **Using a bunch**: dropping the provided nodes.
  * **bunch** <span class="code">bunch</span>: the nodes to drop.

## #.dropEdge

Drops a single edge from the graph.

*Example*

```js
graph.addNode('John');
graph.addNode('Martha');

const edge = graph.addEdge('John', 'Martha');

// Dropping the edge using its key:
graph.dropEdge(edge);

// Dropping the first matching edge between John & Martha
graph.dropEdge('John', 'Martha');
```

*Arguments*

1. Using the key:
  * **edge** <span class="code">any</span>: the edge to drop.
2. Using the source & target:
  * **source** <span class="code">any</span>: source node of the edge to drop.
  * **target** <span class="code">any</span>: target node of the edge to drop.

## #.dropEdges

Drops every edge or a [bunch](concepts.md#bunches) of edges from the graph, or all the edges related to the given source & target.

*Example*

```js
graph.addNode('John');
graph.addNode('Martha');
graph.addNode('Catherine');

const johnMartha = graph.addEdge('John', 'Martha');
const johnCatherine = graph.addEdge('John', 'Catherine');

// Dropping every edge
graph.dropEdges();

// Dropping a bunch of edges
graph.dropEdges([johnMartha, johnCatherine]);

// Dropping all the edges between John & Martha
graph.dropEdges('John', 'Martha');
```

*Arguments*

1. **None**: Dropping every edge.
2. **Using a bunch**:
  * **edge** <span class="code">bunch</span>: bunch of edges to drop.
3. **Using the source & target**:
  * **source** <span class="code">any</span>: source node of the edge to drop.
  * **target** <span class="code">any</span>: target node of the edge to drop.

## #.clear

Drop every node & every edge from the graph, leaving it empty.

*Example*

```js
graph.addNode('John');
graph.addNode('Jack');
graph.addEdge('John', 'Jack');

console.log(graph.order, graph.size);
>>> 2, 1

graph.clear();

console.log(graph.order, graph.size);
>>> 0, 0

graph.hasNode('John');
>>> false
```
