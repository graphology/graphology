# graphlib

Discussions about a simple graph library for JavaScript.

## API proposition

### Rationale

The idea here is to create a concise JavaScript object looking much like the native ES6 objects such as [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) or [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

The data structure must be scalable but remain straightforward in its use.

### Naming

1. What name should we give to the library?
2. Under which organization should we publish the code?

### Instantiation

```js
// Empty graph
var graph = new Graph();

// Hydratation (polymorphisms)
var graph = new Graph({nodes:[...], edges:[...]});

// And to mimick ES6 classes
var graph = Graph.from(...);

// With options
var graph = new Graph({...}, {option: true});
var graph = new Graph(null, {option: true});
```

What about different graph types?

```js
var graph = new DirectedGraph();
// etc.
```

### Properties

Naming is to be discussed. Concept names come from [here](https://en.wikipedia.org/wiki/Graph_theory).

```js
// Number of nodes (read-only)
graph.order

// Number of edges (read-only)
graph.size
```

### Methods

#### Read

##### #.connectedComponents

Retrieve an array of subgraphs (or straight array of nodes?).

```js
graph.connectedComponents();
>>> [component1, component2, ...]
```

#### Write

## Internals

### About element storage

Internals should be kept private and shouldn't be editable.

However, provided nodes and edges should be mutable and shouldn't be overloaded by the internal of the object.

This said, the nodes and edges arrays shouldn't be mutated by the user.

### About ES6 iterables

The library should, as much as possible, implement ES6 iterables that can be used through `for ... of`.

### Indexes

#### Standard

* Index of nodes by id.
* Index of edges by id (if given).
* Index of neighbours (directed if the graph is etc.).

#### Opt-in

* Index of nodes' properties.
* Index of edges' properties.

@jacomyma

## Modularity & use cases

What about algorithms that should not strictly be within the scope of this object?

Where do we draw the line between what should be in the core prototype and what should be modularized?

### Example n°1 - Louvain modularity

```js
import Graph from 'graph';
import louvain from 'louvain';

var graph = new Graph(...);

// We pass the graph to the louvain function
var communities = louvain(graph);

// Or if you want to bootstrap the prototype
Graph.prototype.louvain = function() {
  return louvain(this);
};
```
