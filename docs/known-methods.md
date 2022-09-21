---
layout: default
title: Known methods
nav_order: 14
menu_toc:
  - "#.toJSON"
  - "#.inspect"
---

# Known methods

## #.toJSON

Alias of the [`#.export`](#export) method used by JavaScript to serialize the `Graph` instance when using `JSON.stringify`.

```js
JSON.stringify(graph);
```

## #.inspect

Used by node.js to pretty print the object when using `console.log`.
