[![Build Status](https://travis-ci.org/graphology/graphology-simple-path.svg)](https://travis-ci.org/graphology/graphology-simple-path)

# Graphology Simple Path

Simple path related functions to be used with [`graphology`](https://graphology.github.io). A "simple path" is a path where a node is not repeated.

## Installation

```
npm install graphology-simple-path
```

## Usage

* [allSimplePaths](#allsimplepaths)
* [allSimpleEdgePaths](#allsimpleedgepaths)
* [allSimpleEdgeGroupPaths](#allsimpleedgegrouppaths)

### allSimplePaths

Collects every simple path between a source and a target node in the given graph.

Note that this function also works with cycles.

```js
import {allSimplePaths} from 'graphology-simple-path';

const graph = new Graph();
graph.mergeEdge('1', '2');
graph.mergeEdge('1', '3');
graph.mergeEdge('2', '3');

const paths = allSimplePaths(graph, '1', '3');
>>> [
  ['1', '3'],
  ['1', '2', '3']
]

// To get cycles, just pass same source & target
const cycles = allSimplePaths(graph, '1', '1');
```

*Arguments*

* **graph** *Graph*: target graph.
* **source** *string*: source node.
* **target** *string*: target node.

### allSimpleEdgePaths

Collects every simple path, represented by the followed edges, between a source and a target node in the given graph.

Note that this function also works with cycles but does not work with multi graphs yet.

```js
import {allSimpleEdgePaths} from 'graphology-simple-path';

const graph = new Graph();
graph.mergeEdgeWithKey('1->2', '1', '2');
graph.mergeEdgeWithKey('1->3', '1', '3');
graph.mergeEdgeWithKey('2->3', '2', '3');

const paths = allSimpleEdgePaths(graph, '1', '3');
>>> [
  ['1->3'],
  ['1->2', '2->3']
]

// To get cycles, just pass same source & target
const cycles = allSimpleEdgePaths(graph, '1', '1');
```

*Arguments*

* **graph** *Graph*: target graph.
* **source** *string*: source node.
* **target** *string*: target node.

### allSimpleEdgeGroupPaths

Collects every simple path, represented by groups of equivalent followed edges, between a source and a target node in the given multi graph.

Note that this function also works with cycles and that, even if it can work with a simple graph, it has not be designed to be useful in this case.

```js
import {allSimpleEdgeGroupPaths} from 'graphology-simple-path';

const graph = new Graph();
graph.mergeEdgeWithKey('1->2a', '1', '2');
graph.mergeEdgeWithKey('1->2b', '1', '2');
graph.mergeEdgeWithKey('1->3a', '1', '3');
graph.mergeEdgeWithKey('2->3a', '2', '3');

const paths = allSimpleEdgeGroupPaths(graph, '1', '3');
>>> [
  [['1->3a']],
  [['1->2a', '1->2b'], ['2->3a']]
]

// To get cycles, just pass same source & target
const cycles = allSimpleEdgeGroupPaths(graph, '1', '1');
```

*Arguments*

* **graph** *Graph*: target graph.
* **source** *string*: source node.
* **target** *string*: target node.
