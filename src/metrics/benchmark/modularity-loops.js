var Graph = require('graphology');
var lib = require('../modularity.js');

var nodes = [
  [1, 1], // id, community
  [2, 2],
  [3, 2],
  [4, 2],
  [5, 1],
  [6, 2]
];

var edges = [
  [1, 2], // source, target
  [1, 5],
  [2, 3],
  [3, 4],
  [4, 2],
  [5, 1],
  [6, 3],
  [1, 1]
];

var G = new Graph.UndirectedGraph();
nodes.forEach(n => G.addNode(n[0], {community: n[1]}));
edges.forEach(e => G.mergeEdge(e[0], e[1]));

var D = new Graph.DirectedGraph();
nodes.forEach(n => D.addNode(n[0], {community: n[1]}));
edges.forEach(e => D.mergeEdge(e[0], e[1]));

var Q = lib.dense(G);
var QD = lib.dense(D);

console.log(Q);
console.log(QD);
