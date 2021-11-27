---
layout: default
title: canvas
nav_order: 2
parent: Standard library
aux_links:
  "Library directory": "https://github.com/graphology/graphology/tree/master/src/canvas"
  "Changelog": "https://github.com/graphology/graphology/tree/master/src/canvas/CHANGELOG.md"
---

# Graphology Canvas

Canvas rendering routines for [`graphology`](..).

## Installation

```
npm install graphology-canvas
```

If you need to use this package's functions in node, you will also need to install [`node-canvas`](https://www.npmjs.com/package/canvas) thusly:

```
npm install canvas
```

If you experience any issue when installing the libray check that you have the required dependencies as listed [here](https://www.npmjs.com/package/canvas#compiling).

## Usage

### Pre-requisites

Each node's position must be set before rendering a graph. Two attributes called `x` and `y` must therefore be defined for all the graph nodes. [graphology-layout](/standard-library/layout) or [graphology-layout-forceatlas2](/standard-library/layout-forceatlas2), for instance, can be used to give positions to nodes if they don't have one already.

### Rendering a graph in an arbitrary canvas context

```js
import {render} from 'graphology-canvas';

render(graph, context, settings);
```

### Rendering asynchronously to avoid freezing main thread

```js
import {renderAsync} from 'graphology-canvas';

renderAsync(graph, context, settings, function () {
  console.log('Done!');
});
```

### Rendering a graph to PNG in node

```js
import {renderToPNG} from 'graphology-canvas/node';

renderToPNG(graph, './graph.png', () => console.log('Done!'));
renderToPNG(graph, './graph.png', settings, () => console.log('Done!'));
```

### Settings

- **width** <span class="code">?number</span> <span class="default">2048</span>: width of the canvas. Will be the same as `height` if not provided.
- **height** <span class="code">?number</span> <span class="default">2048</span>: height of the canvas. Will be the same as `width` if not provided.
- **padding** <span class="code">?number</span> <span class="default">20</span>: padding to keep around the drawing.
- **nodes** <span class="code">?object</span>: node-related settings:
  - **defaultColor** <span class="code">?string</span> <span class="default">#999</span>: default color for nodes.
  - **reducer** <span class="code">?function</span>: reducer fonction for nodes taking the rendering settings, the node key and its attributes and tasked to return rendering info such as `color`, `size` etc.
- **edges** <span class="code">?object</span>: node-related settings:
  - **defaultColor** <span class="code">?string</span> <span class="default">#ccc</span>: default color for edges.
  - **reducer** <span class="code">?function</span>: reducer fonction for edges taking the rendering settings, the node key and its attributes and tasked to return rendering info such as `color`, `size` etc.

### Async Settings

- **batchSize** <span class="code">?number</span> <span class="default">500</span>: number of items to render on canvas on each animation frame, increase or decrease to tweak performance vs. UI availability.

