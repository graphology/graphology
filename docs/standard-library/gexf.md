---
layout: default
title: gexf
nav_order: 8
parent: Standard library
aux_links:
  "Library directory": "https://github.com/graphology/graphology/tree/master/src/gexf"
  "Changelog": "https://github.com/graphology/graphology/tree/master/src/gexf/CHANGELOG.md"
---

[![Build Status](/standard-library/gexf/workflows/Tests/badge.svg)](/standard-library/gexf/actions)

# Graphology GEXF Utilities

GEXF parser & writer for [`graphology`](..).

For more information about the GEXF file format, you can head [there](https://gexf.net).

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
  - **allowUndeclaredAttributes** <span class="code">?boolean</span> <span class="default">false</span>: whether to allow undeclared attributes for both nodes & edges, which will be considered as strings.
  - **respectInputGraphType** <span class="code">?boolean</span> <span class="default">false</span>: whether to make sure the output graph type is the same as the passed constructor. By default the parser will try to optimize the graph representation to avoid wasting time and memory. But if `respectInputGraphType` is `true` the output graph is guaranteed to be an instance of the typed constructor you gave as first argument. This also means the parser will throw when reading a graph that cannot be represented with the given typed constructor.

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
  - **pedantic** <span class="code">?boolean</span> <span class="default">false</span>: whether to output a stricter gexf file to make sure it can be validated using the most restrictive gexf xsd schemas. Note that the output may lose some graph attributes when doing so.
  - **version** <span class="code">?string</span> <span class="default">1.2</span>: gexf version to emit. Should be one of `1.2` or `1.3`.

### Notes

Currently, `mutual` (a specific gexf type for edges that is seldom used in practice) edges are parsed as undirected ones rather than two directed ones because it could produce a key conflict. An option to deal differently with this may be added in the future if it becomes a problem.

