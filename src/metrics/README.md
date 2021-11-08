# Graphology metrics

Miscellaneous metrics to be used with [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-metrics
```

## Usage

_Graph metrics_

- [Density](#density)
- [Diameter](#diameter)
- [Extent](#extent)
- [Modularity](#modularity)
- [Weighted size](#weighted-size)

_Node metrics_

- [Centrality](#centrality)
  - [Betweenness centrality](#betweenness-centrality)
  - [Closeness centrality](#closeness-centrality)
  - [Degree centrality](#degree-centrality)
  - [Eigenvector centrality](#eigenvector-centrality)
  - [HITS](#hits)
  - [Pagerank](#pagerank)
- [Degree](#degree)
- [Eccentricity](#eccentricity)
- [Weighted degree](#weighted-degree)

_Attributes metrics_

- [Modalities](#modalities)

_Layout quality metrics_

- [Edge Uniformity](#edge-uniformity)
- [Neighborhood Preservation](#neighborhood-preservation)
- [Stress](#stress)

### Density

Computes the density of the given graph.

```js
import {density} from 'graphology-metrics';
import density from 'graphology-metrics/density';

// Passing a graph instance
const d = density(graph);

// Passing the graph's order & size
const d = density(order, size);

// Or to force the kind of density being computed
import {
  mixedDensity,
  directedDensity,
  undirectedDensity,
  multiMixedDensity,
  multiDirectedDensity,
  multiUndirectedDensity
} from 'graphology-metric/density';

const d = undirectedDensity(mixedGraph);
```

_Arguments_

Either:

- **graph** _Graph_: target graph.

Or:

- **order** _number_: number of nodes in the graph.
- **size** _number_: number of edges in the graph.

### Diameter

Computes the diameter, i.e the maximum eccentricity of any node of the given graph.

```js
import {diameter} from 'graphology-metrics';
// Alternatively, to load only the relevant code:
import diameter from 'graphology-metrics/diameter';

const graph = new Graph();
graph.addNode('1');
graph.addNode('2');
graph.addNode('3');
graph.addUndirectedEdge(1, 2);
graph.addUndirectedEdge(2, 3);

diameter(graph);
>>> 2

```

_Arguments_

- **graph** _Graph_: target graph.

### Extent

Computes the extent - min, max - of a node or edge's attribute.

```js
import extent from 'graphology-metrics/extent';

// Retrieving a single node attribute's extent
extent(graph, 'size');
>>> [1, 34]

// Retrieving multiple node attributes' extents
extent(graph, ['x', 'y']);
>>> {x: [-4, 3], y: [-34, 56]}

// For edges
extent.edgeExtent(graph, 'weight');
>>> [0, 5.7]
```

_Arguments_

- **graph** _Graph_: target graph.
- **attributes** _string|array_: single attribute names or array of attribute names.

### Modularity

Computes the modularity, given the graph and a node partition. It works on both directed & undirected networks and will return the relevant modularity.

```js
import {modularity} from 'graphology-metrics';
// Alternatively, to load only the relevant code:
import modularity from 'graphology-metrics/modularity';

// Simplest way
const Q = modularity(graph);

// If the partition is not given by node attributes
const Q = modularity(graph, {
  communities: {1: 0, 2: 0, 3: 1, 4: 1, 5: 1}
});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **attributes** _?object_: attributes' names:
    - **community** _?string_ [`community`]: name of the nodes' community attribute in case we need to read them from the graph itself.
    - **weight** _?string_ [`weight`]: name of the edges' weight attribute.
  - **communities** _?object_: object mapping nodes to their respective communities.
  - **resolution** _?number_: resolution parameter (`γ`).
  - **weighted** _?boolean_ [`true`]: whether to compute weighted modularity or not.

### Weighted size

Computes the weighted size, i.e. the sum of the graph's edges' weight, of the given graph.

```js
import {weightedSize} from 'graphology-metrics';
// Alternatively, to load only the relevant code:
import weightedSize from 'graphology-metrics/weighted-size';

const graph = new Graph();
graph.mergeEdge(1, 2, {weight: 3});
graph.mergeEdge(1, 2, {weight: 1});

// Simplest way
weightedSize(graph);
>>> 4

// With custom weight attribute
weightedSize(graph, 'myWeightAttribute');
>>> 4
```

_Arguments_

- **graph** _Graph_: target graph.
- **weightAttribute** _?string_ [`weight`]: name of the weight attribute.

### Centrality

#### Betweenness centrality

Computes the betweenness centrality for every node.

```js
import betweennessCentrality from 'graphology-metrics/centrality/betweenness';

// To compute centrality for every node:
const centrality = betweennessCentrality(graph);

// To compute weighted betweenness centrality
const centrality = betweennessCentrality(graph, {weighted: true});

// To directly map the result onto nodes' attributes (`betweennessCentrality`):
betweennessCentrality.assign(graph);

// To directly map the result onto a custom attribute:
betweennessCentrality.assign(graph, {attributes: {centrality: 'myCentrality'}});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **attributes** _?object_: Custom attribute names:
    - **centrality** _?string_ [`betweennessCentrality`]: Name of the centrality attribute to assign.
    - **weight** _?string_: Name of the weight attribute.
  - **normalized** _?boolean_ [`true`]: should the result be normalized?
  - **weighted** _?boolean_ [`false`]: should we compute the weighted betweenness centrality?

### Closeness centrality

Computes the closeness centrality of a graph's nodes.

```js
import closenessCentrality from 'graphology-metrics/centrality/closeness';

// To compute the eigenvector centrality and return the score per node:
const scores = closenessCentrality(graph);

// To directly map the result to nodes' attributes:
closenessCentrality.assign(graph);

// Note that you can also pass options to customize the algorithm:
const p = closenessCentrality(graph, {wassermanFaust: true});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **attributes** _?object_: attributes' names:
    - **centrality** _?string_ [`eigenvectorCentrality`]: name of the node attribute that will be assigned the eigenvector centrality.
  - **wassermanFaust** _?boolean_ [`false`]: whether to use Wasserman & Faust's normalization scheme.

#### Degree centrality

Computes the degree centrality for every node.

```js
import degreeCentrality from 'graphology-metrics/centrality/degree';
// Or to load more specific functions:
import {
  degreeCentrality,
  inDegreeCentrality,
  outDegreeCentrality
} from 'graphology-metrics/centrality/degree';

// To compute degree centrality for every node:
const centrality = degreeCentrality(graph);

// To directly map the result onto nodes' attributes (`degreeCentrality`):
degreeCentrality.assign(graph);

// To directly map the result onto a custom attribute:
degreeCentrality.assign(graph, {attributes: {centrality: 'myCentrality'}});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **attributes** _?object_: custom attribute names:
    - **centrality** _?string_ [`degreeCentrality`]: name of the centrality attribute to assign.

### Eigenvector centrality

Computes the eigenvector centrality of a graph's nodes.

```js
import eigenvectorCentrality from 'graphology-metrics/centrality/eigenvector';

// To compute the eigenvector centrality and return the score per node:
const scores = eigenvectorCentrality(graph);

// To directly map the result to nodes' attributes:
eigenvectorCentrality.assign(graph);

// Note that you can also pass options to customize the algorithm:
const p = eigenvectorCentrality(graph, {tolerance: 1e-3, weighted: false});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **attributes** _?object_: attributes' names:
    - **centrality** _?string_ [`eigenvectorCentrality`]: name of the node attribute that will be assigned the eigenvector centrality.
    - **weight** _?string_ [`weight`]: name of the edges' weight attribute.
  - **maxIterations** _?number_ [`100`]: maximum number of iterations to perform.
  - **tolerance** _?number_ [`1.e-6`]: convergence error tolerance.
  - **weighted** _?boolean_ [`false`]: whether to use available weights or not.


### HITS

Computes the hub/authority metrics for each node using the HITS algorithm.

```js
import hits from 'graphology-metrics/centrality/hits';

// To compute and return the result as 'hubs' & 'authorities':
const {hubs, authorities} = hits(graph);

// To directly map the result to nodes' attributes:
hits.assign(graph);

// Note that you can also pass options to customize the algorithm:
const {hubs, authorities} = hits(graph, {normalize: false});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **attributes** _?object_: attributes' names:
    - **weight** _?string_ [`weight`]: name of the edges' weight attribute.
    - **hub** _?string_ [`hub`]: name of the node attribute holding hub information.
    - **authority** _?string_ [`authority`]: name of the node attribute holding authority information.
  - **maxIterations** _?number_ [`100`]: maximum number of iterations to perform.
  - **normalize** _?boolean_ [`true`]: should the result be normalized by the sum of values.
  - **tolerance** _?number_ [`1.e-8`]: convergence error tolerance.

### Pagerank

Computes the pagerank metrics for each node.

```js
import pagerank from 'graphology-metrics/centrality/pagerank';

// To compute pagerank and return the score per node:
const scores = pagerank(graph);

// To directly map the result to nodes' attributes:
pagerank.assign(graph);

// Note that you can also pass options to customize the algorithm:
const p = pagerank(graph, {alpha: 0.9, weighted: false});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **attributes** _?object_: attributes' names:
    - **pagerank** _?string_ [`pagerank`]: name of the node attribute that will be assigned the pagerank score.
    - **weight** _?string_ [`weight`]: name of the edges' weight attribute.
  - **alpha** _?number_ [`0.85`]: damping parameter of the algorithm.
  - **maxIterations** _?number_ [`100`]: maximum number of iterations to perform.
  - **tolerance** _?number_ [`1.e-6`]: convergence error tolerance.
  - **weighted** _?boolean_ [`false`]: whether to use available weights or not.

### Weighted degree

Computes the weighted degree of nodes. The weighted degree of a node is the sum of its edges' weights.

```js
import weightedDegree from 'graphology-metrics/weighted-degree';
// Or to load more specific functions:
import {
  weightedDegree,
  weightedInDegree,
  weightedOutDegree
} from 'graphology-metrics/weighted-degree';

// To compute weighted degree of a single node
weightedDegree(graph, 'A');

// To compute weighted degree of every node
const weightedDegrees = weightedDegree(graph);

// To compute normalized weighted degree, i.e. weighted degree will be
// divided by the node's relevant degree
weightedDegree(graph, 'A', {normalized: true});

// To directly map the result onto node attributes
weightedDegree.assign(graph);
```

_Arguments_

To compute the weighted degree of a single node:

- **graph** _Graph_: target graph.
- **node** _any_: desired node.
- **options** _?object_: options. See below.

To compute the weighted degree of every node:

- **graph** _Graph_: target graph.
- **options** _?object_: options. See below.

_Options_

- **attributes** _?object_: custom attribute names:
  - **weight** _?string_ [`weight`]: name of the weight attribute.
  - **weightedDegree** _?string_ [`weightedDegree`]: name of the attribute to assign.

### Degree

Returns degree information for every node in the graph. Note that [`graphology`](https://graphology.github.io)'s API already gives you access to this information through `#.degree` etc. So only consider this function as a convenience to extract/assign all degrees at once.

```js
import degree from 'graphology-metrics/degree';

import degree, {
  inDegree,
  outDegree,
  undirectedDegree,
  directedDegree,
  allDegree
} from 'graphology-metrics/degree';

// To extract degree information for every node
const degrees = degree(graph);
>>> {node1: 34, node2: 45, ...}

// To extract only in degree information for every node
const inDegrees = inDegree(graph);

// To extract full degree breakdown for every node
const degrees = allDegree(graph);
>>> { // Assuming the graph is directed
  node1: {
    inDegree: 2,
    outDegree: 36
  },
  ...
}

// To map degree information to node attributes
degree.assign(graph);
graph.getNodeAttribute(node, 'degree');
>>> 45

// To map only degree & in degree to node attributes
allDegree.assign(graph, {types: ['degree', 'inDegree']});

// To map only degree & in degree with different names
allDegree(
  graph,
  {
    attributes: {
      inDegree: 'in',
      outDegree: 'out'
    },
    types: ['inDegree', 'outDegree']
  }
)
>>> {
  1: {in: 1, out: 1},
  ...
}
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **attributes** _?object_: Custom attribute names:
    - **degree** _?string_: Name of the mixed degree attribute.
    - **inDegree** _?string_: Name of the mixed inDegree attribute.
    - **outDegree** _?string_: Name of the mixed outDegree attribute.
    - **undirectedDegree** _?string_: Name of the mixed undirectedDegree attribute.
    - **directedDegree** _?string_: Name of the mixed directedDegree attribute.
  - **types** _?array_: List of degree types to extract.

### Eccentricity

Computes the eccentricity which is the maximum of the shortest paths between the given node and any other node.

```js
import {eccentricity} from 'graphology-metrics';
// Alternatively, to load only the relevant code:
import eccentricity from 'graphology-metrics/eccentricity';

graph.addNode('1');
graph.addNode('2');
graph.addNode('3');
graph.addNode('4');
graph.addUndirectedEdge(1, 2);
graph.addUndirectedEdge(2, 3);
graph.addUndirectedEdge(3, 1);
graph.addUndirectedEdge(3, 4);

eccentricity(graph, 3) >> 1;
```

_Arguments_

- **graph** _Graph_: target graph.
- **node** _any_: desired node.

### Modalities

Method returning a node categorical attribute's modalities and related statistics.

```js
import modalities from 'graphology-metrics/modalities';

// Retrieving the 'type' attribute's modalities
const info = modalities(graph, 'type');
>>> {
  value1: {
    nodes: 34,
    internalEdges: 277,
    internalDensity: 0.03,
    externalEdges: 45,
    externalDensity: 0.05,
    inboundEdges: 67,
    inboundDensity: 0.07,
    outboundEdges: 124,
    outboundDensity: 0.003
  },
  ...
}

// Retrieving modalities info for several attributes at once
const info = modalities(graph, ['type', 'lang']);
>>> {
  type: {...},
  lang: {...}
}
```

_Arguments_

- **graph** _Graph_: target graph.
- **attribute** _string|array_: target categorical attribute or array of categorical attributes.

### Edge Uniformity

Computes the edge uniformity layout quality metric from the given graph having `x` and `y` positions attached to its nodes. Edge uniformity is the normalized standard deviation of edge length of the graph. Lower values should be synonym of better layout according to this particular metric.

Runs in `O(E)`.

```js
import edgeUniformity from 'graphology-metrics/layout-quality/edge-uniformity';

edgeUniformity(graph);
>>> ~1.132
```

### Neighborhood preservation

Computes the "neighborhood preservation" layout quality metric from the given graph having `x` and `y` positions attached to its nodes. Neighborhood preservation is the average proportion of node neighborhood being the same both in the graph's topology and its 2d layout space. The metric is therefore comprised between `0` and `1`, `1` being the best, meaning that every node keeps its neighborhood perfectly intact within the layout space.

Runs in approximately `O(N * log(N))`.

```js
import neighborhoodPreservation from 'graphology-metrics/layout-quality/neighborhood-preservation';

neighborhoodPreservation(graph);
// >>> 0.456
```

### Stress

Computes the "stress" layout quality metric from the given graph having `x` and `y` positions attached to its nodes. Stress is the sum of normalized delta between node topology distances and their layout space distances. Lower values should be synonym of better layout according to this particular metric.

Note that this metric does not work very well when the graph has multiple connected components.

Note also that this metric traverses any given graph as an undirected one.

Runs in `O(N^2)`.

```js
import stress from 'graphology-metrics/layout-quality/stress';

stress(graph);
// >>> ~24510.2914
```
