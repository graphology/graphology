---
layout: default
title: Serialization
nav_order: 12
menu_toc:
  - "Format"
  - "#.import"
  - "#.export"
---

# Serialization

## Format

**Node**

A node is serialized as an object containing the following keys:
  * **key** <span class="code">any</span> The node's key,
  * **attributes** <span class="code">[object]</span> The node's attributes (can be omitted or null).

```js
graph.addNode('Thomas', {age: 34});
// Serialized would be:
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
graph.mergeEdgeWithKey('T->E', 'Thomas', 'Eric', {type: 'KNOWS'});
// Serialized would be:
>>> {
  key: 'T->E',
  source: 'Thomas',
  target: 'Eric',
  attributes: {type: 'KNOWS'}
}
```

**Graph**

A graph is serialized as an object containing an `attributes`, a `nodes` & an `edges` key:
  * <span class="code">object</span> `attributes`: containing the attributes of the graph (can be omitted).
  * <span class="code">object</span> `options`: containing the options of the graph (`allowSelfLoops`, `multi` and `type`).
  * <span class="code">object</span> `nodes`: containing a list of serialized nodes (can be omitted when merging).
  * <span class="code">object</span> `edges`: containing a list of serialized edges (can be omitted).

```js
graph.mergeEdgeWithKey('T->E', 'Thomas', 'Eric', {type: 'KNOWS'});
graph.setAttribute('name', 'My Graph');
graph.export();
>>> {
  attributes: {
    name: 'My Graph'
  },
  options: {
    allowSelfLoops: true,
    multi: false,
    type: 'mixed'
  },
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
  attributes: {name: 'My Graph'},
  nodes: [{key: 'Thomas'}, {key: 'Eric'}],
  edges: [{source: 'Thomas', target: 'Eric'}]
});

graph.hasNode('Thomas');
>>> true
```

*Arguments*

* **data** <span class="code">serialized graph|Graph</span>: serialized graph data or another Graph instance.
* **merge** <span class="code">[boolean]</span> <span class="default">false</span>: whether to merge the imported data.

## #.export

Exports the whole instance's data as a serialized graph.

*Example*

```js
graph.mergeEdgeWithKey('T->E', 'Thomas', 'Eric', {type: 'KNOWS'});
graph.setAttribute('name', 'My Graph');
graph.export();
>>> {
  attributes: {
    name: 'My Graph'
  },
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
