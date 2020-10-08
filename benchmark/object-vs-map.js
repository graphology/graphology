const randomString = require('pandemonium/random-string');

const key = () => randomString(3, 87);

const N = 5000000;

let i, v;

const o = {};
const m = new Map();

const keys = new Array(N);

for (i = 0; i < N; i++)
  keys[i] = key();

if (process.argv[2] === 'object') {
  console.time('object write');
  for (i = 0; i < N; i++)
    o[keys[i]] = Math.random();
  console.timeEnd('object write');

  console.time('object miss');
  for (i = 0; i < N; i++)
    v = o[key()];
  console.timeEnd('object miss');
}
else {
  console.time('map write');
  for (i = 0; i < N; i++)
    m.set(keys[i], Math.random());
  console.timeEnd('map write');

  console.time('map miss');
  for (i = 0; i < N; i++)
    v = m.get(key());
  console.timeEnd('map miss');
}
