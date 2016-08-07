# Setters

## #.addNode

Adds a single node to the graph with optional attributes.

*Example*

```js
// Adding a simple node:
graph.addNode('John');

// Adding a node with attributes:
graph.addNode('John', {
  age: 24,
  eyes: 'blue'
});
```

*Arguments*

* **node** <span class="code">any</span>: the node can be anything a JS object would accept as key or anything if handling a `GraphMap`.
* **attributes** <span class="code">[object]</span>: optional attributes.

## #.addEdge

Adds a single directed edge if the graph is `directed` or `mixed`, or an undirected edge if the graph is `undirected`.

*Example*

```js
graph.addNode('John');
graph.addNode('Jack');

// Adding a simple edge between John & Jack:
graph.addEdge('John', 'Jack');

// Adding an edge with attributes between John & Jack;
graph.addEdge('John', 'Jack', {
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

## #.addUndirectedEdge
