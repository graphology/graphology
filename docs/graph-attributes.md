---
layout: default
title: Graph attributes
nav_order: 7
menu_toc:
  - "#.getAttribute"
  - "#.getAttributes"
  - "#.hasAttribute"
  - "#.setAttribute"
  - "#.updateAttribute"
  - "#.removeAttribute"
  - "#.replaceAttributes"
  - "#.mergeAttributes"
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
