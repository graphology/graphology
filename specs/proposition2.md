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

**Suggestions**

```js
Graph => MultiMixedGraph
DirectedGraph
UndirectedGraph
MixedGraph
SimpleGraph
MultiGraph
// ... Then all combinations of the two criteria above
```

## Loose questions

* What about nested mutability.

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

#### #.addEdge / #.addDirectedEdge

Will throw if either the source or the target key is not found in the graph.

```ts
const graph: Graph = graph.addEdge(key: any, sourceKey: any, targetKey: any, [attributes: Object]);
```

#### #.addUndirectedEdge

Will throw if either the source or the target key is not found in the graph.

```ts
const graph: Graph = graph.addUndirectedEdge(key: any, sourceKey: any, targetKey: any, [attributes: Object]);
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

#### #.setNodeAttribute

```ts
// Using a function to swap the value
const graph: Graph = graph.setNodeAttribute(key: any, name: string, fn: (attr: any) => any);

// Otherwise
const graph: Graph = graph.setNodeAttribute(key: any, name: string, value: any);
```

#### #.removeNodeAttribute

```ts
const graph: Graph = graph.removeNodeAttribute(key: any, name: string);
```

#### #.replaceNodeAttributes

```ts
const graph: Graph = graph.replaceNodeAttributes(key: any, attributes: Object);
```

#### #.mergeNodeAttributes

```ts
const graph: Graph = graph.mergeNodeAttributes(key: any, attributes: Object);
```

#### #.setEdgeAttribute

```ts
// Using a function to swap the value
const graph: Graph = graph.setEdgeAttribute(key: any, name: string, fn: (attr: any) => any);

// Otherwise
const graph: Graph = graph.setEdgeAttribute(key: any, name: string, value: any);
```

#### #.removeEdgeAttribute

```ts
const graph: Graph = graph.removeEdgeAttribute(key: any, name: string);
```

#### #.replaceEdgeAttributes

```ts
const graph: Graph = graph.replaceEdgeAttributes(key: any, attributes: Object);
```

#### #.mergeEdgeAttributes

```ts
const graph: Graph = graph.mergeEdgeAttributes(key: any, attributes: Object);
```

### Getters

#### #.hasNode

```ts
const isNodeInGraph: boolean = graph.hasNode(key: any);
```

#### #.hasEdge

```ts
const isEdgeInGraph: boolean = graph.hasEdge(key: any);
```

#### #.hasEdgeBetween

```ts
const suchEdgeExist: boolean = graph.hasEdgeBetween(source: any, target: any);
```

#### #.degree / #.inDegree / #.outDegree

```ts
const degree: number = graph.degree(key: any, [selfLoops: boolean]);
```

#### #.source

```ts
const node: any = graph.source(key: any);
```

#### #.target

```ts
const node: any = graph.target(key: any);
```

#### #.extremities

```ts
interface Extremities {
  source: any;
  target: any;
}

const extremities: Extremities = graph.extremities(key: any);
```

#### #.getNodeAttribute

```ts
const attribute: any = graph.getNodeAttribute(key: any, name: string);
```

#### #.getNodeAttributes

```ts
const attributes: Object = graph.getNodeAttributes(key: any);
```

#### #.getEdgeAttribute

```ts
const attribute: any = graph.getEdgeAttribute(key: any, name: string);
```

#### #.getEdgeAttributes

```ts
const attributes: Object = graph.getEdgeAttributes(key: any);
```

### Iterators

*Note1*: Each `.forEach*` method should be considered as having its `map`, `filter` etc. counterparts.

*Note2*: Iterated values' format should be discussed.

*Note3*: For some methods, it would be a good thing to provide an iterator on multiple targets.

*Latest idea*: iterators should only provide keys and have array-giving counterparts such as `#.neighbors` and `#.inEdge`.

#### #.forEachNode

```ts
interface NodeData {
  key: any;
}

graph.forEachNode(callback: (node: NodeData, index: number));
```

#### #.forEachEdge

```ts
interface EdgeData {
  key: any;
  source: any;
  target: any;
}

graph.forEachEdge(callback: (edge: EdgeData, index: number));
```

### #.forEachNeighbor / #.forEachInNeighbor / #.forEachOutNeighbor

```ts
interface NodeData {
  key: any;
}

graph.forEachNeighbor(key: any, callback: (node: NodeData, index: number), [selfLoops: boolean]);
```

### #.forEachRelatedEdge / #.forEachInEdge / #.forEachOutEdge / #.forEachUndirectedEdge

```ts
interface EdgeData {
  key: any;
  source: any;
  target: any;
}

graph.forEachInEdge(key: any, callback: (edge: EdgeData, index: number));
```

### Events

The `Graph` class should be an event emitter that one can listen. We should probably stick to the [node](https://nodejs.org/api/events.html) event module to do so.

#### addNode

```ts
graph.on('addNode', (key: any));
```

#### addEdge

```ts
graph.on('addEdge', (key: any, source: any, target: any));
```

#### dropNode

```ts
graph.on('dropNode', (key: any));
```

#### dropEdge

```ts
graph.on('dropEdge', (key: any, source: any, target: any));
```

#### clear

```ts
graph.on('clear', ());
```

#### setNodeAttribute

```ts
graph.on('setNodeAttribute', (key: any, name: string, value: any));
```

#### setEdgeAttribute

```ts
graph.on('setEdgeAttribute', (key: any, name: string, value: any));
```

### Commodities

#### #.toString

Used by JavaScript for string coercion.

```ts
const stringRepresentation: string = graph.toString();
```

Should return something useful such as:

```js
'Graph<14 nodes, 45 edges>'
```

#### #.toJSON

Should return a serialized version of the graph.

Used by JavaScript when using `JSON.stringify`.

```ts
const serializedGraph: Object = graph.toJSON();
```

**Proposition n°1**

```ts
interface SerializedNode {
  key: any;
  attributes: Object;
}

interface SerializedEdge {
  key: any;
  source: any;
  target: any;
  attributes: Object;
}

interface SerializedGraph {
  nodes: Array<SerializedNode>;
  edges: Array<SerializedEdge>;
}
```

The advantage here is that you may easily serialize any kind of graph (but if your keys are objects, you will need some work to rebind the edges to the correct references).

**Proposition n°2**

```ts
interface SerializedGraph {
  nodes: Object;
  edges: Object;
}
```

Serializes the graph as key/value objects but will lose the nodes' whose keys are not serializable.

**Proposition n°3**

Following the methods one could use to serialize an ES6 Map ([reference n°1](http://www.2ality.com/2015/08/es6-map-json.html), [reference n°2](https://github.com/DavidBruant/Map-Set.prototype.toJSON)):

```ts
interface SerializedNode<any|Object> {
  0: any;    // Key
  1: Object; // Attributes
}

interface SerializedEdge<any|Object> {
  0: any;    // Key
  1: any;    // Source
  2: any;    // Target
  3: Object; // Attributes
}

interface SerializedGraph {
  nodes: Array<SerializedNode>;
  edges: Array<SerializedEdge>;
}
```

#### #.inspect

Should return an overview of the graph as a string.

Used by node to display objects when printing them through the console.

```ts
const inspected: string = graph.inspect();
```
