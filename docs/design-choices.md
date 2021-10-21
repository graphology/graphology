---
layout: default
title: Design choices
nav_order: 2
---

# Design choices
{: .no_toc }

1. TOC
{:toc}

## Keys

Both nodes & edges are represented by keys in the graph. For simplicity's sake, like JavaScript's native objects, the graph will always coerce the given keys as strings.

We could technically handle references as keys but finally decided against it for the following reasons:

* Ensure that serialization remains as straightforward as possible.
* Not to put a pressure on end-users' code by having to force the usage of, for instance, ES6 Maps to ensure their code will handle every Graph case possible.

This said, the user should keep in mind that the graph have the same quirks as a JavaScript native object:

* Numbers as keys will be coerced to strings.
* Giving objects as keys will result in a `[object Object]` key etc.

## Mixed graphs & type precedence

When using mixed graphs, one should consider that directed edges will always take precedence over the undirected ones.

Use the typed methods to solve the ambiguity.

```js
import Graph from 'graphology';

const graph = new Graph();
graph.addNodesFrom(1, 2, 3);

// This will add a directed edge
graph.addEdge(1, 2);
// Same as:
graph.addDirectedEdge(1, 2);

// This will add an undirected edge
graph.addUndirectedEdge(1, 2);

// So, for instance, if you need to target the undirected edge
graph.setUndirectedEdgeAttribute(1, 2, 'type', 'LIKES');
```

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

## Chaining

By convention, you can assume that if the documentation does not tell you what a specific method returns then it will return the instance itself for chaining purposes.

One might note that, contrary to some other libraries, `graphology` returns the node or edge on the `#.addNode` & `#.addEdge` method rather than enabling chaining methods. This was made so that the "get/has" pattern remains usable and to avoid unnecessary reads of the graph when building one.

## Concerning order

The user should not expect the `Graph` to retain insertion order. It might be a side effect of the used implementation to retain an order but it is not guaranteed by the specification.

```js
const graph = new Graph();
graph.addNode('First Node');
graph.addNode('Second Node');

// Won't necessarily print 'First Node' then 'Second Node'
// Might be the other way around.
graph.nodes().forEach(node => {
  console.log(node);
});
```

## Polling edges

Note that two different ways are generally accessible to you when targeting edges in the graph:

* Either you can provide their key.
* Or you can use their source & target to find them.

Note however that, since graph instances can support parallel edges, you might sometimes want to avoid using the second way since it will throw if you handle a multi-graph.

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
* Probably disable the event system since the reference will change whenever the graph is edited.

```js
import ImmutableGraph from 'graphology-immutable';

const graph = new ImmutableGraph();

const updatedGraph = graph.addNode('Martha');

graph === updatedGraph
>>> false

graph.order
>>> 0

updatedGraph.order
>>> 1
```
