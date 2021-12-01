---
layout: default
title: components
nav_order: 4
parent: Standard library
aux_links:
  "Library directory": "https://github.com/graphology/graphology/tree/master/src/components"
  "Changelog": "https://github.com/graphology/graphology/tree/master/src/components/CHANGELOG.md"
---

# Graphology Components

Connected components for [`graphology`](..).

## Installation

```
npm install graphology-components
```

## Usage

- [forEachConnectedComponent](#foreachconnectedcomponent)
- [forEachConnectedComponentOrder](#foreachconnectedcomponentorder)
- [countConnectedComponents](#countconnectedcomponents)
- [connectedComponents](#connectedcomponents)
- [largestConnectedComponent](#largestconnectedcomponent)
- [largestConnectedComponentSubgraph](#largestconnectedcomponentsubgraph)
- [cropToLargestConnectedComponent](#cropToLargestConnectedComponent)
- [stronglyConnectedComponents](#stronglyconnectedcomponents)

### forEachConnectedComponent

Iterates over the connected components of the given graph using a callback.

```js
import {forEachConnectedComponent} from 'graphology-components';

forEachConnectedComponent(graph, component => {
  console.log(component);
});
```

### forEachConnectedComponentOrder

Specialized version of [forEachConnectedComponent](#foreachconnectedcomponent) that iterates over the connected component orders, i.e. the number of nodes they contain.

It consumes less memory than a naive approach mapping the component lengths using `forEachConnectedComponent`.

```js
import {forEachConnectedComponentOrder} from 'graphology-components';

forEachConnectedComponentOrder(graph, order => {
  console.log(order);
});
```

### countConnectedComponents

Returns the number of connected components of the given graph.

```js
import {countConnectedComponents} from 'graphology-components';

const count = countConnectedComponents(graph);
```

### connectedComponents

Returns the list of connected components of the given graph.

```js
import {connectedComponents} from 'graphology-components';

const components = connectedComponents(graph);
```

If your graph is mixed or directed, the result will be what are usually called **weakly connected components**.

### largestConnectedComponent

Returns the largest connected component of the given graph.

```js
import {largestConnectedComponent} from 'graphology-components';

const largest = largestConnectedComponent(graph);
```

### largestConnectedComponentSubgraph

Returns a subgraph of the largest connected component of the given graph.

```js
import {largestConnectedComponentSubgraph} from 'graphology-components';

const subgraph = largestConnectedComponentSubgraph(graph);
```

### cropToLargestConnectedComponent

Mutates the given graph to remove nodes and edges that are not part of its largest connected component.

```js
import {cropToLargestConnectedComponent} from 'graphology-components';

cropToLargestConnectedComponent(graph);
```

### stronglyConnectedComponents

Returns the list of strongly connected components of the given graph. (mixed or directed)

```js
import {stronglyConnectedComponents} from 'graphology-components';

const components = stronglyConnectedComponents(graph);
```

