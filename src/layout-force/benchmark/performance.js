const Graph = require('graphology');
const erdosRenyi = require('graphology-generators/random/erdos-renyi');
const random = require('graphology-layout/random');
const force = require('../');

const graph = erdosRenyi(Graph, {order: 2500, approximateSize: 50000});
random.assign(graph);

console.log('ready');

console.time('force');
force.assign(graph, 5);
console.timeEnd('force');
