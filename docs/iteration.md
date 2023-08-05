---
layout: default
title: Iteration
nav_order: 10
detailed_menu_toc:
  - label: Nodes
    subtitle: yes
  - label: "#.nodes"
    id: nodes-array
  - label: "#.forEachNode"
  - label: "#.mapNodes"
  - label: "#.filterNodes"
  - label: "#.reduceNodes"
  - label: "#.findNode"
  - label: "#.someNode"
  - label: "#.everyNode"
  - label: "#.nodeEntries"
  - label: Edges
    subtitle: yes
  - label: "#.edges"
    id: edges-array
  - label: "#.forEachEdge"
  - label: "#.mapEdges"
  - label: "#.filterEdges"
  - label: "#.reduceEdges"
  - label: "#.findEdge"
  - label: "#.someEdge"
  - label: "#.everyEdge"
  - label: "#.edgeEntries"
  - label: Neighbors
    subtitle: yes
  - label: "#.neighbors"
    id: neighbors-array
  - label: "#.forEachNeighbor"
  - label: "#.mapNeighbors"
  - label: "#.filterNeighbors"
  - label: "#.reduceNeighbors"
  - label: "#.findNeighbor"
  - label: "#.someNeighbor"
  - label: "#.everyNeighbor"
  - label: "#.neighborEntries"
---

# Iteration

It is possible to iterate over the following things:

* [Nodes](#nodes)
* [Edges](#edges)
* [Neighbors](#neighbors)

**Iteration methods**

The library basically proposes three ways to iterate:

* Methods returning arrays of keys.
* Methods using callbacks.
* Methods creating JavaScript iterable [iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) for lazy consumption.

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

// Using functional-style iteration method
const degrees = graph.mapNodes((node) => {
  return graph.degree(node);
});

// Using the iterator
for (const {node, attributes} of graph.nodeEntries()) {
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

* **node** <span class="code">string</span>: the node's key.
* **attributes** <span class="code">object</span>: the node's attributes.

### #.mapNodes

Returns an array containing the result of a callback applied on each node of the graph.

**Arguments**

* **callback** <span class="code">function</span>: callback to use.

**Callback arguments**

* **node** <span class="code">string</span>: the node's key.
* **attributes** <span class="code">object</span>: the node's attributes.

### #.filterNodes

Returns an array of node keys for which the given predicate function returned `true`.

**Arguments**

* **callback** <span class="code">function</span>: predicate to use.

**Callback arguments**

* **node** <span class="code">string</span>: the node's key.
* **attributes** <span class="code">object</span>: the node's attributes.

### #.reduceNodes

Returns the accumulated result of applying a callback combining our current value with a computation evaluated on each node of the graph.

Contrary to JavaScript [Array.reduce](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce), you must provide it because the callback takes more than one argument and we cannot infer the initial value from our first iteration.

**Arguments**

* **callback** <span class="code">function</span>: callback to use.
* **initialValue** <span class="code">any</span>: the initial value to use.

**Callback arguments**

* **accumulator** <span class="code">any</span>: the accumulated value.
* **node** <span class="code">string</span>: the node's key.
* **attributes** <span class="code">object</span>: the node's attributes.

### #.findNode

Returns the key of the first node matching given predicate function or `undefined` if no matching node could be found.

**Arguments**

* **callback** <span class="code">function</span>: predicate to use.

**Callback arguments**

* **node** <span class="code">string</span>: the node's key.
* **attributes** <span class="code">object</span>: the node's attributes.

### #.someNode

Returns whether any node in the graph matches the given predicate function.

**Arguments**

* **callback** <span class="code">function</span>: predicate to use.

**Callback arguments**

* **node** <span class="code">string</span>: the node's key.
* **attributes** <span class="code">object</span>: the node's attributes.

### #.everyNode

Returns whether all nodes in the graph match the given predicate function.

**Arguments**

* **callback** <span class="code">function</span>: predicate to use.

**Callback arguments**

* **node** <span class="code">string</span>: the node's key.
* **attributes** <span class="code">object</span>: the node's attributes.

### #.nodeEntries

Returns an iterator over the graph's nodes.

**Entries**

* **node** <span class="code">string</span>: the node's key.
* **attributes** <span class="code">object</span>: the node's attributes.

## Edges

These methods iterate over the graph's edges.

**Examples**

```js
const graph = new Graph();

graph.mergeEdgeWithKey('T->R', 'Thomas', 'Rosaline');
graph.mergeEdgeWithKey('T->E', 'Thomas', 'Emmett');
graph.mergeEdgeWithKey('C->T', 'Catherine', 'Thomas');
graph.mergeEdgeWithKey('R->C', 'Rosaline', 'Catherine');
graph.mergeEdgeWithKey('J->D1', 'John', 'Daniel');
graph.mergeEdgeWithKey('J->D2', 'John', 'Daniel');

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

// And the counterparts to target a node or path's edges
graph.forEachEdge('Thomas', callback);
graph.forEachEdge('John', 'Daniel', callback);

// Using functional-style iteration method
const weights = graph.mapEdges((edge, attr) => {
  return attr.weight;
});

// Using the iterators
for (const {edge, attributes, ...} of graph.edgeEntries()) {
  console.log(edge, attributes);
}
```

<h3 id="edges-array">#.edges</h3>

Returns an array of relevant edge keys.

**Variants**

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

**Variants**

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

* **edge** <span class="code">string</span>: the edge's key.
* **attributes** <span class="code">object</span>: the edge's attributes.
* **source** <span class="code">string</span>: key of the edge's source.
* **target** <span class="code">string</span>: key of the edge's target.
* **sourceAttributes** <span class="code">object</span>: attributes of the edge's source.
* **targetAttributes** <span class="code">object</span>: attributes of the edge's target.
* **undirected** <span class="code">boolean</span>: whether the edge is undirected.

### #.mapEdges

Returns an array containing the result of a callback applied on the relevant edges.

**Variants**

```
#.mapInEdges
#.mapOutEdges
#.mapInboundEdges (in + undirected)
#.mapOutboundEdges (out + undirected)
#.mapDirectedEdges
#.mapUndirectedEdges
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

* **edge** <span class="code">string</span>: the edge's key.
* **attributes** <span class="code">object</span>: the edge's attributes.
* **source** <span class="code">string</span>: key of the edge's source.
* **target** <span class="code">string</span>: key of the edge's target.
* **sourceAttributes** <span class="code">object</span>: attributes of the edge's source.
* **targetAttributes** <span class="code">object</span>: attributes of the edge's target.
* **undirected** <span class="code">boolean</span>: whether the edge is undirected.

### #.filterEdges

Returns an array of edge keys for which the given predicate function returned `true`.

**Variants**

```
#.filterInEdges
#.filterOutEdges
#.filterInboundEdges (in + undirected)
#.filterOutboundEdges (out + undirected)
#.filterDirectedEdges
#.filterUndirectedEdges
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

* **edge** <span class="code">string</span>: the edge's key.
* **attributes** <span class="code">object</span>: the edge's attributes.
* **source** <span class="code">string</span>: key of the edge's source.
* **target** <span class="code">string</span>: key of the edge's target.
* **sourceAttributes** <span class="code">object</span>: attributes of the edge's source.
* **targetAttributes** <span class="code">object</span>: attributes of the edge's target.
* **undirected** <span class="code">boolean</span>: whether the edge is undirected.

### #.reduceEdges

Returns the accumulated result of applying a callback combining our current value with a computation evaluated on the relevant edges.

Contrary to JavaScript [Array.reduce](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce), you must provide it because the callback takes more than one argument and we cannot infer the initial value from our first iteration.

**Variants**

```
#.reduceInEdges
#.reduceOutEdges
#.reduceInboundEdges (in + undirected)
#.reduceOutboundEdges (out + undirected)
#.reduceDirectedEdges
#.reduceUndirectedEdges
```

**Arguments**

1. **Callback**: iterate over every edge.
  * **callback** <span class="code">function</span>: callback to use.
  * **initialValue** <span class="code">any</span>: the initial value to use.
2. **Using a node's key**: will iterate over the node's relevant attached edges.
  * **node** <span class="code">any</span>: the related node's key.
  * **callback** <span class="code">function</span>: callback to use.
  * **initialValue** <span class="code">any</span>: the initial value to use.
3. **Using source & target**: will iterate over the relevant edges going from source to target.
  * **source** <span class="code">any</span>: the source node's key.
  * **target** <span class="code">any</span>: the target node's key.
  * **callback** <span class="code">function</span>: callback to use.
  * **initialValue** <span class="code">any</span>: the initial value to use.

**Callback arguments**

* **accumulator** <span class="code">any</span>: the accumulated value.
* **edge** <span class="code">string</span>: the edge's key.
* **attributes** <span class="code">object</span>: the edge's attributes.
* **source** <span class="code">string</span>: key of the edge's source.
* **target** <span class="code">string</span>: key of the edge's target.
* **sourceAttributes** <span class="code">object</span>: attributes of the edge's source.
* **targetAttributes** <span class="code">object</span>: attributes of the edge's target.
* **undirected** <span class="code">boolean</span>: whether the edge is undirected.

### #.findEdge

Returns the key of the first edge matching given predicate function or `undefined` if no matching node could be found.

**Variants**

```
#.findInEdge
#.findOutEdge
#.findInboundEdge (in + undirected)
#.findOutboundEdge (out + undirected)
#.findDirectedEdge
#.findUndirectedEdge
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

* **edge** <span class="code">string</span>: the edge's key.
* **attributes** <span class="code">object</span>: the edge's attributes.
* **source** <span class="code">string</span>: key of the edge's source.
* **target** <span class="code">string</span>: key of the edge's target.
* **sourceAttributes** <span class="code">object</span>: attributes of the edge's source.
* **targetAttributes** <span class="code">object</span>: attributes of the edge's target.
* **undirected** <span class="code">boolean</span>: whether the edge is undirected.

### #.someEdge

Returns whether any edge in the graph matches the given predicate function.

**Variants**

```
#.someInEdge
#.someOutEdge
#.someInboundEdge (in + undirected)
#.someOutboundEdge (out + undirected)
#.someDirectedEdge
#.someUndirectedEdge
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

* **edge** <span class="code">string</span>: the edge's key.
* **attributes** <span class="code">object</span>: the edge's attributes.
* **source** <span class="code">string</span>: key of the edge's source.
* **target** <span class="code">string</span>: key of the edge's target.
* **sourceAttributes** <span class="code">object</span>: attributes of the edge's source.
* **targetAttributes** <span class="code">object</span>: attributes of the edge's target.
* **undirected** <span class="code">boolean</span>: whether the edge is undirected.

### #.everyEdge

Returns whether all edges in the graph match the given predicate function.

**Variants**

```
#.everyInEdge
#.everyOutEdge
#.everyInboundEdge (in + undirected)
#.everyOutboundEdge (out + undirected)
#.everyDirectedEdge
#.everyUndirectedEdge
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

* **edge** <span class="code">string</span>: the edge's key.
* **attributes** <span class="code">object</span>: the edge's attributes.
* **source** <span class="code">string</span>: key of the edge's source.
* **target** <span class="code">string</span>: key of the edge's target.
* **sourceAttributes** <span class="code">object</span>: attributes of the edge's source.
* **targetAttributes** <span class="code">object</span>: attributes of the edge's target.
* **undirected** <span class="code">boolean</span>: whether the edge is undirected.

### #.edgeEntries

Returns an iterator over relevant edges.

**Variants**

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

* **edge** <span class="code">string</span>: the edge's key.
* **attributes** <span class="code">object</span>: the edge's attributes.
* **source** <span class="code">string</span>: key of the edge's source.
* **target** <span class="code">string</span>: key of the edge's target.
* **sourceAttributes** <span class="code">object</span>: attributes of the edge's source.
* **targetAttributes** <span class="code">object</span>: attributes of the edge's target.

## Neighbors

These methods iterate over the neighbors of the given node or nodes.

**Examples**

```js
const graph = new Graph();

graph.mergeEdge('Thomas', 'Rosaline');
graph.mergeEdge('Thomas', 'Emmett');
graph.mergeEdge('Catherine', 'Thomas');
graph.mergeEdge('Rosaline', 'Catherine');
graph.mergeEdge('John', 'Daniel');
graph.mergeEdge('John', 'Daniel');

// Using the array-returning methods
graph.neighbors('Thomas');
>>> ['Rosaline', 'Emmett', 'Catherine']

// Using the callback methods
graph.forEachNeighbor('Thomas', function(neighbor, attributes) {
  console.log(neighbor, attributes);
});

// Using functional-style iteration method
const neighborDegress = graph.mapNeighbors((neighbor) => {
  return graph.degree(neighbor);
});

// Using the iterators
for (const {neighbor, attributes} of graph.neighborEntries()) {
  console.log(neighbor, attributes);
}
```

<h3 id="neighbors-array">#.neighbors</h3>

Returns an array of relevant neighbor keys.

**Variants**

```
#.inNeighbors
#.outNeighbors
#.inboundNeighbors (in + undirected)
#.outboundNeighbors (out + undirected)
#.directedNeighbors
#.undirectedNeighbors
```

**Arguments**

* **node** <span class="code">any</span>: the node's key.

### #.forEachNeighbor

Iterates over the relevant neighbors using a callback.

**Variants**

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

* **neighbor** <span class="code">string</span>: the neighbor's key.
* **attributes** <span class="code">object</span>: the neighbor's attributes.

### #.mapNeighbors

Returns an array containing the result of a callback applied on the relevant neighbors.

**Variants**

```
#.mapInNeighbors
#.mapOutNeighbors
#.mapInboundNeighbors (in + undirected)
#.mapOutboundNeighbors (out + undirected)
#.mapDirectedNeighbors
#.mapUndirectedNeighbors
```

**Arguments**

* **node** <span class="code">any</span>: the node's key.
* **callback** <span class="code">function</span>: callback to use.

**Callback arguments**

* **neighbor** <span class="code">string</span>: the neighbor's key.
* **attributes** <span class="code">object</span>: the neighbor's attributes.
*
### #.filterNeighbors

Returns an array of neighbor keys for which the given predicate function returned `true`.

**Variants**

```
#.filterInNeighbors
#.filterOutNeighbors
#.filterInboundNeighbors (in + undirected)
#.filterOutboundNeighbors (out + undirected)
#.filterDirectedNeighbors
#.filterUndirectedNeighbors
```

**Arguments**

* **node** <span class="code">any</span>: the node's key.
* **callback** <span class="code">function</span>: callback to use.

**Callback arguments**

* **neighbor** <span class="code">string</span>: the neighbor's key.
* **attributes** <span class="code">object</span>: the neighbor's attributes.

### #.reduceNeighbors

Returns the accumulated result of applying a callback combining our current value with a computation evaluated on the relevant neighbors.

Contrary to JavaScript [Array.reduce](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce), you must provide it because the callback takes more than one argument and we cannot infer the initial value from our first iteration.

**Variants**

```
#.reduceInNeighbors
#.reduceOutNeighbors
#.reduceInboundNeighbors (in + undirected)
#.reduceOutboundNeighbors (out + undirected)
#.reduceDirectedNeighbors
#.reduceUndirectedNeighbors
```

**Arguments**

* **node** <span class="code">any</span>: the node's key.
* **callback** <span class="code">function</span>: callback to use.
* **initialValue** <span class="code">any</span>: the initial value to use.

**Callback arguments**

* **accumulator** <span class="code">any</span>: the accumulated value.
* **neighbor** <span class="code">string</span>: the neighbor's key.
* **attributes** <span class="code">object</span>: the neighbor's attributes.

### #.findNeighbor

Returns the key of the first neighbor matching given predicate function or `undefined` if no matching node could be found.

**Variants**

```
#.findInNeighbors
#.findOutNeighbors
#.findInboundNeighbors (in + undirected)
#.findOutboundNeighbors (out + undirected)
#.findDirectedNeighbors
#.findUndirectedNeighbors
```

**Arguments**

* **node** <span class="code">any</span>: the node's key.
* **callback** <span class="code">function</span>: callback to use.

**Callback arguments**

* **neighbor** <span class="code">string</span>: the neighbor's key.
* **attributes** <span class="code">object</span>: the neighbor's attributes.

### #.someNeighbor

Returns whether any neighbor in the graph matches the given predicate function.

**Variants**

```
#.someInNeighbors
#.someOutNeighbors
#.someInboundNeighbors (in + undirected)
#.someOutboundNeighbors (out + undirected)
#.someDirectedNeighbors
#.someUndirectedNeighbors
```

**Arguments**

* **node** <span class="code">any</span>: the node's key.
* **callback** <span class="code">function</span>: callback to use.

**Callback arguments**

* **neighbor** <span class="code">string</span>: the neighbor's key.
* **attributes** <span class="code">object</span>: the neighbor's attributes.

### #.everyNeighbor

Returns whether all neighbors in the graph match the given predicate function.

**Variants**

```
#.everyInNeighbors
#.everyOutNeighbors
#.everyInboundNeighbors (in + undirected)
#.everyOutboundNeighbors (out + undirected)
#.everyDirectedNeighbors
#.everyUndirectedNeighbors
```

**Arguments**

* **node** <span class="code">any</span>: the node's key.
* **callback** <span class="code">function</span>: callback to use.

**Callback arguments**

* **neighbor** <span class="code">string</span>: the neighbor's key.
* **attributes** <span class="code">object</span>: the neighbor's attributes.

### #.neighborEntries

Returns an iterator over the relevant neighbors.

**Variants**

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

* **neighbor** <span class="code">string</span>: the neighbor's key.
* **attributes** <span class="code">object</span>: the neighbor's attributes.
