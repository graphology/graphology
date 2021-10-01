[![Build Status](https://travis-ci.org/graphology/graphology-generators.svg)](https://travis-ci.org/graphology/graphology-generators)

# Graphology Generators

Various graph generators to be used with [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-generators
```

## Usage

* [Classic graphs](#classic-graphs)
  - [Complete](#complete)
  - [Empty](#empty)
  - [Ladder](#ladder)
  - [Path](#path)
* [Community graphs](#community-graphs)
  - [Caveman](#caveman)
  - [Connected Caveman](#connected-caveman)
* [Random graphs](#random-graphs)
  - [Clusters](#clusters)
  - [Erdos-Renyi](#erdos-renyi)
  - [Girvan-Newman](#girvan-newman)
* [Small graphs](#small-graphs)
  - [Krackhardt Kite](#krackhardt-kite)
* [Social graphs](#social-graphs)
  - [Florentine Families](#florentine-families)
  - [Karate Club](#karate-club)

### Classic graphs

#### Complete

Creates a [complete](https://en.wikipedia.org/wiki/Complete_graph) graph. 

```js
import Graph, {UndirectedGraph} from 'graphology';
import {complete} from 'graphology-generators/classic';
// Alternatively, if you only want to load relevant code
import complete from 'graphology-generators/classic/complete';

// Creating a complete graph
const graph = complete(Graph, 10);

// Using another constuctor to create, say, a complete undirected graph
const graph = complete(UndirectedGraph, 10);
```

**Arguments**

* **constructor** *Class*: a `graphology` constructor.
* **order** *number*: number of nodes in the generated graph.

#### Empty

Creates an empty graph with the desired number of nodes and no edges.

```js
import Graph, {UndirectedGraph} from 'graphology';
import {empty} from 'graphology-generators/classic';
// Alternatively, if you only want to load relevant code
import empty from 'graphology-generators/classic/empty';

// Creating an empty graph
const graph = empty(Graph, 10);

// Using another constuctor to create, say, an empty undirected graph
const graph = empty(UndirectedGraph, 10);
```

**Arguments**

* **constructor** *Class*: a `graphology` constructor.
* **order** *number*: number of nodes in the generated graph.

#### Ladder

Creates a ladder graph with the desired length. Note that the generated graph will logically have twice the number of nodes.

```js
import Graph, {UndirectedGraph} from 'graphology';
import {ladder} from 'graphology-generators/classic';
// Alternatively, if you only want to load relevant code
import ladder from 'graphology-generators/classic/ladder';

// Creating a ladder graph
const graph = ladder(Graph, 10);

// Using another constuctor to create, say, a undirected ladder graph
const graph = ladder(UndirectedGraph, 10);
```

**Arguments**

* **constructor** *Class*: a `graphology` constructor.
* **length** *number*: length of the ladder.

#### Path

Creates a path graph. 

```js
import Graph, {UndirectedGraph} from 'graphology';
import {path} from 'graphology-generators/classic';
// Alternatively, if you only want to load relevant code
import path from 'graphology-generators/classic/path';

// Creating a path graph
const graph = path(Graph, 10);

// Using another constuctor to create, say, a path undirected graph
const graph = path(UndirectedGraph, 10);
```

**Arguments**

* **constructor** *Class*: a `graphology` constructor.
* **order** *number*: number of nodes in the generated graph.

### Community graphs

#### Caveman

Creates a Caveman graph containing `l` components of `k` nodes.

```js
import Graph, {UndirectedGraph} from 'graphology';
import {caveman} from 'graphology-generators/community';
// Alternatively, if you only want to load relevant code
import caveman from 'graphology-generators/community/caveman';

// Creating a caveman graph
const graph = caveman(Graph, 6, 8);
```

**Arguments**

* **constructor** *Class*: a `graphology` constructor.
* **l** *number*: number of components in the graph.
* **k** *number*: number of nodes of the components.

#### Connected Caveman

Creates a Connected Caveman graph containing `l` components of `k` nodes.

```js
import Graph, {UndirectedGraph} from 'graphology';
import {connectedCaveman} from 'graphology-generators/community';
// Alternatively, if you only want to load relevant code
import connectedCaveman from 'graphology-generators/community/connected-caveman';

// Creating a connected caveman graph
const graph = connectedCaveman(Graph, 6, 8);
```

**Arguments**

* **constructor** *Class*: a `graphology` constructor.
* **l** *number*: number of components in the graph.
* **k** *number*: number of nodes of the components.

### Random graphs

#### Clusters

Creates a graph with the desired number of nodes & edges and having a given number of clusters.

```js
import Graph from 'graphology';
import {clusters} from 'graphology-generators/random';
// Alternatively, if you only want to load relevant code
import clusters from 'graphology-generators/random/clusters';

// Creating a random clustered graph
const graph = clusters(Graph, {
  order: 100,
  size: 1000,
  clusters: 5
});
```

**Arguments**

* **constructor** *Class*: a `graphology` constructor.
* **options** *object*: options:
  - **order** *number*: number of nodes of the generated graph.
  - **size** *number*: number of edges of the generated graph.
  - **clusters** *number*: number of clusters of the generated graph.
  - **clusterDensity** *?number* [`0.5`]: Probability that an edge will link two nodes of the same cluster.
  - **rng** *?function*: custom RNG function.

#### Erdos-Renyi

Creates an [Erdos-Renyi](https://en.wikipedia.org/wiki/Erd%C5%91s%E2%80%93R%C3%A9nyi_model), or binomial graph.

```js
import Graph from 'graphology';
import {erdosRenyi} from 'graphology-generators/random';
// Alternatively, if you only want to load relevant code
import erdosRenyi from 'graphology-generators/random/erdos-renyi';

// Creating a binomial graph
const graph = erdosRenyi(Graph, {order: 10, probability: 0.5});

// If your graph is sparse (low probability), you can use the `sparse` version
// which runs in O(m + n) rather than O(n^2)
const graph = erdosRenyi.sparse(Graph, {order: 1000, probability: 0.1});
```

**Arguments**

* **constructor** *Class*: a `graphology` constructor.
* **options** *object*: options:
  - **order** *number*: number of nodes of the generated graph.
  - **probability** *number*: probability for edge creation. (i.e. density you try to approximate in the generated graph).
  - **approximateSize**: alternatively, you can pass an approximate number of edges you are trying to get in the generated graph.
  - **rng** *?function*: custom RNG function.

#### Girvan-Newman

Creates a [Girvan-Newman](http://www.pnas.org/content/99/12/7821.full.pdf) random graph as described in:

> Community Structure in  social and biological networks. Girvan Newman, 2002. PNAS June, vol 99 n 12

```js
import Graph from 'graphology';
import {girvanNewman} from 'graphology-generators/random';
// Alternatively, if you only want to load relevant code
import girvanNewman from 'graphology-generators/random/girvan-newman';

// Creating a binomial graph
const graph = girvanNewman(Graph, {zOut: 4});
```

**Arguments**

* **constructor** *Class*: a `graphology` constructor.
* **options** *object*: options:
  - **zOut** *number*: *zout* parameter.
  - **rng** *?function*: custom RNG function.

### Small graphs

#### Krackhardt kite

Returns the [Krackhardt kite](https://en.wikipedia.org/wiki/Krackhardt_kite_graph) graph.

```js
import Graph from 'graphology';
import {krackhardtKite} from 'graphology-generators/small';
// Alternatively, if you only want to load relevant code
import krackhardtKite from 'graphology-generators/small/krackhardt-kite';

// Creating a random clustered graph
const graph = krackhardtKite(Graph);
```

**Arguments**

* **constructor** *Class*: a `graphology` constructor.

### Social graphs

#### Florentine Families

Returns the Florentine families' graph.

```js
import Graph from 'graphology';
import {florentineFamilies} from 'graphology-generators/florentine-families';
// Alternatively, if you only want to load relevant code
import florentineFamilies from 'graphology-generators/social/florentine-families';

// Generating the graph
const graph = florentineFamilies(Graph);
```

**Arguments**

* **constructor** *Class*: a `graphology` constructor.

#### Karate Club

Returns [Zachary's karate club](https://en.wikipedia.org/wiki/Zachary%27s_karate_club) graph.

```js
import Graph from 'graphology';
import {karateClub} from 'graphology-generators/karate-club';
// Alternatively, if you only want to load relevant code
import karateClub from 'graphology-generators/social/karate-club';

// Generating the graph
const graph = karateClub(Graph);
```

**Arguments**

* **constructor** *Class*: a `graphology` constructor.
