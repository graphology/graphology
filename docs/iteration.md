---
layout: default
title: Iteration
nav_order: 10
menu_toc:
  - "#.forEach"
  - "#.forEachUntil"
  - "#.adjacency"
  - "#.nodes"
  - "#.forEachNode"
  - "#.forEachNodeUntil"
  - "#.nodeEntries"
  - "#.edges"
  - "#.forEachEdge"
  - "#.forEachEdgeUntil"
  - "#.edgeEntries"
  - "#.neighbors"
  - "#.forEachNeighbor"
  - "#.forEachNeighborUntil"
  - "#.neighborEntries"
---

# Iteration

It is possible to iterate over the four following things:

* [Adjacency](#adj)
* [Nodes](#nodes)
* [Edges](#edges)
* [Neighbors](#neighbors)

**Iteration methods**

The library basically proposes three ways to iterate:

* Methods returning arrays of keys.
* Methods using callbacks.
* Methods creating JavaScript iterable [iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) for lazy consumption.

Note that if performance is a concern, callback methods such as `#.forEach*` are usually the fastest of them all.

<h2 id="adj">Adjacency</h2>

Those methods iterate over the graph's adjacency, i.e. on each node's outbound adjacency (out + undirected) successively.

Note that this mean you will thusly traverse each undirected edge twice. You can skip them once if you test that `source < target` for instance.

**Examples**

```js
const graph = new Graph();

graph.addNode('1');
graph.addNode('2');
graph.addNode('3');

graph.addEdge('1', '2');
graph.addEdge('2', '3');
graph.addEdge('3', '1');
graph.addUndirectedEdge('1', '2');

// Using the callback method
const adj = [];
graph.forEach(
  (source, target, sourceAttributes, targetAttributes, edge, edgeAttributes, undirected) => {
  adj.push([undirected, source, target])
});

adj
>>> [
  [false, '1', '2'],
  [true, '1', '2'],
  [false, '2', '3'],
  [true, '2', '1'],
  [false, '3', '1']
]

// Using the breakable callback method
graph.forEachUntil(
  (source, target, sourceAttributes, targetAttributes, edge, edgeAttributes, undirected) => {
  console.log(source, target);

  if (sourceAttributes.count > 2)
    return true;
});

// Using the iterator
for (const [source, target, ...] of graph.adjacency())
  console.log(source, target);

// Iterating over the graph itself is actually the same
for (const [source, target, ...] of graph)
  console.log(source, target);
```

### #.forEach

Iterates over the graph's adjacency using a callback.

**Arguments**

* **callback** <span class="code">function</span>: callback to use.

**Callback arguments**

* **source** <span class="code">string</span>: source node's key.
* **target** <span class="code">string</span>: target node's key.
* **sourceAttributes** <span class="code">object</span>: source node's attributes.
* **targetAttributes** <span class="code">object</span>: target node's attributes.
* **edge** <span class="code">string</span>: edge's key.
* **edgeAttributes** <span class="code">object</span>: edge's attributes.
* **undirected** <span class="code">boolean</span>: whether the edge is undirected.

### #.forEachUntil

Iterates over the graph's adjacency using a callback until it returns `true` to break iteration. Returns a boolean indicating whether the iteration was broken or not.

**Arguments**

* **callback** <span class="code">function</span>: callback to use.

**Callback arguments**

* **source** <span class="code">string</span>: source node's key.
* **target** <span class="code">string</span>: target node's key.
* **sourceAttributes** <span class="code">object</span>: source node's attributes.
* **targetAttributes** <span class="code">object</span>: target node's attributes.
* **edge** <span class="code">string</span>: edge's key.
* **edgeAttributes** <span class="code">object</span>: edge's attributes.
* **undirected** <span class="code">boolean</span>: whether the edge is undirected.

<h3 id="adjacency-iterator">#.adjacency</h3>

Returns an iterator over the graph's adjacency.

**Entries**

* **source** <span class="code">string</span>: source node's key.
* **target** <span class="code">string</span>: target node's key.
* **sourceAttributes** <span class="code">object</span>: source node's attributes.
* **targetAttributes** <span class="code">object</span>: target node's attributes.
* **edge** <span class="code">string</span>: edge's key.
* **edgeAttributes** <span class="code">object</span>: edge's attributes.
* **undirected** <span class="code">boolean</span>: whether the edge is undirected.

## Nodes

Those methods iterate over the graph's nodes.

**Examples**

```js
const graph = new Graph();

graph.addNode('Thomas');
graph.addNode('Elizabeth');

// Using the array-returning method:
graph.nodes();
>>> ['Thomas', 'Elizabeth']

// Using the callback method
graph.forEachNode((node, attributes) => {
  console.log(node, attributes);
});

// Using the breakable callback method
graph.forEachNodeUntil((node, attributes) => {
  console.log(node, attributes);

  if (attributes.count > 14)
    return true;
});

// Using the iterator
for (const [node, attributes] of graph.nodeEntries()) {
  console.log(node, attributes);
}
```

<h3 id="nodes-array">#.nodes</h3>

Returns an array of node keys.

### #.forEachNode

Iterates over each node using a callback.

**Arguments**

* **callback** <span class="code">function</span>: callback to use.

**Callback arguments**

* **key** <span class="code">string</span>: the node's key.
* **attributes** <span class="code">object</span>: the node's attributes.

### #.forEachNodeUntil

Iterates over each node using a callback until it returns `true` to break iteration. Returns a boolean indicating whether the iteration was broken or not.

**Arguments**

* **callback** <span class="code">function</span>: callback to use.

**Callback arguments**

* **key** <span class="code">string</span>: the node's key.
* **attributes** <span class="code">object</span>: the node's attributes.

### #.nodeEntries

Returns an iterator over the graph's nodes.

**Entries**

* **key** <span class="code">string</span>: the node's key.
* **attributes** <span class="code">object</span>: the node's attributes.

## Edges

These methods iterate over the graph's edges.

**Examples**

```js
const graph = new Graph();

graph.addNodesFrom(['Thomas', 'Rosaline', 'Emmett', 'Catherine', 'John', 'Daniel']);
graph.addEdgeWithKey('T->R', 'Thomas', 'Rosaline');
graph.addEdgeWithKey('T->E', 'Thomas', 'Emmett');
graph.addEdgeWithKey('C->T', 'Catherine', 'Thomas');
graph.addEdgeWithKey('R->C', 'Rosaline', 'Catherine');
graph.addEdgeWithKey('J->D1', 'John', 'Daniel');
graph.addEdgeWithKey('J->D2', 'John', 'Daniel');

// Using the array-returning methods:
graph.edges();
>>> ['T->R', 'T->E', 'C->T', 'R->C']

graph.edges('Thomas');
>>> ['T->R', 'T->E', 'C->T']

graph.edges('John', 'Daniel');
>>> ['J->D1', 'J->D2']

// Using the callback methods
graph.forEachEdge(
  (edge, attributes, source, target, sourceAttributes, targetAttributes) => {
  console.log(`Edge from ${source} to ${target}`);
});

// Using the breakable callback methods
graph.forEachEdgeUntil(
  (edge, attributes, source, target, sourceAttributes, targetAttributes) => {

  console.log(`Edge from ${source} to ${target}`);

  if (source === 'John')
    return true;
});

// And the counterparts
graph.forEachEdge('Thomas', callback);
graph.forEachEdge('John', 'Daniel', callback);

// Using the iterators
for (const [edge, attributes, ...] of graph.edgeEntries()) {
  console.log(edge, attributes);
}
```

<h3 id="edges-array">#.edges</h3>

Returns an array of relevant edge keys.

**Counterparts**

```
#.inEdges
#.outEdges
#.inboundEdges (in + undirected)
#.outboundEdges (out + undirected)
#.directedEdges
#.undirectedEdges
```

**Arguments**

1. **None**: iterate over every edge.
2. **Using a node's key**: will iterate over the node's relevant attached edges.
  * **node** <span class="code">any</span>: the related node's key.
3. **Using source & target**: will iterate over the relevant edges going from source to target.
  * **source** <span class="code">any</span>: the source node's key.
  * **target** <span class="code">any</span>: the target node's key.

### #.forEachEdge

Iterates over relevant edges using a callback.

**Counterparts**

```
#.forEachInEdge
#.forEachOutEdge
#.forEachInboundEdge (in + undirected)
#.forEachOutboundEdge (out + undirected)
#.forEachDirectedEdge
#.forEachUndirectedEdge
```

**Arguments**

1. **Callback**: iterate over every edge.
  * **callback** <span class="code">function</span>: callback to use.
2. **Using a node's key**: will iterate over the node's relevant attached edges.
  * **node** <span class="code">any</span>: the related node's key.
  * **callback** <span class="code">function</span>: callback to use.
3. **Using source & target**: will iterate over the relevant edges going from source to target.
  * **source** <span class="code">any</span>: the source node's key.
  * **target** <span class="code">any</span>: the target node's key.
  * **callback** <span class="code">function</span>: callback to use.

**Callback arguments**

* **key** <span class="code">string</span>: the edge's key.
* **attributes** <span class="code">object</span>: the edge's attributes.
* **source** <span class="code">string</span>: key of the edge's source.
* **target** <span class="code">string</span>: key of the edge's target.
* **sourceAttributes** <span class="code">object</span>: attributes of the edge's source.
* **targetAttributes** <span class="code">object</span>= attributes of the edge's target.
* **undirected** <span class="code">boolean</span>: whether the edge is undirected.

### #.forEachEdgeUntil

Iterates over relevant edges using a callback until it returns `true` to break iteration. Returns a boolean indicating whether the iteration was broken or not.

**Counterparts**

```
#.forEachInEdgeUntil
#.forEachOutEdgeUntil
#.forEachInboundEdgeUntil (in + undirected)
#.forEachOutboundEdgeUntil (out + undirected)
#.forEachDirectedEdgeUntil
#.forEachUndirectedEdgeUntil
```

**Arguments**

1. **Callback**: iterate over every edge.
  * **callback** <span class="code">function</span>: callback to use.
2. **Using a node's key**: will iterate over the node's relevant attached edges.
  * **node** <span class="code">any</span>: the related node's key.
  * **callback** <span class="code">function</span>: callback to use.
3. **Using source & target**: will iterate over the relevant edges going from source to target.
  * **source** <span class="code">any</span>: the source node's key.
  * **target** <span class="code">any</span>: the target node's key.
  * **callback** <span class="code">function</span>: callback to use.

**Callback arguments**

* **key** <span class="code">string</span>: the edge's key.
* **attributes** <span class="code">object</span>: the edge's attributes.
* **source** <span class="code">string</span>: key of the edge's source.
* **target** <span class="code">string</span>: key of the edge's target.
* **sourceAttributes** <span class="code">object</span>: attributes of the edge's source.
* **targetAttributes** <span class="code">object</span>= attributes of the edge's target.
* **undirected** <span class="code">boolean</span>: whether the edge is undirected.

### #.edgeEntries

Returns an iterator over relevant edges.

**Counterparts**

```
#.inEdgeEntries
#.outEdgeEntries
#.inboundEdgeEntries (in + undirected)
#.outboundEdgeEntries (out + undirected)
#.directedEdgeEntries
#.undirectedEdgeEntries
```

**Arguments**

1. **None**: iterate over every edge.
2. **Using a node's key**: will iterate over the node's relevant attached edges.
  * **node** <span class="code">any</span>: the related node's key.
3. **Using source & target**: will iterate over the relevant edges going from source to target.
  * **source** <span class="code">any</span>: the source node's key.
  * **target** <span class="code">any</span>: the target node's key.

**Entries**

* **key** <span class="code">string</span>: the edge's key.
* **attributes** <span class="code">object</span>: the edge's attributes.
* **source** <span class="code">string</span>: key of the edge's source.
* **target** <span class="code">string</span>: key of the edge's target.
* **sourceAttributes** <span class="code">object</span>: attributes of the edge's source.
* **targetAttributes** <span class="code">object</span>= attributes of the edge's target.

## Neighbors

These methods iterate over the neighbors of the given node or nodes.

**Examples**

```js
const graph = new Graph();

graph.addNodesFrom(['Thomas', 'Rosaline', 'Emmett', 'Catherine', 'John', 'Daniel']);
graph.addEdge('Thomas', 'Rosaline');
graph.addEdge('Thomas', 'Emmett');
graph.addEdge('Catherine', 'Thomas');
graph.addEdge('Rosaline', 'Catherine');
graph.addEdge('John', 'Daniel');
graph.addEdge('John', 'Daniel');

// Asking whether two nodes are neighbors
graph.neighbors('Thomas', 'Rosaline');
>>> true

// Using the array-returning methods
graph.neighbors('Thomas');
>>> ['Rosaline', 'Emmett', 'Catherine']

// Using the callback methods
graph.forEachNeighbor('Thomas', function(neighbor, attributes) {
  console.log(neighbor, attributes);
});

// Using the breakable callback methods
graph.forEachNeighborUntil('Thomas', function(neighbor, attributes) {
  console.log(neighbor, attributes);

  if (neighbor.includes('o'))
    return true;
});

// Using the iterators
for (const [neighbor, attributes] of graph.neighborEntries()) {
  console.log(neighbor, attributes);
}
```

<h3 id="neighbors-array">#.neighbors</h3>

Returns an array of relevant neighbor keys.

**Counterparts**

```
#.inNeighbors
#.outNeighbors
#.inboundNeighbors (in + undirected)
#.outboundNeighbors (out + undirected)
#.directedNeighbors
#.undirectedNeighbors
```

**Arguments**

1. **Using a node's key**: will iterate over the node's relevant neighbors.
  * **node** <span class="code">any</span>: the node's key.
2. **Using two nodes' keys**: will return whether the two given nodes are neighbors.
  * **node1** <span class="code">any</span>: first node.
  * **node2** <span class="code">any</span>: second node.

### #.forEachNeighbor

Iterates over the relevant neighbors using a callback.

**Counterparts**

```
#.forEachInNeighbor
#.forEachOutNeighbor
#.forEachInboundNeighbor (in + undirected)
#.forEachOutboundNeighbor (out + undirected)
#.forEachDirectedNeighbor
#.forEachUndirectedNeighbor
```

**Arguments**

* **node** <span class="code">any</span>: the node's key.
* **callback** <span class="code">function</span>: callback to use.

**Callback arguments**

* **key** <span class="code">string</span>: the neighbor's key.
* **attributes** <span class="code">object</span>: the neighbor's attributes.

### #.forEachNeighborUntil

Iterates over the relevant neighbors using a callback until it returns `true` to break iteration. Returns a boolean indicating whether the iteration was broken or not.

**Counterparts**

```
#.forEachInNeighborUntil
#.forEachOutNeighborUntil
#.forEachInboundNeighborUntil (in + undirected)
#.forEachOutboundNeighborUntil (out + undirected)
#.forEachDirectedNeighborUntil
#.forEachUndirectedNeighborUntil
```

**Arguments**

* **node** <span class="code">any</span>: the node's key.
* **callback** <span class="code">function</span>: callback to use.

**Callback arguments**

* **key** <span class="code">string</span>: the neighbor's key.
* **attributes** <span class="code">object</span>: the neighbor's attributes.

### #.neighborEntries

Returns an iterator over the relevant neighbors.

**Counterparts**

```
#.inNeighborEntries
#.outNeighborEntries
#.inboundNeighborEntries (in + undirected)
#.outboundNeighborEntries (out + undirected)
#.directedNeighborEntries
#.undirectedNeighborEntries
```

**Arguments**

1. **Using a node's key**: will iterate over the node's relevant neighbors.
  * **node** <span class="code">any</span>: the node's key.
2. **Using two nodes' keys**: will return whether the two given nodes are neighbors.
  * **node1** <span class="code">any</span>: first node.
  * **node2** <span class="code">any</span>: second node.

**Entries**

* **key** <span class="code">string</span>: the neighbor's key.
* **attributes** <span class="code">object</span>: the neighbor's attributes.
