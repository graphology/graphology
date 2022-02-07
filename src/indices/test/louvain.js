/**
 * Graphology Indices Unit Tests
 * ==============================
 */
var assert = require('chai').assert;
var Graph = require('graphology');
var mergeClique = require('graphology-utils/merge-clique');
var toDirected = require('graphology-operators/to-directed');
var toMulti = require('graphology-operators/to-multi');
var louvain = require('../louvain.js');

var UndirectedLouvainIndex = louvain.UndirectedLouvainIndex;
var DirectedLouvainIndex = louvain.DirectedLouvainIndex;

var EDGES = [
  [1, 2, 30], // source, target, weight
  [1, 5],
  [2, 3, 15],
  [3, 4, 10],
  [4, 2],
  [5, 1, 5],
  [6, 3, 100]
];

var UNDIRECTED_MOVES = [
  // node '2' to community '2'
  [1, 3, 2],
  // node '1' to community '4'
  [0, 2, 4],
  // node '6' to community '2'
  [5, 1, 2],
  // node '4' to community '2'
  [3, 2, 2]
];

var DIRECTED_MOVES = [
  // node '2' to community '2'
  [1, 2, 1, 2],
  // node '1' to community '4'
  [0, 1, 2, 4],
  // node '6' to community '2'
  [5, 0, 1, 2],
  // node '4' to community '2'
  [3, 1, 1, 2]
];

function fromEdges(GraphConstructor, edges) {
  var g = new GraphConstructor();

  // Adding nodes in order for easier testing
  var nodes = new Set();

  edges.forEach(function (data) {
    nodes.add(data[0]);
    nodes.add(data[1]);
  });

  Array.from(nodes)
    .sort()
    .forEach(function (node) {
      g.addNode(node);
    });

  edges.forEach(function (data) {
    if (data.length === 3) g.mergeEdge(data[0], data[1], {weight: data[2]});
    else g.mergeEdge(data[0], data[1]);
  });

  return g;
}

function applyMoves(index, moves) {
  moves.forEach(function (move) {
    index.move.apply(index, move);
  });
}

function closeTo(A, B) {
  assert.closeTo(A, B, 0.0001);
}

describe('LouvainIndex', function () {
  it('should properly index the given undirected graph.', function () {
    var graph = fromEdges(Graph.UndirectedGraph, EDGES);

    var index = new UndirectedLouvainIndex(graph);
    // console.log(index);

    assert.strictEqual(index.M, 161);

    assert.deepEqual(index.project(), {
      1: ['5', '2'],
      2: ['4', '3', '1'],
      3: ['6', '4', '2'],
      4: ['2', '3'],
      5: ['1'],
      6: ['3']
    });

    assert.deepEqual(
      index.neighborhood,
      new Uint8Array([4, 1, 3, 2, 0, 5, 3, 1, 1, 2, 0, 2])
    );
    assert.deepEqual(
      index.weights,
      new Float64Array([5, 30, 1, 15, 30, 100, 10, 15, 1, 10, 5, 100])
    );
    // assert.deepEqual(index.internalWeights, new Float64Array([0, 0, 0, 0, 0, 0]));
    assert.deepEqual(
      index.totalWeights,
      new Float64Array(
        Array.from(
          graph.nodes().map(function (node) {
            return graph.edges(node).reduce(function (sum, edge) {
              return sum + (graph.getEdgeAttribute(edge, 'weight') || 1);
            }, 0);
          })
        )
      )
    );
  });

  it('should properly index the given directed graph.', function () {
    var graph = fromEdges(Graph.DirectedGraph, EDGES);

    var index = new DirectedLouvainIndex(graph);
    // console.log(index);

    assert.strictEqual(index.M, 162);

    assert.deepEqual(index.project(), {
      1: ['5', '2', '5'],
      2: ['3', '4', '1'],
      3: ['4', '6', '2'],
      4: ['2', '3'],
      5: ['1', '1'],
      6: ['3']
    });

    assert.deepEqual(index.projectOut(), {
      1: ['5', '2'],
      2: ['3'],
      3: ['4'],
      4: ['2'],
      5: ['1'],
      6: ['3']
    });

    assert.deepEqual(index.projectIn(), {
      1: ['5'],
      2: ['4', '1'],
      3: ['6', '2'],
      4: ['3'],
      5: ['1'],
      6: []
    });

    assert.deepEqual(
      index.neighborhood,
      new Uint8Array([4, 1, 4, 2, 3, 0, 3, 5, 1, 1, 2, 0, 0, 2])
    );
    assert.deepEqual(
      index.weights,
      new Float64Array([1, 30, 5, 15, 1, 30, 10, 100, 15, 1, 10, 5, 1, 100])
    );
    assert.deepEqual(index.offsets, new Uint8Array([2, 4, 7, 10, 12, 14]));
    // assert.deepEqual(index.internalWeights, new Float64Array([0, 0, 0, 0, 0, 0]));
    assert.deepEqual(
      index.totalInWeights,
      new Float64Array(
        Array.from(
          graph.nodes().map(function (node) {
            return graph.inEdges(node).reduce(function (sum, edge) {
              return sum + (graph.getEdgeAttribute(edge, 'weight') || 1);
            }, 0);
          })
        )
      )
    );
    assert.deepEqual(
      index.totalOutWeights,
      new Float64Array(
        Array.from(
          graph.nodes().map(function (node) {
            return graph.outEdges(node).reduce(function (sum, edge) {
              return sum + (graph.getEdgeAttribute(edge, 'weight') || 1);
            }, 0);
          })
        )
      )
    );
  });

  it('should be possible to move a node from one community to the other in the undirected case.', function () {
    var graph = fromEdges(Graph.UndirectedGraph, EDGES);
    var index = new UndirectedLouvainIndex(graph, {getEdgeWeight: null});

    var before = {
      belongings: index.belongings.slice(),
      totalWeights: index.totalWeights.slice()
      // internalWeights: index.internalWeights.slice()
    };

    // Null move of node '1'
    index.move(0, 2, 0);

    assert.deepEqual(before, {
      belongings: index.belongings,
      totalWeights: index.totalWeights
      // internalWeights: index.internalWeights
    });

    // Moving node '1' to community of node '2'
    index.move(0, 2, 1);

    assert.deepEqual(Array.from(index.belongings), [1, 1, 2, 3, 4, 5]);
    // assert.deepEqual(Array.from(index.internalWeights), [0, 2, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalWeights), [0, 5, 3, 2, 1, 1]);

    // Rolling back move
    index.move(0, 2, 0);

    assert.deepEqual(before, {
      belongings: index.belongings,
      totalWeights: index.totalWeights
      // internalWeights: index.internalWeights
    });

    // node '3' to community '1'
    index.move(2, 3, 1);

    assert.deepEqual(Array.from(index.belongings), [0, 1, 1, 3, 4, 5]);
    // assert.deepEqual(Array.from(index.internalWeights), [0, 2, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalWeights), [2, 6, 0, 2, 1, 1]);

    // node '5' to community '0'
    index.move(4, 1, 0);

    assert.deepEqual(Array.from(index.belongings), [0, 1, 1, 3, 0, 5]);
    // assert.deepEqual(Array.from(index.internalWeights), [2, 2, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalWeights), [3, 6, 0, 2, 0, 1]);

    // node '6' to community '1'
    index.move(5, 1, 1);

    assert.deepEqual(Array.from(index.belongings), [0, 1, 1, 3, 0, 1]);
    // assert.deepEqual(Array.from(index.internalWeights), [2, 4, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalWeights), [3, 7, 0, 2, 0, 0]);

    // node '4' to community '1'
    index.move(3, 2, 1);

    assert.deepEqual(Array.from(index.belongings), [0, 1, 1, 1, 0, 1]);
    // assert.deepEqual(Array.from(index.internalWeights), [2, 8, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalWeights), [3, 9, 0, 0, 0, 0]);

    // Supplementary node '3' to community '0'
    index.move(2, 3, 0);

    assert.deepEqual(Array.from(index.belongings), [0, 1, 0, 1, 0, 1]);
    // assert.deepEqual(Array.from(index.internalWeights), [2, 2, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalWeights), [6, 6, 0, 0, 0, 0]);

    // Supplementary node '2' to community '0'
    index.move(2, 3, 1);
    index.move(1, 3, 0);

    assert.deepEqual(Array.from(index.belongings), [0, 0, 1, 1, 0, 1]);
    // assert.deepEqual(Array.from(index.internalWeights), [4, 4, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalWeights), [6, 6, 0, 0, 0, 0]);
  });

  it('should be possible to move a node from one community to the other in the directed case.', function () {
    var graph = fromEdges(Graph.DirectedGraph, EDGES);
    var index = new DirectedLouvainIndex(graph, {getEdgeWeight: null});

    var before = {
      belongings: index.belongings.slice(),
      totalInWeights: index.totalInWeights.slice(),
      totalOutWeights: index.totalOutWeights.slice()
      // internalWeights: index.internalWeights.slice()
    };

    // Null move of node '1'
    index.move(0, 1, 2, 0);

    assert.deepEqual(before, {
      belongings: index.belongings,
      totalInWeights: index.totalInWeights,
      totalOutWeights: index.totalOutWeights
      // internalWeights: index.internalWeights
    });

    // Moving node '1' to community of node '2'
    index.move(0, 1, 2, 1);

    assert.deepEqual(Array.from(index.belongings), [1, 1, 2, 3, 4, 5]);
    // assert.deepEqual(Array.from(index.internalWeights), [0, 1, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalInWeights), [0, 3, 2, 1, 1, 0]);
    assert.deepEqual(Array.from(index.totalOutWeights), [0, 3, 1, 1, 1, 1]);

    // Rolling back move
    index.move(0, 1, 2, 0);

    assert.deepEqual(before, {
      belongings: index.belongings,
      totalInWeights: index.totalInWeights,
      totalOutWeights: index.totalOutWeights
      // internalWeights: index.internalWeights
    });

    // node '3' to community '1'
    index.move(2, 2, 1, 1);

    assert.deepEqual(Array.from(index.belongings), [0, 1, 1, 3, 4, 5]);
    // assert.deepEqual(Array.from(index.internalWeights), [0, 1, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalInWeights), [1, 4, 0, 1, 1, 0]);
    assert.deepEqual(Array.from(index.totalOutWeights), [2, 2, 0, 1, 1, 1]);

    // node '5' to community '0'
    index.move(4, 1, 1, 0);

    assert.deepEqual(Array.from(index.belongings), [0, 1, 1, 3, 0, 5]);
    // assert.deepEqual(Array.from(index.internalWeights), [2, 1, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalInWeights), [2, 4, 0, 1, 0, 0]);
    assert.deepEqual(Array.from(index.totalOutWeights), [3, 2, 0, 1, 0, 1]);

    // node '6' to community '1'
    index.move(5, 0, 1, 1);

    assert.deepEqual(Array.from(index.belongings), [0, 1, 1, 3, 0, 1]);
    // assert.deepEqual(Array.from(index.internalWeights), [2, 2, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalInWeights), [2, 4, 0, 1, 0, 0]);
    assert.deepEqual(Array.from(index.totalOutWeights), [3, 3, 0, 1, 0, 0]);

    // node '4' to community '1'
    index.move(3, 1, 1, 1);

    assert.deepEqual(Array.from(index.belongings), [0, 1, 1, 1, 0, 1]);
    // assert.deepEqual(Array.from(index.internalWeights), [2, 4, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalInWeights), [2, 5, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalOutWeights), [3, 4, 0, 0, 0, 0]);

    // Supplementary node '3' to community '0'
    index.move(2, 2, 1, 0);

    assert.deepEqual(Array.from(index.belongings), [0, 1, 0, 1, 0, 1]);
    // assert.deepEqual(Array.from(index.internalWeights), [2, 1, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalInWeights), [4, 3, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalOutWeights), [4, 3, 0, 0, 0, 0]);

    // Supplementary node '2' to community '0'
    index.move(2, 2, 1, 1);
    index.move(1, 2, 1, 0);

    assert.deepEqual(Array.from(index.belongings), [0, 0, 1, 1, 0, 1]);
    // assert.deepEqual(Array.from(index.internalWeights), [3, 2, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalInWeights), [4, 3, 0, 0, 0, 0]);
    assert.deepEqual(Array.from(index.totalOutWeights), [4, 3, 0, 0, 0, 0]);
  });

  it('should be possible to zoom out in the undirected case.', function () {
    var graph = fromEdges(Graph.UndirectedGraph, EDGES);
    var index = new UndirectedLouvainIndex(graph, {
      keepDendrogram: true,
      getEdgeWeight: null
    });

    // node '1', '5' => community '4' (0)
    // node '2', '3', '4', '6' => community '2' (1)

    // node '2' to community '2'
    index.move(1, 3, 2);

    // node '1' to community '4'
    index.move(0, 2, 4);

    // node '6' to community '2'
    index.move(5, 1, 2);

    // node '4' to community '2'
    index.move(3, 2, 2);

    closeTo(index.modularity(), 0.2083);

    assert.deepEqual(index.counts, new Uint8Array([0, 0, 4, 0, 2, 0]));
    assert.strictEqual(index.U, 4);
    assert.deepEqual(index.unused, new Uint8Array([1, 0, 5, 3, 0, 0]));

    index.zoomOut();

    closeTo(index.modularity(), 0.2083);

    assert.strictEqual(index.C, 2);
    assert.strictEqual(index.E, 2);
    assert.strictEqual(index.U, 0);
    assert.strictEqual(index.level, 1);
    assert.deepEqual(index.counts.slice(0, index.C), new Uint8Array([1, 1]));
    assert.deepEqual(
      index.neighborhood.slice(0, index.E),
      new Uint8Array([1, 0])
    );
    assert.deepEqual(index.weights.slice(0, index.E), new Uint8Array([1, 1]));
    assert.deepEqual(
      index.starts.slice(0, index.C + 1),
      new Uint8Array([0, 1, 2])
    );
    assert.deepEqual(
      index.belongings.slice(0, index.C),
      new Uint8Array([0, 1])
    );
    assert.deepEqual(
      index.totalWeights.slice(0, index.C),
      new Uint8Array([3, 9])
    );
    // assert.deepEqual(index.internalWeights.slice(0, index.C), new Float64Array([2, 8]));

    // Once more
    index.move(0, 1, 1);

    assert.deepEqual(
      index.totalWeights.slice(0, index.C),
      new Uint8Array([0, 12])
    );
    // assert.deepEqual(index.internalWeights.slice(0, index.C), new Float64Array([0, 12]));
    assert.strictEqual(index.U, 1);
    assert.deepEqual(index.unused.slice(0, index.U), new Uint8Array([0]));
    assert.deepEqual(index.counts.slice(0, index.C), new Uint8Array([0, 2]));

    index.zoomOut();

    assert.strictEqual(index.C, 1);
    assert.strictEqual(index.E, 0);
    assert.strictEqual(index.level, 2);

    assert.deepEqual(index.dendrogram, [
      new Uint8Array([0, 1, 2, 3, 4, 5]),
      new Uint8Array([0, 1, 1, 1, 0, 1]),
      new Uint8Array([0, 0, 0, 0, 0, 0])
    ]);

    assert.deepEqual(index.collect(), {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0
    });

    assert.deepEqual(index.collect(0), {
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 4,
      6: 5
    });

    assert.deepEqual(index.collect(1), {
      1: 0,
      2: 1,
      3: 1,
      4: 1,
      5: 0,
      6: 1
    });

    index.assign('community', 1);

    var o = {};

    graph.forEachNode(function (n, attr) {
      o[n] = attr.community;
    });

    assert.deepEqual(o, {
      1: 0,
      2: 1,
      3: 1,
      4: 1,
      5: 0,
      6: 1
    });
  });

  it('should be possible to zoom out in the directed case.', function () {
    var graph = fromEdges(Graph.DirectedGraph, EDGES);
    var index = new DirectedLouvainIndex(graph, {
      keepDendrogram: true,
      getEdgeWeight: null
    });

    // node '1', '5' => community '4' (0)
    // node '2', '3', '4', '6' => community '2' (1)

    // node '2' to community '2'
    index.move(1, 2, 1, 2);

    // node '1' to community '4'
    index.move(0, 1, 2, 4);

    // node '6' to community '2'
    index.move(5, 0, 1, 2);

    // node '4' to community '2'
    index.move(3, 1, 1, 2);

    closeTo(index.modularity(), 0.3265);
    assert.deepEqual(index.counts, new Uint8Array([0, 0, 4, 0, 2, 0]));
    assert.strictEqual(index.U, 4);
    assert.deepEqual(index.unused, new Uint8Array([1, 0, 5, 3, 0, 0]));

    index.zoomOut();

    closeTo(index.modularity(), 0.3265);

    assert.strictEqual(index.C, 2);
    assert.strictEqual(index.E, 2);
    assert.strictEqual(index.U, 0);
    assert.strictEqual(index.level, 1);
    assert.deepEqual(index.counts.slice(0, index.C), new Uint8Array([1, 1]));
    assert.deepEqual(
      index.neighborhood.slice(0, index.E),
      new Uint8Array([1, 0])
    );
    assert.deepEqual(index.weights.slice(0, index.E), new Uint8Array([1, 1]));
    assert.deepEqual(
      index.starts.slice(0, index.C + 1),
      new Uint8Array([0, 1, 2])
    );
    assert.deepEqual(
      index.belongings.slice(0, index.C),
      new Uint8Array([0, 1])
    );
    assert.deepEqual(
      index.totalInWeights.slice(0, index.C),
      new Uint8Array([2, 5])
    );
    assert.deepEqual(
      index.totalOutWeights.slice(0, index.C),
      new Uint8Array([3, 4])
    );
    // assert.deepEqual(index.internalWeights.slice(0, index.C), new Float64Array([2, 4]));

    // Once more
    index.move(0, 0, 1, 1);

    assert.deepEqual(
      index.totalInWeights.slice(0, index.C),
      new Uint8Array([0, 7])
    );
    assert.deepEqual(
      index.totalOutWeights.slice(0, index.C),
      new Uint8Array([0, 7])
    );
    // assert.deepEqual(index.internalWeights.slice(0, index.C), new Float64Array([0, 7]));
    assert.strictEqual(index.U, 1);
    assert.deepEqual(index.unused.slice(0, index.U), new Uint8Array([0]));
    assert.deepEqual(index.counts.slice(0, index.C), new Uint8Array([0, 2]));

    index.zoomOut();

    assert.strictEqual(index.C, 1);
    assert.strictEqual(index.E, 0);
    assert.strictEqual(index.level, 2);

    assert.deepEqual(index.dendrogram, [
      new Uint8Array([0, 1, 2, 3, 4, 5]),
      new Uint8Array([0, 1, 1, 1, 0, 1]),
      new Uint8Array([0, 0, 0, 0, 0, 0])
    ]);

    assert.deepEqual(index.collect(), {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0
    });

    assert.deepEqual(index.collect(0), {
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 4,
      6: 5
    });

    assert.deepEqual(index.collect(1), {
      1: 0,
      2: 1,
      3: 1,
      4: 1,
      5: 0,
      6: 1
    });

    index.assign('community', 1);

    var o = {};

    graph.forEachNode(function (n, attr) {
      o[n] = attr.community;
    });

    assert.deepEqual(o, {
      1: 0,
      2: 1,
      3: 1,
      4: 1,
      5: 0,
      6: 1
    });
  });

  it('should be possible to compute modularity delta in the undirected case.', function () {
    var graph = fromEdges(Graph.UndirectedGraph, EDGES);
    var index = new UndirectedLouvainIndex(graph, {getEdgeWeight: null});
    applyMoves(index, UNDIRECTED_MOVES);

    // node '2' to community '4'
    var delta = index.delta(1, 3, 1, 4);

    closeTo(delta, 1 / 24);

    // node '1' to community '2'
    delta = index.delta(0, 2, 1, 2);

    closeTo(delta, -1 / 12);
  });

  it('should be possible to compute modularity delta in the directed case.', function () {
    var graph = fromEdges(Graph.DirectedGraph, EDGES);
    var index = new DirectedLouvainIndex(graph, {getEdgeWeight: null});
    applyMoves(index, DIRECTED_MOVES);

    // node '2' to community '4'
    var delta = index.delta(1, 2, 1, 1, 4);

    closeTo(delta, -1 / 49);

    // node '1' to community '2'
    delta = index.delta(0, 1, 2, 1, 2);

    closeTo(delta, -1 / 7);
  });

  function modularityDeltaSanityUndirected(resolution) {
    var graph = fromEdges(Graph.UndirectedGraph, EDGES);
    var index = new UndirectedLouvainIndex(graph, {
      resolution: resolution,
      getEdgeWeight: null
    });
    applyMoves(index, UNDIRECTED_MOVES);

    // node '2' to other community
    var delta = index.delta(1, 3, 1, 4);

    var indexWithIsolatedNode = new UndirectedLouvainIndex(graph, {
      resolution: resolution,
      getEdgeWeight: null
    });
    indexWithIsolatedNode.expensiveMove(0, 4);
    indexWithIsolatedNode.expensiveMove(5, 2);
    indexWithIsolatedNode.expensiveMove(3, 2);

    var indexWithNodeInOtherCommunity = new UndirectedLouvainIndex(graph, {
      resolution: resolution,
      getEdgeWeight: null
    });
    indexWithNodeInOtherCommunity.expensiveMove(1, 4);
    indexWithNodeInOtherCommunity.expensiveMove(0, 4);
    indexWithNodeInOtherCommunity.expensiveMove(5, 2);
    indexWithNodeInOtherCommunity.expensiveMove(3, 2);

    var QIsolated = indexWithIsolatedNode.modularity(),
      QWithNodeInOtherCommunity = indexWithNodeInOtherCommunity.modularity();

    closeTo(QIsolated + delta, QWithNodeInOtherCommunity);

    index.zoomOut();

    indexWithNodeInOtherCommunity = new UndirectedLouvainIndex(graph, {
      resolution: resolution,
      getEdgeWeight: null
    });
    applyMoves(indexWithNodeInOtherCommunity, UNDIRECTED_MOVES);
    indexWithNodeInOtherCommunity.zoomOut();
    indexWithNodeInOtherCommunity.expensiveMove(1, 0);

    closeTo(index.deltaWithOwnCommunity(1, 1, 0, 1), 0);
    closeTo(
      index.modularity() + index.delta(1, 1, 1, 0),
      indexWithNodeInOtherCommunity.modularity()
    );
  }

  it('modularity delta computations should remain sane in the undirected case.', function () {
    modularityDeltaSanityUndirected(1);
    modularityDeltaSanityUndirected(0.5);
    modularityDeltaSanityUndirected(2);
  });

  function modularityDeltaSanityDirected(resolution) {
    var graph = fromEdges(Graph.DirectedGraph, EDGES);

    // Self loop to spice up the mix
    // graph.addEdge(1, 1);

    var index = new DirectedLouvainIndex(graph, {
      resolution: resolution,
      getEdgeWeight: null
    });
    applyMoves(index, DIRECTED_MOVES);

    // node '2' to other community
    var delta = index.delta(1, 2, 1, 1, 4);

    var indexWithIsolatedNode = new DirectedLouvainIndex(graph, {
      resolution: resolution,
      getEdgeWeight: null
    });
    indexWithIsolatedNode.expensiveMove(0, 4);
    indexWithIsolatedNode.expensiveMove(5, 2);
    indexWithIsolatedNode.expensiveMove(3, 2);

    var indexWithNodeInOtherCommunity = new DirectedLouvainIndex(graph, {
      resolution: resolution,
      getEdgeWeight: null
    });
    indexWithNodeInOtherCommunity.expensiveMove(1, 4);
    indexWithNodeInOtherCommunity.expensiveMove(0, 4);
    indexWithNodeInOtherCommunity.expensiveMove(5, 2);
    indexWithNodeInOtherCommunity.expensiveMove(3, 2);

    var QIsolated = indexWithIsolatedNode.modularity(),
      QWithNodeInOtherCommunity = indexWithNodeInOtherCommunity.modularity();

    closeTo(QIsolated + delta, QWithNodeInOtherCommunity);

    index.zoomOut();

    indexWithNodeInOtherCommunity = new DirectedLouvainIndex(graph, {
      resolution: resolution,
      getEdgeWeight: null
    });
    applyMoves(indexWithNodeInOtherCommunity, DIRECTED_MOVES);
    indexWithNodeInOtherCommunity.zoomOut();
    indexWithNodeInOtherCommunity.expensiveMove(1, 0);

    closeTo(index.deltaWithOwnCommunity(1, 1, 0, 0, 1), 0);
    closeTo(
      index.modularity() + index.delta(1, 1, 0, 1, 0),
      indexWithNodeInOtherCommunity.modularity()
    );
  }

  it('modularity delta computations should remain sane in the directed case.', function () {
    modularityDeltaSanityDirected(1);
    modularityDeltaSanityDirected(0.5);
    modularityDeltaSanityDirected(2);
  });

  it('delta computations should remain sound when moving to same community, in the undirected case.', function () {
    var graph = fromEdges(Graph.UndirectedGraph, EDGES);
    var index = new UndirectedLouvainIndex(graph, {getEdgeWeight: null});
    applyMoves(index, UNDIRECTED_MOVES);

    // node '2' to own community
    var delta = index.deltaWithOwnCommunity(1, 3, 2, 2);

    var indexWithIsolatedNode = new UndirectedLouvainIndex(graph, {
      getEdgeWeight: null
    });
    indexWithIsolatedNode.expensiveMove(0, 4);
    indexWithIsolatedNode.expensiveMove(5, 2);
    indexWithIsolatedNode.expensiveMove(3, 2);

    var QIsolated = indexWithIsolatedNode.modularity(),
      Q = index.modularity();

    closeTo(QIsolated + delta, Q);

    // sanity test
    delta = indexWithIsolatedNode.deltaWithOwnCommunity(1, 3, 0, 1);

    closeTo(delta, 0);
  });

  it('delta computations should remain sound when moving to same community, in the directed case.', function () {
    var graph = fromEdges(Graph.DirectedGraph, EDGES);
    var index = new DirectedLouvainIndex(graph, {getEdgeWeight: null});
    applyMoves(index, DIRECTED_MOVES);

    // node '2' to own community
    var delta = index.deltaWithOwnCommunity(1, 2, 1, 2, 2);

    var indexWithIsolatedNode = new DirectedLouvainIndex(graph, {
      getEdgeWeight: null
    });
    indexWithIsolatedNode.expensiveMove(0, 4);
    indexWithIsolatedNode.expensiveMove(5, 2);
    indexWithIsolatedNode.expensiveMove(3, 2);

    var QIsolated = indexWithIsolatedNode.modularity(),
      Q = index.modularity();

    closeTo(QIsolated + delta, Q);

    // sanity test
    delta = indexWithIsolatedNode.deltaWithOwnCommunity(1, 2, 1, 0, 1);

    closeTo(delta, 0);
  });

  it('should not break if a community is deprived of its "owner".', function () {
    var graph = fromEdges(Graph.UndirectedGraph, EDGES);
    var index = new UndirectedLouvainIndex(graph, {getEdgeWeight: null});
    applyMoves(index, UNDIRECTED_MOVES);

    index.expensiveMove(2, 4);

    index.zoomOut();

    assert.deepEqual(
      index.totalWeights.slice(0, index.C),
      new Uint8Array([6, 6])
    );
    // assert.deepEqual(index.internalWeights.slice(0, index.C), new Float64Array([2, 2]));
  });

  it('should handle self-loops in the input graph the undirected case.', function () {
    var graph = fromEdges(Graph.UndirectedGraph, EDGES);
    graph.addEdge(1, 1);

    var index = new UndirectedLouvainIndex(graph);

    // assert.strictEqual(index.internalWeights[0], 2);
    assert.strictEqual(index.loops[0], 2);
  });

  it('should handle self-loops in the input graph the directed case.', function () {
    var graph = fromEdges(Graph.DirectedGraph, EDGES);
    graph.addEdge(1, 1);

    var index = new DirectedLouvainIndex(graph);

    // assert.strictEqual(index.internalWeights[0], 1);
    assert.strictEqual(index.loops[0], 1);
  });

  it('modularity should not be NaN on the initial singleton partition.', function () {
    var graph = new Graph.UndirectedGraph();
    graph.mergeEdge(1, 2);
    graph.addNode(3);

    var index = new UndirectedLouvainIndex(graph);

    assert.strictEqual(index.modularity(), -0.5);
  });

  it('should properly zoom out when there are multiple edges between communities.', function () {
    // Undirected
    var graph = new Graph.UndirectedGraph();
    mergeClique(graph, [0, 1, 2, 3]);

    graph.addEdge(0, 0);

    var index = new UndirectedLouvainIndex(graph, {getEdgeWeight: null});
    index.expensiveMove(1, 0);
    index.expensiveMove(3, 2);

    var Q = index.modularity();

    index.zoomOut();

    assert.strictEqual(index.E, 2);
    // assert.deepEqual(index.internalWeights.slice(0, index.C), new Float64Array([4, 2]));
    assert.deepEqual(
      index.totalWeights.slice(0, index.C),
      new Uint8Array([8, 6])
    );

    var UQ = index.modularity();

    closeTo(Q, UQ);

    // Mutual
    graph = new Graph.UndirectedGraph();
    mergeClique(graph, [0, 1, 2, 3]);
    graph = toDirected(graph);

    graph.addEdge(0, 0);

    index = new DirectedLouvainIndex(graph, {getEdgeWeight: null});
    index.expensiveMove(1, 0);
    index.expensiveMove(3, 2);

    var DQ = index.modularity();

    index.zoomOut();

    assert.strictEqual(index.E, 4);
    // assert.deepEqual(index.internalWeights.slice(0, index.C), new Float64Array([3, 2]));
    assert.deepEqual(
      index.totalInWeights.slice(0, index.C),
      new Uint8Array([7, 6])
    );
    assert.deepEqual(
      index.totalOutWeights.slice(0, index.C),
      new Uint8Array([7, 6])
    );

    Q = index.modularity();

    closeTo(Q, DQ);

    index.loops[0] += 1;
    index.totalInWeights[0] += 1;
    index.totalOutWeights[0] += 1;
    index.M += 1;
    closeTo(index.modularity(), UQ);

    // Directed
    graph = new Graph.DirectedGraph();
    graph.mergeEdge(0, 0);
    graph.mergeEdge(0, 1);
    graph.mergeEdge(1, 2);
    graph.mergeEdge(1, 3);
    graph.mergeEdge(3, 2);

    index = new DirectedLouvainIndex(graph, {getEdgeWeight: null});

    index.expensiveMove(1, 0);
    index.expensiveMove(3, 2);

    index.zoomOut();

    assert.strictEqual(index.M, 5);
    // assert.deepEqual(index.internalWeights.slice(0, index.C), new Float64Array([2, 1]));
    assert.deepEqual(
      index.totalInWeights.slice(0, index.C),
      new Uint8Array([2, 3])
    );
    assert.deepEqual(
      index.totalOutWeights.slice(0, index.C),
      new Uint8Array([4, 1])
    );
  });

  it('directed modularity should be the same as the mutual directed one.', function () {
    var undirectedGraph = fromEdges(Graph.UndirectedGraph, EDGES);
    var directedGraph = toDirected(undirectedGraph);

    var undirectedIndex = new UndirectedLouvainIndex(undirectedGraph, {
      getEdgeWeight: null
    });
    applyMoves(undirectedIndex, UNDIRECTED_MOVES);
    undirectedIndex.zoomOut();

    var directedIndex = new DirectedLouvainIndex(directedGraph, {
      getEdgeWeight: null
    });
    directedIndex.expensiveMove(1, 2);
    directedIndex.expensiveMove(0, 4);
    directedIndex.expensiveMove(5, 2);
    directedIndex.expensiveMove(3, 2);

    directedIndex.zoomOut();

    closeTo(undirectedIndex.modularity(), directedIndex.modularity());
  });

  it('testing k-clique equivalency in the undirected case.', function () {
    var graph = new Graph.UndirectedGraph();
    mergeClique(graph, [0, 1, 2, 3]);

    var kCliqueEquiv = graph.copy();
    kCliqueEquiv.dropEdge(0, 1);
    kCliqueEquiv.addEdge(0, 0);

    var index = new UndirectedLouvainIndex(graph),
      other = new UndirectedLouvainIndex(kCliqueEquiv);

    index.expensiveMove(0, 1);
    index.expensiveMove(2, 3);

    other.expensiveMove(0, 1);
    other.expensiveMove(2, 3);

    closeTo(index.modularity(), other.modularity());
  });

  it('testing k-clique equivalency in the directed case.', function () {
    var graph = new Graph.UndirectedGraph();
    mergeClique(graph, [0, 1, 2, 3]);
    graph = toDirected(graph);

    var kCliqueEquiv = graph.copy();
    kCliqueEquiv.dropEdge(0, 1);
    kCliqueEquiv.addEdge(0, 0);

    var index = new DirectedLouvainIndex(graph),
      other = new DirectedLouvainIndex(kCliqueEquiv);

    index.expensiveMove(0, 1);
    index.expensiveMove(2, 3);

    other.expensiveMove(0, 1);
    other.expensiveMove(2, 3);

    closeTo(index.modularity(), other.modularity());
  });

  it('testing modularity validity wrt self loops.', function () {
    var graph = fromEdges(Graph.UndirectedGraph, EDGES);
    graph.addEdge(1, 1);

    var index = new UndirectedLouvainIndex(graph, {getEdgeWeight: null});
    applyMoves(index, UNDIRECTED_MOVES);

    // NOTE: this is aligned to igraph
    closeTo(index.modularity(), 0.3163);

    graph = fromEdges(Graph.DirectedGraph, EDGES);
    graph.addEdge(1, 1);

    index = new DirectedLouvainIndex(graph, {getEdgeWeight: null});
    applyMoves(index, DIRECTED_MOVES);

    closeTo(index.modularity(), 0.375);
  });

  it('should be possible to tweak resolution.', function () {
    var undirectedGraph = fromEdges(Graph.UndirectedGraph, EDGES);
    var undirectedIndex = new UndirectedLouvainIndex(undirectedGraph, {
      resolution: 0.5,
      getEdgeWeight: null
    });
    applyMoves(undirectedIndex, UNDIRECTED_MOVES);

    closeTo(undirectedIndex.modularity(), 0.5208);

    var directedGraph = fromEdges(Graph.DirectedGraph, EDGES);
    var directedIndex = new DirectedLouvainIndex(directedGraph, {
      resolution: 0.5,
      getEdgeWeight: null
    });
    applyMoves(directedIndex, DIRECTED_MOVES);

    closeTo(directedIndex.modularity(), 0.5918);
  });

  it('should be possible to isolate nodes in the undirected case.', function () {
    var graph = fromEdges(Graph.UndirectedGraph, EDGES);
    var rawIndex = new UndirectedLouvainIndex(graph, {getEdgeWeight: null});
    var index = new UndirectedLouvainIndex(graph, {getEdgeWeight: null});
    applyMoves(index, UNDIRECTED_MOVES);

    graph.nodes().forEach(function (node, i) {
      index.isolate(i, graph.degreeWithoutSelfLoops(node));
    });

    index.isolate(2, graph.degreeWithoutSelfLoops(3));

    var sort = function (a) {
      return a.slice().sort();
    };

    ['counts', 'belongings', 'totalWeights'].forEach(function (prop) {
      assert.deepEqual(sort(rawIndex[prop]), sort(index[prop]));
    });

    assert.strictEqual(index.U, 0);
  });

  it('should be possible to isolate nodes in the directed case.', function () {
    var graph = fromEdges(Graph.DirectedGraph, EDGES);
    var rawIndex = new DirectedLouvainIndex(graph, {getEdgeWeight: null});
    var index = new DirectedLouvainIndex(graph, {getEdgeWeight: null});
    applyMoves(index, DIRECTED_MOVES);

    graph.nodes().forEach(function (node, i) {
      index.isolate(
        i,
        graph.inDegreeWithoutSelfLoops(node),
        graph.outDegreeWithoutSelfLoops(node)
      );
    });

    index.isolate(
      2,
      graph.inDegreeWithoutSelfLoops(3),
      graph.outDegreeWithoutSelfLoops(3)
    );

    var sort = function (a) {
      return a.slice().sort();
    };

    ['counts', 'belongings', 'totalInWeights', 'totalOutWeights'].forEach(
      function (prop) {
        assert.deepEqual(sort(rawIndex[prop]), sort(index[prop]));
      }
    );

    assert.strictEqual(index.U, 0);
  });

  it('isolation and deltaWithOwnCommunity should be consistent.', function () {
    var graph = fromEdges(Graph.UndirectedGraph, EDGES);
    var index = new UndirectedLouvainIndex(graph);
    applyMoves(index, UNDIRECTED_MOVES);

    var delta = index.deltaWithOwnCommunity(1, 3, 2, 2),
      fastDelta = index.fastDeltaWithOwnCommunity(1, 3, 2, 2);

    index.isolate(1, 3);

    var isolatedDelta = index.delta(1, 3, 2, 2),
      fastIsolatedDelta = index.fastDelta(1, 3, 2, 2);

    closeTo(delta, isolatedDelta);
    closeTo(fastDelta, fastIsolatedDelta);

    graph = fromEdges(Graph.DirectedGraph, EDGES);
    index = new DirectedLouvainIndex(graph);
    applyMoves(index, DIRECTED_MOVES);

    delta = index.deltaWithOwnCommunity(1, 2, 1, 2, 2);

    index.isolate(1, 2, 1);

    isolatedDelta = index.delta(1, 2, 1, 2, 2);

    closeTo(delta, isolatedDelta);
  });

  it('should work with undirected multi graphs.', function () {
    var graph = fromEdges(Graph.UndirectedGraph, EDGES);
    var index = new UndirectedLouvainIndex(graph, {getEdgeWeight: null});
    applyMoves(index, UNDIRECTED_MOVES);

    var multiGraph = toMulti(graph);

    var toDuplicate = [];
    multiGraph.forEachEdge(function (_, a, s, t) {
      toDuplicate.push([s, t, a.weight || 1]);
    });

    toDuplicate.forEach(function (edge) {
      multiGraph.addEdge(edge[0], edge[1], {weight: edge[2]});
    });

    multiGraph.updateEachEdgeAttributes(function (edge, attr) {
      attr.weight = 0.5;
      return attr;
    });

    var multiIndex = new UndirectedLouvainIndex(multiGraph);
    applyMoves(multiIndex, UNDIRECTED_MOVES);

    assert.strictEqual(index.M, multiIndex.M);
    assert.strictEqual(index.modularity(), multiIndex.modularity());
  });

  it('should work with directed multi graphs.', function () {
    var graph = fromEdges(Graph.DirectedGraph, EDGES);
    var index = new DirectedLouvainIndex(graph, {getEdgeWeight: null});
    applyMoves(index, DIRECTED_MOVES);

    var multiGraph = toMulti(graph);

    var toDuplicate = [];
    multiGraph.forEachEdge(function (_, a, s, t) {
      toDuplicate.push([s, t, a.weight || 1]);
    });

    toDuplicate.forEach(function (edge) {
      multiGraph.addEdge(edge[0], edge[1], {weight: edge[2]});
    });

    multiGraph.updateEachEdgeAttributes(function (edge, attr) {
      attr.weight = 0.5;
      return attr;
    });

    var multiIndex = new DirectedLouvainIndex(multiGraph);
    applyMoves(multiIndex, DIRECTED_MOVES);

    assert.strictEqual(index.M, multiIndex.M);
    assert.strictEqual(index.modularity(), multiIndex.modularity());
  });
});
