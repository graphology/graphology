# Graphology GRAPHML Utilities

GRAPHML parser & writer for [`graphology`](https://graphology.github.io).

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
- **options** _?object_: parsing options:
  - **addMissingNodes** _?boolean_ [`false`]: whether to add missing nodes referenced in the file's edges.
