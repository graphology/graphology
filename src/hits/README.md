[![Build Status](https://travis-ci.org/graphology/graphology-hits.svg)](https://travis-ci.org/graphology/graphology-hits)

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

* **graph** *Graph*: target graph.
* **options** *?object*: options:
  * **attributes** *?object*: attributes' names:
    * **weight** *?string* [`weight`]: name of the edges' weight attribute.
    * **hub** *?string* [`hub`]: name of the node attribute holding hub information.
    * **authority** *?string* [`authority`]: name of the node attribute holding authority information. 
  * **maxIterations** *?number* [`100`]: maximum number of iterations to perform.
  * **normalize** *?boolean* [`true`]: should the result be normalized by the sum of values.
  * **tolerance** *?number* [`1.e-8`]: convergence error tolerance.
