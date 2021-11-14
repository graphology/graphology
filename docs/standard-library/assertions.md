---
layout: default
title: assertions
nav_order: 0
parent: Standard library
aux_links:
  "Library directory": "https://github.com/graphology/graphology/tree/master/src/assertions"
  "Changelog": "https://github.com/graphology/graphology/tree/master/src/assertions/CHANGELOG.md"
---

# Graphology Assertions

Assertions to be used with [`graphology`](..).

## Installation

```
npm install graphology-assertions
```

## Usage

- [#.isGraph](#isgraph)
- [#.isGraphConstructor](#isgraphconstructor)
- [#.haveSameNodes](#hassamenodes)
- [#.haveSameNodesDeep](#hassamenodesdeep)
- [#.areSameGraphs](#issamegraph)
- [#.areSameGraphsDeep](#issamegraphdeep)
- [#.haveSameEdges](#havesameedges)
- [#.haveSameEdgesDeep](#havesameedgesdeep)

### #.isGraph

Function returning whether the given value is a `graphology` implementation's instance.

```js
import {isGraph} from 'graphology-assertions';

const graph = new Graph();

isGraph(graph);
>>> true

isGraph(45);
>>> false

isGraph({hello: 'world'});
>>> false
```

_Arguments_

- **value** _any_: value to test.

### #.isGraphConstructor

Function returning whether the given value is a `graphology` constructor.

```js
import {isGraphConstructor} from 'graphology-assertions';

isGraphConstructor(Graph);
>>> true

isGraphConstructor(45);
>>> false

isGraphConstructor(new Graph());
>>> false
```

_Arguments_

- **value** _any_: value to test.

### #.haveSameNodes

Returns whether two graphs have the same nodes.

```js
import {haveSameNodes} from 'graphology-assertions';

haveSameNodes(G, H);
```

### #.haveSameNodesDeep

Returns whether two graphs have the same nodes & whether those nodes have the same attributes.

```js
import {haveSameNodesDeep} from 'graphology-assertions';

haveSameNodesDeep(G, H);
```

### #.areSameGraphs

Returns whether two graphs are the same.

```js
import {areSameGraphs} from 'graphology-assertions';

areSameGraphs(G, H);
```

### #.areSameGraphsDeep

Returns whether two graphs as well as their node & edge attributes are the same.

```js
import {areSameGraphsDeep} from 'graphology-assertions';

areSameGraphsDeep(G, H);
```

### #.haveSameEdges

Returns whether two graphs have the same edges. Note that it implies that both graphs' nodes are also the same.

This is different than [areSameGraphs](#aresamegraphs) because it will allow different graph types to be compared, e.g. a mixed graph and a directed one having the same edges nonetheless.

```js
import {haveSameEdges} from 'graphology-assertions';

haveSameEdges(G, H);
```

### #.haveSameEdgesDeep

Returns whether two graphs have the same edges & whether those edges have the same attributes. Note that it implies that both graphs' nodes are also the same.

This is different than [areSameGraphsDeep](#aresamegraphsdeep) because it will allow different graph types to be compared, e.g. a mixed graph and a directed one having the same edges nonetheless.

```js
import {haveSameEdgesDeep} from 'graphology-assertions';

haveSameEdgesDeep(G, H);
```

