var Graph = require('graphology');
var generateClusters = require('graphology-generators/random/clusters');
var randomLayout = require('graphology-layout/random');
var layout = require('../');

var ORDER = 50000;
var SIZE = 100000;
var CLUSTERS = 10;

var graph = generateClusters(Graph.UndirectedGraph, {
  order: ORDER,
  size: SIZE,
  clusters: CLUSTERS
});
randomLayout.assign(graph);

console.time('layout');
console.profile('layout');
layout(graph, {iterations: 5, settings: {barnesHutOptimize: true}});
console.profileEnd('layout');
console.timeEnd('layout');
