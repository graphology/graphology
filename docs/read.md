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

Returns the first matching edge linking the given source & target (starting with directed edges & then with undirected ones), or `undefined` if it does not exist.

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
* **selfLoops** <span class="code">[boolean]</span> <span class="default">true</span>: whether to keep the self loops when computing the degree.

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

## #.relatedNode

Given a node & an edge, returns the node at the other end of the relation.

*Example*

```js
graph.addNode('Timothy');
graph.addNode('Clarice');
const edge = graph.addEdge('Clarice', 'Timothy');

graph.relatedNode('Timothy', edge);
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

## #.directed

Returns whether the given edge is directed.

*Example*

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

* **edge** <span class="code">any</span>: target edge.

*Variants*

`#.undirected`

## #.selfLoop

Returns whether the given edge is a self-loop.

*Example*

```js
graph.addNode('Timothy');
const edge = graph.addEdge('Timothy', 'Timothy');

graph.selfLoop(edge);
>>> true
```

*Arguments*

* **edge** <span class="code">any</span>: target edge.
