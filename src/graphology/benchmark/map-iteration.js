const assert = require('assert');
const randomString = require('pandemonium/random-string');

const key = () => randomString(4, 87);

const N = 5000000;
const I = 100;

let i;

const map = new Map();

while (map.size < N) map.set(key(), Math.random());

console.log('Finished preparations...');
console.log(map.size);

let s = '';
let c = 0;
console.time('forEach');
for (i = 0; i < I; i++)
  map.forEach(value => {
    s = value;
    c++;
  });
console.timeEnd('forEach');
assert.strictEqual(c, N * I);

c = 0;
console.time('forEachSameFunction');
const fn = value => {
  s = value;
  c++;
};
for (i = 0; i < I; i++) map.forEach(fn);
console.timeEnd('forEachSameFunction');
assert.strictEqual(c, N * I);

c = 0;
console.time('for of');
for (i = 0; i < I; i++) {
  for (const value of map) {
    s = value;
    c++;
  }
}
console.timeEnd('for of');
assert.strictEqual(c, N * I);

c = 0;
console.time('next');
let step, it;
for (i = 0; i < I; i++) {
  it = map.values();
  while (((step = it.next()), step.done !== true)) {
    s = step.value;
    c++;
  }
}
console.timeEnd('next');
assert.strictEqual(c, N * I);
