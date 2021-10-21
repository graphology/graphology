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
const p = pagerank(graph, {alpha: 0.9, weighted: false});
```

## Arguments

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **attributes** _?object_: attributes' names:
    - **pagerank** _?string_ [`pagerank`]: name of the node attribute that will be assigned the pagerank score.
    - **weight** _?string_ [`weight`]: name of the edges' weight attribute.
  - **alpha** _?number_ [`0.85`]: damping parameter of the algorithm.
  - **maxIterations** _?number_ [`100`]: maximum number of iterations to perform.
  - **tolerance** _?number_ [`1.e-6`]: convergence error tolerance.
  - **weighted** _?boolean_ [`false`]: whether to use available weights or not.
