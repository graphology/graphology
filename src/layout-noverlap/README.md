# Graphology Noverlap

JavaScript implementation of the Noverlap anti-collision layout algorithm for [graphology](https://graphology.github.io).

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

- **gridSize** _?number_ [`20`]: number of grid cells horizontally and vertically subdivising the graph's space. This is used as an optimization scheme. Set it to `1` and you will have `O(n²)` time complexity, which can sometimes perform better with very few nodes.
- **margin** _?number_ [`5`]: margin to keep between nodes.
- **expansion** _?number_ [`1.1`]: percentage of current space that nodes could attempt to move outside of.
- **ratio** _?number_ [`1.0`]: ratio scaling node sizes.
- **speed** _?number_ [`3`]: dampening factor that will slow down node movements to ease the overall process.

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
  - **maxIterations** _?number_ [`500`]: maximum number of iterations to perform before stopping. Note that the algorithm will also stop as soon as converged.
  - **inputReducer** _?function_: a function reducing each node attributes. This can be useful if the rendered positions/sizes of your graph are stored outside of the graph's data. This is the case when using sigma.js for instance.
  - **outputReducer** _?function_: a function reducing node positions as computed by the layout algorithm. This can be useful to map back to a previous coordinates system. This is the case when using sigma.js for instance.
  - **settings** _?object_: the layout's settings (see [#settings](#settings)).

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
