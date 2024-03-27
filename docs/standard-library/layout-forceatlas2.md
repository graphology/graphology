---
layout: default
title: layout-forceatlas2
nav_order: 13
parent: Standard library
aux_links:
  "Library directory": "https://github.com/graphology/graphology/tree/master/src/layout-forceatlas2"
  "Changelog": "https://github.com/graphology/graphology/tree/master/src/layout-forceatlas2/CHANGELOG.md"
---

# Graphology ForceAtlas2

JavaScript implementation of the [ForceAtlas2](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0098679) algorithm for [graphology](..).

## Reference

> Jacomy M, Venturini T, Heymann S, Bastian M (2014) ForceAtlas2, a Continuous Graph Layout Algorithm for Handy Network Visualization Designed for the Gephi Software. PLoS ONE 9(6): e98679. https://doi.org/10.1371/journal.pone.0098679

## Installation

```
npm install graphology-layout-forceatlas2
```

## Usage

- [Pre-requisite](#pre-requisite)
- [Settings](#settings)
- [Synchronous layout](#synchronous-layout)
- [Webworker](#webworker)
- [#.inferSettings](#infersettings)

### Pre-requisites

Each node's starting position must be set before running ForceAtlas 2 layout. Two attributes called `x` and `y` must therefore be defined for all the graph nodes. [graphology-layout](/standard-library/layout) can be used to initialize these attributes to a [random](/standard-library/layout#random) or [circular](/standard-library/layout#circular) layout, if needed.

Note also that the algorithm has an edge-case where the layout cannot be computed if all of your nodes starts with `x=0` and `y=0`.

### Settings

- **adjustSizes** <span class="code">?boolean</span> <span class="default">false</span>: should the node's sizes be taken into account?
- **barnesHutOptimize** <span class="code">?boolean</span> <span class="default">false</span>: whether to use the Barnes-Hut approximation to compute repulsion in `O(n*log(n))` rather than default `O(n^2)`, `n` being the number of nodes.
- **barnesHutTheta** <span class="code">?number</span> <span class="default">0.5</span>: Barnes-Hut approximation theta parameter.
- **edgeWeightInfluence** <span class="code">?number</span> <span class="default">1</span>: influence of the edge's weights on the layout. To consider edge weight, don't forget to pass `weighted` as `true` when applying the [synchronous layout](#synchronous-layout) or when instantiating the [worker](#webworker).
- **gravity** <span class="code">?number</span> <span class="default">1</span>: strength of the layout's gravity.
- **linLogMode** <span class="code">?boolean</span> <span class="default">false</span>: whether to use Noack's LinLog model.
- **outboundAttractionDistribution** <span class="code">?boolean</span> <span class="default">false</span>
- **scalingRatio** <span class="code">?number</span> <span class="default">1</span>
- **slowDown** <span class="code">?number</span> <span class="default">1</span>
- **strongGravityMode** <span class="code">?boolean</span> <span class="default">false</span>

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

_Arguments_

- **graph** _Graph_: target graph.
- **options** _object_: options:
  - **iterations** _number_: number of iterations to perform.
  - **getEdgeWeight** <span class="code">?string\|function</span> <span class="default">weight</span>: name of the edge weight attribute or getter function. Defaults to `weight`.
  - **settings** <span class="code">?object</span>: the layout's settings (see [#settings](#settings)).

### Webworker

If you need to run the layout's computation in a web worker, the library comes with a utility to do so:

_Example_

```js
import FA2Layout from 'graphology-layout-forceatlas2/worker';

// The parameters are the same as for the synchronous version, minus `iterations` of course
const layout = new FA2Layout(graph, {
  settings: {gravity: 1}
});

// To start the layout
layout.start();

// To stop the layout
layout.stop();

// To kill the layout and release attached memory
layout.kill();

// Assess whether the layout is currently running
layout.isRunning();
```

**WARNING!**: if you are using [`webpack`](https://webpack.js.org/) to bundle your code, avoid the `cheap-eval`-like options for the [`devtool`](https://webpack.js.org/configuration/devtool/) setting. Some users noticed that it interacts in mysterious ways with the library's code and cause performance to drop dramatically when using the worker. Note that this should have been fixed from v0.5.0.

### #.inferSettings

If you don't know how to tune the layout's settings and want to infer them from your graph, you can use the `#.inferSettings` method:

```js
import forceAtlas2 from 'graphology-layout-forceatlas2';

const sensibleSettings = forceAtlas2.inferSettings(graph);
const positions = forceAtlas2(graph, {
  iterations: 50,
  settings: sensibleSettings
});

// Alternatively using the graph's order instead of a graph instance
const sensibleSettings = forceAtlas2.inferSettings(500);
```

