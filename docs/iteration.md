# Iteration

Using a `Graph` instance, it is possible to iterate on the three following things:

* [Nodes](#nodes)
* [Edges](#edges)
* [Neighbors](#neighbors)

**Iteration methods**

The library basically proposes two ways to iterate:

* Methods returning arrays of keys.
* Counting methods when the implementationis able to return a number without creating an array.

**On what do we iterate?**

Note that the methods will always iterate on nodes' & edges' keys and nothing more. If you need to access to attributes during iteration, you can do so using the [attributes](attributes.md) methods.

**Difference between directed iterators**

The difference between, for instance, the `#.outEdges` & the `#.outboundEdges` iterator is that the former will only traverse directed edges while the latter will traverse both directed edges & undirected edges facing towards this direction so that all edges are traversed, and never twice.

This is very useful when performing operations such as creating a subgraph etc.

## Nodes

Those methods iterate over the graph instance's nodes.

**Examples**

```js
const graph = new Graph();

graph.addNode('Thomas');
graph.addNode('Elizabeth');

// Using the array-returning method:
graph.nodes();
>>> ['Thomas', 'Elizabeth']
```

**Methods**

```
#.nodes
```

**Arguments**

1. **None**: iterate over every node.

**Getting the total number of nodes**

You can simply use the [`#.order`](properties.md#order) property.

## Edges

These methods iterate over the graph instance's edges.

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

graph.edges(['Rosaline', 'Catherine']);
>>> ['T->R', 'C->T', 'R->C']

graph.edges('John', 'Daniel');
>>> ['J->D1', 'J->D2']

// Using the counting methods
graph.countEdges('Thomas');
>>> 3
graph.countOutEdges('Thomas');
>>> 2
graph.countInEdges('Thomas');
>>> 1
```

**Methods**

```
#.edges
#.inEdges
#.outEdges
#.inboundEdges
#.outboundEdges
#.directedEdges
#.undirectedEdges
#.selfLoops

#.countEdges
#.countInEdges
#.countOutEdges
#.countInboundEdges
#.countOutboundEdges
#.countDirectedEdges
#.countUndirectedEdges
#.countSelfLoops
```

**Arguments**

1. **None**: iterate over every edge.
2. **Using a node's key**: will iterate over the node's relevant attached edges.
  * **node** <span class="code">any</span>: the related node's key.
3. **Using a [bunch](concept.md#bunches) of nodes**: will iterate over the union of the nodes' relevant attached edge.
  * **bunch** <span class="code">bunch</span>: bunch of related nodes.
4. **Using source & target**: will iterate over the relevant edges going from source to target.
  * **source** <span class="code">any</span>: the source node's key.
  * **target** <span class="code">any</span>: the target node's key.

**Getting the total number of edges**

You can simply use the [`#.size`](properties.md#size) property.

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

// Asking whether two nodes are neighbors:
graph.neighbors('Thomas', 'Rosaline');
>>> true

// Using the array-returning methods:
graph.neighbors('Thomas');
>>> ['Rosaline', 'Emmett', 'Catherine]

graph.neighbors(['Rosaline', 'Thomas']);
>>> ['Emmett', 'Catherine']

// Using the counting methods
graph.countNeighbors('Thomas');
>>> 3
```

**Methods**

```
#.neighbors
#.inNeighbors
#.outNeighbors
#.inboundNeighbors
#.outboundNeighbors

#.countNeighbors
#.countInNeighbors
#.countOutNeighbors
#.countInboundNeighbors
#.countOutboundNeighbors
```

**Arguments**

1. **Using a node's key**: will iterate over the node's relevant neighbors.
  * **node** <span class="code">any</span>: the node's key.
2. **Using a [bunch](concept.md#bunches) of nodes**: will iterate over the union of the nodes' relevant neighbors.
  * **bunch** <span class="code">bunch</span>: bunch of related nodes.
3. **Using two nodes' keys**: will return whether the two given nodes are neighbors.
  * **node1** <span class="code">any</span>: first node.
  * **node2** <span class="code">any</span>: second node.
