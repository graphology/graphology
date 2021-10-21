---
layout: default
title: graphml
nav_order: 6
parent: Standard library
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
```

_Arguments_

- **constructor** _GraphClass_: graphology constructor to use.
- **source** _string|Document_: source data to parse.

