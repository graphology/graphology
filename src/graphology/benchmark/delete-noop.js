const randomString = require('pandemonium/random-string');

const N = 1000000;

const trueKeys = new Array(N);
const falseKeys = new Array(N);

const o1 = {};
const o2 = {};
const o3 = {};

let i;

for (i = 0; i < N; i++) {
  trueKeys[i] = randomString(10, 35);
  falseKeys[i] = randomString(10, 35);

  o1[trueKeys[i]] = Math.random();
  o2[trueKeys[i]] = Math.random();
  o3[trueKeys[i]] = Math.random();
}

console.time('delete');
for (i = 0; i < N; i++) {
  delete o1[trueKeys[i]];
}
console.timeEnd('delete');

console.time('delete no-op');
for (i = 0; i < N; i++) {
  delete o2[falseKeys[i]];
}
console.timeEnd('delete no-op');

console.time('delete precheck');
for (i = 0; i < N; i++) {
  if (falseKeys[i] in o3) delete o3[falseKeys[i]];
}
console.timeEnd('delete precheck');

console.log(o1);
