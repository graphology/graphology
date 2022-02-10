const randomString = require('pandemonium/random-string');

const N = 2000000;

const trueKeys = new Array(N);
const falseKeys = new Array(N);

const s1 = new Set();
const s2 = new Set();

let i;

for (i = 0; i < N; i++) {
  trueKeys[i] = randomString(10, 35);
  falseKeys[i] = randomString(10, 35);

  s1.add(trueKeys[i]);
  s2.add(trueKeys[i]);
}

console.time('has');
for (i = 0; i < N; i++) {
  if (!s1.has(trueKeys[i])) {
    s1.add(trueKeys[i]);
    console.log('should never happen!');
  }

  if (!s1.has(falseKeys[i])) {
    s1.add(falseKeys[i]);
  }
}
console.timeEnd('has');

console.time('add');
for (i = 0; i < N; i++) {
  let earlierSize = s1.size;
  s1.add(trueKeys[i]);

  if (s1.size !== earlierSize) {
    console.log('should never happen!');
  }

  earlierSize = s1.size;
  s2.add(falseKeys[i]);

  if (s2.size === earlierSize) {
    console.log('should never happen!');
  }
}
console.timeEnd('add');

console.log(s1.size, s2.size);
