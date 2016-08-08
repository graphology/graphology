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

`#.hasDirectedEdge`, `#.hasUndirectedEdge`

## #.getEdge

Returns the first matching edge linking the given source & target, or `undefined` if it does not exist.

*Example*

```js
graph.addNode('Timothy');
graph.addNode('Clarice');
graph.addEdgeWithKey('C->T', 'Clarice', 'Timothy');

graph.getEdge('Clarice', 'Timothy');
>>> 'C->T'

graph.getEdge('Clarice', 'Franck');
>>> undefined
```

*Arguments*

* **source** <span class="type">any</span>: source of the edge to find.
* **target** <span class="type">any</span>: target of the edge to find.

*Variants*

`#.getDirectedEdge`, `#.getUndirectedEdge`

## #.degree

Returns the degree of the given node.

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

* **node** <span class="code">any</span>: node to find.

*Variants*

`#.inDegree`, `#.outDegree`

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

* **edge** <span class="code">any</span>: edge to find.

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

* **edge** <span class="code">any</span>: edge to find.

## #.relatedNode

Given a node & an edge, returns the node at the other end of the relation.

```js
graph.addNode('Timothy');
graph.addNode('Clarice');
const edge = graph.addEdge('Clarice', 'Timothy');

graph.relatedNode('Timothy', edge);
>>> 'Clarice'
```

*Arguments*

* **node** <span class="code">any</span>: node to find.
* **edge** <span class="code">any</span>: edge to find.

## #.extremities

Returns both extremities of the given edge.

```js
graph.addNode('Timothy');
graph.addNode('Clarice');
const edge = graph.addEdge('Clarice', 'Timothy');

graph.extremities(edge);
>>> ['Timothy', 'Clarice']
```

*Arguments*

* **edge** <span class="code">any</span>: edge to find.

## #.directed

Returns whether the given edge is directed.

```js
graph.addNode('Timothy');
graph.addNode('Clarice');
const edge = graph.addEdge('Clarice', 'Timothy');
const undirectedEdge = graph.addUndirectedEdge('Clarice', 'Timothy');

graph.directed(edge);
>>> true
graph.directed(undirectedEdge);
>>> false
```

*Arguments*

* **edge** <span class="code">any</span>: edge to find.

*Variants*

`#.undirected`
