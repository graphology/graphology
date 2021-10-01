[![Build Status](https://github.com/graphology/graphology-gexf/workflows/Tests/badge.svg)](https://github.com/graphology/graphology-gexf/actions)


# Graphology GEXF Utilities

GEXF parser & writer for [`graphology`](https://graphology.github.io).

For more information about the GEXF file format, you can head [there](https://gephi.org/gexf/format/).

## Installation

```
npm install graphology-gexf
```

## Usage

* [Parser](#parser)
* [Writer](#writer)

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
```

*Arguments*

* **constructor** *GraphClass*: graphology constructor to use.
* **source** *string|Document*: source data to parse.

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
  formatNode: function(key, attributes) {
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
  formatEdge: function(key, attributes) {
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

*Arguments*

* **graph** *Graph*: graphology instance to write.
* **options** *?object*: Options:
  - **encoding** *?string* [`UTF-8`]: encoding declaration.
  - **formatNode** *?function*: function returning the node's data to write.
  - **formatEdge** *?function*: function returning the edge's data to write.
  - **pretty** *?boolean* [`true`]: pretty-print output?
