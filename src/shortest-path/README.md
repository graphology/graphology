# Graphology Shortest Path

Shortest path functions for [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-shortest-path
```

## Usage

- [Unweighted](#unweighted)
  - [bidirectional](#bidirectional)
  - [singleSource](#singlesource)
  - [singleSourceLength](#singlesourcelength)
  - [undirectedSingleSourceLength](#undirectedsinglesourcelength)
- [Dijkstra](#dijkstra)
  - [bidirectional](#dijkstra-bidirectional)
  - [singleSource](#dijkstra-singlesource)
- [A-star](#a-star)
  - [bidirectional](#astar-bidirectional)
- [Utilities](#utilities)
  - [edgePathFromNodePath](#edgepathfromnodepath)

## Unweighted

### bidirectional

Returns the shortest path in the graph between source & target or `null` if such a path does not exist.

```js
import {bidirectional} from 'graphology-shortest-path';
// Alternatively, if you want to load only the relevant code
import {bidirectional} from 'graphology-shortest-path/unweighted';

// Returning the shortest path between source & target
const path = bidirectional(graph, source, target);
```

_Arguments_

- **graph** _Graph_: a `graphology` instance.
- **source** _any_: source node.
- **target** _any_: target node.

### singleSource

Return a map of every shortest path between the given source & all the nodes of the graph.

```js
import {singleSource} from 'graphology-shortest-path';
// Alternatively, if you want to load only the relevant code
import {singleSource} from 'graphology-shortest-path/unweighted';

// Returning every shortest path between source & every node of the graph
const paths = singleSource(graph, source);
```

_Arguments_

- **graph** _Graph_: a `graphology` instance.
- **source** _any_: source node.

### singleSourceLength

Return a map of every shortest path length between the given source & all the nodes of the graph.

```js
import {singleSourceLength} from 'graphology-shortest-path';
// Alternatively, if you want to load only the relevant code
import {singleSourceLength} from 'graphology-shortest-path/unweighted';

// Returning every shortest path between source & every node of the graph
const paths = singleSourceLength(graph, source);
```

_Arguments_

- **graph** _Graph_: a `graphology` instance.
- **source** _any_: source node.

### undirectedSingleSourceLength

Return a map of every shortest path length between the given source & all the nodes of the graph. This is basically the same as [singleSourceLength](#singlesourcelength) except that it will consider any given graph as undirected when traversing.

```js
import {undirectedSingleSourceLength} from 'graphology-shortest-path';
// Alternatively, if you want to load only the relevant code
import {undirectedSingleSourceLength} from 'graphology-shortest-path/unweighted';

// Returning every shortest path between source & every node of the graph
const paths = undirectedSingleSourceLength(graph, source);
```

_Arguments_

- **graph** _Graph_: a `graphology` instance.
- **source** _any_: source node.

## Dijkstra

<h3 id="dijkstra-bidirectional">bidirectional</h3>

Returns the shortest path in the weighted graph between source & target or `null` if such a path does not exist.

```js
import {dijkstra} from 'graphology-shortest-path';
// Alternatively, if you want to load only the relevant code
import dijkstra from 'graphology-shortest-path/dijkstra';

// Returning the shortest path between source & target
const path = dijkstra.bidirectional(graph, source, target);

// If you store edges' weight in custom attribute
const path = dijkstra.bidirectional(graph, source, target, 'customWeight');

// Using a custom weight getter function
const path = dijkstra.bidirectional(
  graph,
  source,
  target,
  (_, attr) => attr.importance
);
```

_Arguments_

- **graph** _Graph_: a `graphology` instance.
- **source** _any_: source node.
- **target** _any_: target node.
- **getEdgeWeight** _?string\|function_ [`weight`]: name of the weight attribute or getter function.

<h3 id="dijkstra-singlesource">singleSource</h3>

Return a map of every shortest path between the given source & all the nodes of the weighted graph.

```js
import {dijkstra} from 'graphology-shortest-path';
// Alternatively, if you want to load only the relevant code
import dijkstra from 'graphology-shortest-path/dijkstra';

// Returning every shortest path between source & every node of the graph
const paths = dijkstra.singleSource(graph, source);

// If you store edges' weight in custom attribute
const paths = dijkstra.singleSource(graph, source, 'customWeight');

// Using a custom weight getter function
const path = dijkstra.singleSource(graph, source, (_, attr) => attr.importance);
```

_Arguments_

- **graph** _Graph_: a `graphology` instance.
- **source** _any_: source node.
- **getEdgeWeight** _?string\|function_ [`weight`]: name of the weight attribute or getter function.

## A-star

<h3 id="astar-bidirectional">bidirectional</h3>

Returns the shortest path in the weighted graph between source & target or `null` if such a path does not exist.

```js
import {astar} from 'graphology-shortest-path';
// Alternatively, if you want to load only the relevant code
import astar from 'graphology-shortest-path/astar';

// Returning the shortest path between source & target
const path = astar.bidirectional(
  graph,
  source,
  target,
  (_, attr) => attr.importance
  (node, finalTarget) => euclideanDistance(points[node], points[finalTarget])
);
```

_Arguments_

- **graph** _Graph_: a `graphology` instance.
- **source** _any_: source node.
- **target** _any_: target node.
- **getEdgeWeight** _?string\|function_ [`weight`]: name of the weight attribute or getter function.
- **heuristic** _?function_: heuristic function to compute distance between current node and final target.

## Utilities

### edgePathFromNodePath

Helper function that can convert a node path to an edge path.

```js
import {edgePathFromNodePath} from 'graphology-shortest-path';
// Alternatively, if you want to load only the relevant code
import {edgePathFromNodePath} from 'graphology-shortest-path/utils';

const edgePath = edgePathFromNodePath(graph, nodePath);
```

_Arguments_

- **graph** _Graph_: a `graphology` instance.
- **nodePath** _Array_: node path to convert.
