# Concepts

## Keys

Both nodes & edges are represented in the graph by keys. Those keys, whether you use a standard `Graph` or a `GraphMap` instance, can be a lot of different things.

This said, the user should have in mind that both classes won't fix JavaScript quirks and should expect the keys of a `Graph` to have the same downsides as any plain object's keys (namely string coercion). The same can be said about `GraphMap` and the ES6 `Map` object.

## Errors

Rather than failing silently, `graphology` API will often throw errors to notify the developer that something inconsistent was performed so they can fix their code.

`graphology` errors are designed to be as helpful as possible to help the developer fix the issue. For instance, the implementation will gladly tell you not to use the `#.addUndirectedEdge` method on a `directed` graph and point you towards the `#.addEdge` or `#.addDirectedEdge`  method instead.

```js
import {DirectedGraph} from 'graphology';

const graph = new DirectedGraph();
graph.addNodesFrom(['Lucy', 'Catherine']);
graph.addUndirectedEdge('Lucy', 'Catherine');
>>> Error `DirectedGraph.addUndirectedEdge: You cannot add an undirected edge.
to a directed graph Use the #.addEdge or #.addDirectedEdge method instead.`
```

## Bunches

At times, the present documentation tells you that some methods can optionally take bunches of nodes or edges instead of a single node or edge. This basically means that you can provide any JavaScript iterable as a bunch so the method will take it as a sequence of nodes or edges.

This is how the API will understand different iterables:

* If you pass a list-like iterable (`Array`, `Set` etc.), the API will understand each of the sequence's values as nodes' or edges' keys.

```js
const nodes = new Set(['John', 'Martha']);

// This will correctly drop both nodes:
graph.dropNodes(nodes);
```

* If you pass a key-value-like iterable (`Object`, `Map` etc.), the API will understand each keys as nodes' or edges' keys and values as their respective attributes.

```js
// This will add two nodes, 'John' & 'Martha':
const nodes = ['John', 'Martha'];
graph.addNodesFrom(nodes);

// This will add two nodes, 'John' & 'Martga', along with
// their respective attributes:
const nodesWithAttributes = {
  John: {age: 34},
  Martha: {age: 45}
};
graph.addNodesFrom(nodesWithAttributes);

graph.getNodeAttribute('Martha', 'age');
>>> 45
```

## Chaining

By convention, you can assume that if the documentation does not tell you what a specific method returns then it will return the instance itself for chaining purposes.

One might note that, contrary to some other libraries, `graphology` returns the node or edge on the `#.addNode` & `#.addEdge` method rather than enabling chaining methods. This was made so that the "get/has" pattern remains usable and to avoid unnecessary reads of the graph when building one:

You can see an example of this pattern in the ["Creating a co-occurrence graph"](examples/co-occurrence.md) example.

## Concerning order

The user should expect the `Graph` object to retain insertion order for both nodes & edges.

```js
const graph = new Graph();
graph.addNode('First Node');
graph.addNode('Second Node');

graph.nodes().forEach(node => {
  console.log(node);
});
>>> 'First Node'
>>> 'Second Node'
```

## Polling edges

Note that two different ways are generally accessible to you when targeting edges in the graph:

* Either you can provide their key.
* Or you can use their source & target to find them.

Note however that, since graph instances can support parallel edges, you might sometimes want to avoid using the second way since it will always only target the first matching edge (in insertion order).

```js
cons graph = new Graph();
graph.addNodesFrom(['Eric', 'Martha']);

// Adding our edge
const edge = graph.addEdge('Eric', 'Martha');

// Now we can see if the edge exists either by key:
graph.hasEdge(edge);
>>> true

// or by source & target:
graph.hasEdge('Eric', 'Martha');
>>> true
```

## Concerning immutability

While the present specification doesn't cover the case of an immutable graph, it would be very easy to implement it by changing the three following things in the API:

* Make all the mutating methods returns the new graph.
* Add a boolean `#.immutable` property to the object.
* Make sure that the `onNodeDuplicate` & `onEdgeDuplicate` options return the new graph rather than mutating it.
* Probably disable the event system since the reference will change whenever the graph is edited.

```js
import ImmutableGraph from 'graphology-immutable';

const graph = new ImmutableGraph();

const updatedGraph = graph.addNode('Martha');

graph === updatedGraph
>>> false

graph.order
>>> 0

updatedGraph
>>> 1
```
