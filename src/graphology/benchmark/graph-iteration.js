require('@babel/register');

const randomString = require('pandemonium/random-string');

const Graph = require('../src/endpoint.cjs').default;

const N = 500000;
const I = 1000;

const g = new Graph();

let i, v, j, l;
let it, step;

while (g.order < N) g.mergeEdge(randomString(4, 50), randomString(4, 50));

// console.time('nodes array');
// for (i = 0; i < I; i++) {
//   it = g.nodes();
//   for (j = 0, l = it.length; j < l; j++) v = g.getNodeAttributes(it[j]);
// }
// console.timeEnd('nodes array');

console.time('forEachNode');
for (i = 0; i < I; i++)
  g.forEachNode(node => {
    v = node;
  });
console.timeEnd('forEachNode');

console.time('for...of node');
for (i = 0; i < I; i++) {
  for (const node of g.nodeEntries()) v = node;
}
console.timeEnd('for...of node');

console.time('step node');
for (i = 0; i < I; i++) {
  it = g.nodeEntries();
  while (((step = it.next()), !step.done)) v = step.value[0];
}
console.timeEnd('step node');

// ---

console.time('forEachEdge');
for (i = 0; i < I; i++)
  g.forEachEdge(edge => {
    v = edge;
  });
console.timeEnd('forEachEdge');

console.time('for...of edge');
for (i = 0; i < I; i++) {
  for (const edge of g.edgeEntries()) v = edge;
}
console.timeEnd('for...of edge');

console.time('step edge');
for (i = 0; i < I; i++) {
  it = g.edgeEntries();
  while (((step = it.next()), !step.done)) v = step.value[0];
}
console.timeEnd('step edge');
