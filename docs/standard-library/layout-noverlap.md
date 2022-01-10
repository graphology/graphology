---
layout: default
title: layout-noverlap
nav_order: 13
parent: Standard library
aux_links:
  "Library directory": "https://github.com/graphology/graphology/tree/master/src/layout-noverlap"
  "Changelog": "https://github.com/graphology/graphology/tree/master/src/layout-noverlap/CHANGELOG.md"
---

# Graphology Noverlap

JavaScript implementation of the Noverlap anti-collision layout algorithm for [graphology](..).

Note that this algorithm is iterative and might not converge easily in some cases.

## Installation

```
npm install graphology-layout-noverlap
```

## Usage

- [Pre-requisite](#pre-requisite)
- [Settings](#settings)
- [Synchronous layout](#synchronous-layout)
- [Webworker](#webworker)

### Pre-requisites

Each node's starting position must be set before running the Noverlap anti-collision layout. Two attributes called `x` and `y` must therefore be defined for all the graph nodes.

### Settings

- **gridSize** <span class="code">?number</span> <span class="default">20</span>: number of grid cells horizontally and vertically subdivising the graph's space. This is used as an optimization scheme. Set it to `1` and you will have `O(n²)` time complexity, which can sometimes perform better with very few nodes.
- **margin** <span class="code">?number</span> <span class="default">5</span>: margin to keep between nodes.
- **expansion** <span class="code">?number</span> <span class="default">1.1</span>: percentage of current space that nodes could attempt to move outside of.
- **ratio** <span class="code">?number</span> <span class="default">1.0</span>: ratio scaling node sizes.
- **speed** <span class="code">?number</span> <span class="default">3</span>: dampening factor that will slow down node movements to ease the overall process.

### Synchronous layout

```js
import noverlap from 'graphology-layout-noverlap';

const positions = noverlap(graph, {maxIterations: 50});

// With settings:
const positions = noverlap(graph, {
  maxIterations: 50,
  settings: {
    ratio: 2
  }
});

// With a custom input reducer
const positions = noverlap(graph, {
  inputReducer: (key, attr) => ({
    x: store[key].x,
    y: store[key].y,
    size: attr.size
  }),
  outputReducer: (key, pos) => ({x: pos.x * 10, y: pos.y * 10})
});

// To directly assign the positions to the nodes:
noverlap.assign(graph);
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _object_: options:
  - **maxIterations** <span class="code">?number</span> <span class="default">500</span>: maximum number of iterations to perform before stopping. Note that the algorithm will also stop as soon as converged.
  - **inputReducer** <span class="code">?function</span>: a function reducing each node attributes. This can be useful if the rendered positions/sizes of your graph are stored outside of the graph's data. This is the case when using sigma.js for instance.
  - **outputReducer** <span class="code">?function</span>: a function reducing node positions as computed by the layout algorithm. This can be useful to map back to a previous coordinates system. This is the case when using sigma.js for instance.
  - **settings** <span class="code">?object</span>: the layout's settings (see [#settings](#settings)).

### Webworker

If you need to run the layout's computation in a web worker, the library comes with a utility to do so:

_Example_

```js
import NoverlapLayout from 'graphology-layout-noverlap/worker';

const layout = new NoverlapLayout(graph, params);

// To start the layout. It will automatically stop when converged
layout.start();

// To stop the layout
layout.stop();

// To kill the layout and release attached memory
layout.kill();

// Assess whether the layout is currently running
layout.isRunning();
```

