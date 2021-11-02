const randomString = require('pandemonium/random-string');
const Iterator = require('obliterator/iterator');
const consume = require('obliterator/consume');

const N = 1000000;
let i;

const string = () => randomString(2, 15);

const arrayItemsIterator = new Iterator(() => {
  return {
    done: false,
    value: [
      string(),
      {name: string()},
      string(),
      string(),
      {sourceData: string()},
      {targetData: string()},
      false
    ]
  };
});

const objectItemsIterator = new Iterator(() => {
  return {
    done: false,
    value: {
      key: string(),
      attributes: {name: string()},
      source: string(),
      target: string(),
      sourceAttributes: {sourceData: string()},
      targetAttributes: {targetData: string()},
      undirected: false
    }
  };
});

const forEachWithArgs = (n, callback) => {
  for (let j = 0; j < n; j++)
    callback(
      string(),
      {name: string()},
      string(),
      string(),
      {sourceData: string()},
      {targetData: string()},
      false
    );
};

const forEachWithObjects = (n, callback) => {
  for (let j = 0; j < n; j++)
    callback({
      key: string(),
      attributes: {name: string()},
      source: string(),
      target: string(),
      sourceAttributes: {sourceData: string()},
      targetAttributes: {targetData: string()},
      undirected: false
    });
};

console.time('consume array');
consume(arrayItemsIterator, N);
console.timeEnd('consume array');

console.time('consume object');
consume(objectItemsIterator, N);
console.timeEnd('consume object');

console.time('for of array');
i = 0;
for (const [_key, _attr] of arrayItemsIterator) {
  i++;

  if (i === N) break;
}
console.timeEnd('for of array');

console.time('for of object');
i = 0;
for (const {key: _key, attributes: _attr} of objectItemsIterator) {
  i++;

  if (i === N) break;
}
console.timeEnd('for of object');

console.time('forEachWithArgs');
forEachWithArgs(N, ({key: _key, attributes: _attr}) => {});
console.timeEnd('forEachWithArgs');

console.time('forEachWithObjects');
forEachWithObjects(N, ({key: _key, attributes: _attr}) => {});
console.timeEnd('forEachWithObjects');
