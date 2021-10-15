require('@babel/register');

const updateStructureIndex = require('../src/indices').updateStructureIndex;
const data = require('../src/data');

const {EdgeData, MixedNodeData} = data;

const randomString = require('pandemonium/random-string');

const Graph = require('../src/endpoint.cjs').default;

const N = 500000;

const g = new Graph();

let i, s, t;
let copy;

function directedCopy(fromGraph, strict = false) {
  const type = strict ? 'directed' : 'mixed';

  const toGraph = fromGraph.emptyCopy({type});
  toGraph._undirectedSelfLoopCount = fromGraph._undirectedSelfLoopCount;
  toGraph._undirectedSize = fromGraph._undirectedSize;

  const iterator = fromGraph._edges.values();

  let step, edgeData, source, target, sourceData, targetData;

  while (((step = iterator.next()), step.done !== true)) {
    edgeData = step.value;

    if (edgeData.undirected) continue;

    source = edgeData.source.key;
    target = edgeData.target.key;
    sourceData = toGraph._nodes.get(source);
    targetData = toGraph._nodes.get(target);

    const copy = new EdgeData(
      false,
      edgeData.key,
      edgeData.generatedKey,
      sourceData,
      targetData,
      Object.assign({}, edgeData.attributes)
    );

    toGraph._edges.set(copy.key, copy);

    if (source === target) {
      sourceData.directedSelfLoops++;
    } else {
      sourceData.outDegree++;
      targetData.inDegree++;
    }

    updateStructureIndex(
      toGraph,
      false,
      copy,
      source,
      target,
      sourceData,
      targetData
    );
  }

  return toGraph;
}

function directedCopyThroughAdjacency(fromGraph, strict = false) {
  const type = strict ? 'directed' : 'mixed';

  const toGraph = fromGraph.emptyCopy({type});
  toGraph._undirectedSelfLoopCount = fromGraph._undirectedSelfLoopCount;
  toGraph._undirectedSize = fromGraph._undirectedSize;

  let sourceData = new MixedNodeData(null);

  fromGraph.forEach((source, target, sa, ta, edge, ea, u) => {
    if (u) return;

    if (source !== sourceData.key) sourceData = toGraph._nodes.get(source);

    const targetData = toGraph._nodes.get(target);

    const copy = new EdgeData(
      false,
      edge,
      true,
      sourceData,
      targetData,
      Object.assign({}, ea)
    );

    toGraph._edges.set(copy.key, copy);

    if (source === target) {
      sourceData.directedSelfLoops++;
    } else {
      sourceData.outDegree++;
      targetData.inDegree++;
    }

    updateStructureIndex(
      toGraph,
      false,
      copy,
      source,
      target,
      sourceData,
      targetData
    );
  });

  return toGraph;
}

for (i = 0; i < N; i++) {
  s = randomString(4, 50);
  t = randomString(4, 50);

  if (i % 2 === 0) g.mergeDirectedEdge(s, t);
  else g.mergeUndirectedEdge(s, t);
}

console.time('copy');
copy = g.emptyCopy();
g.forEachDirectedEdge((edge, attr, source, target) => {
  copy.addEdge(source, target, Object.assign({}, attr));
});
console.timeEnd('copy');
console.log(copy.size);

console.time('directedCopy');
copy = directedCopy(g);
console.timeEnd('directedCopy');
console.log(copy.size);

console.time('directedCopyThroughAdjacency');
copy = directedCopyThroughAdjacency(g);
console.timeEnd('directedCopyThroughAdjacency');
console.log(copy.size);
