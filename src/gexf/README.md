[![Build Status](https://github.com/graphology/graphology-gexf/workflows/Tests/badge.svg)](https://github.com/graphology/graphology-gexf/actions)

# Graphology GEXF Utilities

GEXF parser & writer for [`graphology`](https://graphology.github.io).

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
- **options** _?object_: parsing options:
  - **addMissingNodes** _?boolean_ [`false`]: whether to add missing nodes referenced in the file's edges.

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
- **options** _?object_: Options:
  - **encoding** _?string_ [`UTF-8`]: encoding declaration.
  - **formatNode** _?function_: function returning the node's data to write.
  - **formatEdge** _?function_: function returning the edge's data to write.
  - **pretty** _?boolean_ [`true`]: pretty-print output?

### Notes

Currently, `mutual` edges are parsed as undirected ones rather than two directed ones because it could produce a key conflict. An option to deal differently with this may be added in the future if it becomes a problem.
