---
layout: default
title: layout
nav_order: 9
parent: Standard library
aux_links:
  "Library directory": "https://github.com/graphology/graphology/tree/master/src/layout"
  
---

# Graphology Layout

Collection of basic layout algorithms to be used with [`graphology`](..).

## Installation

```
npm install graphology-layout
```

## Usage

- [circlePack](#circlePack)
- [circular](#circular)
- [random](#random)

### #.circlePack

Arranges the nodes as a bubble chart, according to specified attributes.

_Example_

```js
import {circlepack} from 'graphology-layout';
// Alternatively, to load only the relevant code:
import circlepack from 'graphology-layout/circlepack';

const positions = circlepack(Graph);

// With options
const positions = circlepack(Graph, {
  hierarchyAttributes: ['degree', 'community'],
  rng: customRngFunction
});

// To directly assign the positions to the nodes:
circlepack.assign(Graph);
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

### #.circular

Arranges the node in a circle.

_Example_

```js
import {circular} from 'graphology-layout';
// Alternatively, to load only the relevant code:
import circular from 'graphology-layout/circular';

const positions = circular(Graph);

// With options:
const positions = circular(Graph, {scale: 100});

// To directly assign the positions to the nodes:
circular.assign(Graph);
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** <span class="code">?object</span>: options:
  - **attributes** <span class="code">?object</span>: attributes to map:
    - **x** <span class="code">?string</span> <span class="default">x</span>: name of the x position.
    - **y** <span class="code">?string</span> <span class="default">y</span>: name of the y position.
  - **center** <span class="code">?number</span> <span class="default">0.5</span>: center of the layout.
  - **scale** <span class="code">?number</span> <span class="default">1</span>: scale of the layout.

### #.random

Random layout positioning every node by choosing each coordinates uniformly at random on the interval `[0, 1)`.

_Example_

```js
import {random} from 'graphology-layout';
// Alternatively, to load only the relevant code:
import random from 'graphology-layout/random';

const positions = random(Graph);

// With options:
const positions = random(Graph, {rng: customRngFunction});

// To directly assign the positions to the nodes:
random.assign(Graph);
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** <span class="code">?object</span>: options:
  - **attributes** <span class="code">?object</span>: attributes to map:
    - **x** <span class="code">?string</span> <span class="default">x</span>: name of the x position.
    - **y** <span class="code">?string</span> <span class="default">y</span>: name of the y position.
  - **center** <span class="code">?number</span> <span class="default">0.5</span>: center of the layout.
  - **rng** <span class="code">?function</span> <span class="default">Math.random</span>: custom RNG function to use.
  - **scale** <span class="code">?number</span> <span class="default">1</span>: scale of the layout.

