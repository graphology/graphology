---
layout: default
title: Edge attributes
nav_order: 9
menu_toc:
  - "#.getEdgeAttribute"
  - "#.getEdgeAttributes"
  - "#.hasEdgeAttribute"
  - "#.setEdgeAttribute"
  - "#.updateEdgeAttribute"
  - "#.removeEdgeAttribute"
  - "#.replaceEdgeAttributes"
  - "#.mergeEdgeAttributes"
  - "#.updateEachEdgeAttributes"
---


# Edge attributes

## #.getEdgeAttribute

Returns the desired edge's attribute or `undefined` if not found.

*Example*

```js
graph.addNode('Martha');
graph.addNode('Catherine');
const edge = graph.addEdge('Martha', 'Catherine', {type: 'KNOWS'});

// Using the edge's key:
graph.getEdgeAttribute(edge, 'type');
>>> 'KNOWS'

// Using the edge's source & target:
graph.getEdgeAttribute('Martha', 'Catherine', 'type');
>>> 'KNOWS'
```

*Arguments*

1. Using the key:
  * **edge** <span class="code">any</span>: the target edge.
  * **attribute** <span class="code">string</span>: name of the attribute to retrieve.
2. Using the source & target:
  * **source** <span class="code">any</span>: source of the edge.
  * **target** <span class="code">any</span>: target of the edge.
  * **attribute** <span class="code">string</span>: name of the attribute to retrieve.

## #.getEdgeAttributes

Returns the desired edge's attributes.

*Example*

```js
graph.addNode('Martha');
graph.addNode('Catherine');
const edge = graph.addEdge('Martha', 'Catherine', {type: 'KNOWS', weight: 2});

// Using the edge's key:
const attributes = graph.getEdgeAttributes(edge);

// Using the edge's source & target:
graph.getEdgeAttributes('Martha', 'Catherine');
>>> {
  type: 'KNOWS',
  weight: 2
}
```

*Arguments*

1. Using the key:
  * **edge** <span class="code">any</span>: the target edge.
2. Using the source & target:
  * **source** <span class="code">any</span>: source of the edge.
  * **target** <span class="code">any</span>: target of the edge.

## #.hasEdgeAttribute

Returns whether the desired edge's attribute is set.

*Example*

```js
graph.addNode('Martha');
graph.addNode('Catherine');
const edge = graph.addEdge('Martha', 'Catherine', {type: 'KNOWS'});

// Using the edge's key:
const type = graph.hasEdgeAttribute(edge, 'type');
>>> true

// Using the edge's source & target:
graph.hasEdgeAttribute('Martha', 'Catherine', 'type');
>>> 'KNOWS'
```

*Arguments*

1. Using the key:
  * **edge** <span class="code">any</span>: the target edge.
  * **attribute** <span class="code">string</span>: name of the attribute to poll.
2. Using the source & target:
  * **source** <span class="code">any</span>: source of the edge.
  * **target** <span class="code">any</span>: target of the edge.
  * **attribute** <span class="code">string</span>: name of the attribute to poll.

## #.setEdgeAttribute

Set the attribute of an edge to the given value.

*Example*

```js
graph.addNode('Martha');
graph.addNode('Jack');
const edge = graph.addEdge('Martha', 'Jack', {type: 'KNOWS'});

// Using the edge's key:
graph.setEdgeAttribute(edge, 'type', 'LIKES');

// Using the edge's source & target:
graph.setEdgeAttribute('Martha', 'Jack', 'type', 'LIKES');
```

*Arguments*

1. Using the key:
  * **edge** <span class="code">any</span>: the edge to update.
  * **attribute** <span class="code">string</span>: name of the attribute to set.
  * **value** <span class="code">any</span>: value to set.
2. Using the source & target:
  * **source** <span class="code">any</span>: source of the edge.
  * **target** <span class="code">any</span>: target of the edge.
  * **attribute** <span class="code">string</span>: name of the attribute to set.
  * **value** <span class="code">any</span>: value to set.

## #.updateEdgeAttribute

Update the attribute of an edge using the provided function.

This method is very useful when performing tasks such as incrementing an attribute so you don't have to first fetch the former value to compute the next one.

Note that if the attribute is not yet setted, the passed value will be `undefined`.

*Example*

```js
graph.addNode('Martha');
graph.addNode('Jack');
const edge = graph.addEdge('Martha', 'Jack', {weight: 1});

// Using the edge's key:
graph.updateEdgeAttribute(edge, 'weight', n => n + 1);

// Using the edge's source & target:
graph.updateEdgeAttribute('Martha', 'Jack', 'weight', n => n + 1);
```

*Arguments*

1. Using the key:
  * **edge** <span class="code">any</span>: the edge to update.
  * **attribute** <span class="code">string</span>: name of the attribute to update.
  * **updater** <span class="code">function</span>: function used to perform the update.
2. Using the source & target:
  * **source** <span class="code">any</span>: source of the edge.
  * **target** <span class="code">any</span>: target of the edge.
  * **attribute** <span class="code">string</span>: name of the attribute to update.
  * **updater** <span class="code">function</span>: function used to perform the update.

## #.removeEdgeAttribute

Remove the given edge's attribute altogether.

*Example*

```js
graph.addNode('Martha');
graph.addNode('Jack');
const edge = graph.addEdge('Martha', 'Jack', {type: 'KNOWS'});

// Using the edge's key:
graph.removeEdgeAttribute(edge, 'type');

// Using the edge's source & target:
graph.removeEdgeAttribute('Martha', 'Jack', 'type');

graph.hasEdgeAttribute(edge, 'type');
>>> false
```

*Arguments*

1. Using the key:
  * **edge** <span class="code">any</span>: the edge to update.
  * **attribute** <span class="code">string</span>: name of the attribute to set.
2. Using the source & target:
  * **source** <span class="code">any</span>: source of the edge.
  * **target** <span class="code">any</span>: target of the edge.
  * **attribute** <span class="code">string</span>: name of the attribute to set.

## #.replaceEdgeAttributes

Completely replace one edge's attributes by the provided object.

*Example*

```js
graph.addNode('Martha');
graph.addNode('Jack');
const edge = graph.addEdge('Martha', 'Jack', {type: 'KNOWS', weight: 1});

// Using the edge's key:
graph.replaceEdgeAttributes(edge, {type: 'LIKES', weight: 3});

// Using the edge's source & target:
graph.replaceEdgeAttributes('Martha', 'Jack', {type: 'LIKES', weight: 3}));
```

*Arguments*

1. Using the key:
  * **edge** <span class="code">any</span>: the edge to update.
  * **attributes** <span class="code">object</span>: the new attributes.
2. Using the source & target:
  * **source** <span class="code">any</span>: source of the edge.
  * **target** <span class="code">any</span>: target of the edge.
  * **attributes** <span class="code">object</span>: the new attributes.

## #.mergeEdgeAttributes

Merge the current attributes of an edge with the provided object.

*Example*

```js
graph.addNode('Martha');
graph.addNode('Jack');
const edge = graph.addEdge('Martha', 'Jack', {type: 'KNOWS'});

// Using the edge's key:
graph.mergeEdgeAttributes(edge, {type: 'LIKES', weight: 3});

// Using the edge's source & target:
graph.mergeEdgeAttributes('Martha', 'Jack', {type: 'LIKES', weight: 3}));
```

*Arguments*

1. Using the key:
  * **edge** <span class="code">any</span>: the edge to update.
  * **data** <span class="code">object</span>: data to merge.
2. Using the source & target:
  * **source** <span class="code">any</span>: source of the edge.
  * **target** <span class="code">any</span>: target of the edge.
  * **data** <span class="code">object</span>: data to merge.

## #.updateEachEdgeAttributes

Update each edge's attributes using the given function. This is usually the most performant function to update edge attributes in batch.

Note that you can optionally pass hints regarding the updated attribute names so that people listening to the emitted events can handle the situation more efficiently.

*Example*

```js
graph.mergeEdge('Martha', 'John', {weight: 12});
graph.mergeEdge('Lucy', 'Martin', {weight: 4})

graph.updateEachEdgeAttributes((node, attr) => {
  return {
    ...attr,
    weight: attr.weight * 2
  };
});

graph.edges().map(e => graph.getEdgeAttribute(e, 'weight'));
>>> [24, 8]

// Note that you can indicate hints
graph.updateEachEdgeAttributes((node, attr) => {
  return {
    ...attr,
    weight: attr.weight * 2
  };
}, {attributes: ['weight']}); // <-- here
```

*Arguments*

* **updater** <span class="code">function</span>: the udpater function.
* **hints** <span class="code">[object]</span>: optional hints to emit as part of the [eachEdgeAttributesUpdated](events.md#eachedgeattributesupdated) event:
  * **attributes** <span class="code">[array]</span>: an array of attribute names that will be updated by your action.
