---
layout: default
title: Instantiation
nav_order: 3
menu_toc:
  - Options
  - Typed constructors
  - "Static #.from method"
---

# Instantiation

Instantiating a `graphology` Graph object is merely an issue of requiring an implementation and calling it with some options.

Note that if you need to create a Graph using some serialized data or another Graph's data, you should probably check the static [#.from](#static-from-method).

```js
import Graph from 'graphology';

// Here you go:
const graph = new Graph();

// With options:
const graph = new Graph(options);
```

## Options

- **allowSelfLoops** <span class="code">[boolean]</span> <span class="default">true</span>: should the graph allow self-loops?
- **multi** <span class="code">[boolean]</span> <span class="default">false</span>: Should the graph allow parallel edges?
- **type** <span class="code">[string]</span> <span class="default">"mixed"</span>: Type of the graph. One of `directed`, `undirected` or `mixed`.

_Examples_

```js
// Creating a multi-graph with no self-loops
const graph = new Graph({multi: true, allowSelfLoops: false});
```

## Typed constructors

Rather than providing tedious options to the constructor, one can use one of the many handy constructors provided by the implementation to create the desired graph:

```js
import {MultiDirectedGraph} from 'graphology';

const myCustomGraph = new MultiDirectedGraph();
```

By default, the `Graph` object is a simple mixed graph, but here are the different naming "components" that you can use to instantiate a more complex graph:

- **Type of the graph?**: `Directed`, `Undirected` or none (mixed graph).
- **Graph with parallel edges?**: `Multi` or none (simple graph).

Then to build the name, one must order the components likewise:

```
Multi? + Type? + Graph
```

_List of all the typed constructors_

```
DirectedGraph
UndirectedGraph
MultiGraph
MultiDirectedGraph
MultiUndirectedGraph
```

## Static #.from method

Alternatively, one can create a graph from a serialized graph or another `Graph` instance using the static `#.from` method:

_Example_

```js
const graph = Graph.from(data);

// Need some options?
const graph = Graph.from(data, options);

// Also works with typed constructors
const graph = UndirectedGraph.from(data);
```

_Arguments_

- **data** <span class="code">Graph|SerializedGraph</span>: pre-existing data to give to the constructor. This data can either be an existing `Graph` instance, and in this case both nodes & edges will be imported from the given graph, or a serialized graph whose format is described [here](serialization#format).
- **options** <span class="code">[object]</span>: options passed to the created graph.

Note that `graphology` will throw an error if you try to instantiate a [typed constructor](#typed-constructors) using inconsistent options.
