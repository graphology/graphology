---
layout: default
title: graphml
nav_order: 9
parent: Standard library
aux_links:
  "Library directory": "https://github.com/graphology/graphology/tree/master/src/graphml"
  
---

# Graphology GRAPHML Utilities

GRAPHML parser & writer for [`graphology`](..).

For more information about the GRAPHML file format, you can head [there](http://graphml.graphdrawing.org/).

## Installation

```
npm install graphology-graphml
```

## Usage

- [Parser](#parser)

### Parser

The parser must be passed a `graphology` constructor and is able to read either a string, or an `XMLDocument` instance.

```js
var Graph = require('graphology');

// Node
var graphml = require('graphology-graphml');
// Browser
var graphml = require('graphology-graphml/browser');

// Reading a string
var graph = graphml.parse(Graph, string);

// Reading a dom document
var graph = graphml.parse(Graph, xmlDocument);

// Passing options
var graph = graphml.parse(Graph, string, {addMissingNodes: true});
```

_Arguments_

- **constructor** _GraphClass_: graphology constructor to use.
- **source** _string\|Document_: source data to parse.
- **options** <span class="code">?object</span>: parsing options:
  - **addMissingNodes** <span class="code">?boolean</span> <span class="default">false</span>: whether to add missing nodes referenced in the file's edges.

