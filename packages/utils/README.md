# Graphology Utils

Miscellaneous utility functions to be used with [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-utils
```

## Usage

*Assertions*

* [#.isGraph](#isgraph)
* [#.isGraphConstructor](#isgraphconstructor)

*Introspection*

* [#.inferType](#infertype)

*Typical edge patterns*

* [#.mergeClique](#mergeclique)
* [#.mergeCycle](#mergecycle)
* [#.mergePath](#mergepath)
* [#.mergeStar](#mergestar)

*Miscellaneous helpers*

* [#.renameGraphKeys](#renamegraphkeys)
* [#.updateGraphKeys](#updategraphkeys)

### #.inferType

Function returning the inferred type of the given graph. This function is useful to check whether a given mixed graph is in fact a mere `directed` or `undirected` graph based on its actual edges.

```js
import Graph from 'graphology';
import {inferType} from 'graphology-utils';
// Alternatively, if you want to only load the relevant code:
import inferType from 'graphology-utils/infer-type';

const graph = new Graph();
graph.addUndirectedEdge(1, 2);

inferType(graph);
>>> 'directed'
```

### #.isGraph

Function returning whether the given value is a `graphology` implementation's instance.

```js
import Graph from 'graphology';
import {isGraph} from 'graphology-utils';
// Alternatively, if you want to only load the relevant code:
import isGraph from 'graphology-utils/is-graph';

const graph = new Graph();

isGraph(graph);
>>> true

isGraph(45);
>>> false

isGraph({hello: 'world'});
>>> false
```

*Arguments*

* **value** *any*: value to test.

### #.isGraphConstructor

Function returning whether the given value is a `graphology` constructor.

```js
import Graph from 'graphology';
import {isGraphConstructor} from 'graphology-utils';
// Alternatively, if you want to only load the relevant code:
import isGraphConstructor from 'graphology-utils/is-graph-constructor';

isGraphConstructor(Graph);
>>> true

isGraphConstructor(45);
>>> false

isGraphConstructor(new Graph());
>>> false
```

*Arguments*

* **value** *any*: value to test.

### #.mergeClique

Function adding a clique to the given graph.

```js
import Graph from 'graphology';
import {mergeClique} from 'graphology-utils';
// Alternatively, if you want to only load the relevant code:
import mergeClique from 'graphology-utils/merge-clique';

const graph = new Graph();

mergeClique(graph, [1, 2, 3]);
graph.edges().map(e => graph.extremities(e));
>>> [[1, 2], [1, 3], [2, 3]]
```


### #.mergeCycle

Function adding a cycle to the given graph.

```js
import Graph from 'graphology';
import {mergeCycle} from 'graphology-utils';
// Alternatively, if you want to only load the relevant code:
import mergeCycle from 'graphology-utils/merge-cycle';

const graph = new Graph();

mergeCycle(graph, [1, 2, 3, 4, 5]);
graph.edges().map(e => graph.extremities(e));
>>> [[1, 2], [2, 3], [3, 4], [4, 5], [5, 1]]
```

*Arguments*

* **graph** *Graph*: target graph.
* **cycle** *array*: array of nodes representing the cycle to add.

### #.mergePath

Function adding a path to the given graph.

```js
import Graph from 'graphology';
import {mergePath} from 'graphology-utils';
// Alternatively, if you want to only load the relevant code:
import mergePath from 'graphology-utils/merge-path';

const graph = new Graph();

mergePath(graph, [1, 2, 3, 4, 5]);
graph.edges().map(e => graph.extremities(e));
>>> [[1, 2], [2, 3], [3, 4], [4, 5]]
```

*Arguments*

* **graph** *Graph*: target graph.
* **path** *array*: array of nodes representing the path to add.

### #.mergeStar

Function adding a star to the given graph.

```js
import Graph from 'graphology';
import {mergeStar} from 'graphology-utils';
// Alternatively, if you want to only load the relevant code:
import mergeStar from 'graphology-utils/merge-star';

const graph = new Graph();

mergeStar(graph, [1, 2, 3, 4, 5]);
graph.edges().map(e => graph.extremities(e));
>>> [[1, 2], [1, 3], [1, 4], [1, 5]]
```

*Arguments*

* **graph** *Graph*: target graph.
* **star** *array*: array of nodes representing the star to add.

### #.renameGraphKeys

Function renaming the nodes & edges key of a graph using mappings and returning a new graph with renamed keys.

```js
import Graph from 'graphology';
import {renameGraphKeys} from 'graphology-utils';
// Alternatively, if you want to only load the relevant code:
import renameGraphKeys from 'graphology-utils/rename-graph-keys';

const graph = new Graph();
graph.addNode('Martha');
graph.addNode('Catherine');
graph.addNode('John');
graph.addEdgeWithKey('M->C', 'Martha', 'Catherine');
graph.addEdgeWithKey('C->J', 'Catherine', 'John');

const renamedGraph = renameGraphKeys(
  graph,
  {Martha: 1, Catherine: 2, John: 3},
  {'M->C': 'rel1', 'C->J': 'rel2'}
);

renamedGraph.nodes();
>>> [1, 2, 3];

renamedGraph.edges();
>>> ['rel1', 'rel2'];
```

*Arguments*

* **graph** *Graph*: target graph.
* **nodeKeyMapping** *object*: A key/value map for the node key mapping.
* **edgeKeyMapping** *?object*: A key/value map for the edge key mapping.

### #.updateGraphKeys

Function updating the nodes & edges key of a graph using functions and returning a new graph with updated keys.

```js
import Graph from 'graphology';
import {updateGraphKeys} from 'graphology-utils';
// Alternatively, if you want to only load the relevant code:
import updateGraphKeys from 'graphology-utils/update-graph-keys';

const graph = new Graph();
graph.addNode('Martha');
graph.addNode('Catherine');
graph.addNode('John');
graph.addEdgeWithKey('M->C', 'Martha', 'Catherine');
graph.addEdgeWithKey('C->J', 'Catherine', 'John');

const updatedGraph = updateGraphKeys(
  graph,
  (key)=> {
    if (key === 'Martha') return 1;
    if (key === 'Catherine') return 2;
    return 3;
  },
  (key) => {
    if (key === 'M->C') return 'rel1';
    return 'rel2';
  }
);

updatedGraph.nodes();
>>> [1, 2, 3];

updatedGraph.edges();
>>> ['rel1', 'rel2'];
```

*Arguments*

* **graph** *Graph*: target graph.
* **nodeKeyUdater** *function*: A function to compute a new node key from the same arguments that would be given to [`#.forEachNode`](https://graphology.github.io/iteration.html#foreachnode).
* **edgeKeyUpdater** *function*: A function to compute a new edge key from the same arguments that would be given to [`#.forEachEdge`](https://graphology.github.io/iteration.html#foreachedge).
