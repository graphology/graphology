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
// Will trigger:
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
// Will trigger:
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
// Will trigger:
>>> 'Thomas'
```

*Payload*

* **key** <span class="code">any</span>: the added node.
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
// Will trigger:
>>> 'T->R', 'Thomas', 'Richard'
```

*Payload*

* **edge** <span class="code">any</span>: the added edge.
* **source** <span class="code">any</span>: the added edge's source.
* **target** <span class="code">any</span>: the added edge's target.
* **attributes** <span class="code">object</span>: the edge's attributes.
* **undirected** <span class="code">boolean</span>: whether the edge is undirected.

## cleared

Emitted whenever the graph is cleared when using the [`#.clear`](mutations.md#clear) or the [`#.dropNodes`](mutations.md#dropnodes) (without arguments) method. Note that when using this method, the `nodeDropped` & the `edgeDropped` won't be emitted.

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
graph.on('nodeUpdated', function({key, type, meta}) {
  console.log(key, type, meta);
});

graph.setNodeAttribute('Thomas', 'age', 54);
// Will trigger:
'Thomas', 'set', {key: 'age', value: 54}
```

*Payload*

* **key** <span class="code">any</span>: the updated node.
* **type** <span class="code">string</span>: type of the update, one of `set`, `replace` or `merge`.
* **meta** <span class="code">object</span>: additional information related to the update.
  * `set`
    * **name** <span class="code">string</span>: edited attribute's name.
    * **value** <span class="code">string</span>: new value.
  * `replace`
    * **before** <span class="code">object</span>: precedent attributes.
    * **after** <span class="code">object</span>: current attributes.
  * `merge`
    * **data** <span class="code">object</span>: Merged data.

## edgeUpdated

Emitted whenever the attributes of the edge are updated.

*Example*

```js
graph.on('edgeUpdated', function({key, type, meta}) {
  console.log(key, type, meta);
});

graph.setEdgeAttribute('T->R', 'type', 'KNOWS');
// Will trigger:
'Thomas', 'set', {key: 'type', value: 'KNOWS'}
```

*Payload*

* **key** <span class="code">any</span>: the updated edge.
* **type** <span class="code">string</span>: type of the update, one of `set`, `replace` or `merge`.
* **meta** <span class="code">object</span>: additional information related to the update.
  * `set`
    * **name** <span class="code">string</span>: edited attribute's name.
    * **value** <span class="code">string</span>: new value.
  * `replace`
    * **before** <span class="code">object</span>: precedent attributes.
    * **after** <span class="code">object</span>: current attributes.
  * `merge`
    * **data** <span class="code">object</span>: Merged data.
