# API Specs Proposition n°3

## Objectives

Build a specification for a `Graph` object in JavaScript that could serve as a basis for any typical use cases going from graph generation, algorithms (on fairly huge graphs even but never for graphs too big that they would pose memory issues) and even graph rendering.

The idea is to propose a specification with the attached unit tests but not to enforce a particular implementation (even if we'll of course propose one of our own along with a series of relevant modules).

## Rationale

To ensure that one may perform every graph-related task with the library, we should aim to abide by the following principle: Graphs being complex objects whose definition is sometimes different according to the use cases and the domains, one should be, by default, be able to do anything with the default graph object provided by the library. This means that:

1. The default graph should accept every case from undirectedness to parallel edges etc.
2. Contrary to other libraries that would have a default graph covering only most basic cases and complexifying the graph object and APIs when one wants to perform stranger things, our library should by default cover the whole complexity while letting the user provide hints concerning the structure of the graph as means for the underlying implementation to enhance performance.

This approach comes with some advantages:

* The basic graph will handle every case & never will an algorithm fail to process the provided graph because of its specificities (except of course if the algorithm tends to apply only to one specific type of graph).
* The handled graph object is **always** the same and one doesn't need to learn more than one API to use it.

but also with some quirks:

* the API is compulsorily more verbose (but note that this spec only proposes a "low-level" object that could be associated with other higher-level wrapper libraries for easier handling).

### Facets

Facets are the multiple criteria that one could provide as performance hints to the implementation:

* **Directedness**: Is the graph allowing `directed` edges, `undirected` edges or both?
* **Multi**: Does the graph allow parallel edges?
* **Map**: Should the graph accept references as keys?
* **?Mutable**: Should the graph be mutable or not (tmtc @DavidBruant) (outside of the standard spec)

The default `Graph` object is therefore be an observable, mutable, mixed multi graph allowing self links.

Then the user would be able to hint about the structure of the graph using the constructor or relying on some handy shortcuts.

```ts
const graph = new Graph();
const graph = new Graph(null, {type: 'directed'});
const graph = new DirectedGraph();
const graph = new MultiDirectedGraph();
const graph = new ImmutableGraph();
//...
```

## Structure

The graph holds **nodes** and **edges** both being represented by a key and respectively storing attributes.

```ts
[node]: (key) => attributes
[edge]: (key) + {sourceKey, targetKey} => attributes
```

Like a JS `Map`, nodes & edges' keys can be anything, even references.

## API

* [Instantiation](#instantiation)
* [Properties](#properties)
* [Mutation](#mutation)
* [Getters](#getters)
* [Iteration](#iteration)
* [Events](#events)
* [Indexes](#indexes)
* [Utilities](#utilities)

**Concerning bunches**

As in networkx, some methods can read from various iterables understood as node & edges bunches.

As a general rule, if the iterable is list-like (Array, Set), the values will be understood as keys. Whereas, if the iterable is key-value-like (Object, Map), then, the keys will be understood as keys and the values as attributes.

**Concerning chaining**

By convention, if the methods' examples don't seem to return a value, then the method returns the instance itself for chaining purposes.

**Concerning errors**

One should expect the graph instance not to fail silently and to throw errors with a useful message (I cannot stress this part enough) whenever someone tries to do something inconsistent like acting on a node or and edge that doesn't exist in the graph or when going against the performance hints given to the constructor.

### Instantiation

```ts
const graph: Graph = new Graph(data: SerializedGraph|Graph, options: Object);
```

The input data may only be the following or another graph instance.

```ts
interface SerializedNode<any|Object> {
  0: any;    // Key
  1: Object; // Attributes
}

interface SerializedEdge<any|Object|boolean> {
  0: any;    // Key
  1: any;    // Source
  2: any;    // Target
  3: Object; // Attributes
  4: boolean // Is directed?
}

interface SerializedGraph {
  nodes: Array<SerializedNode>;
  edges: Array<SerializedEdge>;
}
```

#### Options

* *allowSelfLoops* `boolean` [`true`]: Should the graph accept self loops?
* *type* `string` [`mixed`]: Type of the graph. One of `directed`, `undirected` or `mixed`.
* *map* `boolean` [`false`]: Should the graph accept references as keys like a `Map`?
* *multi* `boolean` [`true`]: Should the graph accept parallel edges.
* *edgeIdGenerator* `function`: Function used by the graph to generate id for the edges' added through the #.addEdge method (probably using uuid v4 compressed through base64 or base91).
* *hashDelimiter* `string`: String delimiter used to compose string hashes when required.
* *indexes* `object`: Handling the index' configuration (lazyness, precomputation etc.)

#### Note on indexes

Indexes are the following:

* Neighbors
* RelatedEdges

They can be computed ahead of time and lazily synchronized. But, by default, they should be computed lazily and synchronized.

#### Facet naming

To see potential facets, see [this](#facets).

```ts
Graph
DirectedGraph
UndirectedGraph

SimpleGraph
SimpleDirectedGraph
SimpleUndirectedGraph

GraphMap
DirectedGraphMap
UndirectedGraphMap

SimpleGraphMap
SimpleDirectedGraphMap
SimpleUndirectedGraphMap
```

### Properties

#### #.order

Number of nodes in the graph.

```ts
const order: number = graph.order;
```

#### #.size

Number of edges in the graph.

```ts
const order: number = graph.size;
```

#### #.type

Type of the graph. One of:

* `directed`
* `undirected`
* `mixed`

```ts
const type: string = graph.type;
```

#### #.multi

Is the graph accepting parallel edges?

```ts
const isMulti: boolean = graph.multi;
```

#### #.selfLoops

Is the graph accepting self loops?

```ts
const hasSelfLoops: boolean = graph.selfLoops;
```

### Mutation

#### #.addNode

Adds a single node to the graph.

```ts
const node: any = graph.addNode(key: any, [attributes: Object]);
```

Note: the node is the same as the key but is likewise for consistency. We drop chaining but chaining is seldom useful in real usecases we came across.

#### #.import

Importing a serialized graph.

```ts
graph.import(data: SerializedGraph);
```

#### #.importNode / #.importNodes

Importing serialized nodes.

```ts
graph.importNode(data: SerializedNode);
graph.importNodes(data: Array<SerializedNode>);
```

#### #.addNodesFrom

Adds nodes from an iterable.

```ts
graph.addNodesFrom(nodes: Iterable);
```

#### #.addEdge, #.addDirectedEdge

Adds an edge (whose type is directed by default unless the graph is specifically said to be undirected) to the graph. Its id will be generated through the `edgeIdGenerator` function.

```ts
const edge: any = graph.addEdge(source: any, target: any, [attributes: Object]);
```


#### #.addEdgeWithKey, #.addDirectedEdgeWithKey

Adds an edge (whose type is directed by default unless the graph is specifically said to be undirected) to the graph with the associated key.

```ts
const edge: any = graph.addEdgeWithKey(key: any, source: any, target: any, [attributes: Object]);
```

#### #.addUndirectedEdge
#### #.addUndirectedEdgeWithKey

#### #.importEdge / #.importEdges

Importing serialized edges.

```ts
graph.importEdge(data: SerializedEdge);
graph.importEdges(data: Array<SerializedEdge>);
```

#### #.dropNode

Drops the given node.

```ts
graph.dropNode(key: any);
```

#### #.dropNodes

Drops the given node bunch & all the edges related to this node.

```ts
graph.dropNodes(keys: Iterable);
```

#### #.dropEdge

Drops the given edge.

```ts
graph.dropEdge(key: any);
```

#### #.dropEdges

Drops the given edge bunch.

```ts
graph.dropEdges(keys: Iterable);
```

#### #.clear

Drops every nodes & edges from the graph, leaving it blank.

```ts
graph.clear();
```

#### #.setNodeAttribute

```ts
graph.setNodeAttribute(key: any, name: string, value: any);
```

#### #.updateNodeAttribute

```ts
graph.updateNodeAttribute(key: any, name: string, updater: function);
```

#### #.replaceNodeAttributes

```ts
graph.replaceNodeAttributes(key: any, attributes: Object);
```

#### #.mergeNodeAttributes

```ts
graph.mergeNodeAttributes(key: any, data: Object);
```

#### #.setEdgeAttribute

```ts
graph.setEdgeAttribute(key: any, name: string, value: any);

// Or, if you provide 4 arguments, it will update the first matching edge:
graph.setEdgeAttribute(source: any, target: any, name: string, value: any);
```

#### #.updateEdgeAttribute

#### #.replaceEdgeAttributes

#### #.mergeEdgeAttributes

### Getters

#### #.hasNode

Checks whether a node exists in the graph.

```ts
const isNodeInGraph: boolean = graph.hasNode(key: any);
```

#### #.hasEdge / #.hasDirectedEdge / #.hasUndirectedEdge

Checks whether an edge exists in the graph.

```ts
// By id
const isEdgeInGraph: boolean = graph.hasEdge(key: any);

// By source, target
const isEdgeInGraph: boolean = graph.hasEdge(source: any, target: any);
```

#### #.getEdge / #.getDirectedEdge / #.getUndirectedEdge

Retrieves the first edge between two nodes.

```ts
const edge: any | null = graph.getEdge(source: any, target: any);
```

#### #.export

Exports the serialized graph. (Used by #.toJSON).

#### #.exportNode / #.exportNodes

Exports a node bunch in a serialized way.

```ts
const serializedNode: SerializedNode = graph.exportNode(key: any);
const serializedNodes: Array<SerializedNode> = graph.exportNodes(keys: Iterable);
```

#### #.exportEdge / #.exportEdges / #.exportDirectedEdges / #.exportUndirectedEdges

Exports a node bunch in a serialized way.

```ts
const serializedEdge: SerializedEdge = graph.exportEdge(key: any);
const serializedEdges: Array<SerializedEdge> = graph.exportEdges(keys: Iterable);
```

#### #.degree / #.inDegree / #.outDegree

Retrieves the degree of the given node.

```ts
const degree: number = graph.degree(key: any, [selfLoops: boolean]);
```

#### #.source

Retrieves the source of the given edge.

```ts
const sourceNode = graph.source(key: any);
```

#### #.target

Retrieves the target of the given edge.

```ts
const targetNode = graph.target(key: any);
```

#### #.extremities

Retrieves the extremities of the given edge.

```ts
interface Extremities<any> {
  0: any; // Node n°1
  1: any; // Node n°2
}

const extremities: Extremities = graph.extremities(key: any);
```

#### #.relatedNode

Retrieves the other end of an edge given the first node.

```ts
const otherEnd = graph.relatedNode(node: any, edge: any);
```

#### #.directed

Checks whether the given edge is directed or not.

```ts
const isTheEdgeDirected: boolean = graph.directed(key: any);
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

### Iteration

Iteration methods should assume the following stances:

* `forEach` iterators (optionally combined with other typical reducers).
* Generators.
* Array-giving methods.
* Counting methods.

Iteration targets are:

* Nodes
* Edges
* A node or bunch of nodes' neighbors
* A node or bunch of nodes' edges

Iterations methods always only give access to nodes' & edges' keys and not attributes. The getter methods should be used to retrieve attributes during iteration. This is designed thusly for performance reasons and to enforce good practices regarding the use of the attributes' setters.

Note that for GraphMap types, some polymorphisms will require a single lookup to be solved (O(1)).

#### Nodes

```
// Possible arguments are:
() => over every nodes

#.nodes()
#.forEachNode()
#.createNodeIterator()
#.order
```

#### Edges

```
// Possible arguments are:
() => over every edges
(nodes: Iterable) => over the given nodes' relevant edges (only once per edge)
(node: any) => over the node's relevant edges
(source: any, target: any) => over relevant edges for the path

#.edges()
#.forEachEdge()
#.createEdgeIterator()
#.size

#.inEdges()
#.inboundEdges()
#.countInEdges()
...
#.outEdges()
#.outboundEdges()
...
#.undirectedEdges()
...
#.directedEdges()
...
```

#### Neighbours

```
// Possible arguments are:
(nodes: Iterable) => over the given nodes' neighbors (but not themselves)
(node: any) => over the neighbors of the node

#.neighbors()
#.forEachNeighbor()
#.createNeighborIterator()
#.countNeighbors()

#.inNeighbors()
#.inboundNeighbors()
...
#.outNeighbors()
#.outboundNeighbors()
...
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

#### updateNode

```ts
graph.on('updateNode', (key: any, type: string, meta: Object));
```

#### updateEdge

```ts
graph.on('updateEdge', (key: any, type: string, meta: Object));
```

### Indexes

Advanced functions that should probably not be used by the common peddler and regarding indexes' memory management.

#### #.computeNeighborsIndex

#### #.clearNeighborsIndex

#### #.computeRelateEdgesIndex

#### #.clearRelatedEdgesIndex

### Utilities

#### #.createEmptyCopy

Returns a new empty graph with the exact same options as the current instance but merged with the optional given ones.

This is useful to functions needing to return subgraphs or near identical copies of a graph such as reversed graph or graph converted to another type altogether.

```ts
const emptyGraph: Graph = graph.createEmptyCopy([options: Object]);
```

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

Following the methods one could use to serialize an ES6 Map ([reference n°1](http://www.2ality.com/2015/08/es6-map-json.html), [reference n°2](https://github.com/DavidBruant/Map-Set.prototype.toJSON)):

#### #.inspect

Should return an overview of the graph as a string.

Used by node to display objects when printing them through the console.

```ts
const inspected: string = graph.inspect();
```
