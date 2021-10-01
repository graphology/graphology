[![Build Status](https://travis-ci.org/graphology/graphology-shortest-path.svg)](https://travis-ci.org/graphology/graphology-shortest-path)

# Graphology Shortest Path

Shortest path functions for [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-shortest-path
```

## Usage

* [Unweighted](#unweighted)
  - [shortestPath](#shortestpath)
  - [bidirectional](#bidirectional)
  - [singleSource](#singlesource)
  - [singleSourceLength](#singlesourcelength)
  - [undirectedSingleSourceLength](#undirectedsinglesourcelength)
  - [brandes](#brandes)
* [Dijkstra](#dijkstra)
  - [bidirectional](#dijkstra-bidirectional)
  - [singleSource](#dijkstra-singlesource)
  - [brandes](#dijkstra-brandes)

## Unweighted

### shortestPath

Returns the shortest path in the graph between source & target or `null` if such a path does not exist (same as [bidirectional](#bidirectional)).

If you only pass the source & omit the target, will return a map of every shortest path between the source & all the nodes of the graph (same as [singleSource](#singlesource)).

```js
import shortestPath from 'graphology-shortest-path';
// Alternatively, if you want to load only the relevant code
import shortestPath from 'graphology-shortest-path/unweighted';

// Returning the shortest path between source & target
const path = shortestPath(graph, source, target);

// Returning every shortest path between source & every node of the graph
const paths = shortestPath(graph, source);
```

*Arguments*

* **graph** *Graph*: a `graphology` instance.
* **source** *any*: source node.
* **target** *?any*: optionally, target node.

### bidirectional

Returns the shortest path in the graph between source & target or `null` if such a path does not exist.

```js
import {bidirectional} from 'graphology-shortest-path';
// Alternatively, if you want to load only the relevant code
import {bidirectional} from 'graphology-shortest-path/unweighted';

// Returning the shortest path between source & target
const path = bidirectional(graph, source, target);
```

*Arguments*

* **graph** *Graph*: a `graphology` instance.
* **source** *any*: source node.
* **target** *any*: target node.

### singleSource

Return a map of every shortest path between the given source & all the nodes of the graph.

```js
import {singleSource} from 'graphology-shortest-path';
// Alternatively, if you want to load only the relevant code
import {singleSource} from 'graphology-shortest-path/unweighted';

// Returning every shortest path between source & every node of the graph
const paths = singleSource(graph, source);
```

*Arguments*

* **graph** *Graph*: a `graphology` instance.
* **source** *any*: source node.

### singleSourceLength

Return a map of every shortest path length between the given source & all the nodes of the graph.

```js
import {singleSourceLength} from 'graphology-shortest-path';
// Alternatively, if you want to load only the relevant code
import {singleSourceLength} from 'graphology-shortest-path/unweighted';

// Returning every shortest path between source & every node of the graph
const paths = singleSourceLength(graph, source);
```

*Arguments*

* **graph** *Graph*: a `graphology` instance.
* **source** *any*: source node.

### undirectedSingleSourceLength

Return a map of every shortest path length between the given source & all the nodes of the graph. This is basically the same as [singleSourceLength](#singlesourcelength) except that it will consider any given graph as undirected when traversing.

```js
import {undirectedSingleSourceLength} from 'graphology-shortest-path';
// Alternatively, if you want to load only the relevant code
import {undirectedSingleSourceLength} from 'graphology-shortest-path/unweighted';

// Returning every shortest path between source & every node of the graph
const paths = undirectedSingleSourceLength(graph, source);
```

*Arguments*

* **graph** *Graph*: a `graphology` instance.
* **source** *any*: source node.

### brandes

Apply Ulrik Brandes' method to collect single source shortest paths from the given node. This is mostly used to compute betweenness centrality.

```js
import {brandes} from 'graphology-shortest-path';
// Alternatively, if you want to load only the relevant code
import {brandes} from 'graphology-shortest-path/unweighted';

// Returning S, P & sigma
const [S, P, sigma] = brandes(graph, source);
```

*Arguments*

* **graph** *Graph*: a `graphology` instance.
* **source** *any*: source node.

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
const paths = dijkstra.bidirectional(graph, source, target, 'customWeight');
```

*Arguments*

* **graph** *Graph*: a `graphology` instance.
* **source** *any*: source node.
* **target** *any*: target node.
* **weightAttribute** *?string* [`weight`]: name of the weight attribute.

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
```

*Arguments*

* **graph** *Graph*: a `graphology` instance.
* **source** *any*: source node.
* **weightAttribute** *?string* [`weight`]: name of the weight attribute.

<h3 id="dijkstra-brandes">brandes</h3>

Apply Ulrik Brandes' method to collect single source shortest paths from the given node. This is mostly used to compute betweenness centrality.

```js
import {dijkstra} from 'graphology-shortest-path';
// Alternatively, if you want to load only the relevant code
import dijkstra from 'graphology-shortest-path/dijkstra';

// Returning S, P & sigma
const [S, P, sigma] = dijkstra.brandes(graph, source);

// If you store edges' weight in custom attribute
const [S, P, sigma] = dijkstra.brandes(graph, source, 'customWeight');
```

*Arguments*

* **graph** *Graph*: a `graphology` instance.
* **source** *any*: source node.
* **weightAttribute** *?string* [`weight`]: name of the weight attribute.
