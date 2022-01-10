---
layout: default
title: gexf
nav_order: 7
parent: Standard library
aux_links:
  "Library directory": "https://github.com/graphology/graphology/tree/master/src/gexf"
  
---

[![Build Status](/standard-library/gexf/workflows/Tests/badge.svg)](/standard-library/gexf/actions)

# Graphology GEXF Utilities

GEXF parser & writer for [`graphology`](..).

For more information about the GEXF file format, you can head [there](https://gephi.org/gexf/format/).

## Installation

```
npm install graphology-gexf
```

## Usage

- [Parser](#parser)
- [Writer](#writer)
- [Notes](#notes)

### Parser

The parser must be passed a `graphology` constructor and is able to read either a string, or an `XMLDocument` instance.

```js
var Graph = require('graphology');

// Node
var gexf = require('graphology-gexf');
// Browser
var gexf = require('graphology-gexf/browser');

// Reading a string
var graph = gexf.parse(Graph, string);

// Reading a dom document
var graph = gexf.parse(Graph, xmlDocument);

// Passing options
var graph = gexf.parse(Graph, string, {addMissingNodes: true});
```

_Arguments_

- **constructor** _GraphClass_: graphology constructor to use.
- **source** _string\|Document_: source data to parse.
- **options** <span class="code">?object</span>: parsing options:
  - **addMissingNodes** <span class="code">?boolean</span> <span class="default">false</span>: whether to add missing nodes referenced in the file's edges.

### Writer

The writer must be passed a `graphology` instance and will output a GEXF string.

```js
// Node
var gexf = require('graphology-gexf');
// Browser
var gexf = require('graphology-gexf/browser');

// Writing the graph
var gexfString = gexf.write(graph);

// Using custom formatting for nodes & edges
var gexfString = gexf.write(graph, {
  formatNode: function (key, attributes) {
    return {
      label: attributes.label,
      attributes: {
        age: attributes.age,
        name: attributes.name
      },
      viz: {
        color: '#FF0',
        x: attributes.x,
        y: attributes.y,
        shape: 'circle',
        size: 20
      }
    };
  },
  formatEdge: function (key, attributes) {
    return {
      label: attributes.label,
      attributes: {
        number: attributes.number
      },
      weight: attributes.weight,
      viz: {
        color: '#FF0',
        x: attributes.x,
        y: attributes.y,
        shape: 'dotted',
        thickness: 20
      }
    };
  }
});
```

_Arguments_

- **graph** _Graph_: graphology instance to write.
- **options** <span class="code">?object</span>: Options:
  - **encoding** <span class="code">?string</span> <span class="default">UTF-8</span>: encoding declaration.
  - **formatNode** <span class="code">?function</span>: function returning the node's data to write.
  - **formatEdge** <span class="code">?function</span>: function returning the edge's data to write.
  - **pretty** <span class="code">?boolean</span> <span class="default">true</span>: pretty-print output?

### Notes

Currently, `mutual` edges are parsed as undirected ones rather than two directed ones because it could produce a key conflict. An option to deal differently with this may be added in the future if it becomes a problem.

