[![Build Status](https://travis-ci.org/graphology/graphology-operators.svg)](https://travis-ci.org/graphology/graphology-operators)

# Graphology Operators

Miscellaneous operators to be used with [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-operators
```

## Usage

*Unary*

* [subgraph](#subgraph)
* [reverse](#reverse)

*Binary*

* [disjointUnion](#disjointunion)
* [union](#union)

*Cast*

* [toDirected](#todirected)
* [toSimple](#tosimple)
* [toUndirected](#toundirected)

### subgraph

Return a graph's subgraph containing the given nodes and their relevant edges.

```js
import {subgraph} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import subgraph from 'graphology-operators/subgraph';

// From an array of nodes
const sub = subgraph(graph, ['John', 'Mary', 'Sue']);

// From a set of nodes
const sub = subgraph(graph, new Set(['John', 'Mary', 'Sue']));

// From a filtering function
const sub = subgraph(graph, function(key, attr) {
  return key.startsWith('J') || attr.color === 'red';
});
```

*Arguments*

* **graph** *Graph*: target graph.
* **nodes** *array|Set|function*: either an array of nodes to keep, or a set of nodes to keep or a function taking a node's key and its attributes and tasked to filter the nodes to keep.

### reverse

Reverse the given graph's directed edges.

```js
import {reverse} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import reverse from 'graphology-operators/reverse';

const reversedGraph = reverse(graph);
```

*Arguments*

* **graph** *Graph*: target graph.

### disjointUnion

Returns the disjoin union of the given graphs. To do so, the function will
relabel your nodes & edges so both graphs can remain disjoint.

```js
import {disjointUnion} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import disjointUnion from 'graphology-operators/disjoint-union';

const R = disjointUnion(G, H);
```

*Arguments*

* **G** *Graph*: first graph.
* **H** *Graph*: second graph.

### union

Returns the union of the given graphs. Nodes & edges present in both graph will have their attributes merges with precedence given to the second graph.

```js
import {union} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import union from 'graphology-operators/union';

const R = union(G, H);
```

*Arguments*

* **G** *Graph*: first graph.
* **H** *Graph*: second graph.

### toDirected

Returns the directed version of the given graph where any undirected edge will be now considered as mutual.

Note that you can pass a function to merge edge attributes in case of mixed edges conflicts. This can be useful to sum weights and so on...

If an already directed graph is passed, the function will only return a copy of it.

```js
import {toDirected} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import toDirected from 'graphology-operators/to-directed';

const directedGraph = toDirected(graph);

// Using a merging function
const directedGraph = toDirected(graph, (currentAttr, nextAttr) => {
  return {
    ...currentAttr,
    weight: currentAttr.weight + nextAttr.weight
  };
});
```

*Arguments*

* **graph** *Graph*: target graph.
* **mergeOrOptions** *?function|object*: either a merging function or an options object:
  * **mergeEdge** *?function*: merging function to use.

### toSimple

Returns the simple version of the given multigraph where we only keep a single edge of each type between nodes.

If an already simple graph is passed, the function will only return a copy of it.

```js
import {toSimple} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import toSimple from 'graphology-operators/to-simple';

const simpleGraph = toSimple(multiGraph);
```

### toUndirected

Returns the undirected version of the given graph where any directed edge will be now considered as undirected.

Note that you can pass a function to merge edge attributes in case of mutual edges or mixed edges conflicts. This can be useful to sum weights and so on...

If an already undirected graph is passed, the function will only return a copy of it.

```js
import {toUndirected} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import toUndirected from 'graphology-operators/to-undirected';

const undirectedGraph = toUndirected(graph);

// Using a merging function
const undirectedGraph = toUndirected(graph, (currentAttr, nextAttr) => {
  return {
    ...currentAttr,
    weight: currentAttr.weight + nextAttr.weight
  };
});
```

*Arguments*

* **graph** *Graph*: target graph.
* **mergeOrOptions** *?function|object*: either a merging function or an options object:
  * **mergeEdge** *?function*: merging function to use.
