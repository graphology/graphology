const Graph = require('graphology');
const erdosRenyi = require('graphology-generators/random/erdos-renyi');
const random = require('graphology-layout/random');
const layout = require('../index');

const graph = erdosRenyi(Graph, {order: 250, approximateSize: 500});
random.assign(graph);

console.log('ready');

console.time('Layout.js');
layout(graph, {
  maxIterations: 50
});
console.timeEnd('Layout.js');

console.time('Layout.wasm');
layout(graph, {
  maxIterations: 50,
  settings: {
    wasm: true
  }
});
console.timeEnd('Layout.wasm');