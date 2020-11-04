require('@babel/register');

const randomString = require('pandemonium/random-string');

const Graph = require('../src/endpoint.cjs').default;

const E = 1000000;

const g = new Graph();

console.time('build');
while (g.size < E)
  g.mergeEdge(randomString(4, 50), randomString(4, 50));
console.timeEnd('build');
