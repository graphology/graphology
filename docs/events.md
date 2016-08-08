# Events

The `Graph` instance is a node.js-like event emitter. As such, you can listen to its events in order to be able to react. This is particularly useful if you need to render your graph or maintain external indexes.

Documentation about node.js event emitters can be found [here](https://nodejs.org/api/events.html).

Note that the emitted payload will always be an object.

Here is the list of the events you can listen:

* [nodeAdded](#nodeadded)
* [edgeAdded](#edgeadded)
* [nodeDropped](#nodedropped)
* [edgeDropped](#edgedropped)
* [cleared](#cleared)
* [nodeUpdated](#nodeupdated)
* [edgeUpdated](#edgeupdated)

## nodeAdded

Emitted whenever a node is added to the graph.

*Example*

```js
graph.on('nodeAdded', function({node}) {
  console.log(node);
})

graph.addNode('Thomas');
// Will trigger:
>>> 'Thomas'
```

*Payload*

* **node** <span class="code">any</span>: the added node.

## edgeAdded

Emitted whenever an edge is added to the graph.

*Example*

```js
graph.on('edgeAdded', function({edge, source, target}) {
  console.log(edge, source, target);
})

graph.addEdgeWithKey('T->R', 'Thomas', 'Richard');
// Will trigger:
>>> 'T->R', 'Thomas', 'Richard'
```

*Payload*

* **edge** <span class="code">any</span>: the added edge.
* **source** <span class="code">any</span>: the added edge's source.
* **target** <span class="code">any</span>: the added edge's target.

## nodeDropped

Emitted whenever a node is dropped from the graph.

*Example*

```js
graph.on('nodeDropped', function({node}) {
  console.log(node);
})

graph.dropNode('Thomas');
// Will trigger:
>>> 'Thomas'
```

*Payload*

* **node** <span class="code">any</span>: the dropped node.

## edgeDropped

Emitted whenever an edge is dropped from the graph.

*Example*

```js
graph.on('edgeDropped', function({edge, source, target}) {
  console.log(edge, source, target);
})

graph.addEdgeWithKey('T->R', 'Thomas', 'Richard');
graph.dropEdge('T->R');
// Will trigger:
>>> 'T->R', 'Thomas', 'Richard'
```

*Payload*

* **edge** <span class="code">any</span>: the dropped edge.
* **source** <span class="code">any</span>: the dropped edge's source.
* **target** <span class="code">any</span>: the dropped edge's target.

## cleared

Emitted whenever the graph is cleared when using the [`#.clear`](mutations.md#clear) method. Note that when using this method, the `nodeDropped` & the `edgeDropped` won't be emitted.

*Example*

```js
graph.on('cleared', function() {
  console.log(graph.order, graph.size);
});

graph.clear();
// Wil fire:
>>> 0, 0
```

## nodeUpdated

Emitted whenever the attributes of the node are updated.

*Example*

```js
graph.on('nodeUpdated', function({node, type, meta}) {
  console.log(node, type, meta);
});

graph.setNodeAttribute('Thomas', 'age', 54);
// Will trigger:
'Thomas', 'set', {key: 'age', value: 54}
```

*Payload*

* **node** <span class="code">any</span>: the updated node.
* **type** <span class="code">string</span>: type of the update, one of `set`, `replace` or `merge`.
* **meta** <span class="code">object</span>: additional information related to the update.
  * `set`
    * **key** <span class="code">string</span>: edited key.
    * **value** <span class="code">string</span>: new value.
  * `replace`
    * **before** <span class="code">object</span>: precedent attributes.
    * **after** <span class="code">object</span>: current attributes.
  * `merge`
    * **data** <span class="code">object</span>: Merged data.
    * **before** <span class="code">object</span>: precedent attributes.
    * **after** <span class="code">object</span>: current attributes.

## edgeUpdated

Emitted whenever the attributes of the edge are updated.

*Example*

```js
graph.on('edgeUpdated', function({edge, type, meta}) {
  console.log(edge, type, meta);
});

graph.setEdgeAttribute('T->R', 'type', 'KNOWS');
// Will trigger:
'Thomas', 'set', {key: 'type', value: 'KNOWS'}
```

*Payload*

* **edge** <span class="code">any</span>: the updated edge.
* **type** <span class="code">string</span>: type of the update, one of `set`, `replace` or `merge`.
* **meta** <span class="code">object</span>: additional information related to the update.
  * `set`
    * **key** <span class="code">string</span>: edited key.
    * **value** <span class="code">string</span>: new value.
  * `replace`
    * **before** <span class="code">object</span>: precedent attributes.
    * **after** <span class="code">object</span>: current attributes.
  * `merge`
    * **data** <span class="code">object</span>: Merged data.
    * **before** <span class="code">object</span>: precedent attributes.
    * **after** <span class="code">object</span>: current attributes.
