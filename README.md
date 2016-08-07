# Graphology

`graphology` is a generic specification for a JavaScript `Graph` object.

While `graphology` proposes a reference implementation, it merely remains a specificiation that anyone is free to implement in their own way.

Along with both its specification & its reference implementation, note finally that `graphology` also packs a standard library full of graph theory algorithms and common utilities written to work with any implementation of the present specifications.

## Installation

To install the reference implementation along with the standard library:

```bash
npm install --save graphology
```

To install the unit tests validating `graphology`'s specifications:

```bash
npm install --save-dev graphology-specs
```

## Quick start

```js
import Graph from 'graphology';

const graph = new Graph();

graph.addNode('John', {age: 13});
graph.addNode('Jack', {age: 56});
graph.addNode('Catherine', {age: 15});
graph.addNode('Martha', {age: 94});

graph.addEdge('Jack', 'John', {type: 'FATHER_OF'});
graph.addEdge('Jack', 'Catherine', {type: 'FATHER_OF'});
graph.addEdge('Martha', 'Jack', {type: 'MOTHER_OF'});

const children = graph
  .filterEdges('Jack', edge => edge.type === 'FATHER_OF')
  .map(edge => return graph.relatedNode('Jack', edge));

console.log(children);
```

TODO: api throws
TODO: define generator function
