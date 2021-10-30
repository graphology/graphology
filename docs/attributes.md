---
layout: default
title: Attributes
nav_order: 7
detailed_menu_toc:
  - label: Graph Attributes
    subtitle: yes
  - label: "#.getAttribute"
  - label: "#.getAttributes"
  - label: "#.hasAttribute"
  - label: "#.setAttribute"
  - label: "#.updateAttribute"
  - label: "#.removeAttribute"
  - label: "#.replaceAttributes"
  - label: "#.mergeAttributes"
  - label: Node Attributes
    subtitle: yes
  - label: "#.getNodeAttribute"
  - label: "#.getNodeAttributes"
  - label: "#.hasNodeAttribute"
  - label: "#.setNodeAttribute"
  - label: "#.updateNodeAttribute"
  - label: "#.removeNodeAttribute"
  - label: "#.replaceNodeAttributes"
  - label: "#.mergeNodeAttributes"
  - label: "#.updateEachNodeAttributes"
  - label: Edge Attributes
    subtitle: yes
  - label: "#.getEdgeAttribute"
  - label: "#.getEdgeAttributes"
  - label: "#.hasEdgeAttribute"
  - label: "#.setEdgeAttribute"
  - label: "#.updateEdgeAttribute"
  - label: "#.removeEdgeAttribute"
  - label: "#.replaceEdgeAttributes"
  - label: "#.mergeEdgeAttributes"
  - label: "#.updateEachEdgeAttributes"
---

# Graph attributes

## #.getAttribute

Returns the desired graph's attribute or `undefined` if not found.

*Example*

```js
graph.setAttribute('name', 'My Beautiful Graph');

const name = graph.getAttribute('name');

console.log(name);
>>> 'My Beautiful Graph'
```

*Arguments*

* **attribute** <span class="code">string</span>: name of the attribute to retrieve.

## #.getAttributes

Returns the desired graph's attributes.

*Example*

```js
graph.setAttribute('name', 'My Beautiful Graph');
graph.setAttribute('color', 'blue');

graph.getAttributes();
>>> {
  name: 'My Beautiful Graph',
  color: 'blue'
}
```

## #.hasAttribute

Returns whether the desired graph's attribute is set.

*Example*

```js
graph.setAttribute('name', 'My Beautiful Graph');

graph.hasAttribute('name');
>>> true

graph.hasNodeAttribute('color');
>>> false
```

## #.setAttribute

Set the attribute of the graph to the given value.

*Example*

```js
graph.setAttribute('name', 'My Beautiful Graph');

graph.getAttribute('name');
>>> 'My Beautiful Graph'
```

*Arguments*

* **attribute** <span class="code">string</span>: name of the attribute to set.
* **value** <span class="code">any</span>: value to set.

## #.updateAttribute

Update the attribute of the graph using the provided function.

This method is very useful when performing tasks such as incrementing an attribute so you don't have to first fetch the former value to compute the next one.

Note that if the attribute is not yet setted, the passed value will be `undefined`.

*Example*

```js
graph.setAttribute('relevance', 10);

graph.updateAttribute('relevance', x => x + 1);

graph.getAttribute('relevance');
>>> 11
```

*Arguments*

* **attribute** <span class="code">string</span>: name of the attribute to update.
* **updater** <span class="code">function</span>: function used to perform the update.

## #.removeAttribute

Remove the given graph's attribute altogether.

*Example*

```js
graph.setAttribute('name', 'My Beautiful Graph');

graph.removeAttribute('name');

graph.hasAttribute('name');
>>> false
```

## #.replaceAttributes

Completely replace one graph's attributes by the provided object.

*Example*

```js
graph.setAttribute('name', 'My Beautiful Graph');

graph.replaceAttributes({
  name: 'My Different Graph',
  color: 'blue'
});
```

*Arguments*

* **attributes** <span class="code">object</span>: the new attributes.


## #.mergeAttributes

Merge the current attributes of the graph with the provided object.

*Example*

```js
graph.setAttribute('name', 'My Beautiful Graph');

graph.mergeAttributes({
  name: 'My Different Graph',
  color: 'blue'
});
```

*Arguments*

* **data** <span class="code">object</span>: data to merge.

# Node attributes

## #.getNodeAttribute

Returns the desired node's attribute or `undefined` if not found..

*Example*

```js
graph.addNode('Martha', {age: 34});

const age = graph.getNodeAttribute('Martha', 'age');

console.log(age);
>>> 34
```

*Arguments*

* **node** <span class="code">any</span>: the target node.
* **attribute** <span class="code">string</span>: name of the attribute to retrieve.

## #.getNodeAttributes

Returns the desired node's attributes.

*Example*

```js
graph.addNode('Martha', {age: 34, eyes: 'blue'});

graph.getNodeAttributes('Martha');
>>> {
  age: 34,
  eyes: 'blue'
}
```

## #.hasNodeAttribute

Returns whether the desired node's attribute is set.

*Example*

```js
graph.addNode('Martha', {eyes: 'blue'});

graph.hasNodeAttribute('Martha', 'eyes');
>>> true

graph.hasNodeAttribute('Martha', 'age');
>>> false
```

## #.setNodeAttribute

Set the attribute of a node to the given value.

*Example*

```js
graph.addNode('Martha', {age: 36, eyes: 'blue'});

graph.setNodeAttribute('Martha', 'age', 34);
```

*Arguments*

* **node** <span class="code">any</span>: the node to update.
* **attribute** <span class="code">string</span>: name of the attribute to set.
* **value** <span class="code">any</span>: value to set.

## #.updateNodeAttribute

Update the attribute of a node using the provided function.

This method is very useful when performing tasks such as incrementing an attribute so you don't have to first fetch the former value to compute the next one.

Note that if the attribute is not yet setted, the passed value will be `undefined`.

*Example*

```js
graph.addNode('Martha', {occurrences: 1});

graph.updateNodeAttribute('Martha', 'occurrences', n => n + 1);
```

*Arguments*

* **node** <span class="code">any</span>: the node to update.
* **attribute** <span class="code">string</span>: name of the attribute to update.
* **updater** <span class="code">function</span>: function used to perform the update.

## #.removeNodeAttribute

Remove the given node's attribute altogether.

*Example*

```js
graph.addNode('Martha', {age: 34});

graph.removeNodeAttribute('Martha', 'age');

graph.hasNodeAttribute('Martha', 'age');
>>> false
```

## #.replaceNodeAttributes

Completely replace one node's attributes by the provided object.

*Example*

```js
graph.addNode('Martha', {age: 36, eyes: 'blue'});

graph.replaceNodeAttributes('Martha', {
  age: 34,
  eyes: 'green'
});
```

*Arguments*

* **node** <span class="code">any</span>: the node to update.
* **attributes** <span class="code">object</span>: the new attributes.


## #.mergeNodeAttributes

Merge the current attributes of a node with the provided object.

*Example*

```js
graph.addNode('Martha', {age: 36, eyes: 'blue'});

graph.mergeNodeAttributes('Martha', {age: 34, hair: 'brown'});
```

*Arguments*

* **node** <span class="code">any</span>: the node to update.
* **data** <span class="code">object</span>: data to merge.

## #.updateEachNodeAttributes

Update each node's attributes using the given function. This is usually the most performant function to update node attributes in batch.

Note that you can optionally pass hints regarding the updated attribute names so that people listening to the emitted events can handle the situation more efficiently.

*Example*

```js
graph.addNode('Martha', {age: 34});
graph.addNode('Lara', {age: 78});

graph.updateEachNodeAttributes((node, attr) => {
  return {
    ...attr,
    age: attr.age + 1
  };
});

graph.nodes().map(n => graph.getNodeAttribute(n, 'age'));
>>> [35, 79]

// Note that you can indicate hints
graph.updateEachNodeAttributes((node, attr) => {
  return {
    ...attr,
    age: attr.age + 1
  };
}, {attributes: ['age']}); // <-- here
```

*Arguments*

* **updater** <span class="code">function</span>: the udpater function.
* **hints** <span class="code">[object]</span>: optional hints to emit as part of the [eachNodeAttributesUpdated](events#eachnodeattributesupdated) event:
  * **attributes** <span class="code">[array]</span>: an array of attribute names that will be updated by your action.

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
* **hints** <span class="code">[object]</span>: optional hints to emit as part of the [eachEdgeAttributesUpdated](events#eachedgeattributesupdated) event:
  * **attributes** <span class="code">[array]</span>: an array of attribute names that will be updated by your action.
