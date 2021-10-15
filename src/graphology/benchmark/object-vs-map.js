const random = require('pandemonium/random');
const randomString = require('pandemonium/random-string');

const N = 500000;

let i, k, v;

const o = {};
const m = new Map();

const keys = new Array(N);

const integerKeys = process.argv[3] === 'integers';

const key = () => {
  if (integerKeys) return random(N, N * 2);

  return randomString(3, 87);
};

for (i = 0; i < N; i++) keys[i] = integerKeys ? i : key();

if (process.argv[2] === 'object') {
  console.time('object write');
  for (i = 0; i < N; i++) o[keys[i]] = Math.random();
  console.timeEnd('object write');

  console.time('object miss');
  for (i = 0; i < N; i++) v = o[key()];
  console.timeEnd('object miss');

  console.time('object get');
  for (i = 0; i < N; i++) v = o[keys[i]];
  console.timeEnd('object get');

  console.time('object iter');
  for (k in o) v = o[k];
  console.timeEnd('object iter');

  if (integerKeys) {
    console.time('object iter monotonic');
    for (k = 0; k < N; k++) v = o[k];
    console.timeEnd('object iter monotonic');
  }
} else {
  console.time('map write');
  for (i = 0; i < N; i++) m.set(keys[i], Math.random());
  console.timeEnd('map write');

  console.time('map miss');
  for (i = 0; i < N; i++) v = m.get(key());
  console.timeEnd('map miss');

  console.time('map get');
  for (i = 0; i < N; i++) v = m.get(keys[i]);
  console.timeEnd('map get');

  console.time('map iter');
  m.forEach(value => (v = value));
  console.timeEnd('map iter');
}
