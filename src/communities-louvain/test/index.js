/**
 * Graphology Louvain Unit Tests
 * ==============================
 */
var assert = require('chai').assert;
var seedrandom = require('seedrandom');
var Graph = require('graphology');
var modularity = require('graphology-metrics/graph/modularity');
var emptyGraph = require('graphology-generators/classic/empty');
var toUndirected = require('graphology-operators/to-undirected');
var toMulti = require('graphology-operators/to-multi');
// var netToImg = require('net-to-img');
var path = require('path');
var gexf = require('graphology-gexf');
var fs = require('fs');
var louvain = require('../');

// Tweaking defaults for tests
louvain.defaults.randomWalk = false;
louvain.defaults.fastLocalMoves = false;

/**
 * Test helpers.
 */
var TYPE = {
  UNDIRECTED: 'undirected',
  DIRECTED: 'directed',
  MIXED: 'mixed'
};

function distinctSize(obj) {
  var indexer = new Set();

  for (var element in obj) indexer.add(obj[element]);

  return indexer.size;
}

function lookup(o) {
  return function (n) {
    return o[n];
  };
}

function parse(dataset, t) {
  var graph = new Graph({type: t}),
    n = dataset.nodes,
    e = dataset.edges,
    partitioning = {},
    i,
    l;

  for (i = 0, l = n.length; i < l; i++) {
    graph.addNode(n[i].id);
    partitioning[n[i].id] = n[i].attributes['Modularity Class'];
  }

  for (i = 0, l = e.length; i < l; i++) {
    if (graph.hasEdge(e[i].source, e[i].target)) continue;
    if (
      t === TYPE.DIRECTED ||
      (t === TYPE.MIXED && e[i].attributes.Orientation === 'directed')
    )
      graph.addDirectedEdge(e[i].source, e[i].target);
    else graph.addUndirectedEdge(e[i].source, e[i].target);
  }

  return {graph: graph, partitioning: partitioning};
}

function assignNodeAttributes(graph, prop, map) {
  for (var node in map) graph.setNodeAttribute(node, prop, map[node]);
}

/* eslint-disable */
function dumpToImage(graph, communities) {
  if (communities) {
    graph = graph.copy();
    assignNodeAttributes(graph, 'community', communities);
  }

  netToImg({
    graph: graph,
    destPath: './test/dump.png',
    options: {
      colorize: 'community',
      width: 512,
      height: 512
    }
  });
}

function printReport(result) {
  console.log('Q =', result.modularity);
  console.log('Level =', result.level);
  console.log('Resolution =', result.resolution);
  console.log('Communities =', result.count);
  console.log('Delta Computations =', result.deltaComputations);
  console.log('Nodes visited =', result.nodesVisited);
  console.log('Moves', result.moves);
}
/* eslint-enable */

/**
 * Datasets.
 */
function loadGexfDataset(name) {
  var xml = fs.readFileSync(
    path.join(__dirname, 'datasets', name + '.gexf'),
    'utf-8'
  );

  return gexf.parse(Graph, xml);
}

var clique3 = parse(require('./datasets/clique3.json'), TYPE.UNDIRECTED),
  complex500 = parse(require('./datasets/complex500.json'), TYPE.UNDIRECTED),
  undirected500 = parse(
    require('./datasets/undirected500.json'),
    TYPE.UNDIRECTED
  ),
  undirected1000 = parse(
    require('./datasets/undirected1000.json'),
    TYPE.UNDIRECTED
  ),
  directed1000 = parse(require('./datasets/directed1000.json'), TYPE.DIRECTED);

var euroSis = Graph.DirectedGraph.from(require('./datasets/eurosis.json'));
var ricardo = loadGexfDataset('1898');

var undirectedEuroSis = toUndirected(euroSis);

/**
 * Actual unit tests.
 */
describe('graphology-communities-louvain', function () {
  // High timeout
  this.timeout(30 * 1000);

  it('should throw when given invalid arguments.', function () {
    // Invalid graph
    assert.throws(function () {
      louvain(null);
    }, /graphology/);

    // True mixed graph
    assert.throws(function () {
      var graph = new Graph();
      graph.mergeUndirectedEdge(1, 2);
      graph.mergeDirectedEdge(2, 3);

      louvain(graph);
    });
  });

  it('should return a singleton partition on empty graphs.', function () {
    var graph = emptyGraph(Graph.UndirectedGraph, 5);

    var communities = louvain(graph);

    assert.deepEqual(communities, {0: 0, 1: 1, 2: 2, 3: 3, 4: 4});
  });

  it('should work with multiple connected components.', function () {
    var graph = clique3.graph.copy();
    graph.dropNode(0);
    graph.dropNode(8);
    graph.dropNode(4);

    var communities = louvain(graph);

    assert.strictEqual(communities[1], communities[3]);
    assert.strictEqual(communities[2], communities[3]);

    assert.strictEqual(communities[5], communities[6]);
    assert.strictEqual(communities[6], communities[7]);

    assert.strictEqual(communities[9], communities[10]);
    assert.strictEqual(communities[10], communities[11]);

    assert.strictEqual(distinctSize(communities), 3);
  });

  it('should work on a simple 3 clique graph.', function () {
    var communities = louvain(clique3.graph);

    assert.strictEqual(communities[0], communities[1]);
    assert.strictEqual(communities[1], communities[2]);
    assert.strictEqual(communities[2], communities[3]);

    assert.strictEqual(communities[4], communities[5]);
    assert.strictEqual(communities[5], communities[6]);
    assert.strictEqual(communities[6], communities[7]);

    assert.strictEqual(communities[8], communities[9]);
    assert.strictEqual(communities[9], communities[10]);
    assert.strictEqual(communities[10], communities[11]);
  });

  it('should handle a small undirected graph with 3 connected cliques', function () {
    var communities = louvain(clique3.graph);

    assert.closeTo(
      modularity(clique3.graph, {getNodeCommunity: lookup(communities)}),
      0.524,
      0.001
    );
    assert.strictEqual(
      distinctSize(communities),
      distinctSize(clique3.partitioning)
    );
  });

  it('should handle heavy-sized complex graph (undirected, with self-loops) (500 nodes, 4302 links)', function () {
    var result = louvain.detailed(complex500.graph);
    // printReport(result);
    // dumpToImage(complex500.graph, result.communities);
    assert.closeTo(
      result.modularity,
      modularity(complex500.graph, {
        getNodeCommunity: lookup(result.communities)
      }),
      0.0001
    );
    assert.strictEqual(
      distinctSize(result.communities),
      distinctSize(complex500.partitioning)
    );
  });

  it('should handle heavy-sized undirected graph (500 nodes, 4768 links)', function () {
    var result = louvain.detailed(undirected500.graph);
    // printReport(result);
    // dumpToImage(undirected500.graph, result.communities);
    assert.closeTo(
      result.modularity,
      modularity(undirected500.graph, {
        getNodeCommunity: lookup(result.communities)
      }),
      0.0001
    );
    assert.strictEqual(
      distinctSize(result.communities),
      distinctSize(undirected500.partitioning)
    );
  });

  it('should handle heavy-sized undirected graph (1000 nodes, 9724 links)', function () {
    var result = louvain.detailed(undirected1000.graph);
    // printReport(result);
    // dumpToImage(undirected1000.graph, result.communities);
    assert.closeTo(
      result.modularity,
      modularity(undirected1000.graph, {
        getNodeCommunity: lookup(result.communities)
      }),
      0.0001
    );
    assert.strictEqual(
      distinctSize(result.communities),
      distinctSize(undirected1000.partitioning)
    );
  });

  it('should handle heavy-sized directed graph (1000 nodes, 10000 links)', function () {
    var result = louvain.detailed(directed1000.graph);
    // printReport(result);
    // dumpToImage(directed1000.graph, result.communities);
    assert.closeTo(
      result.modularity,
      modularity(directed1000.graph, {
        getNodeCommunity: lookup(result.communities)
      }),
      0.0001
    );
    assert.strictEqual(
      distinctSize(result.communities),
      distinctSize(directed1000.partitioning)
    );
  });

  it('should work with undirected EuroSIS (1285 nodes, 6462 links).', function () {
    var result = louvain.detailed(undirectedEuroSis);
    assert.strictEqual(result.count, 17);

    assert.closeTo(
      result.modularity,
      modularity(undirectedEuroSis, {
        getNodeCommunity: lookup(result.communities)
      }),
      0.0001
    );
    // printReport(result);
    // dumpToImage(undirectedEuroSis, result.communities);
  });

  it('should work with directed EuroSIS (1285 nodes, 7524 links).', function () {
    var result = louvain.detailed(euroSis);

    assert.strictEqual(result.count, 19);

    assert.closeTo(
      result.modularity,
      modularity(euroSis, {getNodeCommunity: lookup(result.communities)}),
      0.0001
    );
    // printReport(result);
    // dumpToImage(euroSis, result.communities);
  });

  it('should be possible to seed the random walk.', function () {
    var result = louvain.detailed(undirectedEuroSis, {
      randomWalk: true,
      rng: seedrandom('test')
    });

    assert.strictEqual(result.count, 17);
    assert.closeTo(result.modularity, 0.7264, 0.0001);
  });

  it('should be possible to use fast local moves in the undirected case.', function () {
    var result = louvain.detailed(undirectedEuroSis, {
      randomWalk: true,
      rng: seedrandom('test'),
      fastLocalMoves: true
    });

    assert.strictEqual(result.count, 18);
    assert.closeTo(result.modularity, 0.7278, 0.0001);
  });

  it('should be possible to use fast local moves in the directed case.', function () {
    var result = louvain.detailed(euroSis, {
      randomWalk: true,
      rng: seedrandom('test'),
      fastLocalMoves: true
    });

    assert.strictEqual(result.count, 18);
    assert.closeTo(result.modularity, 0.7411, 0.0001);
  });

  it('should be possible to tweak resolution.', function () {
    var result = louvain.detailed(undirected1000.graph, {
      resolution: 3
    });

    assert.strictEqual(result.resolution, 3);
    assert.strictEqual(result.count, 31);
    assert.closeTo(result.modularity, 0.1945, 0.0001);

    result = louvain.detailed(undirected1000.graph, {
      resolution: 0.5
    });

    assert.strictEqual(result.resolution, 0.5);
    assert.strictEqual(result.count, 2);
    assert.closeTo(result.modularity, 0.5072, 0.0001);
  });

  it('should work with a multi graph.', function () {
    var graph = new Graph();

    graph.mergeEdge(1, 2);
    graph.mergeEdge(1, 3);
    graph.mergeEdge(2, 3);

    graph.mergeEdge(3, 4);

    graph.mergeEdge(4, 5);
    graph.mergeEdge(5, 6);
    graph.mergeEdge(4, 6);

    var result = louvain.detailed(graph);

    assert.closeTo(result.modularity, 0.3673, 0.0001);

    assert.strictEqual(result.communities[1], result.communities[2]);
    assert.strictEqual(result.communities[2], result.communities[3]);
    assert.strictEqual(result.communities[4], result.communities[5]);
    assert.strictEqual(result.communities[5], result.communities[6]);

    graph = toMulti(graph);
    var toDuplicate = [];

    graph.forEachEdge(function (_e, _a, s, t) {
      toDuplicate.push([s, t]);
    });

    toDuplicate.forEach(function (edge) {
      graph.addEdge(edge[0], edge[1]);
    });

    graph.forEachEdge(function (edge) {
      graph.setEdgeAttribute(edge, 'weight', 0.5);
    });

    var multiResult = louvain.detailed(graph);

    assert.closeTo(result.modularity, multiResult.modularity, 0.00001);

    assert.strictEqual(multiResult.communities[1], multiResult.communities[2]);
    assert.strictEqual(multiResult.communities[2], multiResult.communities[3]);
    assert.strictEqual(multiResult.communities[4], multiResult.communities[5]);
    assert.strictEqual(multiResult.communities[5], multiResult.communities[6]);
  });

  it('should work with the ricardo graph.', function () {
    var customRng = seedrandom('nansi');

    var result = louvain.detailed(ricardo, {
      rng: customRng,
      randomWalk: true,
      fastLocalMoves: true
    });

    assert.strictEqual(result.count, 37);
    assert.closeTo(result.modularity, 0.2464, 0.0001);
  });

  it('should work with the ricardo graph with custom weights.', function () {
    var customRng = seedrandom('nansi');

    var customRicardo = ricardo.copy();

    customRicardo.updateEachEdgeAttributes(function (_, attr) {
      attr.importance = attr.weight;
      delete attr.weight;

      return attr;
    });

    var result = louvain.detailed(customRicardo, {
      rng: customRng,
      randomWalk: true,
      fastLocalMoves: true,
      getEdgeWeight: function (_, attr) {
        return attr.importance;
      }
    });

    assert.strictEqual(result.count, 37);
    assert.closeTo(result.modularity, 0.2464, 0.0001);
  });

  it('should work with the ricardo graph without weights.', function () {
    var customRng = seedrandom('nansi');

    var result = louvain.detailed(ricardo, {
      rng: customRng,
      randomWalk: true,
      fastLocalMoves: true,
      getEdgeWeight: null
    });

    assert.closeTo(result.modularity, 0.2991, 0.0001);
  });
});
