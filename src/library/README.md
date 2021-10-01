# Graphology Standard Library

A npm package gathering every library from the [graphology](https://graphology.github.io) ecosystem.

## Installation

```
npm install graphology-library
```

## Usage

The whole list of graphology packages included in this collected library can be found [here](https://graphology.github.io/standard-library.html).

You can import packages using the documented examples of each package or thusly:

```js
// Importing a sub package
import * as metrics from 'graphology-library/metrics';

metrics.density(graph);

// Importing parts of the library
import {metrics, layout} from 'graphology-library';

// Importing the whole library
import * as lib from 'graphology-library';
```
