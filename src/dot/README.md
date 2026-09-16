# Graphology DOT Utilities

Graphviz DOT parser & writer for [`graphology`](https://graphology.github.io).

For more information about the Graphviz DOT file format, see the [DOT Language documentation](https://graphviz.org/doc/info/lang.html).

## Installation

```
npm install graphology-dot
```

## Usage

- [Parser](#parser)
- [Writer](#writer)

### Parser

The parser takes a `graphology` constructor and a DOT string, returning a graphology graph instance.

```js
var Graph = require('graphology');

// Node
var dot = require('graphology-dot');
// Browser
var dot = require('graphology-dot/browser');

// Reading a string
var graph = dot.parse(Graph, string);

// Passing options
var graph = dot.parse(Graph, string, {addMissingNodes: true});
```

_Arguments_

- **constructor** _GraphClass_: graphology constructor to use.
- **source** _string_: DOT string to parse.
- **options** _?object_: parsing options:
  - **addMissingNodes** _?boolean_ [`false`]: whether to add missing nodes referenced in edge statements. In DOT, nodes are commonly defined implicitly through edges, so missing nodes are always added automatically regardless of this option.

#### Supported DOT Features

- `graph` / `digraph` / `strict graph` / `strict digraph` declarations
- Node statements with attributes: `nodeID [key=value, ...]`
- Edge statements: `n1 -- n2` (undirected) / `n1 -> n2` (directed)
- Edge chains: `a -> b -> c -> d`
- Attribute statements for defaults: `graph [...]`, `node [...]`, `edge [...]`
- Subgraphs (named and anonymous): `subgraph S { ... }` / `{ ... }`
- Comments: `// line`, `/* block */`, `# line`
- Quoted node IDs and attribute values: `"node name" [label="A Label"]`
- Numeric node IDs: `1`, `42`
- Port/compass syntax: `node:port`, `node:port:compass`
- HTML-like labels: `<b>bold</b>`

#### Attribute Type Inference

Attribute values are automatically cast to the appropriate JavaScript type:

- `true` / `false` → `boolean`
- `42`, `3.14`, `-1` → `number`
- `"hello"` → `string`
- `bareword` → `string`
- Bare key without value (e.g. `[active]`) → `true`

### Writer

The writer takes a `graphology` instance and outputs a DOT **string**.

```js
// Node
var dot = require('graphology-dot');
// Browser
var dot = require('graphology-dot/browser');

// Writing the graph
var dotString = dot.write(graph);

// Using custom formatting for nodes & edges
var dotString = dot.write(graph, {
  formatNode: function (key, attributes) {
    return {
      label: attributes.label,
      color: attributes.color,
      size: attributes.size
    };
  },
  formatEdge: function (key, attributes) {
    return {
      weight: attributes.weight,
      active: attributes.active
    };
  }
});
```

_Arguments_

- **graph** _Graph_: graphology instance to write.
- **options** _?object_: Options:
  - **formatNode** _?function_: function receiving `(key, attributes)` and returning the node's data to write. Defaults to writing all attributes.
  - **formatEdge** _?function_: function receiving `(key, attributes)` and returning the edge's data to write. Defaults to writing all attributes.

#### Writer Behavior

- Undirected/mixed graphs use the `graph` keyword; directed graphs use `digraph`.
- The graph's `id` attribute becomes the graph name: `graph G { ... }`.
- Other graph-level attributes are written as `graph [key=value, ...]`.
- Attribute values are formatted according to their JavaScript type:
  - Booleans → `true` / `false`
  - Numbers → unquoted literal (`42`, `3.14`)
  - Simple string identifiers → unquoted (`red`)
  - Strings with special characters → quoted (`"hello world"`)
