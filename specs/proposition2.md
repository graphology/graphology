# API Specs Proposition n°2

## Rationale

This proposition will assume the following:

* A node is the combination of a `key` which can be anything, and an optional `value` which is a key-value store whose integrity should be managed by the graph itself.
* An edge is also the combination of a `key` which can be anything, and an optinal `value` which is a key-value store whose integrity should be managed by the graph itself. Oviously, an edge has to go from a source node (by key) to a target node (by key).

**Node**: `(key) => value`

**Edge**: `(key) + (source, target) => value`

## Note

* This proposition assumes a very strict position about the value of the nodes as a protected attributes store for the following reasons:
  * Possibility of localized events (needed by rendering engines to perform some kind of incremental updates).
  * Underlying implementation freedom (you want to use a FloatArray as storage, well you can).
  * Possibility to implement attributes' indexes very easily.
  * Possibility to enforce some "good practices" about specific node attributes such as checking that an edge's weight, or a node's x or y positions are correctly given as numerical values.
* It could be possible to make edges' key optional but this create issues concerning parallel edges.
* The keys of nodes & edges can be absolutely anything (scalar or not) and can be mutated *ad lib* without altering the structure of the graph.
* Serialization should somewhat be fairly easy to do.
* Once again, this implementation's rationale is very inspired by [networkx](https://networkx.github.io/).
* The reason why we have to split the concepts using both `key` and `value` is mostly because it's the only way to have both a data structure oblivious of what you give as "nodes" at the same time as keeping the possibility to query the graph by `key` in a performant way (namely `O(1)`).
* We will use `attributes` rather than `properties` to designate the nodes' & edges' `key=>value` pairs stored as value to remain consistent with `gexf`, `networkx` and many other plus staying away from JavaScript naming about object property.

## Graph types

The default graph should be mixed (both directed & undirected edges), support self-loops & parallel edges.

There should probably be subtypes of graph enabling the implementation to perform optimizations if the user can declare beforehand the type of their graph.

## Loose questions

* Should an edge be added with non-existent source or target: should we throw or add the missing nodes? (throw)

## API

### Instantiation

The constructor should accept a variety of data to hydrate the graph. All those polymorphisms should be decided later on.

```ts
const graph: Graph = new Graph([data: any, options: Object]);
```

It should be possible to use different typed constructors to give performance hints to the underlying implementation. Those alternative constructors should be decided later on.

```ts
const directedGraph: DirectedGraph = new DirectedGraph([data: any, options: Object]);
```

### Properties

*Note*: @jacomyal raises a valid point by saying those should probably be accessed through methods.

### #.order

Number of nodes in the graph (read-only).

```ts
const order: number = graph.order;
```

### #.size

Number of edges in the graph (read-only).

```ts
const size: number = graph.size;
```

### Mutation

#### #.addNode

```ts
const graph: Graph = graph.addNode(key: any, [attributes: Object]);
```

#### #.addEdge

Will throw if either the source or the target key is not found in the graph.

```ts
const graph: Graph = graph.addEdge(key: any, sourceKey: any, targetKey: any, [attributes: Object]);
```

#### #.dropNode

Will throw if the node doesn't exist in the graph.

```ts
const graph: Graph = graph.dropNode(key: any);
```

#### #.dropEdge

Will throw if the edge isn't in the graph.

```ts
const graph: Graph = graph.dropEdge(key: any);
```

#### #.clear

```ts
const graph: Graph = graph.clear();
```

### Getters

#### #.degree / #.inDegree / #.outDegree

```ts
const degree: number = graph.degree(key: any, [selfLoops: boolean]);
```

### Iterators

*Note*: Each `.forEach*` method should be considered as having its `map`, `filter` etc. counterparts.

#### #.forEachNode

```ts
interface NodeData {
  key: any;
}

graph.forEachNode(callback: (node: NodeData, index: number), thisArg: any);
```

#### #.forEachEdge

```ts
interface EdgeData {
  key: any;
  source: any;
  target: any;
}

graph.forEachEdge(callback: (edge: EdgeData, index: number), thisArg: any);
```
