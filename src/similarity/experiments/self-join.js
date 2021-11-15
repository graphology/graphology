/* eslint no-console: 0 */
const Graph = require('graphology');
const {jaccard} = require('mnemonist/set');
const DATA = require('./resources/polarisation.json');

// TODO: fix similarity computation by implying self loop
// TODO: use anti-neighbors concept for directedness

const EPSILON = 1e-8;

const polarisation = Graph.from(DATA);

const upperBound = (polarisation.order * (polarisation.order - 1)) / 2;

const nodes = polarisation.nodes();
const sets = {};
const vectors = {};

polarisation.forEachNode(node => {
  const neighbors = polarisation.neighbors(node);
  vectors[node] = neighbors;
  sets[node] = new Set(neighbors);
});

// Naive quadratic approach
console.time('quadratic');
const quadraticPairs = [];
let J = 0;

for (let i = 0; i < nodes.length; i++) {
  const n1 = nodes[i];
  const v1 = sets[n1];

  for (let j = i + 1; j < nodes.length; j++) {
    const n2 = nodes[j];
    const v2 = sets[n2];

    J++;
    const d = jaccard(v1, v2);

    if (d - EPSILON > 0) quadraticPairs.push([n1, n2, d]);
  }
}
console.timeEnd('quadratic');

console.log(quadraticPairs.length, J, upperBound);

// Topology approach
console.time('topology');
const topologyPairs = [];

const index = {}; // NOTE: this index can be replaced by the graph in a sense (assymetric)
J = 0;

for (let i = 0; i < nodes.length; i++) {
  const n1 = nodes[i];
  const v1 = vectors[n1];

  // if (v1.length > polarisation.order / 4) continue;

  const candidates = {};

  for (let k = 0; k < v1.length; k++) {
    const neighbor = v1[k];
    let container = index[neighbor];

    if (!container) {
      container = [];
      index[neighbor] = container;
    }

    for (let j = 0; j < container.length; j++) {
      const n2 = container[j];

      if (!(n2 in candidates)) {
        candidates[n2] = 1;
      } else {
        candidates[n2] += 1;
      }
    }

    container.push(n1);
  }

  for (const n2 in candidates) {
    const v2 = vectors[n2];
    const I = candidates[n2];

    J++;
    const d = I / (v1.length + v2.length - I);

    if (d - EPSILON > 0) topologyPairs.push([n1, n2, d]);
  }
}
console.timeEnd('topology');

console.log(topologyPairs.length, J, upperBound);

// Full graph experiment
// polarisation.forEachEdge(edge => {
//   polarisation.mergeEdgeAttributes(edge, {type: 'existed', weight: 0});
// });

// topologyPairs.forEach(function ([n1, n2, d]) {
//   if (polarisation.hasEdge(n1, n2)) {
//     polarisation.mergeEdgeAttributes(n1, n2, {weight: d, type: 'both'});
//   } else if (polarisation.hasEdge(n2, n1)) {
//     polarisation.mergeEdgeAttributes(n2, n1, {weight: d, type: 'both'});
//   } else {
//     polarisation.addEdge(n1, n2, {type: 'inexistent', weight: d});
//   }
// });

// console.error(JSON.stringify(polarisation, null, 2));

// Projection experiment
// const louvain = require('graphology-communities-louvain');
// const projection = polarisation.emptyCopy({type: 'undirected'});

// topologyPairs.forEach(([n1, n2, d]) => {
//   projection.addEdge(n1, n2, {weight: d});
// });

// const result = louvain.detailed(projection, {weighted: true, resolution: 1.2});

// polarisation.forEachNode(node => {
//   polarisation.setNodeAttribute(node, 'simsim', '' + result.communities[node]);
// });

// console.error(JSON.stringify(polarisation, null, 2));
