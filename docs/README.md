# Graphology

`graphology` is a generic specification for a robust & multipurpose JavaScript `Graph` object.

While `graphology` proposes a reference implementation, it merely remains a specificiation that anyone is free to implement in their own way.

Along with both its specification & its reference implementation, note finally that `graphology` also packs a standard library full of graph theory algorithms and common utilities written to work with any implementation of the present specifications.

## Installation

To install the reference implementation:

```bash
npm install --save graphology
```

## Quick start

```js
import Graph from 'graphology';

const graph = new Graph();

graph.addNode('Jack', {age: 56});
graph.addNode('John', {age: 13});
graph.addNode('Catherine', {age: 15});
graph.addNode('Martha', {age: 94});

graph.addEdge('Jack', 'John', {type: 'FATHER_OF'});
graph.addEdge('Jack', 'Catherine', {type: 'FATHER_OF'});
graph.addEdge('Martha', 'Jack', {type: 'MOTHER_OF'});

const children = graph
  .edges()
  .filter('Jack', edge => graph.getEdgeAttribute('type') === 'FATHER_OF')
  .map(edge => return graph.relatedNode('Jack', edge));

children
>>> ['John', 'Catherine']
```
