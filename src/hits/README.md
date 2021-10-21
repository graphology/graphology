# Graphology HITS

HITS algorithm to be used with [`graphology`](https://graphology.github.io).

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
- **options** _?object_: options:
  - **attributes** _?object_: attributes' names:
    - **weight** _?string_ [`weight`]: name of the edges' weight attribute.
    - **hub** _?string_ [`hub`]: name of the node attribute holding hub information.
    - **authority** _?string_ [`authority`]: name of the node attribute holding authority information.
  - **maxIterations** _?number_ [`100`]: maximum number of iterations to perform.
  - **normalize** _?boolean_ [`true`]: should the result be normalized by the sum of values.
  - **tolerance** _?number_ [`1.e-8`]: convergence error tolerance.
