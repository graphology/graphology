/* eslint no-console: 0 */
/**
 * Graphology FA2 Layout Bench
 * ============================
 *
 * Simplistic benchmark to assess some performance improvements.
 */
var Graph = require('graphology'),
  layout = require('../index.js'),
  randomClusters = require('graphology-generators/random/clusters'),
  seedrandom = require('seedrandom');

var rng = function () {
  return seedrandom('bench');
};

console.time('Creation');
var graph = randomClusters(Graph, {
  order: 5000,
  size: 100000,
  clusters: 5,
  rng: rng()
});

graph.nodes().forEach(function (node) {
  graph.setNodeAttribute(node, 'x', Math.random());
  graph.setNodeAttribute(node, 'y', Math.random());
});
console.timeEnd('Creation');

console.time('Layout');
layout(graph, {
  settings: {
    barnesHutOptimize: true
  },
  iterations: 50
});
console.timeEnd('Layout');
