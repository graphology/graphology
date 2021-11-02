const Graph = require('graphology');
const {erdosRenyi} = require('graphology-generators/random');
const {OutboundNeighborhoodIndex} = require('../neighborhood');
const seedrandom = require('seedrandom');

const rng = seedrandom('test');

const graph = erdosRenyi.sparse(Graph, {order: 10000, probability: 0.02, rng});

console.log(graph.order, graph.size);
console.log();

console.time('OutboundNeighborhoodIndex');
const index = new OutboundNeighborhoodIndex(graph);
console.timeEnd('OutboundNeighborhoodIndex');

console.time('Iteration');
let i = 0;
let n = 0;
let j = 0;

for (i = 0; i < index.nodes.length; i++) {
  for (n = index.starts[i]; n < index.starts[i + 1]; n++) {
    j++;
  }
}
console.timeEnd('Iteration');

console.log(j, graph.directedSize + graph.undirectedSize * 2);
