---
layout: default
title: Read
nav_order: 5
menu_toc:
  - "#.hasNode"
  - "#.hasEdge"
  - "#.edge"
  - "#.degree"
  - "#.degreeWithoutSelfLoops"
  - "#.source"
  - "#.target"
  - "#.opposite"
  - "#.extremities"
  - "#.hasExtremity"
  - "#.isDirected"
  - "#.isSelfLoop"
  - "#.areNeighbors"
---

# Read

## #.hasNode

Returns whether the given node is found in the graph.

*Example*

```js
graph.addNode('Timothy');

graph.hasNode('Timothy');
>>> true

graph.hasNode('Jack');
>>> false
```

*Arguments*

* **node** <span class="code">any</span>: node to find.

## #.hasEdge

Returns whether the given edge is found in the graph or whether an edge links the given source & target.

See also [#.areNeighbors](#areneighbors).

*Example*

```js
graph.addNode('Timothy');
graph.addNode('Clarice');
const edge = graph.addEdge('Clarice', 'Timothy');

// Using the edge's key:
graph.hasEdge(edge);
>>> true

// Using the edge's source & target:
graph.hasEdge('Clarice', 'Timothy');
>>> true

graph.hasEdge('Clarice', 'John');
>>> false
```

*Arguments*

1. Using the key:
  * **edge** <span class="type">any</span>: edge to find.
2. Using the source & target:
  * **source** <span class="type">any</span>: source of the edge to find.
  * **target** <span class="type">any</span>: target of the edge to find.

*Variants*

* `#.hasDirectedEdge`
* `#.hasUndirectedEdge`

## #.edge

Returns the key of the edge between given source & target or `undefined` if such an edge does not exist.

Note that this method will throw if either source or target is not found in the graph.

In addition, this method won't work on a multi graph and will throw because the graph cannot know which edge to return since there might be multiple edges between source & target.

*Example*

```js
graph.addNode('Timothy');
graph.addNode('Clarice');
graph.addNode('Olivia');
graph.addEdgeWithKey('C->T', 'Clarice', 'Timothy');

graph.edge('Clarice', 'Timothy');
>>> 'C->T'

graph.edge('Clarice', 'Olivia');
>>> undefined
```

*Arguments*

* **source** <span class="type">any</span>: source of the edge to find.
* **target** <span class="type">any</span>: target of the edge to find.

*Variants*

* `#.directedEdge`
* `#.undirectedEdge`

## #.degreeWithoutSelfLoops

Returns the degree of the given node, without taking self loops into account.

Will throw if the node is not found in the graph.

*Example*

```js
graph.addNodeFrom(['Timothy', 'Jack', 'Clarice', 'Martha']);
graph.addEdge('Timothy', 'Timothy');
graph.addEdge('Timothy', 'Jack');
graph.addEdge('Timothy', 'Clarice');
graph.addEdge('Martha', 'Timothy');

graph.degreeWithoutSelfLoops('Timothy');
>>> 3
graph.inWithoutSelfLoops('Timothy');
>>> 1
graph.outWithoutSelfLoops('Timothy');
>>> 2
```

*Arguments*

* **node** <span class="code">any</span>: target node.

*Variants*

* `#.inDegreeWithoutSelfLoops`
* `#.outDegreeWithoutSelfLoops`
* `#.directedDegreeWithoutSelfLoops` (`#.inDegreeWithoutSelfLoops` + `#.outDegreeWithoutSelfLoops`)
* `#.undirectedDegreeWithoutSelfLoops`
* `#.degreeWithoutSelfLoops` (`#.directedDegreeWithoutSelfLoops` + `#.undirectedDegreeWithoutSelfLoops`)

## #.degree

Returns the degree of the given node.

Will throw if the node is not found in the graph.

*Example*

```js
graph.addNodeFrom(['Timothy', 'Jack', 'Clarice', 'Martha']);
graph.addEdge('Timothy', 'Jack');
graph.addEdge('Timothy', 'Clarice');
graph.addEdge('Martha', 'Timothy');

graph.degree('Timothy');
>>> 3
graph.inDegree('Timothy');
>>> 1
graph.outDegree('Timothy');
>>> 2
```

*Arguments*

* **node** <span class="code">any</span>: target node.

*Variants*

* `#.inDegree`
* `#.outDegree`
* `#.directedDegree` (`#.inDegree` + `#.outDegree`)
* `#.undirectedDegree`
* `#.degree` (`#.directedDegree` + `#.undirectedDegree`)

## #.source

Returns the source of the given edge.

*Example*

```js
graph.addNode('Timothy');
graph.addNode('Clarice');
const edge = graph.addEdge('Clarice', 'Timothy');

graph.source(edge);
>>> 'Clarice'
```

*Arguments*

* **edge** <span class="code">any</span>: target edge.

## #.target

Returns the target of the given edge.

*Example*

```js
graph.addNode('Timothy');
graph.addNode('Clarice');
const edge = graph.addEdge('Clarice', 'Timothy');

graph.target(edge);
>>> 'Timothy'
```

*Arguments*

* **edge** <span class="code">any</span>: target edge.

## #.opposite

Given a node & an edge, returns the node at the other end of the edge.

*Example*

```js
graph.addNode('Timothy');
graph.addNode('Clarice');
const edge = graph.addEdge('Clarice', 'Timothy');

graph.opposite('Timothy', edge);
>>> 'Clarice'
```

*Arguments*

* **node** <span class="code">any</span>: target node.
* **edge** <span class="code">any</span>: target edge.

## #.extremities

Returns both extremities of the given edge.

*Example*

```js
graph.addNode('Timothy');
graph.addNode('Clarice');
const edge = graph.addEdge('Clarice', 'Timothy');

graph.extremities(edge);
>>> ['Timothy', 'Clarice']
```

*Arguments*

* **edge** <span class="code">any</span>: target edge.

## #.hasExtremity

Returns whether the given edge has the given node as extremity.

```js
graph.addNode('Lucy');
graph.addNode('Timothy');
graph.addNode('Clarice');
const edge = graph.addEdge('Clarice', 'Timothy');

graph.hasExtremity(edge, 'Timothy');
>>> true

graph.hasExtremity(edge, 'Lucy');
>>> false
```

## #.isDirected

Returns whether the given edge is directed.

*Example*

```js
graph.addNode('Timothy');
graph.addNode('Clarice');
const edge = graph.addEdge('Clarice', 'Timothy');
const undirectedEdge = graph.addUndirectedEdge('Clarice', 'Timothy');

graph.isDirected(edge);
>>> true
graph.isDirected(undirectedEdge);
>>> false
```

*Arguments*

* **edge** <span class="code">any</span>: target edge.

*Variants*

* `#.isUndirected`

## #.isSelfLoop

Returns whether the given edge is a self-loop.

*Example*

```js
graph.addNode('Timothy');
const edge = graph.addEdge('Timothy', 'Timothy');

graph.isSelfLoop(edge);
>>> true
```

*Arguments*

* **edge** <span class="code">any</span>: target edge.

## #.areNeighbors

Returns whether both nodes are neighbors.

See also [#.hasEdge](#hasedge).

*Examples*

```js
graph.addNode('Timothy');
graph.addNode('Clarice');
graph.addNode('Zendar');
graph.addEdge('Clarice', 'Timothy');

graph.areNeighbors('Clarice', 'Timothy');
>>> true

graph.areNeighbors('Zendar', 'Clarice');
>>> false
```

*Arguments*

* **node** <span class="code">any</span>: target node.
* **neighbord** <span class="code">any</span>: potential neighbor.

*Variants*

* `#.areDirectedNeighbors`
* `#.areUndirectedNeighbors`
* `#.areInNeighbors`
* `#.areOutNeighbors`
* `#.areInboundNeighbors` (in + undirected)
* `#.areOutboundNeighbors` (out + undirected)
