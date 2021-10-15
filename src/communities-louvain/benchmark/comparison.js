var undirected1000Data = require('../test/datasets/undirected1000.json');
var euroSisData = require('../test/datasets/eurosis.json');

var Graph = require('graphology');
var modularity = require('graphology-metrics/modularity');
// var toUndirected = require('graphology-operators/to-undirected');
var generateClusters = require('graphology-generators/random/clusters');
var jLouvain = require('jlouvain').jLouvain;
var createNGraph = require('ngraph.graph');
var ngraphLouvain = require('ngraph.louvain');
var ngraphLouvainNative = require('ngraph.louvain.native');
var ngraphCoarsen = require('ngraph.coarsen');
var louvain = require('../');

function collectNGraphCommunities(g, result) {
  var map = {};

  g.forEachNode(n => {
    map[n.id] = result.getClass(n.id);
  });

  return map;
}

function ngraphLouvainHierarchy(g) {
  var clusters = ngraphLouvain(g);

  while (clusters.canCoarse()) {
    g = ngraphCoarsen(g, clusters);
    clusters = ngraphLouvain(g);
  }

  return collectNGraphCommunities(g, clusters);
}

function ngraphLouvainHierarchyNative(g) {
  var clusters = ngraphLouvainNative(g);

  while (clusters.canCoarse()) {
    g = ngraphCoarsen(g, clusters);
    clusters = ngraphLouvainNative(g);
  }

  return collectNGraphCommunities(g, clusters);
}

// Helpers
function distinctSize(o) {
  var keys = new Set();

  for (var k in o) keys.add(o[k]);

  return keys.size;
}

// Preparing data
var undirected1000 = new Graph.UndirectedGraph();
var undirected1000NGraph = createNGraph();

undirected1000Data.nodes.forEach(d => {
  undirected1000.addNode(d.id, d);
  undirected1000NGraph.addNode(d.id);
});

undirected1000Data.edges.forEach(d => {
  undirected1000.addEdge(d.source, d.target);
  undirected1000NGraph.addLink(d.source, d.target);
});

var undirected1000NodeData = undirected1000Data.nodes.map(d => d.id);

var euroSis = Graph.DirectedGraph.from(euroSisData);
// var undirectedEuroSis = toUndirected(euroSis);
var euroSisNGraph = createNGraph();

euroSis.forEachNode(n => euroSisNGraph.addNode(n));
euroSis.forEachEdge((e, a, s, t) => euroSisNGraph.addLink(s, t));

var euroSisNodeData = euroSis.nodes();
var euroSisEdgeData = euroSis.edges().map(e => {
  return {
    source: euroSis.source(e),
    target: euroSis.target(e)
  };
});

var bigGraph = generateClusters(Graph.UndirectedGraph, {
  order: 50000,
  size: 1000000,
  clusters: 50
});
// var bigGraphStringKeys = new Graph.UndirectedGraph();
// bigGraph.forEachEdge((e, a, s, t) => {
//   bigGraphStringKeys.mergeEdge(`__${s}__`, `__${t}__`);
// });
// bigGraph = bigGraphStringKeys;

var bigGraphNGraph = createNGraph();

// var bigGraphNodeData = bigGraph.nodes();
// var bigGraphEdgeData = bigGraph.edges().map(e => {
//   return {
//     source: bigGraph.source(e),
//     target: bigGraph.target(e)
//   };
// });

bigGraph.forEachNode(n => bigGraphNGraph.addNode(n));
bigGraph.forEachEdge((e, a, s, t) => bigGraphNGraph.addLink(s, t));

// Bench
var communities;

console.log(
  `Clustered Undirected graph with ${undirected1000.order} nodes and ${undirected1000.size} edges.`
);
console.log();

console.time('graphology undirected1000');
communities = louvain(undirected1000);
console.timeEnd('graphology undirected1000');

console.log('Communities', distinctSize(communities));
console.log('Modularity', modularity(undirected1000, {communities}));
console.log();

console.time('jlouvain undirected1000');
communities = jLouvain()
  .nodes(undirected1000NodeData)
  .edges(undirected1000Data.edges)();
console.timeEnd('jlouvain undirected1000');

console.log('Communities', distinctSize(communities));
console.log('Modularity', modularity(undirected1000, {communities}));
console.log();

console.time('ngraph.louvain undirected1000');
communities = ngraphLouvainHierarchy(undirected1000NGraph);
console.timeEnd('ngraph.louvain undirected1000');

console.log('Communities', distinctSize(communities));
console.log();

console.time('ngraph.louvain.native undirected1000');
communities = ngraphLouvainHierarchyNative(undirected1000NGraph);
console.timeEnd('ngraph.louvain.native undirected1000');

console.log('Communities', distinctSize(communities));
console.log();

//---
console.log('---');
console.log();

console.log(
  `EuroSIS Directed graph with ${euroSis.order} nodes and ${euroSis.size} edges.`
);
console.log();

console.time('graphology euroSis');
communities = louvain(euroSis);
console.timeEnd('graphology euroSis');

console.log('Communities', distinctSize(communities));
console.log('Modularity', modularity(euroSis, {communities}));
console.log();

console.time('jlouvain euroSis');
communities = jLouvain().nodes(euroSisNodeData).edges(euroSisEdgeData)();
console.timeEnd('jlouvain euroSis');

console.log('Communities', distinctSize(communities));
console.log('Modularity', modularity(euroSis, {communities}));
console.log();

console.time('ngraph euroSis');
communities = ngraphLouvainHierarchy(euroSisNGraph);
console.timeEnd('ngraph euroSis');

console.log('Communities', distinctSize(communities));
console.log();

console.time('ngraph.native euroSis');
communities = ngraphLouvainHierarchyNative(euroSisNGraph);
console.timeEnd('ngraph.native euroSis');

console.log('Communities', distinctSize(communities));
console.log();

//---
console.log('---');
console.log();

console.log(
  `Big Undirected graph with ${bigGraph.order} nodes and ${bigGraph.size} edges.`
);
console.log();

console.time('graphology bigGraph');
communities = louvain(bigGraph);
console.timeEnd('graphology bigGraph');

console.log('Communities', distinctSize(communities));
console.log('Modularity', modularity(bigGraph, {communities}));
console.log();

// NOTE: too slow to finish in time
console.log('jLouvain is too slow...');
console.log();
// console.time('jlouvain bigGraph');
// communities = jLouvain()
//   .nodes(bigGraphNodeData)
//   .edges(bigGraphEdgeData)();
// console.timeEnd('jlouvain bigGraph');

console.time('ngraph bigGraph');
communities = ngraphLouvainHierarchy(bigGraphNGraph);
console.timeEnd('ngraph bigGraph');

console.log('Communities', distinctSize(communities));
console.log();

console.time('ngraph.native bigGraph');
communities = ngraphLouvainHierarchyNative(bigGraphNGraph);
console.timeEnd('ngraph.native bigGraph');

console.log('Communities', distinctSize(communities));
console.log();
