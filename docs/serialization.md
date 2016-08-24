# Serialization

## Format

**Node**

A node is serialized as an object containing the following keys:
  * **key** <span class="code">any</span> The node's key,
  * **attributes** <span class="code">[object]</span> The node's attributes (can be omitted or null).

```js
graph.addNode('Thomas', {age: 34});
graph.exportNode('Thomas');
>>> {key: 'Thomas', attributes: {age: 34}}
```

**Edge**

An edge is serialized as an object containing the following keys:
  * **key** <span class="code">[any]</span> The edge's key (can be omitted or null on import),
  * **source** <span class="code">any</span> The edge's source,
  * **target** <span class="code">any</span> The edge's target,
  * **attributes** <span class="code">[object]</span> The edge's attributes (can be omitted or null),
  * **undirected** <span class="code">[boolean]</span> Whether the edge is undirected (can be omitted or null).

```js
graph.addNodesFrom(['Thomas', 'Eric']);
graph.addEdgeWithKey('T->E', 'Thomas', 'Eric', {type: 'KNOWS'});
graph.exportEdge('T->E');
>>> {
  key: 'T->E',
  source: 'Thomas',
  target: 'Eric',
  attributes: {type: 'KNOWS'},
  undirected: false
}
```

**Graph**

A graph is serializd as an object containing a `nodes` key & a `edges` key:
  * <span class="code">object</span> `nodes`: containing a list of serialized nodes.
  * <span class="code">object</span> `edges`: containing a list of serialized edges (can be omitted).

```js
graph.addNodesFrom(['Thomas', 'Eric']);
graph.addEdgeWithKey('T->E', 'Thomas', 'Eric', {type: 'KNOWS'});
graph.export();
>>> {
  nodes: [
    {key: 'Thomas'},
    {key: 'Eric'}
  ],
  edges: [
    {
      key: 'T->E',
      source: 'Thomas',
      target: 'Eric',
      attributes: {type: 'KNOWS'}
    }
  ]
}
```

## #.import

Imports a whole serialized graph into the graph.

*Example*

```js
graph.import({
  nodes: [{key: 'Thomas'}, {key: 'Eric'}],
  edges: [{source: 'Thomas', target: 'Eric'}]
});

graph.hasNode('Thomas');
>>> true
```

*Arguments*

* **data** <span class="code">serialized graph|Graph</span>: serialized graph data or another Graph instance.

## #.importNode

Imports a single serialized node into the graph.

*Example*

```js
graph.importNode({key: 'Thomas', attributes: {eyes: 'blue'}});

graph.getNodeAttribute('Thomas', 'eyes');
>>> 'blue'
```

*Arguments*

* **node** <span class="code">serialized node</span>: data of the node to import.

## #.importNodes

Imports a list of serialized nodes into the graph.

*Example*

```js
graph.importNodes([
  {key: 'Thomas', attributes: {age: 7}},
  {key: 'Eric', attributes: {age: 45}}
]);

graph.getNodeAttribute('Eric', 'age');
>>> 45
```

*Arguments*

* **nodes** <span class="code">array</span>: array of serialized nodes.

## #.importEdge

Imports a single serialized edge into the graph.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Eric']);
graph.importEdge({
  key:'T->E',
  source: 'Thomas',
  target: 'Eric',
  attributes: {type: 'KNOWS'}
});

graph.hasEdge('Thomas', 'Eric');
>>> true
```

*Arguments*

* **edge** <span class="code">serialized edge</span>: data of the edge to import.

## #.importEdges

Imports a list of serialized edges into the graph.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Eric', 'John']);
graph.importEdges([
  {
    key:'T->E',
    source: 'Thomas',
    target: 'Eric',
    attributes: {type: 'KNOWS'}
  },
  {
    key:'T->J',
    source: 'Thomas',
    target: 'John',
    attributes: {type: 'KNOWS'}
  }
]);

graph.edges('Thomas');
>>> ['T->E', 'T->J']
```

*Arguments*

* **edges** <span class="code">array</span>: array of serialized edges.


## #.export

Exports the whole instance's data as a serialized graph.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Eric']);
graph.addEdgeWithKey('T->E', 'Thomas', 'Eric', {type: 'KNOWS'});
graph.export();
>>> {
  nodes: [
    {key: 'Thomas'},
    {key: 'Eric'}
  ],
  edges: [
    {
      key: 'T->E',
      source: 'Thomas',
      target: 'Eric',
      attributes: {type: 'KNOWS'}
    }
  ]
}
```

## #.exportNode

Exports a single node from the graph.

*Example*

```js
graph.addNode('Thomas', {age: 34});

graph.exportNode('Thomas');
>>> {key: 'Thomas', attributes: {age: 34}}
```

## #.exportNodes

Exports every node or only a bunch of nodes from the graph.

*Example*

```js
graph.addNodesFrom({
  Thomas: {age: 34},
  Martha: {age: 26}
});

graph.exportNodes();
>>> [
  {key: 'Thomas', attributes: {age: 34}},
  {key: 'Eric', attributes: {age: 26}}
]

graph.exportNodes(['Thomas']);
>>> [
  {key: 'Thomas', attributes: {age: 34}},
]
```

*Arguments*

1. **None**: exporting every node.
2. **Bunch of nodes**: exporting the given bunch.
  * **nodes** <span class="code">[bunch]</span>: bunch of nodes to export.

## #.exportEdge

Exports a single edge from the graph.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Martha']);
graph.addEdgeWithKey('T->M', 'Thomas', 'Martha', {type: 'KNOWS'});

graph.exportEdge('T->M');
>>> {
  key: 'T->M',
  source: 'Thomas',
  target: 'Martha',
  attributes: {type: 'KNOWS'}
}
```

## #.exportEdges

Exports every edge or only a bunch of edges from the graph.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Martha', 'Eric']);
graph.addEdgeWithKey('T->M', 'Thomas', 'Martha', {type: 'KNOWS'});
graph.addEdgeWithKey('M->E', 'Martha', 'Eric', {type: 'KNOWS'});

graph.exportEdges();
>>> [
  {
    key: 'T->M',
    source: 'Thomas',
    target: 'Martha',
    attributes: {type: 'KNOWS'}
  },
  {
    key: 'M->E',
    source: 'Martha',
    target: 'Eric'
  }
]

graph.exportEdges(['T->M']);
>>> [
  {
    key: 'T->M',
    source: 'Thomas',
    target: 'Martha',
    attributes: {type: 'KNOWS'}
  }
]
```

*Arguments*

1. **None**: exporting every edge.
2. **Bunch of edges**: exporting the given bunch.
  * **edges** <span class="code">[bunch]</span>: bunch of edges to export.

## #.exportDirectedEdges

Exports every directed edge or only the directed edges in the provided bunch from the graph.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Martha', 'Eric']);
graph.addEdgeWithKey('T->M', 'Thomas', 'Martha', {type: 'KNOWS'});
graph.addEdgeWithKey('M->E', 'Martha', 'Eric', {type: 'KNOWS'});
graph.addUndirectedEdgeWithKey('A', 'Thomas', 'Eric');

graph.exportDirectedEdges();
>>> [
  {
    key: 'T->M',
    source: 'Thomas',
    target: 'Martha',
    attributes: {type: 'KNOWS'}
  },
  {
    key: 'M->E',
    source: 'Martha',
    target: 'Eric'
  }
]

// Undirected edges are filtered
graph.exportEdges(['T->M', 'A']);
>>> [
  {
    key: 'T->M',
    source: 'Thomas',
    target: 'Martha',
    attributes: {type: 'KNOWS'}
  }
]
```

*Arguments*

1. **None**: exporting every edge.
2. **Bunch of edges**: exporting the given bunch.
  * **edges** <span class="code">[bunch]</span>: bunch of edges to export (undirected will be filtered).

## #.exportUndirectedEdges

Exports every undirected edge or only the undirected edges in the provided bunch from the graph.

*Example*

```js
graph.addNodesFrom(['Thomas', 'Martha', 'Eric']);
graph.addEdgeWithKey('T->M', 'Thomas', 'Martha', {type: 'KNOWS'});
graph.addEdgeWithKey('M->E', 'Martha', 'Eric', {type: 'KNOWS'});
graph.addUndirectedEdgeWithKey('A', 'Thomas', 'Eric');

graph.exportUndirectedEdges();
>>> [
  {
    key: 'A',
    source: 'Thomas',
    target: 'Eric',
    undirected: true
  }
]

// Directed edges are filtered
graph.exportUndirectedEdges(['A', 'T->M']);
>>> [
  {
    key: 'A',
    source: 'Thomas',
    target: 'Eric',
    undirected: true
  }
]
```

*Arguments*

1. **None**: exporting every edge.
2. **Bunch of edges**: exporting the given bunch.
  * **edges** <span class="code">[bunch]</span>: bunch of edges to export (directed will be filtered).

## #.copy

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

## #.emptyCopy

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
