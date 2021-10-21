# Graphology Assertions

Assertions to be used with [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-assertions
```

## Usage

- [#.isGraph](#isgraph)
- [#.isGraphConstructor](#isgraphconstructor)
- [#.sameNodes](#samenodes)
- [#.sameNodesDeep](#samenodesdeep)

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

### #.sameNodes

Returns whether two graphs have the same nodes.

```js
import {sameNodes} from 'graphology-assertions';

sameNodes(G, H);
```

### #.sameNodesDeep

Returns whether two graphs have the same nodes & whether those nodes have the same attributes.

```js
import {sameNodesDeep} from 'graphology-assertions';

sameNodesDeep(G, H);
```
