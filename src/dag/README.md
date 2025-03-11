# Graphology DAG

Functions related to Directed Acyclic Graphs (DAGs) and to be used with [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-dag
```

## Usage

- [hasCycle](#hascycle)
- [willCreateCycle](#willcreatecycle)
- [topologicalSort](#topologicalsort)
- [topologicalGenerations](#topologicalgenerations)
- [forEachNodeInTopologicalOrder](#foreachnodeintopologicalorder)
- [forEachTopologicalGeneration](#foreachtopologicalgeneration)

### hasCycle

Function returning whether the given directed graph contains at least one cycle.

Note that this function will also work with a disconnected graph.

```js
import {hasCycle} from 'graphology-dag';
// Alternatively, to load only the relevant code:
import hasCycle from 'graphology-dag/has-cycle';

const graph = new DirectedGraph();
graph.mergeEdge(0, 1);
graph.mergeEdge(1, 2);
graph.mergeEdge(2, 3);

hasCycle(graph);
>>> false

graph.mergeEdge(3, 0);

hasCycle(graph);
>>> true
```

### willCreateCycle

Function returning whether adding the given directed edge to a DAG will create an undesired cycle.

Note that this function expects a valid DAG and even if passing a cyclic graph could work it could also very well lead to undefined behavior ranging from an infinite loop to overkill memory usage.

Note finally that this function will also work with DAG forests (sets of disconnected DAGs living in the same graph instance).

```js
import {willCreateCycle} from 'graphology-dag';
// Alternatively, to load only the relevant code:
import willCreateCycle from 'graphology-dag/will-create-cycle';

const graph = new DirectedGraph();
graph.mergeEdge(0, 1);
graph.mergeEdge(1, 2);
graph.mergeEdge(2, 3);

willCreateCycle(graph, 3, 0);
>>> true
willCreateCycle(graph, 0, 2);
>>> false
```

### topologicalSort

Function returning an array of nodes representing a possible topological ordering of the given DAG.

Note that this function will throw if given graph has any cycle, is able to work on mixed graphs containing only directed edges and can work on disconnected graphs (a DAG forest).

```js
import {topologicalSort} from 'graphology-dag';
// Alternatively, to load only the relevant code:
import {topologicalSort} from 'graphology-dag/topological-sort';

const graph = new DirectedGraph();
graph.mergeEdge(0, 1);
graph.mergeEdge(1, 2);
graph.mergeEdge(2, 3);

topologicalSort(graph);
>>> ['0', '1', '2', '3']
```

### topologicalGenerations

Function returning an array of array of nodes representing the successive generations of the topological ordering of the given DAG.

Note that this function will throw if given graph has any cycle, is able to work on mixed graphs containing only directed edges and can work on disconnected graphs (a DAG forest).

```js
import {topologicalGenerations} from 'graphology-dag';
// Alternatively, to load only the relevant code:
import {topologicalGenerations} from 'graphology-dag/topological-sort';

const graph = new DirectedGraph();
graph.mergeEdge(0, 1);
graph.mergeEdge(1, 2);
graph.mergeEdge(0, 3);

topologicalGenerations(graph);
>>> [[ '0' ], ['1', '3'], ['2']]
```

### forEachNodeInTopologicalOrder

Function iterating over the given DAG's nodes in topological order using a callback function.

Note that this function will throw if given graph has any cycle, is able to work on mixed graphs containing only directed edges and can work on disconnected graphs (a DAG forest).

```js
import {forEachNodeInTopologicalOrder} from 'graphology-dag';
// Alternatively, to load only the relevant code:
import {forEachNodeInTopologicalOrder} from 'graphology-dag/topological-sort';

const graph = new DirectedGraph();
graph.mergeEdge(0, 1);
graph.mergeEdge(1, 2);
graph.mergeEdge(2, 3);

forEachNodeInTopologicalOrder(graph, (node, attr, generationIndex) => {
  // Note that generationIndex will be monotonically increasing from 0 to n.
  console.log(node, attr, generationIndex);
});
```

### forEachTopologicalGeneration

Function iterating over the given DAG's generations, represented by an array of node keys, using a callback function.

Note that this function will throw if given graph has any cycle, is able to work on mixed graphs containing only directed edges and can work on disconnected graphs (a DAG forest).

```js
import {forEachTopologicalGeneration} from 'graphology-dag';
// Alternatively, to load only the relevant code:
import {forEachTopologicalGeneration} from 'graphology-dag/topological-sort';

const graph = new DirectedGraph();
graph.mergeEdge(0, 1);
graph.mergeEdge(1, 2);
graph.mergeEdge(2, 3);

forEachTopologicalGeneration(graph, generation => {
  console.log(generation);
});
```

### forEachTransitiveRelation

Function that takes a cartesian product of a node's in-edges with
its out-edges and performs an operation on each pair.

This function is m\*n in time and space, where m is the node's in-degree
and n is the node's out-degree.

```js
import {forEachTransitiveRelation} from 'graphology-dag';
// Alternatively, to load only the relevant code:
import {forEachTransitiveRelation} from 'graphology-dag/transitive';

const graph = new DirectedGraph();
graph.mergeEdge(0, 2);
graph.mergeEdge(1, 2);
graph.mergeEdge(2, 3);
graph.mergeEdge(2, 4);

forEachTransitiveRelation(
  graph,
  2,
  (
    inEdge,
    outEdge,
    inEdgeAttributes,
    outEdgeAttributes,
    source,
    node,
    target,
    sourceAttributes,
    nodeAttributes,
    targetAttributes
  ) => {
    console.log(`${source} -> ${target}`);
  }
);

// >>> 0 -> 3
// >>> 0 -> 4
// >>> 1 -> 3
// >>> 1 -> 4
```

### bypassNode

Function that fully connects each of a node's in-neighbors to its
out-neighbors, so that the node can be dropped while preserving its
neighbors' relative order with one another.

This function is m\*n in time and space, where m is the node's in-degree
and n is the node's out-degree.

```js
import {bypassNode} from 'graphology-dag';
// Alternatively, to load only the relevant code:
import bypassNode from 'graphology-dag/transitive';

const graph = new DirectedGraph();
graph.mergeEdge(0, 2);
graph.mergeEdge(1, 2);
graph.mergeEdge(2, 3);
graph.mergeEdge(2, 4);

/* Now the graph looks like:
1    2
 \  /
  3
 / \
4   5
(source nodes on top)
*/

bypassNode(graph, 3);
graph.dropNode(3);

/* After dropping 3:
1  2
 \/
 /\
4  5
*/
```
