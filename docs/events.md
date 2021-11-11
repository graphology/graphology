---
layout: default
title: Events
nav_order: 11
menu_toc:
  - nodeAdded
  - edgeAdded
  - nodeDropped
  - edgeDropped
  - cleared
  - edgesCleared
  - attributesUpdated
  - nodeAttributesUpdated
  - edgeAttributesUpdated
  - eachNodeAttributesUpdated
  - eachEdgeAttributesUpdated
---


# Events

The `Graph` instance is a node.js-like event emitter. As such, you can listen to its events in order to be able to react. This is particularly useful if you need to render your graph or maintain external indexes.

Documentation about node.js event emitters can be found [here](https://nodejs.org/api/events.html).

Note that the emitted payload is always an object with various keys.

## nodeAdded

Emitted whenever a node is added to the graph.

*Example*

```js
graph.on('nodeAdded', function({key}) {
  console.log(key);
})

graph.addNode('Thomas');
// Will print:
>>> 'Thomas'
```

*Payload*

* **key** <span class="code">any</span>: the added node.
* **attributes** <span class="code">object</span>: the node's attributes.

## edgeAdded

Emitted whenever an edge is added to the graph.

*Example*

```js
graph.on('edgeAdded', function({key, source, target}) {
  console.log(key, source, target);
})

graph.addEdgeWithKey('T->R', 'Thomas', 'Richard');
// Will print:
>>> 'T->R', 'Thomas', 'Richard'
```

*Payload*

* **key** <span class="code">any</span>: the added edge.
* **source** <span class="code">any</span>: the added edge's source.
* **target** <span class="code">any</span>: the added edge's target.
* **attributes** <span class="code">object</span>: the edge's attributes.
* **undirected** <span class="code">boolean</span>: whether the edge is undirected.

## nodeDropped

Emitted whenever a node is dropped from the graph.

*Example*

```js
graph.on('nodeDropped', function({key}) {
  console.log(key);
})

graph.dropNode('Thomas');
// Will print:
>>> 'Thomas'
```

*Payload*

* **key** <span class="code">any</span>: the dropped node's key.
* **attributes** <span class="code">object</span>: the node's attributes.

## edgeDropped

Emitted whenever an edge is dropped from the graph.

*Example*

```js
graph.on('edgeDropped', function({key, source, target}) {
  console.log(key, source, target);
})

graph.addEdgeWithKey('T->R', 'Thomas', 'Richard');
graph.dropEdge('T->R');
// Will print:
>>> 'T->R', 'Thomas', 'Richard'
```

*Payload*

* **key** <span class="code">any</span>: the dropped edge's key.
* **source** <span class="code">any</span>: the dropped edge's source.
* **target** <span class="code">any</span>: the dropped edge's target.
* **attributes** <span class="code">object</span>: the edge's attributes.
* **undirected** <span class="code">boolean</span>: whether the edge is undirected.

## cleared

Emitted whenever the graph is cleared when using the [`#.clear`](mutations#clear) method. Note that when using this method, the `nodeDropped` & the `edgeDropped` events won't be emitted.

*Example*

```js
graph.on('cleared', function() {
  console.log(graph.order, graph.size);
});

graph.clear();
// Will print:
>>> 0, 0
```

## edgesCleared

Emitted whenever the graph is cleared of its edges when using the [`#.clearEdges`](mutations#clearedges) method. Note that when using this method the `edgeDropped` events won't be emitted.

*Example*

```js
graph.on('edgesCleared', function() {
  console.log(graph.order, graph.size);
});

graph.clearEdges();
// Will print:
>>> 45, 0
```

## attributesUpdated

Emitted whenever the attributes of the graph are updated.

*Example*

```js
graph.on('attributesUpdated', function({type}) {
  console.log(type);
});

graph.setAttribute('name', 'My Beautiful Graph');
// Will print:
'set'
```

*Payload*

* **type** <span class="code">string</span>: type of the update, one of `set`, `remove`, `replace`, `merge` or `update`.
* **attributes** <span class="code">object</span>: the graph's attributes.
* **name** <span class="code">[string]</span>: the name of the edited attributes if type is `set` or `remove`.
* **data** <span class="code">[object]</span>: merged data in case the type is `merge`.

## nodeAttributesUpdated

Emitted whenever the attributes of the node are updated.

*Example*

```js
graph.on('nodeAttributesUpdated', function({key, type}) {
  console.log(key, type);
});

graph.setNodeAttribute('Thomas', 'age', 54);
// Will print:
'Thomas', 'set'
```

*Payload*

* **type** <span class="code">string</span>: type of the update, one of `set`, `remove`, `replace`, `merge` or `update`.
* **key** <span class="code">string</span>: the affected node's key.
* **attributes** <span class="code">object</span>: the node's attributes.
* **name** <span class="code">[string]</span>: the name of the edited attributes if type is `set` or `remove`.
* **data** <span class="code">[object]</span>: merged data in case the type is `merge`.

## edgeAttributesUpdated

Emitted whenever the attributes of the edge are updated.

*Example*

```js
graph.on('edgeAttributesUpdated', function({key, type}) {
  console.log(key, type);
});

graph.setEdgeAttribute('T->R', 'type', 'KNOWS');
// Will print:
'Thomas', 'set'
```

*Payload*

* **type** <span class="code">string</span>: type of the update, one of `set`, `remove`, `replace`, `merge` or `update`.
* **key** <span class="code">string</span>: the affected edge's key.
* **attributes** <span class="code">object</span>: the edge's attributes.
* **name** <span class="code">[string]</span>: the name of the edited attributes if type is `set` or `remove`.
* **data** <span class="code">[object]</span>: merged data in case the type is `merge`.

## eachNodeAttributesUpdated

Emitted whenever the [#.updateEachNodeAttributes](attributes#updateeachnodeattributes) is called.

*Payload*

* **hints** <span class="code">[object]</span>: hints (only if they were provided by user, else `null`):
  * **attributes** <span class="code">[array]</span>: the list of updated attribute names.

## eachEdgeAttributesUpdated

Emitted whenever the [#.updateEachEdgeAttributes](attributes#updateeachedgeattributes) is called.

*Payload*

* **hints** <span class="code">[object]</span>: hints (only if they were provided by user, else `null`):
  * **attributes** <span class="code">[array]</span>: the list of updated attribute names.
