---
layout: default
title: hits
nav_order: 7
parent: Standard library
---

# Graphology HITS

HITS algorithm to be used with [`graphology`](..).

## Installation

```
npm install graphology-hits
```

## Usage

```js
import hits from 'graphology-hits';

// To compute and return the result as 'hubs' & 'authorities':
const {hubs, authorities} = hits(graph);

// To directly map the result to nodes' attributes:
hits.assign(graph);

// Note that you can also pass options to customize the algorithm:
const {hubs, authorities} = hits(graph, {normalize: false});
```

## Arguments

- **graph** _Graph_: target graph.
- **options** <span class="code">?object</span>: options:
  - **attributes** <span class="code">?object</span>: attributes' names:
    - **weight** <span class="code">?string</span> <span class="default">weight</span>: name of the edges' weight attribute.
    - **hub** <span class="code">?string</span> <span class="default">hub</span>: name of the node attribute holding hub information.
    - **authority** <span class="code">?string</span> <span class="default">authority</span>: name of the node attribute holding authority information.
  - **maxIterations** <span class="code">?number</span> <span class="default">100</span>: maximum number of iterations to perform.
  - **normalize** <span class="code">?boolean</span> <span class="default">true</span>: should the result be normalized by the sum of values.
  - **tolerance** <span class="code">?number</span> <span class="default">1.e-8</span>: convergence error tolerance.

