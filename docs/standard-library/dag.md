---
layout: default
title: dag
nav_order: 5
parent: Standard library
aux_links:
  "Library directory": "https://github.com/graphology/graphology/tree/master/src/dag"
  "Changelog": "https://github.com/graphology/graphology/tree/master/src/dag/CHANGELOG.md"
---

# Graphology DAG

Functions related to directed acyclic graphs (DAGs) and to be used with [`graphology`](..).

## Installation

```
npm install graphology-dag
```

## Usage

- [willCreateCycle](#willcreatecycle)

### willCreateCycle

Function returning whether adding the given directed edge to a DAG will create an undesired cycle.

Note that this function expects a valid DAG and even if passing a cyclic graph could work it could also very well lead to undefined behavior ranging from an infinite loop to overkill memory usage.

Note finally that this function will also work with DAG forests (sets of disconnected DAGs living in the same graph instance).

```js
import {willCreateCycle} from 'graphology-dag';
// Alternatively, to load only the relevant code:
import willCreateCycle from 'graphology-dag/will-create-cycle';

const graph = new DirectedGraph();
graph.mergeEdge(0, 1);
graph.mergeEdge(1, 2);
graph.mergeEdge(2, 3);

willCreateCycle(graph, 3, 0);
>>> true
willCreateCycle(graph, 0, 2);
>>> false
```

