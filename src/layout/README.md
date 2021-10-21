# Graphology Layout

Collection of basic layout algorithms to be used with [`graphology`](https://graphology.github.io).

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
- **options** _?object_: options:
  - **attributes** _?object_: attributes to map:
    - **x** _?string_ [`x`]: name of the x position.
    - **y** _?string_ [`y`]: name of the y position.
  - **center** _?number_ [`0`]: center of the layout.
  - **hierarchyAttributes** _?list_ [`[]`]: attributes used to group nodes.
  - **rng** _?function_ [`Math.random`]: custom RNG function to use.
  - **scale** _?number_ [`1`]: scale of the layout.

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
- **options** _?object_: options:
  - **attributes** _?object_: attributes to map:
    - **x** _?string_ [`x`]: name of the x position.
    - **y** _?string_ [`y`]: name of the y position.
  - **center** _?number_ [`0.5`]: center of the layout.
  - **scale** _?number_ [`1`]: scale of the layout.

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
- **options** _?object_: options:
  - **attributes** _?object_: attributes to map:
    - **x** _?string_ [`x`]: name of the x position.
    - **y** _?string_ [`y`]: name of the y position.
  - **center** _?number_ [`0.5`]: center of the layout.
  - **rng** _?function_ [`Math.random`]: custom RNG function to use.
  - **scale** _?number_ [`1`]: scale of the layout.
