[![Build Status](https://travis-ci.org/graphology/graphology-components.svg)](https://travis-ci.org/graphology/graphology-components)

# Graphology Components

Connected components for [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-components
```

## Usage

* [connectedComponents](#connectedcomponents)
* [largestConnectedComponent](#largestconnectedcomponent)
* [stronglyConnectedComponents](#stronglyconnectedcomponents)

### connectedComponents

Returns the list of connected components of the given graph.

```js
import {connectedComponents} from 'graphology-components';

const components = connectedComponents(graph);
```

If `graph` is a mixed or directed, the result will be the list of **weakly connected components.**

### largestConnectedComponent

Returns the largest connected component of the given graph.

```js
import {largestConnectedComponent} from 'graphology-components';

const largest = largestConnectedComponent(graph);
```

### stronglyConnectedComponents

Returns the list of strongly connected components of the given graph. (mixed or directed)

```js
import {stronglyConnectedComponents} from 'graphology-components';

const components = stronglyConnectedComponents(graph);
```
