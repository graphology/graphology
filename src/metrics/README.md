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
- [Simple size](#simple-size)
- [Weighted size](#weighted-size)

_Node metrics_

- [Eccentricity](#eccentricity)
- [Weighted degree](#weighted-degree)

_Edge metrics_

- [Disparity](#disparity)
- [Simmelian strength](#simmelian-strength)
- [Chi square](#chi-square)
- [G square](#g-square)

_Centrality_

- [Betweenness centrality](#betweenness-centrality)
- [Edge betweenness centrality](#edge-betweenness-centrality)
- [Closeness centrality](#closeness-centrality)
- [Degree centrality](#degree-centrality)
- [Eigenvector centrality](#eigenvector-centrality)
- [HITS](#hits)
- [Pagerank](#pagerank)

_Layout quality metrics_

- [Connected Closeness](#connected-closeness)
- [Edge Uniformity](#edge-uniformity)
- [Neighborhood Preservation](#neighborhood-preservation)
- [Stress](#stress)

## Graph metrics

### Density

Computes the density of the given graph. Note that multi variants can exceed `0`, as it is also the case when considering self loops.

```js
import {density} from 'graphology-metrics/graph/density';

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
} from 'graphology-metric/graph/density';

const d = undirectedDensity(mixedGraph);

// If you need to chose the kind of density dynamically
import {abstractDensity} from 'graphology-metric/graph/density';

abstractDensity('directed', true, 10, 24);
```

_Arguments_- [Chi square](#chi-square)

- [G square](#g-square)

Either:

- **graph** _Graph_: target graph.

Or:

- **order** _number_: number of nodes in the graph.
- **size** _number_: number of edges in the graph.

_Abstract version arguments_

Either:

- **type** _string_: type of density to compute (`directed`, `undirected` or `mixed`).
- **multi** _boolean_: whether to compute density for the multi of simple case.
- **graph** _Graph_: target graph.

Or:

- **type** _string_: type of density to compute (`directed`, `undirected` or `mixed`).
- **multi** _boolean_: whether to compute density for the multi of simple case.
- **order** _number_: number of nodes in the graph.
- **size** _number_: number of edges in the graph.

### Diameter

Computes the diameter, i.e the maximum eccentricity of any node of the given graph.

```js
import diameter from 'graphology-metrics/graph/diameter';

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
import {nodeExtent, edgeExtent} from 'graphology-metrics/graph';
// Alternatively, to load only the relevant code:
import {nodeExtent, edgeExtent} from 'graphology-metrics/graph/extent';

// Retrieving a single node attribute's extent
nodeExtent(graph, 'size');
>>> [1, 34]

// Retrieving multiple node attributes' extents
nodeExtent(graph, ['x', 'y']);
>>> {x: [-4, 3], y: [-34, 56]}

// The same for edges
edgeExtent(graph, 'weight');
>>> [0, 5.7]
```

_Arguments_

- **graph** _Graph_: target graph.
- **attributes** _string|array_: single attribute names or array of attribute names.

### Modularity

Computes the modularity, given the graph and a node partition. It works on both directed & undirected networks and will return the relevant modularity.

```js
import modularity from 'graphology-metrics/graph/modularity';

// Simplest way
const Q = modularity(graph);

// Custom node partition
const Q = modularity(graph, {
  getNodeCommunity(node, attr) {
    return attr.customPartition;
  }
});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **getNodeCommunity** _?string\|function_ [`community`]: name of the node community attribute or getter function.
  - **getEdgeWeight** _?string\|function_ [`weight`]: name of the edges' weight attribute or getter function.
  - **resolution** _?number_: resolution parameter (`γ`).

### Simple size

Computes the simple size of a given graph, i.e. its number of edges if we consider the graph simple, even if it has multiple edges between pairs of nodes.

```js
import {simpleSize} from 'graphology-metrics';
// Alternatively, to load only the relevant code:
import simpleSize from 'graphology-metrics/graph/simple-size';

const graph = new MultiGraph();
graph.mergeEdge(1, 2);
graph.mergeEdge(1, 2);
graph.mergeEdge(4, 3);
graph.mergeUndirectedEdge(5, 6);

simpleSize(graph);
>>> 3
```

### Weighted size

Computes the weighted size, i.e. the sum of the graph's edges' weight, of the given graph.

```js
import weightedSize from 'graphology-metrics/graph/weighted-size';

const graph = new Graph();
graph.mergeEdge(1, 2, {weight: 3});
graph.mergeEdge(1, 2, {weight: 1});

// Simplest way
weightedSize(graph);
>>> 4

// With custom weight attribute
weightedSize(graph, 'myWeightAttribute');
>>> 4

// With custom getter
weightedSize(graph, (_, attr) => attr.importance);
```

_Arguments_

- **graph** _Graph_: target graph.
- **getEdgeWeight** _?string\|function_ [`weight`]: name of the weight attribute or getter function.

## Node metrics

### Weighted degree

Computes the weighted degree of nodes. The weighted degree of a node is the sum of its edges' weights.

```js
import {
  weightedDegree,
  weightedInDegree,
  weightedOutDegree,
  weightedInboundDegree,
  weightedOutboundDegree,
  weightedUndirectedDegree,
  weightedDirectedDegree
} from 'graphology-metrics/node/weighted-degree';

// To compute weighted degree of a node
weightedDegree(graph, 'A');

// To use a custom weight
weightedDegree(graph, 'A', function (_, attr) {
  return attr.importance;
});
```

_Arguments_

- **graph** _Graph_: target graph.
- **node** _any_: desired node.
- **getEdgeWeight** _?string\|function_: name of the edge weight attribute or getter function.

### Eccentricity

Computes the eccentricity which is the maximum of the shortest paths between the given node and any other node.

```js
import eccentricity from 'graphology-metrics/node/eccentricity';

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

## Edge metrics

### Disparity

Function computing a score for each edge which is necessary to apply a "disparity filter" as described in the following paper:

> Serrano, M. Ángeles, Marián Boguná, and Alessandro Vespignani. "Extracting the multiscale backbone of complex weighted networks." Proceedings of the national academy of sciences 106.16 (2009): 6483-6488.

Note that this metric requires a weighted graph or will return a useless result.

Beware, the results must be interpreted thusly: a lower score means a more relevant edge, as is intuited in the paper's formulae. This means you can prune edges that have a score greater than a given threshold, as a statistical test. Some other implementations might differ in that they offer the opposite intuition (i.e. greater score = more relevant edge).

```js
import disparity from 'graphology-metrics/edge/disparity';

// To compute strength for every edge:
const disparities = disparity(graph);

// To directly map the result onto edge attributes (`disparity`):
disparity.assign(graph);

// Using custom weights
disparity.assign(graph, {getEdgeWeight: (_, attr) => attr.importance});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **edgeDisparityAttribute** _?string_ [`disparity`]: Name of the disparity attribute to assign.
  - **getEdgeWeight** _?string\|function_ [`weight`]: Name of the edge weight attribute or getter function.

### Simmelian strength

Function returning the simmelian strength, i.e. the number of triangles an edge is part of, of all the edges in the given graph.

```js
import simmelianStrength from 'graphology-metrics/edge/simmelian-strength';

// To compute strength for every edge:
const strengths = simmelianStrength(graph);

// To directly map the result onto edge attributes (`simmelianStrength`):
simmelianStrength.assign(graph);
```

### Chi square

Function computing a `chi square` significance test for each edge.

The test results are a `number` or `undefined`. `undefined` means the test could not be fully computed due to observed weight being less than expected. Those cases should be filtered out.

To ease filtering the edges based on the results one can use the provided `thresholds`: this object gives the minimum value of `chi square` for each level of significance expressed as `p values`.

```js
import chiSquare from 'graphology-metrics/edge/chi-square';

// To compute strength for every edge using weight attribute:
const chiSquareResults = chiSquare(graph);
// To compute strength for every edge using weight custom attribute:
const chiSquareResults = chiSquare(graph, 'cooccurrences');
// To compute strength for every edge defining weight as an edge function:
const chiSquareResults = chiSquare(graph, (_, attr) => attr.cooccurrences);

// To directly map the result onto edge attribute `chiSquare`:
chiSquare.assign(graph);

// Filtering out unsignificant edges
graph
  .filterEdges((_, atts) => atts.chiSquare < chiSquare.thresholds['0.01'])
  .forEach(e => {
    graph.dropEdge(e);
  });
```

_Arguments_

- **graph** _Graph_: target graph.
- **getEdgeWeight** <span class="code">?string\|function</span> <span class="default">weight</span>: Name of the edge weight attribute or getter function.

### G square

Function computing a `g square` significance test for each edge.

The test results are a `number` or `undefined`. `undefined` means the test could not be fully computed due to observed weight being less than expected. Those cases should be filtered out.

To ease filtering the edges based on the results one can use the provided `thresholds`: this object gives the minimum value of `g square` for each level of significance expressed as `p values`.

```js
import gSquare from 'graphology-metrics/edge/g-square';

// To compute strength for every edge using weight attribute:
const gSquareResults = gSquare(graph);
// To compute strength for every edge using weight custom attribute:
const gSquareResults = gSquare(graph, 'cooccurrences');
// To compute strength for every edge defining weight as an edge function:
const gSquareResults = gSquare(graph, (_, attr) => attr.cooccurrences);

// To directly map the result onto edge attribute `gSquare`:
gSquare.assign(graph);

// Filter out unsignificant edges
graph
  .filterEdges((_, atts) => atts.gSquare < gSquare.thresholds['0.01'])
  .forEach(e => {
    graph.dropEdge(e);
  });
```

_Arguments_

- **graph** _Graph_: target graph.
- **getEdgeWeight** <span class="code">?string\|function</span> <span class="default">weight</span>: Name of the edge weight attribute or getter function.

## Centrality

### Betweenness centrality

Computes the betweenness centrality for every node.

```js
import betweennessCentrality from 'graphology-metrics/centrality/betweenness';

// To compute centrality for every node:
const centralities = betweennessCentrality(graph);

// To directly map the result onto nodes' attributes (`betweennessCentrality`):
betweennessCentrality.assign(graph);

// To directly map the result onto a custom attribute:
betweennessCentrality.assign(graph, {nodeCentralityAttribute: 'myCentrality'});

// To ignore weights
const centralities = betweennessCentrality(graph, {getEdgeWeight: null});

// To use a getter function for weights
const centralities = betweennessCentrality(graph, {
  getEdgeWeight: (_, attr) => attr.importance
});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **nodeCentralityAttribute** _?string_ [`betweennessCentrality`]: Name of the centrality attribute to assign.
  - **getEdgeWeight** _?string\|function_ [`weight`]: Name of the edge weight attribute or getter function.
  - **normalized** _?boolean_ [`true`]: should the result be normalized?

### Edge betweenness centrality

Computes the betweenness centrality for every edge.

```js
import edgeBetweennessCentrality from 'graphology-metrics/centrality/edge-betweenness';

// To compute centrality for every edge:
const centralities = edgeBetweennessCentrality(graph);

// To directly map the result onto edges' attributes (`edgeBetweennessCentrality`):
edgeBetweennessCentrality.assign(graph);

// To directly map the result onto a custom attribute:
edgeBetweennessCentrality.assign(graph, {
  edgeCentralityAttribute: 'myCentrality'
});

// To ignore weights
const centralities = edgeBetweennessCentrality(graph, {getEdgeWeight: null});

// To use a getter function for weights
const centralities = edgeBetweennessCentrality(graph, {
  getEdgeWeight: (_, attr) => attr.importance
});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **edgeCentralityAttribute** _?string_ [`betweennessCentrality`]: Name of the centrality attribute to assign.
  - **getEdgeWeight** _?string\|function_ [`weight`]: Name of the edge weight attribute or getter function.
  - **normalized** _?boolean_ [`true`]: should the result be normalized?

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
  - **nodeCentralityAttribute** _?string_ [`closenessCentrality`]: name of the node attribute that will be assigned the closeness centrality.
  - **wassermanFaust** _?boolean_ [`false`]: whether to use Wasserman & Faust's normalization scheme.

### Degree centrality

Computes the degree centrality for every node.

```js
import {
  degreeCentrality,
  inDegreeCentrality,
  outDegreeCentrality
} from 'graphology-metrics/centrality/degree';

// To compute degree centrality for every node:
const centralities = degreeCentrality(graph);

// To directly map the result onto nodes' attributes (`degreeCentrality`):
degreeCentrality.assign(graph);

// To directly map the result onto a custom attribute:
degreeCentrality.assign(graph, {nodeCentralityAttribute: 'myCentrality'});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **nodeCentralityAttribute** _?string_ [`degreeCentrality`]: name of the centrality attribute to assign.

### Eigenvector centrality

Computes the eigenvector centrality of a graph's nodes.

```js
import eigenvectorCentrality from 'graphology-metrics/centrality/eigenvector';

// To compute the eigenvector centrality and return the score per node:
const scores = eigenvectorCentrality(graph);

// To directly map the result to nodes' attributes:
eigenvectorCentrality.assign(graph);

// Note that you can also pass options to customize the algorithm:
const p = eigenvectorCentrality(graph, {tolerance: 1e-3});

// To ignore your graph's weights
eigenvectorCentrality.assign(graph, {getEdgeWeight: null});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **nodeCentralityAttribute** _?string_ [`eigenvectorCentrality`]: name of the node attribute that will be assigned the eigenvector centrality.
  - **getEdgeWeight** _?string\|function_ [`weight`]: name of the edges' weight attribute or getter function.
  - **maxIterations** _?number_ [`100`]: maximum number of iterations to perform.
  - **tolerance** _?number_ [`1.e-6`]: convergence error tolerance.

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
  - **getEdgeWeight** _?string\|function_ [`weight`]: name of the edges' weight attribute or getter function.
  - **nodeHubAttribute** _?string_ [`hub`]: name of the node attribute holding hub information.
  - **nodeAuthorityAttribute** _?string_ [`authority`]: name of the node attribute holding authority information.
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
const p = pagerank(graph, {alpha: 0.9});

// To ignore your graph's weights
pagerank.assign(graph, {getEdgeWeight: null});
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **nodePagerankAttribute** _?string_ [`pagerank`]: name of the node attribute that will be assigned the pagerank score.
  - **getEdgeWeight** _?string\|function_ [`weight`]: name of the edges' weight attribute or getter function.
  - **alpha** _?number_ [`0.85`]: damping parameter of the algorithm.
  - **maxIterations** _?number_ [`100`]: maximum number of iterations to perform.
  - **tolerance** _?number_ [`1.e-6`]: convergence error tolerance.

## Layout quality metrics

### Connected Closeness

TODO...

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
