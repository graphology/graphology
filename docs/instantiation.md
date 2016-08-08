# Instantiation

Instantiating a `graphology` Graph object is merely an issue of requiring an implementation and calling it with, optionnally, some data & options.

```js
import Graph from 'graphology';

// Here you go:
const graph = new Graph();

// With some pre-existing dtaa:
const graph = new Graph(data);

// With options:
const graph = new Graph(null, options);

// With both:
const graph = new Graph(data, options);
```

## Arguments

* **data** <span class="code">[Graph|SerializedGraph]</span>: pre-existing data to give to the constructor. This data can either be an existing `Graph` instance, and in this case both nodes & edges will be imported from the given graph, or a serialized graph such as the one you may retrieve from the [`#.export`](./utilities.md#export) method.
* **options** <span class="code">[object]</span>: options to customize the behavior of the graph & performance hints:
  * **allowSelfLoops** <span class="code">[boolean]</span> <span class="default">true</span>: should the graph allow self-loops?
  * **defaultEdgeAttributes** <span class="code">[object]</span>: default edge attributes.
  * **defaultNodeAttributes** <span class="code">[object]</span>: default node attributes.
  * **edgeKeyGenerator** <span class="code">[function]</span>: Function used internally by the graph to produce keys for key-less edges. By default, the graph will produce keys as UUID v4 compressed through base91. For more information concerning the function you can provide, see [this](#edge-key-generator-function).
  * **hashDelimiter** <span class="code">[string]</span>: string used as hash delimiter for storing some data internally (undirected edges, typically).
  * **indexes** <span class="code">[object]</span>: Options regarding index computation. For more information, see [this](./advanced.md#indexes).
  * **map** <span class="code">[boolean]</span> <span class="default">false</span>: Should the graph allow references as key like a JavaScript `Map` object?
  * **multi** <span class="code">[boolean]</span> <span class="default">false</span>: Should the graph allow parallel edges?
  * **type** <span class="code">[string]</span> <span class="default">"mixed"</span>: Type of the graph. One of `directed`, `undirected` or `mixed`.

## Alternative constructors

Rather than providing tedious options to the constructor, one can use one of the many handy constructors provided by the implementation to create the desired graph:

```js
import {MultiDirectedGraph} from 'graphology';

const myCustomGraph = new MultiDirectedGraph();
```

Here are the different naming "components" that you can use to find the correct constructor:

* **Type of the graph?**: `Mixed` (same as none), `Directed`, `Undirected`.
* **Graph with parallel edges?**: `Multi` or `Simple` (same as none).
* **Graph accepting references as keys?**: `Map` or none.

Then to build the name, one must order the components likewise:

```
Multi? + Type? + Graph + Map?
```

*Examples*

```js
MultiGraph
DirectedGraphMap
MultiUndirectedGraphMap
...
```

## Edge key generator function

The provided function takes several arguments:

* **source**: the source of the edge.
* **target**: the target of the edge.
* **attributes**: optional attributes.

*Example*

```js
// To have an incremental id, for instance:
const generator = (function() {
  let id = 0;

  return () => id++;
})();

const graph = new Graph(null, {edgeKeyGenerator: generator});

// To build the id based on the nodes:
const generator = function(source, target, attributes) {
  return `${source}->${target}`;
};

const graph = new Graph(null, {edgeKeyGenerator: generator});
```
