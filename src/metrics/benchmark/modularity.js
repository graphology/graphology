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
  [6, 3]
];

var g = new Graph.UndirectedGraph();
nodes.forEach(n => g.addNode(n[0], {community: n[1]}));
edges.forEach(e => g.mergeEdge(e[0], e[1]));

var degrees = nodes.map(n => g.degree(n[0]));

var M = g.size; // Undirected size (minus 1 mutual edge)
var M2 = M * 2;

var S = 0, Aij, didj;

var tot = {1: 0, 2: 0}, int = {1: 0, 2: 0}, ext = {1: 0, 2: 0};

var i, j, l, ok;

for (i = 0, l = nodes.length; i < l; i++) {

  // NOTE: j = 0, not i + 1 here
  for (j = 0; j < l; j++) {

    // Kronecker delta
    if (nodes[i][1] !== nodes[j][1])
      continue;

    ok = g.hasEdge(nodes[i][0], nodes[j][0]);
    Aij = ok ? 1 : 0;
    didj = degrees[i] * degrees[j];
    S += Aij - (didj / M2);
  }
}

for (i = 0, l = nodes.length; i < l; i++) {
  for (j = i + 1; j < l; j++) {
    ok = g.hasEdge(nodes[i][0], nodes[j][0]);

    if (ok) {
      tot[nodes[i][1]] += 1;
      tot[nodes[j][1]] += 1;
    }

    // Kronecker delta
    if (nodes[i][1] !== nodes[j][1]) {
      ext[nodes[i][1]] += 1;
      ext[nodes[j][1]] += 1;
      continue;
    }

    if (ok)
      int[nodes[i][1]] += 2;
  }
}

var Q = S / M2;
var SPARSE_Q = ((int[1] - (tot[1] * tot[1] / M2)) + (int[2] - (tot[2] * tot[2] / M2))) / M2;
var OTHER_SPARSE_Q = ((int[1] / M2) - Math.pow(tot[1] / M2, 2)) + ((int[2] / M2) - Math.pow(tot[2] / M2, 2));

console.log();
console.log('Undirected case:');
console.log('----------------');
console.log('M = ', M);
console.log('S = ', S);
console.log('Q = ', Q.toFixed(4));
console.log('lib Q =', lib.dense(g).toFixed(4));
console.log('tot1', tot[1], 'tot2', tot[2]);
console.log('int1', int[1], 'int2', int[2]);
console.log('ext1', ext[1], 'ext2', ext[2]);
console.log('sparse Q = ', SPARSE_Q.toFixed(4));
console.log('other sparse Q =', OTHER_SPARSE_Q.toFixed(4));
console.log('lib sparse Q = ', lib.sparse(g).toFixed(4));

// 1/2m ∑ij[Aij - (di.dj / 2m)].∂(ci, cj)
// ∑c[(∑c-internal / 2m) - (∑c-total / 2m)²]
// self-loop do not count
// note: sparse version is the same as igraph now

var d = new Graph.DirectedGraph();
nodes.forEach(n => d.addNode(n[0], {community: n[1]}));
edges.forEach(e => d.mergeEdge(e[0], e[1]));

var inDegrees = nodes.map(n => d.inDegree(n[0]));
var outDegrees = nodes.map(n => d.outDegree(n[0]));

M = d.size;
M2 = M * 2;
S = 0;

for (i = 0, l = nodes.length; i < l; i++) {

  // NOTE: j = 0, not i + 1 here
  for (j = 0; j < l; j++) {

    // Kronecker delta
    if (nodes[i][1] !== nodes[j][1])
      continue;

    ok = d.hasEdge(nodes[i][0], nodes[j][0]);
    Aij = ok ? 1 : 0;
    didj = inDegrees[i] * outDegrees[j];
    S += Aij - (didj / M);
  }
}

var totIn = {1: 0, 2: 0}, totOut = {1: 0, 2: 0};
tot = {1: 0, 2: 0};
int = {1: 0, 2: 0};
ext = {1: 0, 2: 0};

for (i = 0, l = nodes.length; i < l; i++) {
  for (j = 0; j < l; j++) {
    if (i === j)
      continue;

    ok = d.hasEdge(nodes[i][0], nodes[j][0]);

    if (ok) {
      totOut[nodes[i][1]] += 1;
      totIn[nodes[j][1]] += 1;
      tot[nodes[i][1]] += 1;
      tot[nodes[j][1]] += 1;
    }

    // Kronecker delta
    if (nodes[i][1] !== nodes[j][1]) {
      ext[nodes[i][1]] += 1;
      ext[nodes[j][1]] += 1;
      continue;
    }

    if (ok)
      int[nodes[i][1]] += 1;
  }
}

Q = S / M;

OTHER_SPARSE_Q =
  ((int[1] / M) - (totIn[1] * totOut[1] / Math.pow(M, 2))) +
  ((int[2] / M) - (totIn[2] * totOut[2] / Math.pow(M, 2)));

console.log();
console.log('Directed case:');
console.log('--------------');
console.log('M = ', M);
console.log('S = ', S);
console.log('Q = ', Q.toFixed(4));
console.log('lib Q = ', lib.dense(d).toFixed(4));
console.log('tot1', tot[1], 'tot2', tot[2]);
console.log('totIn1', totIn[1], 'totIn2', totIn[2]);
console.log('totOut1', totOut[1], 'totOut2', totOut[2]);
console.log('int1', int[1], 'int2', int[2]);
console.log('other sparse Q =', OTHER_SPARSE_Q.toFixed(4));
console.log('lib sparse Q = ', lib.sparse(d).toFixed(4));
console.log();

// NOTE: connected components are correctly handled, empty graph should not be done
// TODO: align with https://networkx.github.io/documentation/stable/_modules/networkx/algorithms/community/quality.html

