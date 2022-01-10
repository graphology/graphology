---
layout: default
title: layout-force
nav_order: 11
parent: Standard library
aux_links:
  "Library directory": "https://github.com/graphology/graphology/tree/master/src/layout-force"
  "Changelog": "https://github.com/graphology/graphology/tree/master/src/layout-force/CHANGELOG.md"
---

# Graphology Force layout

JavaScript implementation of a basic [force directed layout algorithm](https://en.wikipedia.org/wiki/Force-directed_graph_drawing) for [graphology](..).

In some few cases, for very small graphs, [ForceAtlas2](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0098679) can be "too efficient". This simpler force algorithm cannot spatialize larger networks, but will offer more organic movements which are more suited to some interactions with the graph such as drag and drop etc.

## Installation

```
npm install graphology-layout-force
```

## Usage

- [Pre-requisite](#pre-requisite)
- [Settings](#settings)
- [Synchronous layout](#synchronous-layout)
- [Supervisor](#supervisor)

### Pre-requisites

Each node's starting position must be set before running the force layout algorithm. Two attributes called `x` and `y` must therefore be defined for all the graph nodes.

Note also that the algorithm has an edge-case where the layout cannot be computed if all of your nodes starts with `x=0` and `y=0`.

### Settings

- **attraction** <span class="code">?number</span> <span class="default">0.0005</span>: importance of the attraction force, that attracts each pair of connected nodes like elastics.
- **repulsion** <span class="code">?number</span> <span class="default">0.1</span>: importance of the repulsion force, that attracts each pair of nodes like magnets.
- **gravity** <span class="code">?number</span> <span class="default">0.0001</span>: importance of the gravity force, that attracts all nodes to the center.
- **inertia** <span class="code">?number</span> <span class="default">0.6</span>: percentage of a node vector displacement that is preserved at each step. `0` means no inertia, `1` means no friction.
- **maxMove** <span class="code">?number</span> <span class="default">200</span>: Maximum length a node can travel at each step, in pixel.

### Synchronous layout

```js
import forceLayout from 'graphology-layout-force';

const positions = forceLayout(graph, {maxIterations: 50});

// With settings:
const positions = forceLayout(graph, {
  maxIterations: 50,
  settings: {
    gravity: 10
  }
});

// To directly assign the positions to the nodes:
forceLayout.assign(graph);
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _object_: options:
  - **nodeXAttribute** <span class="code">?string</span> <span class="default">x</span>: name of the `x` position attribute for nodes.
  - **nodeYAttribute** <span class="code">?string</span> <span class="default">y</span>: name of the `y` position attribute for edges.
  - **isNodeFixed** <span class="code">?string\|function</span> <span class="default">fixed</span>: name of the `fixed` attribute for nodes or a function getting a node entry (key, attributes) and returning whether the node is fixed.
  - **shouldSkipNode** <span class="code">?function</span>: function returning whether the layout computations should skip this node.
  - **shouldSkipEdge** <span class="code">?function</span>: function returning whether the layout computations should skip this edge.
  - **maxIterations** <span class="code">?number</span> <span class="default">500</span>: maximum number of iterations to perform before stopping. Note that the algorithm will also stop as soon as converged.
  - **settings** <span class="code">?object</span>: the layout's settings (see [#settings](#settings)).

### Supervisor

Layout supervisor relying on [`window.requestAnimationFrame`](https://developer.mozilla.org/fr/docs/Web/API/Window/requestAnimationFrame) to run the layout live without hampering the UI thread.

_Example_

```js
import ForceSupervisor from 'graphology-layout-force/worker';

const layout = new ForceSupervisor(graph, params);

// To start the layout. It will automatically stop when converged
layout.start();

// To stop the layout
layout.stop();

// To kill the layout and release attached memory and listeners
layout.kill();

// Assess whether the layout is currently running
layout.isRunning();
```

