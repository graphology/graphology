var Graph = require('graphology');
var robustRandomnessLouvain = require('../experimental/robust-randomness.js');

var kite = new Graph({type: 'undirected'});

kite.addNode('0');
kite.addNode('1');
kite.addNode('2');
kite.addNode('3');
kite.addNode('4');
kite.addNode('5');
kite.addNode('6');
kite.addEdge('0', '1');
kite.addEdge('1', '2');
kite.addEdge('2', '0');
kite.addEdge('0', '3');
kite.addEdge('4', '3');
kite.addEdge('4', '5');
kite.addEdge('5', '6');
kite.addEdge('6', '4');

for (var i = 0; i < 10; i++) console.log(robustRandomnessLouvain(kite)[3]);

var N = 10000;

var ZEROES = 0;

for (var i = 0; i < N; i++) {
  if (robustRandomnessLouvain(kite)[3] === 0) {
    ZEROES++;
  }
}

console.log(ZEROES, ZEROES / N);

// const EUROSIS = Graph.from(require('../test/datasets/eurosis.json'));
// console.log(robustRandomnessLouvain(EUROSIS));
