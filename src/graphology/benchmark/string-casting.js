var randomString = require('pandemonium/random-string');

var N = 1000000000;
var S = 5000;

var strings = Array.from(new Array(S), () => randomString(4, 100));

let i, s;

console.time('ninja cast');
for (i = 0; i < N; i++) s = '' + strings[i % S];
console.timeEnd('ninja cast');

console.time('toString');
for (i = 0; i < N; i++) s = strings[i % S].toString();
console.timeEnd('toString');

console.time('condition');
for (i = 0; i < N; i++) {
  s = strings[i % S];
  s = typeof s === 'string' ? s : '' + s;
}
console.timeEnd('condition');

console.time('constructor');
for (i = 0; i < N; i++) {
  s = String(strings[i % S]);
}
console.timeEnd('constructor');
