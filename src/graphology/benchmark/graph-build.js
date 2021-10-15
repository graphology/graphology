require('@babel/register');

const randomString = require('pandemonium/random-string');

const Graph = require('../src/endpoint.cjs').default;

const N = 1500;

const g = new Graph();
const keys = new Array(N);
const keySet = new Set();

let i, j, k;

for (i = 0; i < N; i++) {
  do {
    k = randomString(4, 50);
  } while (keySet.has(k));
  keySet.add(k);
  keys[i] = k;
  g.addNode(k);
}

console.time('build');
for (i = 0; i < N; i++) {
  for (j = 0; j < N; j++) {
    if (i === j) continue;

    g.addEdge(keys[i], keys[j]);
  }
}
console.timeEnd('build');
