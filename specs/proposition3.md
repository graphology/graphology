# API Specs Proposition n°3

## Objectives

Build a specification for a `Graph` object in JavaScript that could serve as a basis for any typical use cases going from graph generation, algorithms (on fairly huge graphs even but never for graphs too big that they would pose memory issues) and even graph rendering.

The idea is to propose a specification with the attached unit tests but not to enforce a particular implementation (even if we'll of course propose one of our own along with a series of relevant modules).

## Rationale

To ensure one can perform virtually every graph-related task with the library, we should aim to abide by the following principle: Graphs being complex objects whose definition is sometimes different according to the use cases and the domains, one should be, by default, be able to do anything with the default `Graph` provided by the library. This means that:

1. The default Graph should accept every case from undirectedness to parallel edges etc.
2. Contrary to other libraries that would have a default graph covering only most basic cases and complexifying the Graph object and APIs when one wants to perform stranger things, our library should by default cover the whole complexity while letting the user provide hints concerning the structure of the graph as means for the underlying implementation to enhance performance.

This approach comes with some advantages:

* The basic Graph will handle every case & never an algorithm will fail to process the provided Graph because of its specificities (except of course if the algorithm tends to apply only to one specific type of Graph).
* The handled Graph object is **always** the same and one doesn't need to learn more than one API to use it.

but also with some quirks:

* the API is compulsorily more verbose (but note that this spec only proposes a "low-level" object that could be associated with other higher-level wrapper libraries for easier handling).

### Facets

Facets are the multiple criteria that one could provide as hint to the implementation:

* **Directedness**: Is the Graph allowing `directed` edges, `undirected` edges or both?
* **Multi**: Does the Graph allow parallel edges?
* **Self-links**: Does the Graph allow self links?
* **Observable**: Can one react to the changes of the Graph.
* **Mutable**: Should the Graph be mutable or not (tmtc @DavidBruant)

Default `Graph` object would then be an observable, mutable, mixed multi Graph allowing self links.

Then the user would be able to hint about the structure of the Graph using the constructor or relying on some handy shortcuts.

```js
const graph = new Graph();
const graph = new DirectedGraph();
const graph = new MultiDirectedGraph();
const graph = new ImmutableGraph();
//...
```

## Structure

The Graph would hold both **nodes** and **edges** both being represented by a key and storing attributes.

```js
(node): key => attributes
(edge): key + [sourceKey, targetKey] => attributes
```

Like a JS `Map`, nodes & edges' keys could be anything, even references.

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

#### #.size

Number of edges in the graph.

#### #.type

Type of the graph. One of:

* `directed`
* `undirected`
* `mixed`

#### #.multi

Is the Graph accepting parallel edges?

#### #.selfLoops

Is the Graph accepting self loops?

#### #.observable

Is the Graph observable?

### Mutations

#### #.clear

Drops every nodes & edges from the Graph, leaving it blank.

```ts
const graph: Graph = graph.clear();
```
