# graphlib

[Discussions](/issues) about a simple graph library for JavaScript.

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
