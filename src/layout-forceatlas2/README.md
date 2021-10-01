[![Build Status](https://travis-ci.org/graphology/graphology-layout-forceatlas2.svg)](https://travis-ci.org/graphology/graphology-layout-forceatlas2)

# Graphology ForceAtlas2

JavaScript implementation of the [ForceAtlas2](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0098679) algorithm for [graphology](https://graphology.github.io).

## Reference

> Jacomy M, Venturini T, Heymann S, Bastian M (2014) ForceAtlas2, a Continuous Graph Layout Algorithm for Handy Network Visualization Designed for the Gephi Software. PLoS ONE 9(6): e98679. https://doi.org/10.1371/journal.pone.0098679

## Installation

```
npm install graphology-layout-forceatlas2
```

## Usage

* [Pre-requisite](#pre-requisite)
* [Settings](#settings)
* [Synchronous layout](#synchronous-layout)
* [Webworker](#webworker)
* [#.inferSettings](#infersettings)

### Pre-requisites

Each node's starting position must be set before running ForceAtlas 2 layout. Two attributes called `x` and `y` must therefore be defined for all the graph nodes. [graphology-layout](https://github.com/graphology/graphology-layout) can be used to initialize these attributes to a [random](https://github.com/graphology/graphology-layout#random) or [circular](https://github.com/graphology/graphology-layout#circular) layout, if needed.

Note also that the algorithm has an edge-case where the layout cannot be computed if all of your nodes starts with `x=0` and `y=0`.

### Settings

* **adjustSizes** *?boolean* [`false`]: should the node's sizes be taken into account?
* **barnesHutOptimize** *?boolean* [`false`]: whether to use the Barnes-Hut approximation to compute repulsion in `O(n*log(n))` rather than default `O(n^2)`, `n` being the number of nodes.
* **barnesHutTheta** *?number* [`0.5`]: Barnes-Hut approximation theta parameter.
* **edgeWeightInfluence** *?number* [`0`]: influence of the edge's weights on the layout.
* **gravity** *?number* [`1`]: strength of the layout's gravity.
* **linLogMode** *?boolean* [`false`]: whether to use Noack's LinLog model.
* **outboundAttractionDistribution** *?boolean* [`false`]
* **scalingRatio** *?number* [`1`]
* **slowDown** *?number* [`1`]
* **strongGravityMode** *?boolean* [`false`]

### Synchronous layout

```js
import forceAtlas2 from 'graphology-layout-forceatlas2';

const positions = forceAtlas2(graph, {iterations: 50});

// With settings:
const positions = forceAtlas2(graph, {
  iterations: 50,
  settings: {
    gravity: 10
  }
});

// To directly assign the positions to the nodes:
forceAtlas2.assign(graph);
```

*Arguments*

* **graph** *Graph*: target graph.
* **options** *object*: options:
  - **iterations** *number*: number of iterations to perform.
  - **settings** *?object*: the layout's settings (see [#settings](#settings)).

### Webworker

If you need to run the layout's computation in a web worker, the library comes with a utility to do so:

*Example*

```js
import FA2Layout from 'graphology-layout-forceatlas2/worker';

const layout = new FA2Layout(graph);

// To start the layout
layout.start({settings: {gravity: 1}});

// To stop the layout
layout.stop();

// To kill the layout and release attached memory
layout.kill();
```

**WARNING!**: if you are using [`webpack`](https://webpack.js.org/) to bundle your code, avoid the `cheap-eval`-like options for the [`devtool`](https://webpack.js.org/configuration/devtool/) setting. Some users noticed that it interacts in mysterious ways with the library's code and cause performance to drop dramatically when using the worker. Note that this should have been fixed from v0.5.0.

### #.inferSettings

If you don't know how to tune the layout's settings and want to infer them from your graph, you can use the `#.inferSettings` method:

```js
import forceAtlas2 from 'graphology-layout-forceatlas2';

const sensibleSettings = forceAtlas2.inferSettings(graph);
const positions = forceAtlas2(graph, {iterations: 50, settings: sensibleSettings});

// Alternatively using the graph's order instead of a graph instance
const sensibleSettings = forceAtlas2.inferSettings(500);
```
