# Graphology Bipartite

Functions related to bipartite graphs and to be used with [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-bipartite
```

## Usage

- [isBypartiteBy](#isbypartiteby)

### isBypartiteBy

Returns whether the given graph is bipartite according to the given partition scheme.

```js
import {isBypartiteBy} from 'graphology-bipartite';
// Alternatively, to load only the relevant code:
import isBypartiteBy from 'graphology-bipartite/is-bipartite-by';

// Wrt some node attribute:
isBipartiteBy(graph, 'category');

// Using some getter function:
isBipartiteBy(graph, (node, attr) => externalIndex[node].category);
```

_Arguments_

- **graph** _Graph_: target graph.
- **getNodePartition** _string\|function_: node attribute name or getter function taking a node entry (node, attributes) and returning this node's partition.
