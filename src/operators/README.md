# Graphology Operators

Miscellaneous operators to be used with [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-operators
```

## Usage

_Unary_

- [subgraph](#subgraph)
- [reverse](#reverse)

_Binary_

- [disjointUnion](#disjointunion)
- [union](#union)

_Cast_

- [toDirected](#todirected)
- [toMixed](#tomixed)
- [toMulti](#tomulti)
- [toSimple](#tosimple)
- [toUndirected](#toundirected)

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
const sub = subgraph(graph, function (key, attr) {
  return key.startsWith('J') || attr.color === 'red';
});
```

_Arguments_

- **graph** _Graph_: target graph.
- **nodes** _array\|Set\|function_: either an array of nodes to keep, or a set of nodes to keep or a function taking a node's key and its attributes and tasked to filter the nodes to keep.

### reverse

Reverse the given graph's directed edges.

```js
import {reverse} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import reverse from 'graphology-operators/reverse';

const reversedGraph = reverse(graph);
```

_Arguments_

- **graph** _Graph_: target graph.

### disjointUnion

Returns the disjoin union of the given graphs. To do so, the function will
relabel your nodes & edges so both graphs can remain disjoint.

```js
import {disjointUnion} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import disjointUnion from 'graphology-operators/disjoint-union';

const R = disjointUnion(G, H);
```

_Arguments_

- **G** _Graph_: first graph.
- **H** _Graph_: second graph.

### union

Returns the union of the given graphs. Nodes & edges present in both graph will have their attributes merges with precedence given to the second graph.

```js
import {union} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import union from 'graphology-operators/union';

const R = union(G, H);
```

_Arguments_

- **G** _Graph_: first graph.
- **H** _Graph_: second graph.

### toDirected

Returns the directed version of the given graph where any undirected edge will be now considered as mutual.

Note that you can pass a function to merge edge attributes in case of mixed edges conflicts. This can be useful to sum weights and so on...

If an already directed graph is passed, the function will only return a copy of it.

If passing a multi graph, undirected edges will only be converted as pairs ofmutual ones and will never be merged.

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

_Arguments_

- **graph** _Graph_: target graph.
- **mergeOrOptions** _?function\|object_: either a merging function or an options object:
  - **mergeEdge** _?function_: merging function to use.

### toMixed

Returns the given graph as mixed.

If an already mixed graph is passed, the function will only return a copy of it.

```js
import {toMixed} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import toMixed from 'graphology-operators/to-mixed';

const mixedGraph = toMixed(graph);
```

### toMulti

Returns the given graph as multi.

If an already multi graph is passed, the function will only return a copy of it.

```js
import {toMulti} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import toMulti from 'graphology-operators/to-multi';

const mixedGraph = toMulti(graph);
```

### toSimple

Returns the simple version of the given multigraph where we only keep a single edge of each type between nodes.

Note that you can pass a function to merge edge attributes in case of mutual edges or mixed edges conflicts. This can be useful to sum weights and so on...

If an already simple graph is passed, the function will only return a copy of it.

```js
import {toSimple} from 'graphology-operators';
// Alternatively, to load only the relevant code:
import toSimple from 'graphology-operators/to-simple';

const simpleGraph = toSimple(multiGraph);

// Using a merging function
const simpleGraph = toSimple(graph, (currentAttr, nextAttr) => {
  return {
    ...currentAttr,
    weight: currentAttr.weight + nextAttr.weight
  };
});
```

_Arguments_

- **graph** _Graph_: target graph.
- **mergeOrOptions** _?function|object_: either a merging function or an options object:
  - **mergeEdge** _?function_: merging function to use.


### toUndirected

Returns the undirected version of the given graph where any directed edge will be now considered as undirected.

Note that you can pass a function to merge edge attributes in case of mutual edges or mixed edges conflicts. This can be useful to sum weights and so on...

If an already undirected graph is passed, the function will only return a copy of it.

If passing a multi graph, directed edges will only be converted as undirected ones and will never be merged.

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

_Arguments_

- **graph** _Graph_: target graph.
- **mergeOrOptions** _?function|object_: either a merging function or an options object:
  - **mergeEdge** _?function_: merging function to use.
