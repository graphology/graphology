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

```js
const graph = new Graph();
const graph = new Graph(null, {type: 'directed'});
const graph = new DirectedGraph();
const graph = new MultiDirectedGraph();
const graph = new ImmutableGraph();
//...
```

## Structure

The graph holds **nodes** and **edges** both being represented by a key and respectively storing attributes.

```js
(node): key => attributes
(edge): key + [sourceKey, targetKey] => attributes
```

Like a JS `Map`, nodes & edges' keys can be anything, even references.

## API

* [Instantiation](#instantiation)
* [Properties](#properties)
* [Mutations](#mutations)

### Instantiation

```js
const graph = new Graph(data, options);
```

TODO: input data & options

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

#### #.addEdge, #.addDirectedEdge

Adds a single directed edge to the graph.

```ts
graph.addEdge(key: any, source: any, target: any, [attributes: Object]);
```

Will throw if either the source or target not were not to be found in the graph.

#### #.addUndirectedEdge

Adds a single undirected edge to the graph.

```ts
graph.addUndirectedEdge(key: any, source: any, target: any, [attributes: Object]);
```

Will throw if either the source or target not were not to be found in the graph.

#### #.clear

Drops every nodes & edges from the graph, leaving it blank.

```ts
graph.clear();
```
