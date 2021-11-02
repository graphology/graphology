# Graphology Assertions

Assertions to be used with [`graphology`](https://graphology.github.io).

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
