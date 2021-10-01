[![Build Status](https://travis-ci.org/graphology/graphology-pagerank.svg)](https://travis-ci.org/graphology/graphology-pagerank)

# Graphology Pagerank Algorithm

Pagerank algorithm for [`graphology`](https://graphology.github.io).

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
const p = pagerank(graph, {alpha: 0.9, weighted: false})
```

## Arguments

* **graph** *Graph*: target graph.
* **options** *?object*: options:
  * **attributes** *?object*: attributes' names:
    * **pagerank** *?string* [`pagerank`]: name of the node attribute that will be assigned the pagerank score.
    * **weight** *?string* [`weight`]: name of the edges' weight attribute. 
  * **alpha** *?number* [`0.85`]: damping parameter of the algorithm.
  * **maxIterations** *?number* [`100`]: maximum number of iterations to perform.
  * **tolerance** *?number* [`1.e-6`]: convergence error tolerance.
  * **weighted** *?boolean* [`false`]: whether to use available weights or not.

