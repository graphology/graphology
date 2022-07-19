require('@babel/register');

const assert = require('assert');
const randomString = require('pandemonium/random-string');

const Graph = require('../src/endpoint.cjs').default;

const N = 500000;

const g = new Graph();

for (i = 0; i < N; i++) {
  s = randomString(4, 50);
  t = randomString(4, 50);

  if (i % 2 === 0) g.mergeDirectedEdge(s, t);
  else g.mergeUndirectedEdge(s, t);
}

function basicTraversal() {
  let e = 0;
  g.forEachNode(node => {
    g.forEachOutboundNeighbor(node, neighbor => {
      e++;
    });
  });

  assert.strictEqual(e, g.directedSize + g.undirectedSize * 2);
}

function betterTraversal() {
  let e = 0;

  const inc = () => e++;

  g.forEachNode(node => {
    g.forEachOutboundNeighbor(node, inc);
  });

  assert.strictEqual(e, g.directedSize + g.undirectedSize * 2);
}

function traverse(callback) {
  g._nodes.forEach(data => {
    let n;

    for (n in data.out) {
      callback(data.out[n].source.key, data.out[n].target.key);
    }

    for (n in data.undirected) {
      callback(data.undirected[n].source.key, data.undirected[n].target.key);
    }
  });
}

function flatTraversal() {
  let e = 0;

  traverse(key => {
    e++;
  });

  assert.strictEqual(e, g.directedSize + g.undirectedSize * 2);
}

function newTraversal() {
  let e = 0;

  g.forEachAdjacencyEntry(key => {
    e++;
  });

  assert.strictEqual(e, g.directedSize + g.undirectedSize * 2);
}

console.time('basic');
basicTraversal();
console.timeEnd('basic');

console.time('better');
betterTraversal();
console.timeEnd('better');

console.time('flat');
flatTraversal();
console.timeEnd('flat');

console.time('new');
newTraversal();
console.timeEnd('new');
