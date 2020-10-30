require('@babel/register');

const randomString = require('pandemonium/random-string');

const Graph = require('../src/endpoint.cjs').default;

const N = 500000;
const I = 10;

const g = new Graph();

let i;
let c;

while (g.order < N)
  g.mergeNode(randomString(4, 50), {x: Math.random(), y: Math.random()});

console.time('double');
c = 0;
for (i = 0; i < I; i++) {
  g.forEachNode(node => {
    g.setNodeAttribute(node, 'x', Math.random());
    g.setNodeAttribute(node, 'y', Math.random());
    c++;
  });
}
console.timeEnd('double');
console.log(c);

console.time('mono');
c = 0;
for (i = 0; i < I; i++) {
  g.forEachNode(node => {
    g.replaceNodeAttributes(node, {x: Math.random(), y: Math.random()});
    c++;
  });
}
console.timeEnd('mono');
console.log(c);

console.time('update');
c = 0;
for (i = 0; i < I; i++)
  g.updateEachNodeAttributes((_, attr) => {
    attr.x = Math.random();
    attr.y = Math.random();
    c++;
    return attr;
  });
console.timeEnd('update');
console.log(c);
