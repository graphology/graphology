require('@babel/register');

const data = require('../src/data');
const randomString = require('pandemonium/random-string');
const random = require('pandemonium/random');

const {DirectedEdgeData} = data;

const I = 100000000;
const O = 10000;

let i, r;

const objects = new Array(O);

for (i = 0; i < O; i++) {
  objects[i] = new DirectedEdgeData(
    randomString(3, 10),
    i % 2 === 0,
    randomString(3, 10),
    randomString(3, 10),
    {weight: random(1, 30)}
  );
  objects[i].undirected = false;
}

console.time('instanceof');
for (i = 0; i < I; i++) r = objects[i % O] instanceof DirectedEdgeData;
console.timeEnd('instanceof');

console.time('property');
for (i = 0; i < I; i++) r = objects[i % O].undirected;
console.timeEnd('property');
