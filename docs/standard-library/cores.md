---
layout: default
title: cores
nav_order: 6
parent: Standard library
aux_links:
  "Library directory": "https://github.com/graphology/graphology/tree/master/src/cores"
  
---

# Graphology Cores

Various functions related to k-cores of graphs and to be used with [graphology](..).

The k-core of a graph is the maximal connected subgraph in which all nodes have a degree of k or more. The main core of a graph is the k-core subgraph with the highest possible k.

If the graph is directed, node degrees are considered to be the sum of all the inbound and outbound neighbors of the node.

> An O(m) Algorithm for Cores Decomposition of Networks Vladimir Batagelj and Matjaz Zaversnik, 2003. [https://arxiv.org/abs/cs.DS/0310049](https://arxiv.org/abs/cs.DS/0310049)

> Generalized Cores Vladimir Batagelj and Matjaz Zaversnik, 2002. [https://arxiv.org/pdf/cs/0202039](https://arxiv.org/pdf/cs/0202039)

## Installation

```
npm install graphology-cores
```

## Usage

- [coreNumber](#corenumber)
- [kCore](#kcore)
- [kShell](#kshell)
- [kCrust](#kcrust)
- [kCorona](#kcorona)
- [kTruss](#ktruss)
- [onionLayers](#onionlayers)

### coreNumber

Returns the core number for each node. The core number of a node is the largest k of a k-core subgraph containing this node.

This implementation doesn't allow graphs with parallel edges or self loops.

```js
import coreNumber from 'graphology-cores/coreNumber';

// Return the core number for each node
const numbers = coreNumber(graph);

// Assign to each node its core number
coreNumber.assign(graph);

// Assign with a custom attribute label
coreNumber.assign(graph, 'core');
```

_Arguments_

- **graph** _Graph_: target graph.
- **nodeCoreAttribute** <span class="code">?string</span> : the name of the attribute to use if core numbers are assigned to the nodes.

### kCore

Returns the maximal connected subgraph containing nodes with k degree or more. If k isn't provided, k is the highest core number present in the graph.

```js
import kCore from 'graphology-cores/kCore';

// Return the main k-core of the graph
const core = kCore(graph);

// Return the k-core subgraph with an arbitrary k value
const core = kCore(graph, 4);
```

_Arguments_

- **graph** _Graph_: target graph.
- **k** <span class="code">?number</span>: custom k value to use.
- **customCore** <span class="code">?object</span>: custom core numbers to use.

### kShell

Returns the k-shell subgraph. The k-shell subgraph is the maximal connected subgraph containing the nodes with k degree.

```js
import kShell from 'graphology-cores/kShell';

// Return the main k-shell of the graph
const shell = kShell(graph);

// Return the k-shell subgraph with an arbitrary k value
const shell = kShell(graph, 5);
```

_Arguments_

- **graph** _Graph_: target graph.
- **k** <span class="code">?number</span>: custom k value to use.
- **customCore** <span class="code">?object</span>: custom core numbers to use.

### kCrust

Returns the k-crust subgraph. The k-crust subgraph is the maximal connected subgraph containing nodes with less than k degree.

```js
import kCrust from 'graphology-cores/kCrust';

// Return the main k-crust of the graph
const crust = kCrust(graph);

// Return the k-crust subgraph with an arbitrary k value
const crust = kCrust(graph, 4);
```

_Arguments_

- **graph** _Graph_: target graph.
- **k** <span class="code">?number</span>: custom k value to use.
- **customCore** <span class="code">?object</span>: custom core numbers to use.

### kCorona

Returns the k-corona subgraph. The k-corona subgraph contains nodes in the k-core with exactly k neighbors in the k-core.

```js
import kCorona from 'graphology-cores/kCorona';

// Return the main k-corona of the graph
const corona = kCorona(graph);

// Return the k-corona subgraph with an arbitrary k value
const corona = kCorona(graph, 4);
```

_Arguments_

- **graph** _Graph_: target graph.
- **k** <span class="code">?number</span>: custom k value to use.
- **customCore** <span class="code">?object</span>: custom core numbers to use.

### kTruss

Returns the k-truss subgraph. The k-truss subgraph contains at least three nodes for which every edge is incident to at least `k-2` triangles.

K-Truss is not implemented for directed graphs and multigraphs.

```js
import kTruss from 'graphology-cores/kTruss';

// Return the k-truss of the graph with k = 4
const truss = kTruss(graph, 4);
```

_Arguments_

- **graph** _Graph_: target graph.
- **k** _number_: k value to use.

### onionLayers

Computes the onion decomposition of a given graph. Onion layers can't be calculated if the graph is directed.

> Multi-scale structure and topological anomaly detection via a new network statistic: The onion decomposition L. Hébert-Dufresne, J. A. Grochow, and A. Allard Scientific Reports 6, 31708 (2016) [http://doi.org/10.1038/srep31708](http://doi.org/10.1038/srep31708)

```js
import onionLayers from 'graphology-cores/onionLayers';

// Return the onion layers for each node
const onion = onionLayers(graph);

// Assign to each node its onion layer
onionLayers.assign(graph);

// Assign with a custom attribute label
onionLayers.assign(graph, 'onion');
```

_Arguments_

- **graph** _Graph_: target graph.
- **nodeOnionLayerAttribute** <span class="code">?string</span> : the name of the attribute to use if onion layers are assigned to the nodes.

