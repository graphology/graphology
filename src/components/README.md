# Graphology Components

Connected components for [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-components
```

## Usage

- [connectedComponents](#connectedcomponents)
- [largestConnectedComponent](#largestconnectedcomponent)
- [largestConnectedComponentSubgraph](#largestconnectedcomponentsubgraph)
- [stronglyConnectedComponents](#stronglyconnectedcomponents)

### connectedComponents

Returns the list of connected components of the given graph.

```js
import {connectedComponents} from 'graphology-components';

const components = connectedComponents(graph);
```

If your graph is mixed or directed, the result will be what are usually called **weakly connected components**.

### largestConnectedComponent

Returns the largest connected component of the given graph.

```js
import {largestConnectedComponent} from 'graphology-components';

const largest = largestConnectedComponent(graph);
```

### largestConnectedComponentSubgraph

Returns a subgraph of the largest connected component of the given graph.

```js
import {largestConnectedComponentSubgraph} from 'graphology-components';

const subgraph = largestConnectedComponentSubgraph(graph);
```

### stronglyConnectedComponents

Returns the list of strongly connected components of the given graph. (mixed or directed)

```js
import {stronglyConnectedComponents} from 'graphology-components';

const components = stronglyConnectedComponents(graph);
```
