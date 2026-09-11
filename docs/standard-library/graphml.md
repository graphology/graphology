# Graphology GRAPHML Utilities

GRAPHML parser & writer for [`graphology`](https://graphology.github.io).

For more information about the GRAPHML file format, you can head [there](http://graphml.graphdrawing.org/).

## Installation

```
npm install graphology-graphml
```

## Usage

- [Parser](#parser)
- [Writer](#writer)

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

### Writer

The writer must be passed a `graphology` instance and will output a GRAPHML **string**.

```js
// Node
var graphml = require('graphology-graphml');
// Browser
var graphml = require('graphology-graphml/browser');

// Writing the graph
var graphmlString = graphml.write(graph);

// Using custom formatting for nodes & edges
var graphmlString = graphml.write(graph, {
  formatNode: function (key, attributes) {
    return {
      label: attributes.label,
      color: attributes.color,
      size: attributes.size,
      x: attributes.x,
      y: attributes.y
    };
  },
  formatEdge: function (key, attributes) {
    return {
      weight: attributes.weight
    };
  }
});
```

_Arguments_

- **graph** _Graph_: graphology instance to write.
- **options** _?object_: Options:
  - **encoding** _?string_ [`UTF-8`]: encoding declaration.
  - **formatNode** _?function_: function returning the node's data to write.
  - **formatEdge** _?function_: function returning the edge's data to write.
  - **pretty** _?boolean_ [`true`]: pretty-print output?
