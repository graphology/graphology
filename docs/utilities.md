# Utilities

## Import/Export

Methods used to import or export data in a serialized way to avoid the need for data conversion along the way. Those methods should only be used by utilities developer designing subgraph or conversion utilities.

### Regarding graph serialization

**Node**

A node is serialized as an array containing two elements:
  * <span class="code">any</span> The node's key,
  * <span class="code">[object]</span> The node's attributes (can be omitted or null).

```js
graph.addNode('Thomas', {age: 34});
graph.exportNode('Thomas');
>>> ['Thomas', {age: 34}]
```

**Edge**

An edge is serialized as an array containing five elements:
  * <span class="code">any</span> The edge's key (can be null on import),
  * <span class="code">any</span> The edge's source,
  * <span class="code">any</span> The edge's target,
  * <span class="code">[object]</span> The edge's attributes (can be omitted or null),
  * <span class="code">[boolean]</span> Whether the edge is undirected (can be omitted or null).

```js
graph.addNodesFrom(['Thomas', 'Eric']);
graph.addEdgeWithKey('T->E', 'Thomas', 'Eric', {type: 'KNOWS'});
graph.exportEdge('T->E');
>>> ['T->E', 'Thomas', 'Eric', {type: 'KNOWS'}, false]
```

**Graph**

A graph is serializd as an object containing a `nodes` key & a `edges` key:
  * <span class="code">array</span> `nodes`: containing a list of serialized nodes.
  * <span class="code">array</span> `edges`: containing a list of serialized edges.

```js
graph.addNodesFrom(['Thomas', 'Eric']);
graph.addEdgeWithKey('T->E', 'Thomas', 'Eric', {type: 'KNOWS'});
graph.export();
>>> {
  nodes: [
    ['Thomas', null],
    ['Eric', null]
  ],
  edges: [
    ['T->E', 'Thomas', 'Eric', {type: 'KNOWS'}, false]
  ]
}
```

### #.import

Imports a whole serialized graph into the graph.

*Example*

```js
graph.import({
  nodes: [['Thomas', 'Eric']],
  edges: [[null, 'Thomas', 'Eric']]
});

graph.hasNode('Thomas');
>>> true
```

*Arguments*

* **data** <span class="code">serialized graph</span>: graph data to import.

### #.importNode

Imports a single serialized node into the graph.

*Example*

```js
graph.importNode(['Thomas', {eyes: 'blue'}]);

graph.getNodeAttribute('Thomas', 'eyes');
>>> 'blue'
```

*Arguments*

* **node** <span class="code">serialized node</span>: data of the node to import.

### #.importNodes

Imports a list of serialized nodes into the graph.

*Example*

```js
graph.importNodes([
  ['Thomas', {age: 7}],
  ['Eric', {age: 45}]
]);

graph.getNodeAttribute('Eric', 'age');
>>> 45
```

*Arguments*

* **nodes** <span class="code">array</span>: array of serialized nodes.

### #.importEdge

Imports a single serialized edge into the graph.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Eric']);
graph.importEdge(['T->E', 'Thomas', 'Eric', {type: 'KNOWS'}]);

graph.hasEdge('Thomas', 'Eric');
>>> true
```

*Arguments*

* **edge** <span class="code">serialized edge</span>: data of the edge to import.

### #.importEdges

Imports a list of serialized edges into the graph.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Eric', 'John']);
graph.importEdges([
  ['T->E', 'Thomas', 'Eric', {type: 'KNOWS'}],
  ['T->J', 'Thomas', 'John', {type: 'KNOWS'}]
]);

graph.edges('Thomas');
>>> ['T->E', 'T->J']
```

*Arguments*

* **edges** <span class="code">array</span>: array of serialized edges.


### #.export

Exports the whole instance's data as a serialized graph.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Eric']);
graph.addEdgeWithKey('T->E', 'Thomas', 'Eric', {type: 'KNOWS'});
graph.export();
>>> {
  nodes: [
    ['Thomas', null],
    ['Eric', null]
  ],
  edges: [
    ['T->E', 'Thomas', 'Eric', {type: 'KNOWS'}, false]
  ]
}
```

### #.exportNode

Exports a single node from the graph.

*Example*

```js
graph.addNode('Thomas', {age: 34});

graph.exportNode('Thomas');
>>> ['Thomas', {age: 34}]
```

### #.exportNodes

Exports every node or only a bunch of nodes from the graph.

*Example*

```js
graph.addNodesFrom({
  Thomas: {age: 34},
  Martha: {age: 26}
});

graph.exportNodes();
>>> [
  ['Thomas', {age: 34}],
  ['Martha', {age: 26}]
]

graph.exportNodes(['Thomas']);
>>> [
  ['Thomas', {age: 34}]
]
```

*Arguments*

* **nodes** <span class="code">[bunch]</span>: bunch of nodes to export. If not provided, every node will be exported.

### #.exportEdge

Exports a single edge from the graph.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Martha']);
graph.addEdgeWithKey('T->M', 'Thomas', 'Martha', {type: 'KNOWS'});

graph.exportEdge('T->M');
>>> ['T->M', 'Thomas', 'Martha', {type: 'KNOWS'}, false]
```

### #.exportEdges

Exports every edge or only a bunch of edges from the graph.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Martha', 'Eric']);
graph.addEdgeWithKey('T->M', 'Thomas', 'Martha', {type: 'KNOWS'});
graph.addEdgeWithKey('M->E', 'Martha', 'Eric', {type: 'KNOWS'});

graph.exportEdges();
>>> [
  ['T->M', 'Thomas', 'Martha', {type: 'KNOWS'}, false],
  ['M->E', 'Martha', 'Eric', {type: 'KNOWS'}, false]
]

graph.exportEdges(['T->M']);
>>> [
  ['T->M', 'Thomas', 'Martha', {type: 'KNOWS'}, false]
]
```

*Arguments*

* **edges** <span class="code">[bunch]</span>: bunch of edges to export. If not provided, every edge will be exported.

### #.exportDirectedEdges

Exports every directed edge or only a bunch of directed edges from the graph.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Martha', 'Eric']);
graph.addEdgeWithKey('T->M', 'Thomas', 'Martha', {type: 'KNOWS'});
graph.addEdgeWithKey('M->E', 'Martha', 'Eric', {type: 'KNOWS'});
graph.addUndirectedEdgeWithKey('A', 'Thomas', 'Eric');

graph.exportDirectedEdges();
>>> [
  ['T->M', 'Thomas', 'Martha', {type: 'KNOWS'}, false],
  ['M->E', 'Martha', 'Eric', {type: 'KNOWS'}, false]
]

graph.exportEdges(['T->M']);
>>> [
  ['T->M', 'Thomas', 'Martha', {type: 'KNOWS'}, false]
]
```

*Arguments*

* **edges** <span class="code">[bunch]</span>: bunch of directed edges to export. If not provided, every directed edge will be exported.

### #.exportUndirectedEdges

Exports every undirected edge or only a bunch of undirected edges from the graph.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Martha', 'Eric']);
graph.addEdgeWithKey('T->M', 'Thomas', 'Martha', {type: 'KNOWS'});
graph.addEdgeWithKey('M->E', 'Martha', 'Eric', {type: 'KNOWS'});
graph.addUndirectedEdgeWithKey('A', 'Thomas', 'Eric');

graph.exportUndirectedEdges();
>>> [
  ['A', 'Thomas', 'Eric', {}, true]
]

graph.exportUndirectedEdges(['A']);
>>> [
  ['A', 'Thomas', 'Eric', {}, true]
]
```

*Arguments*

* **edges** <span class="code">[bunch]</span>: bunch of undirected edges to export. If not provided, every undirected edge will be exported.

### #.copy

Returns a copy of the current instance.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Eric']);
graph.addEdgeWithKey('T->E', 'Thomas', 'Eric', {type: 'KNOWS'});

const newGraph = graph.copy();
newGraph.hasNode('Eric');
>>> true
newGraph.order
>>> 2
newGraph.size
>>> 1
graph.type === newGraph.type
>>> true
```

### #.emptyCopy

Returns an empty copy of the current instance retaining the type & the options of the graph.

This is useful to functions needing to return subgraphs or near identical copies of a graph such as reversed graph or graph converted to another type altogether.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Eric']);
graph.addEdgeWithKey('T->E', 'Thomas', 'Eric', {type: 'KNOWS'});

const newGraph = graph.emptyCopy();
newGraph.hasNode('Eric');
>>> false
newGraph.order
>>> 0
newGraph.size
>>> 0
graph.type === newGraph.type
>>> true
```

*Arguments*

* **options** <span class="code">[object]</span>: options to merge to create a slightly different graph.

## Known properties

### #.toJSON

Alias of the [`#.export`](#export) method used by JavaScript to serialize the `Graph` instance when using `JSON.stringify`.

### #.toString

Method used by JavaScript to perform string coercion. Will return some informative string about the graph.

```
Graph<12 nodes, 14 edges>
```

### #.inspect

Used by node.js to pretty print the object when using `console.log`.
