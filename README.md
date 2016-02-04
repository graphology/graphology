# graphlib

Discussions about a simple graph library for JavaScript.

## API proposition

### Rationale

The idea here is to create a concise JavaScript object looking much like the native ES6 objects such as [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) or [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

The data structure must be scalable but remain straightforward in its use.

### Instantiation

```js
// Empty graph
var graph = new Graph();

// Hydratation
var graph = new Graph({nodes: [...], edges: [...]});

// Hydratation should accept some polymorphisms, notably:
var graph = new Graph({nodes: {...}, edges: {...}});

// Or even
var graph = new Graph([[...], [...]]);
var graph = new Graph([[...]]);
var graph = new Graph([{...}, {...}]);
var graph = new Graph([{...}]);

// And to mimick ES6 classes
var graph = Graph.from(...);

// With options
var graph = new Graph({...}, {option: true});
var graph = new Graph(null, {option: true});
```

What about different graph types? By default, `Graph` would be mixed and dynamic.

```js
var graph = new DirectedGraph();
var immutableGraph = new ImmutableGraph();
// etc.
```

### On nodes & edges

Nodes & edges should be objects (we could accept scalar values but it would probably be more annoying than anything).

A node is at least `{id: 'string|number'}`.
An edge should be at least `{source: 'string|number', target: 'string|number'}` and can have and id.

### Properties

Naming is to be discussed. Concept names come from [here](https://en.wikipedia.org/wiki/Graph_theory).

```js
// Number of nodes (read-only)
graph.order

// Number of edges (read-only)
graph.size

// Nodes (array, read-only)
graph.nodes

// Edges (array, read-only)
graph.edges
```

### Methods

Note that methods exposed below try to follow as closely as possible the native ES6 objects' naming.

#### Read

##### #.get

Retrieve a node by id.

```js
// node is the original object
var node = graph.get(id);
>>> {
  id: 45,
  label: 'Book'
}
```

##### #.has

Checks whether the given id exists

```js
var exists = graph.has(id);
>>> true
>>> false
```

##### #.degree

Retrieve the degree of a node by id.

```js
var degree = graph.degree(id);
>>> 3
```

##### #.outDegree

Retrieve the out degree of a node by id.

```js
var outDegree = graph.outDegree(id);
>>> 1
```

##### #.inDegree

Retrieve the in degree of a node by id.

```js
var inDegree = graph.inDegree(id);
>>> 1
```

#### Write

##### #.add

Add a node to the graph.

```js
graph.add(key, nodeData);
>>> undefined
```

##### #.delete

Delete a node by key.

```js
graph.delete(key);
// if key doesn't exist
>>> 'false'
// if key exists
>>> 'true'
```

##### #.relate

Add a edge between two node ids.

```js
graph.relate(source, target, edgeData);
```

##### #.unrelate

We should discuss this point. By id? What if the edge has no id? By source & target? What if there are parallel edges?

##### #.clear

Clear the graph of both nodes & edges.

```js
graph.order
>>> 2
graph.size
>>> 1

graph.clear();

graph.order
>>> 0
graph.size
>>> 0
```

## Internals

### About element storage

Internals should be kept private and shouldn't be editable.

However, provided nodes and edges should be mutable and shouldn't be overloaded by the internal of the object.

This said, the nodes and edges arrays shouldn't be mutated by the user.

```js
// Very basic explanation of the above
function Graph(nodes, edges) {
  this.nodes = Array.from(nodes);
  this.edges = Array.from(edges);

  this.internalNodeProperties = {};
  this.internalEdgeProperties = {};
}

var graph = new Graph([{id: 1}, {id: 2}], [{from: 1, to: 2}]);

// The internal nodes & edges array shouldn't be mutated or accessed
// BAD!
graph.nodes.push(whatever);
// ALSO BAD!
graph.edges.splice(0, 1);

// One can access the nodes
var node = graph.get(1);
// You can mutate node freely
node.label = 'Book';

// The graph object will never mutate the node & edges objects
// It'll use an internal mask instead with the relevant properties
```

Ids should be coerced to strings.

### About ES6 iterables

The library should, as much as possible, implement ES6 iterables that can be used through `for ... of`.

### Indexes

#### Standard

* Index of nodes by id.
* Index of edges by id (edges without ids would be given an internal one through ES6 `Symbol`).
* Index of neighbours (directed if the graph is etc.).

#### Opt-in

* Index of nodes' properties.
* Index of edges' properties.

@jacomyma

## Modules & use cases

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
