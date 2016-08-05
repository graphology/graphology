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
* **Self-links**: Does the graph allow self links?
* **Observable**: Can one react to the changes of the graph.
* **Mutable**: Should the graph be mutable or not (tmtc @DavidBruant)

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
(node): key => attributes
(edge): key + [sourceKey, targetKey] => attributes
```

Like a JS `Map`, nodes & edges' keys can be anything, even references.

## API

* [Instantiation](#instantiation)
* [Properties](#properties)
* [Mutations](#mutations)
* [Getters](#getters)
* [Iteration](#iteration)
* [Events](#events)
* [Utilities](#utilities)

**Concerning bunches**

As in networkx, some methods can read from various iterables understood as node & edges bunches.

As a general rule, if the iterable is list-like (Array, Set), the values will be understood as keys. Whereas, if the iterable is key-value-like (Object, Map), then, the keys will be understood as keys and the values as attributes.

### Instantiation

```ts
const graph = new Graph(data, options);
```

The input data may only be the following or another graph instance.

```ts
interface SerializedNode<any> {
  0: any;    // Key
  1: Object; // Attributes
}

interface SerializedEdge<any> {
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

TODO: options regarding performance hints & index generation.

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

#### #.observable

Is the graph observable?

```ts
const isObservable: boolean = graph.observable;
```

### Mutations

#### #.addNode

Adds a single node to the graph.

```ts
graph.addNode(key: any, [attributes: Object]);
```

#### #.import

Adding a serialized graph.

#### #.importNode / #.importNodes

Adding serialized nodes.

#### #.addNodesFrom

Adds nodes from an iterable.

```ts
graph.addNodesFrom(nodes: iterable);
```

#### #.addEdge, #.addDirectedEdge

Adds a single directed edge to the graph.

```ts
graph.addEdge(key: any, source: any, target: any, [attributes: Object]);
```

Will throw if either the source or target not were not to be found in the graph.

#### #.importEdge / #.importEdges

Adds serialized edges.

#### #.addUndirectedEdge

Adds a single undirected edge to the graph.

```ts
graph.addUndirectedEdge(key: any, node1: any, node2: any, [attributes: Object]);
```

Will throw if either the source or target not were not to be found in the graph.

Note that under the hood, both nodes will be mapped to ids and stored sorted so that, not matter the order you put them in, the memory structure will never change.

#### #.dropNode

Drops the given node.

```ts
graph.dropNode(key: any);
```

Will throw if the node is not found in the graph.

#### #.dropNodes

Drops the given node bunch & all the edges related to this node.

```ts
graph.dropNodes(keys: iterable);
```

Will throw if any of the nodes is not found in the graph.

#### #.dropEdge

Drops the given edge.

```ts
graph.dropEdge(key: any);
```

Will throw if the edge is not found in the graph.

#### #.dropEdges

Drops the given edge bunch.

```ts
graph.dropEdges(keys: iterable);
```

Will throw if any of the edges is not found in the graph.

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

#### #.getEdge / #.getFirstEdge

Retrieves the first edge between two nodes.

```ts
const edge = graph.getEdge(source: any, target: any);
```

#### #.export

Exports the serialized graph. (Used by #.toJSON).

#### #.exportNode / #.exportNodes

Exports a node bunch in a serialized way.

```ts
const serializedNode: SerializedNode = graph.exportNode(key: any);
const serializedNodes: Array<SerializedNode> = graph.exportNodes(keys: iterable);
```

#### #.exportEdge / #.exportEdges

Exports a node bunch in a serialized way.

```ts
const serializedEdge: SerializedEdge = graph.exportEdge(key: any);
const serializedEdges: Array<SerializedEdge> = graph.exportEdges(keys: iterable);
```

#### #.degree / #.inDegree / #.outDegree

Retrieves the degree of the given node.

```ts
const degree: number = graph.degree(key: any, [selfLoops: boolean]);
```

Will throw if the node is not found in the graph.

#### #.source

Retrieves the source of the given edge.

```ts
const sourceNode = graph.source(key: any);
```

Will throw if the edge is not in the graph.

#### #.target

Retrieves the target of the given edge.

```ts
const targetNode = graph.target(key: any);
```

Will throw if the edge is not in the graph.

#### #.extremities

Retrieves the extremities of the given edge.

```ts
interface Extremities<any> {
  0: any; // Node n°1
  1: any; // Node n°2
}

const extremities: Extremities = graph.extremities(key: any);
```

Will throw if the edge is not in the graph.

#### #.directed

Checks whether the given edge is directed or not.

```ts
const isTheEdgeDirected: boolean = graph.directed(key: any);
```

Will throw if the edge is not in the graph.

#### #.getNodeAttribute

```ts
const attribute: any = graph.getNodeAttribute(key: any, name: string);
```

Will throw if the node is not found in the graph.

#### #.getNodeAttributes

```ts
const attributes: Object = graph.getNodeAttributes(key: any);
```

Will throw if the node is not found in the graph.

#### #.getEdgeAttribute

```ts
const attribute: any = graph.getEdgeAttribute(key: any, name: string);
```

Will throw if the edge is not in the graph.

#### #.getEdgeAttributes

```ts
const attributes: Object = graph.getEdgeAttributes(key: any);
```

Will throw if the edge is not in the graph.

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

Iterations methods always only give access to nodes' & edges' keys and not attributes. The getter methods should be used to retrieve attributes during iteration.

#### Nodes

```
#.nodes()
#.forEachNode()
#.createNodeIterator()
#.order
```

#### Edges

```
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
#.neighbors()
#.forEachNeighbor()
#.createNeighborIterator()
#.countNeighbors()

#.inNeighbors()
...
#.outNeighbors()
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

#### setNodeAttribute

```ts
graph.on('setNodeAttribute', (key: any, name: string, value: any));
```

#### setEdgeAttribute

```ts
graph.on('setEdgeAttribute', (key: any, name: string, value: any));
```

### Utilities

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
