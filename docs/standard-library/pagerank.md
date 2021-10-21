---
layout: default
title: pagerank
nav_order: 14
parent: Standard library
---

# Graphology Pagerank Algorithm

Pagerank algorithm for [`graphology`](..).

## Installation

```
npm install graphology-pagerank
```

## Usage

```js
import pagerank from 'graphology-pagerank';

// To compute pagerank and return the score per node:
const p = pagerank(graph);

// To directly map the result to nodes' attributes:
pagerank.assign(graph);

// Note that you can also pass options to customize the algorithm:
const p = pagerank(graph, {alpha: 0.9, weighted: false});
```

## Arguments

- **graph** _Graph_: target graph.
- **options** <span class="code">?object</span>: options:
  - **attributes** <span class="code">?object</span>: attributes' names:
    - **pagerank** <span class="code">?string</span> <span class="default">pagerank</span>: name of the node attribute that will be assigned the pagerank score.
    - **weight** <span class="code">?string</span> <span class="default">weight</span>: name of the edges' weight attribute.
  - **alpha** <span class="code">?number</span> <span class="default">0.85</span>: damping parameter of the algorithm.
  - **maxIterations** <span class="code">?number</span> <span class="default">100</span>: maximum number of iterations to perform.
  - **tolerance** <span class="code">?number</span> <span class="default">1.e-6</span>: convergence error tolerance.
  - **weighted** <span class="code">?boolean</span> <span class="default">false</span>: whether to use available weights or not.

