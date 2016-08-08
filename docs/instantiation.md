# Instantiation

Instantiating a `graphology` Graph object is merely an issue of requiring an implementation and calling it with, optionally, some data & options.

```js
import Graph from 'graphology';

// Here you go:
const graph = new Graph();

// With some pre-existing data:
const graph = new Graph(data);

// With options:
const graph = new Graph(null, options);

// With both:
const graph = new Graph(data, options);
```

## Arguments

* **data** <span class="code">[Graph|SerializedGraph]</span>: pre-existing data to give to the constructor. This data can either be an existing `Graph` instance, and in this case both nodes & edges will be imported from the given graph, or a serialized graph whose format is described [here](utilities.md#regarding-graph-serialization).
* **options** <span class="code">[object]</span>: options to customize the behavior of the graph & performance hints:
  * **allowSelfLoops** <span class="code">[boolean]</span> <span class="default">true</span>: should the graph allow self-loops?
  * **defaultEdgeAttributes** <span class="code">[object]</span>: default edge attributes.
  * **defaultNodeAttributes** <span class="code">[object]</span>: default node attributes.
  * **edgeKeyGenerator** <span class="code">[function]</span>: Function used internally by the graph to produce keys for key-less edges. By default, the graph will produce keys as UUID v4 compressed through base91. For more information concerning the function you can provide, see [this](#edge-key-generator-function).
  * **hashDelimiter** <span class="code">[string]</span>: string used as hash delimiter for storing some data internally (undirected edges, typically).
  * **indexes** <span class="code">[object]</span>: Options regarding index computation. For more information, see [this](./advanced.md#indexes).
  * **map** <span class="code">[boolean]</span> <span class="default">false</span>: Should the graph allow references as key like a JavaScript `Map` object?
  * **multi** <span class="code">[boolean]</span> <span class="default">false</span>: Should the graph allow parallel edges?
  * **onDuplicateEdge** <span class="code">[function]</span>: Optional function that will solve the addition of a duplicate edge rather than throwing an error. For more information, see [this](#duplicate-elements).
  * **onDuplicateNode** <span class="code">[function]</span>: Optional function that will solve the addition of a duplicate node rather than throwing an error. For more information, see [this](#duplicate-elements).
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

## Duplicate elements

By default, the API wil throw as soon as someone tries to add a node or an edge already existing in the graph. But it is possible to override this behavior through the `onDuplicateNode` & `onDuplicateEdge` option if needed.

This option is quite convenient for developers wanting to consider the addition of duplicate edges as a weight increment, for instance.

The given functions have therefore the opportunity to mutate the graph instead.

### Duplicate nodes

A graph considering duplicate nodes as incrementing the occurrence of said node.

```js
const solver = (graph, {node}) => {

  // Just incrementing the "occurrences" attribute
  graph.updateNodeAttribute(node, 'occurrences', x => x + 1);
};

const graph = new Graph(null, {onDuplicateNode: solver});

graph.addNode('John', {occurrences: 1});
graph.addNode('John');

graph.getNodeAttributes('John');
>>> {occurrences: 2}
```

*Arguments*

* **graph** <span class="code">Graph</span>: the graph instance.
* **meta** <span class="code">object</span>: information about the duplicate node:
  * **node** <span class="code">any</span>: the node's key.
  * **attributes** <span>object</span>: attributes passed to the `#.addNode` function.

### Duplicate edges

A graph considering duplicate edges as incrementing the weight of said edge.

For multi-graphs, the solving function will only trigger if an edge is added twice with the same key.

```js
const solver = (graph, {edge}) => {

  // Just incrementing the "weight" attribute
  graph.updateEdgeAttribute(edge, 'weight', x => x + 1);
};

const graph = new Graph(null, {onDuplicateEdge: solver});

graph.addNodesFrom(['John', 'Clemence']);
graph.addEdge('John', 'Clemence', {weight: 1});
graph.addEdge('John', 'Clemence');

graph.getEdgeAttributes('John', 'Clemence');
>>> {weight: 2}
```

*Arguments*

* **graph** <span class="code">Graph</span>: the graph instance.
* **meta** <span class="code">object</span>: information about the duplicate edge:
  * **edge** <span class="code">any</span>: the edge's key.
  * **attributes** <span>object</span>: attributes passed to the `#.addNode` function.
