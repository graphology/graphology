---
layout: default
title: Node attributes
nav_order: 8
menu_toc:
  - "#.getNodeAttribute"
  - "#.getNodeAttributes"
  - "#.hasNodeAttribute"
  - "#.setNodeAttribute"
  - "#.updateNodeAttribute"
  - "#.removeNodeAttribute"
  - "#.replaceNodeAttributes"
  - "#.mergeNodeAttributes"
  - "#.updateEachNodeAttributes"
---


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
* **hints** <span class="code">[object]</span>: optional hints to emit as part of the [eachNodeAttributesUpdated](events.md#eachnodeattributesupdated) event:
  * **attributes** <span class="code">[array]</span>: an array of attribute names that will be updated by your action.
