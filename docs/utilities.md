---
layout: default
title: Utilities
nav_order: 13
menu_toc:
  - "#.copy"
  - "#.nullCopy"
  - "#.emptyCopy"
---

# Utilities

## #.copy

Returns a copy of the current instance.

*Example*

```js
graph.mergeEdgeWithKey('T->E', 'Thomas', 'Eric', {type: 'KNOWS'});

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

*Arguments*

* **options** <span class="code">[object]</span>: options to merge to create a slightly different graph. Note that those options will be validated to ensure that created graph is an "upgrade" and so no information can be lost. For instance, a mixed graph can be created from a directed one, but the reverse is not true.

## #.nullCopy

Returns a null copy, i.e. a copy of the graph without nodes nor edges, of the current instance while retaining the type & the options of the graph.

*Example*

```js
graph.mergeEdgeWithKey('T->E', 'Thomas', 'Eric', {type: 'KNOWS'});

const newGraph = graph.nullCopy();
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

* **options** <span class="code">[object]</span>: options to merge to create a graph with different characteristics.

## #.emptyCopy

Returns an empty copy, i.e. a copy of the graph containing only nodes, of the current instance while retaining the type & the options of the graph.

This is useful to functions needing to return subgraphs or near identical copies of a graph such as reversed graph or graph converted to another type altogether.

*Example*

```js
graph.mergeEdgeWithKey('T->E', 'Thomas', 'Eric', {type: 'KNOWS'});

const newGraph = graph.emptyCopy();
newGraph.hasNode('Eric');
>>> true
newGraph.order
>>> 2
newGraph.size
>>> 0
newGraph.hasEdge('Thomas', 'Eric');
>>> false
graph.type === newGraph.type
>>> true
```

*Arguments*

* **options** <span class="code">[object]</span>: options to merge to create a graph with different characteristics.
