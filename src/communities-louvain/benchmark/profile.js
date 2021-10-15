var Graph = require('graphology');
var generateClusters = require('graphology-generators/random/clusters');
var louvain = require('../');

var graph = generateClusters(Graph.UndirectedGraph, {
  order: 50000,
  size: 1000000,
  clusters: 50
});

console.time('louvain');
console.profile('louvain');
louvain(graph);
console.profileEnd('louvain');
console.timeEnd('louvain');
