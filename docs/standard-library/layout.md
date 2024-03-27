---
layout: default
title: layout
nav_order: 11
parent: Standard library
aux_links:
  "Library directory": "https://github.com/graphology/graphology/tree/master/src/layout"
  "Changelog": "https://github.com/graphology/graphology/tree/master/src/layout/CHANGELOG.md"
---

# Graphology Layout

Collection of basic layout algorithms to be used with [`graphology`](..).

## Installation

```
npm install graphology-layout
```

## Usage

_Basic_

- [circular](#circular)
- [random](#random)

_Advanced_

- [circlePack](#circlePack)

_Utilities_

- [rotation](#rotation)
- [collectLayout](#collectlayout)
- [collectLayoutAsFlatArray](#collectlayoutasflatarray)
- [assignLayout](#assignlayout)
- [assignLayoutAsFlatArray](#assignlayoutasflatarray)

### circular

Arranges the node in a circle (or an sphere/hypersphere in higher dimensions).

_Example_

```js
import {circular} from 'graphology-layout';
// Alternatively, to load only the relevant code:
import circular from 'graphology-layout/circular';

const positions = circular(graph);

// With options:
const positions = circular(graph, {scale: 100});

// To directly assign the positions to the nodes:
circular.assign(graph);

// To pass custom dimensions
const positions = random(graph, {dimensions: ['x1', 'x2']});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** <span class="code">?object</span>: options:
  - **dimensions** <span class="code">?array</span> <span class="default">['x', 'y']</span>: dimensions of the layout. Cannot work with dimensions != 2.
  - **center** <span class="code">?number</span> <span class="default">0.5</span>: center of the layout.
  - **scale** <span class="code">?number</span> <span class="default">1</span>: scale of the layout.

### random

Random layout positioning every node by choosing each coordinates uniformly at random on the interval `[0, 1)`.

_Example_

```js
import {random} from 'graphology-layout';
// Alternatively, to load only the relevant code:
import random from 'graphology-layout/random';

const positions = random(graph);

// With options:
const positions = random(graph, {rng: customRngFunction});

// To directly assign the positions to the nodes:
random.assign(graph);

// To pass custom dimensions
const positions = random(graph, {dimensions: ['x', 'y', 'z']});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** <span class="code">?object</span>: options:
  - **dimensions** <span class="code">?array</span> <span class="default">['x', 'y']</span>: dimensions of the layout.
  - **center** <span class="code">?number</span> <span class="default">0.5</span>: center of the layout.
  - **rng** <span class="code">?function</span> <span class="default">Math.random</span>: custom RNG function to use.
  - **scale** <span class="code">?number</span> <span class="default">1</span>: scale of the layout.

### circlePack

Arranges the nodes as a bubble chart, according to specified attributes.

_Example_

```js
import {circlepack} from 'graphology-layout';
// Alternatively, to load only the relevant code:
import circlepack from 'graphology-layout/circlepack';

const positions = circlepack(graph);

// With options
const positions = circlepack(graph, {
  hierarchyAttributes: ['degree', 'community'],
  rng: customRngFunction
});

// To directly assign the positions to the nodes:
circlepack.assign(graph);
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** <span class="code">?object</span>: options:
  - **attributes** <span class="code">?object</span>: attributes to map:
    - **x** <span class="code">?string</span> <span class="default">x</span>: name of the x position.
    - **y** <span class="code">?string</span> <span class="default">y</span>: name of the y position.
  - **center** <span class="code">?number</span> <span class="default">0</span>: center of the layout.
  - **hierarchyAttributes** <span class="code">?list</span> <span class="default">[]</span>: attributes used to group nodes.
  - **rng** <span class="code">?function</span> <span class="default">Math.random</span>: custom RNG function to use.
  - **scale** <span class="code">?number</span> <span class="default">1</span>: scale of the layout.

### rotation

Rotates the node coordinates of the given graph by the given angle in radians (or in degrees using an option).

Note that this function rotates your graph based on its center. If you want to use zero as the center for your rotation, use the `centeredOnZero` option. This option can also be used as an optimization strategy if you know your graph is already centered on zero to avoid needing to compute the graph's extent.

_Example_

```js
import {rotation} from 'graphology-layout';
// Alternatively, to load only the relevant code:
import rotation from 'graphology-layout/rotation';

const positions = rotation(graph, Math.PI / 2);

// With options:
const positions = rotation(graph, Math.PI / 2, {centeredOnZero: true});

// To directly assign the positions to the nodes:
rotation.assign(graph, Math.PI / 2);
```

_Arguments_

- **graph** _Graph_: target graph.
- **angle** _number_: rotation angle in radians (or degrees using an option below).
- **options** <span class="code">?object</span>: options:
  - **dimensions** <span class="code">?array</span> <span class="default">['x', 'y']</span>: dimensions to use for the rotation. Cannot work with dimensions != 2.
  - **degrees** <span class="code">?boolean</span> <span class="default">false</span>: whether the given angle is in degrees.
  - **centeredOnZero** <span class="code">?boolean</span> <span class="default">false</span>: whether to rotate the graph around `0`, rather than the graph's center.

### collectLayout

Function returning the given graph's layout as `{node: {x, y}}`.

_Example_

```js
import {collectLayout} from 'graphology-layout/utils';

collectLayout(graph);

// Custom dimensions
collectLayout(graph, {dimensions: ['x', 'y', 'z']});

// Non exhaustive (i.e. node having missing dimensions will be returned also)
collectLayout(graph, {exhaustive: false});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** <span class="code">?object</span>: options:
  - **dimensions** <span class="code">?array</span> <span class="default">['x', 'y']</span>: array of attribute names for the dimensions.
  - **exhaustive** <span class="code">?boolean</span> <span class="default">true</span>: whether to collect positions of nodes having all the dimensions set.

### collectLayoutAsFlatArray

Function returning the given graph's layout as a flat array of length `order * dimensions`.

_Example_

```js
import {collectLayoutAsFlatArray} from 'graphology-layout/utils';

collectLayoutAsFlatArray(graph);

// Custom dimensions
collectLayoutAsFlatArray(graph, {dimensions: ['x', 'y', 'z']});

// Custom type
collectLayoutAsFlatArray(graph, {type: Float32Array});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** <span class="code">?object</span>: options:
  - **dimensions** <span class="code">?array</span> <span class="default">['x', 'y']</span>: array of attribute names for the dimensions.
  - **type** <span class="code">?constructor</span> <span class="default">Float64Array</span>: array class to use.

### assignLayout

Function assigning a `{node: {x, y}}` layout to the given graph.

_Example_

```js
import {assignLayout} from 'graphology-layout/utils';

assignLayout(graph, layout);

// Custom dimensions
assignLayout(graph, layout, {dimensions: ['x', 'y', 'z']});
```

_Arguments_

- **graph** _Graph_: target graph.
- **layout** _object_: layout mapping.
- **options** <span class="code">?object</span>: options:
  - **dimensions** <span class="code">?array</span> <span class="default">['x', 'y']</span>: array of attribute names for the dimensions.

### assignLayoutAsFlatArray

Function assigning a flat array layout to the given graph.

_Example_

```js
import {assignLayoutAsFlatArray} from 'graphology-layout/utils';

assignLayoutAsFlatArray(graph, layout);

// Custom dimensions
assignLayoutAsFlatArray(graph, layout, {dimensions: ['x', 'y', 'z']});
```

_Arguments_

- **graph** _Graph_: target graph.
- **layout** _array_: layout flat array.
- **options** <span class="code">?object</span>: options:
  - **dimensions** <span class="code">?array</span> <span class="default">['x', 'y']</span>: array of attribute names for the dimensions.

