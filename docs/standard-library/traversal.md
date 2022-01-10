---
layout: default
title: traversal
nav_order: 19
parent: Standard library
aux_links:
  "Library directory": "https://github.com/graphology/graphology/tree/master/src/traversal"
  "Changelog": "https://github.com/graphology/graphology/tree/master/src/traversal/CHANGELOG.md"
---

# Graphology Traversal

Miscellaneous traversal functions to be used with [`graphology`](..).

## Installation

```
npm install graphology-traversal
```

## Usage

- [bfs](#bfs)
- [bfsFromNode](#bfsfromnode)
- [dfs](#dfs)
- [dfsFromNode](#bfsfromnode)

### bfs

Perform a BFS (Breadth-First Search) over the given graph using a callback.

```js
import {bfs} from 'graphology-traversal';
// Alternatively, to only load the relevant code
import {bfs} from 'graphology-traversal/bfs';

bfs(graph, function (node, attr, depth) {
  console.log(node, attr, depth);
});

// Stopping at depth 3
bfs(graph, function (node, attr, depth) {
  return depth >= 3;
});
```

_Arguments_

- **graph** _Graph_: a graphology instance.
- **callback** _function_: iteration callback taking the traversed node, its attributes and the traversal's depth. Returning `true` will prevent the traversal from following the next neighbors.
- **options** <span class="code">?object</span>: traversal options:
  - **mode** <span class="code">?string</span> <span class="default">outbound</span>: type of neighbors to traverse.

### bfsFromNode

Perform a BFS (Breadth-First Search) over the given graph, starting from the given node, using a callback.

```js
import {bfsFromNode} from 'graphology-traversal';
// Alternatively, to only load the relevant code
import {bfsFromNode} from 'graphology-traversal/bfs';

bfsFromNode(graph, 'node1', function (node, attr, depth) {
  console.log(node, attr, depth);
});

// Stopping at depth 3
bfsFromNode(graph, 'node1', function (node, attr, depth) {
  return depth >= 3;
});
```

_Arguments_

- **graph** _Graph_: a graphology instance.
- **node** _string\|number_: starting node.
- **callback** _function_: iteration callback taking the traversed node, its attributes and the traversal's depth. Returning `true` will prevent the traversal from following the next neighbors.
- **options** <span class="code">?object</span>: traversal options:
  - **mode** <span class="code">?string</span> <span class="default">outbound</span>: type of neighbors to traverse.

### dfs

Perform a DFS (Depth-First Search) over the given graph using a callback.

```js
import {dfs} from 'graphology-traversal';
// Alternatively, to only load the relevant code
import {dfs} from 'graphology-traversal/dfs';

dfs(graph, function (node, attr, depth) {
  console.log(node, attr, depth);
});

// Stopping at depth 3
dfs(graph, function (node, attr, depth) {
  return depth >= 3;
});
```

_Arguments_

- **graph** _Graph_: a graphology instance.
- **callback** _function_: iteration callback taking the traversed node, its attributes and the traversal's depth. Returning `true` will prevent the traversal from following the next neighbors.
- **options** <span class="code">?object</span>: traversal options:
  - **mode** <span class="code">?string</span> <span class="default">outbound</span>: type of neighbors to traverse.

### dfsFromNode

Perform a DFS (Depth-First Search) over the given graph, starting from the given node, using a callback.

```js
import {dfsFromNode} from 'graphology-traversal';
// Alternatively, to only load the relevant code
import {dfsFromNode} from 'graphology-traversal/dfs';

dfsFromNode(graph, 'node1', function (node, attr, depth) {
  console.log(node, attr, depth);
});

// Stopping at depth 3
dfsFromNode(graph, 'node1', function (node, attr, depth) {
  return depth >= 3;
});
```

_Arguments_

- **graph** _Graph_: a graphology instance.
- **node** _string\|number_: starting node.
- **callback** _function_: iteration callback taking the traversed node, its attributes and the traversal's depth. Returning `true` will prevent the traversal from following the next neighbors.
- **options** <span class="code">?object</span>: traversal options:
  - **mode** <span class="code">?string</span> <span class="default">outbound</span>: type of neighbors to traverse.

