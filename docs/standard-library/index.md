---
layout: default
title: Standard library
nav_order: 1
has_children: true
has_toc: false
---

# Standard library

* [assertions](./assertions): *Miscellaneous assertions (same nodes, same edges etc.).*
* [canvas](./canvas): *Canvas rendering routines for graphs.*
* [communities-louvain](./communities-louvain): *Louvain method for community detection.*
* [components](./components): *Connected components (strong, weak etc.).*
* [generators](./generators): *Graph generators (random graphs, complete graphs etc.).*
* [gexf](./gexf): *Parsers & writers for the GEXF file format.*
* [graphml](./graphml): *Parsers & writers for the GRAPHML file format.*
* [hits](./hits): *HITS algorithm.*
* [indices](./indices): *Various specialized graph indices (neighborhood, louvain etc.)*
* [layout](./layout): *Basic graph layouts (random, circle etc.).*
* [layout-forceatlas2](./layout-forceatlas2): *ForceAtlas2 layout algorithm.*
* [layout-noverlap](./layout-noverlap): *Noverlap anti-collision layout algorithm.*
* [metrics](./metrics): *Modularity, density, centrality etc.*
* [operators](./operators): *Graph unary, binary & cast operators (reverse, union, intersection, conversion etc.)*
* [pagerank](./pagerank): *Pagerank algorithm.*
* [shortest-path](./shortest-path): *Shortest path functions (Dijkstra, A&ast; etc.)*
* [simple-path](./simple-path): *Simple path related functions (e.g. all paths between source & target)*
* [svg](./svg): *SVG export for graphs.*
* [traversal](./traversal): *Traversal functions (DFS, BFS, etc.)*
* [utils](./utils): *Miscellaneous utils used by most of the other modules.*

## Installation

Any of the above packages can be installed through npm likewise (just change the name to
the desired package):

```
npm install graphology-metrics
```

For convenience, an aggregated package called `graphology-library` also exists
and depends on all the listed packages at once for convenience (albeit maybe
a little bit more complicated to optimize through tree-shaking).

You can install it thusly:

```
npm install graphology-library
```

If you do so, here is how to access the required packages:

```js
// Importing a sub package
import * as metrics from 'graphology-library/metrics';

metrics.density(graph);

// Importing select parts of the library
import {metrics, layout} from 'graphology-library';

// Importing the whole library
import * as lib from 'graphology-library';
```
