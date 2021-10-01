/**
 * Graphology Leiden Unit Tests
 * =============================
 */
var assert = require('chai').assert;
var seedrandom = require('seedrandom');
var Graph = require('graphology');
var louvainIndices = require('graphology-indices/neighborhood/louvain');
var leidenIndices = require('../utils.js');
var mergeClique = require('graphology-utils/merge-clique');
var modularity = require('graphology-metrics/modularity');
var generateFigC1Graph = require('./utils').generateFigC1Graph;
var leiden = require('../');

var UndirectedLouvainIndex = louvainIndices.UndirectedLouvainIndex;
var UndirectedLeidenAddenda = leidenIndices.UndirectedLeidenAddenda;

// var ARCTIC = require('./resources/arctic.json');

function rng(seed) {
  return seedrandom(seed || 'test');
}

function getDoubleCliqueGraph() {
  var graph = new Graph.UndirectedGraph();
  mergeClique(graph, [0, 1, 2]);
  mergeClique(graph, [3, 4, 5]);
  graph.addEdge(2, 4);

  return graph;
}

describe('graphology-communities-leiden', function() {
  describe('UndirectedLeidenAddenda', function() {
    it('should properly group by communities.', function() {
      var graph = getDoubleCliqueGraph();

      var index = new UndirectedLouvainIndex(graph);
      var addenda = new UndirectedLeidenAddenda(index);

      index.expensiveMove(1, 0);
      index.expensiveMove(2, 0);
      index.expensiveMove(3, 4);
      index.expensiveMove(5, 4);

      addenda.groupByCommunities();

      assert.strictEqual(addenda.B, 2);

      assert.deepStrictEqual(addenda.communities(), [[0, 1, 2], [3, 4, 5]]);
    });

    it('should properly refine the partition.', function() {
      var graph = getDoubleCliqueGraph();

      var index = new UndirectedLouvainIndex(graph);
      var addenda = new UndirectedLeidenAddenda(index);

      index.expensiveMove(1, 0);
      index.expensiveMove(2, 0);
      index.expensiveMove(3, 4);
      index.expensiveMove(5, 4);

      addenda.refinePartition();
      assert.strictEqual(addenda.C, 4);

      addenda.split();

      function compile(o) {
        var a = [];

        for (var k in o) {
          a.push(Array.from(o[k]).join('§'));
        }

        return a.sort();
      }

      var mappingBeforeSplit = {};

      addenda.belongings.forEach(function(c, i) {
        if (!(c in mappingBeforeSplit))
          mappingBeforeSplit[c] = new Set();
        mappingBeforeSplit[c].add(i);
      });
      mappingBeforeSplit = compile(mappingBeforeSplit);

      var mappingAfterSplit = {};

      index.belongings.forEach(function(c, i) {
        if (!(c in mappingAfterSplit))
          mappingAfterSplit[c] = new Set();
        mappingAfterSplit[c].add(i);
      });
      mappingAfterSplit = compile(mappingAfterSplit);

      assert.deepStrictEqual(mappingBeforeSplit, mappingAfterSplit);
    });

    it('should be possible to zoom out correctly.', function() {
      var graph = getDoubleCliqueGraph();

      var index = new UndirectedLouvainIndex(graph);
      var addenda = new UndirectedLeidenAddenda(index);

      index.expensiveMove(1, 0);
      index.expensiveMove(2, 0);
      index.expensiveMove(3, 4);
      index.expensiveMove(5, 4);

      var qBefore = index.modularity();

      addenda.zoomOut();

      var qAfter = index.modularity();

      assert.closeTo(qBefore, qAfter, 0.00001);
      assert.strictEqual(index.C - index.U, 2);
      assert.strictEqual(index.level, 1);
    });

    it('should be possible to detect if every community is a singleton.', function() {
      var graph = getDoubleCliqueGraph();

      var index = new UndirectedLouvainIndex(graph);
      var addenda = new UndirectedLeidenAddenda(index);

      assert.strictEqual(addenda.onlySingletons(), true);

      index.expensiveMove(1, 0);
      index.expensiveMove(2, 0);
      index.expensiveMove(3, 4);
      index.expensiveMove(5, 4);

      assert.strictEqual(addenda.onlySingletons(), false);

      addenda.zoomOut();

      assert.strictEqual(addenda.onlySingletons(), false);
    });
  });

  describe('algorithm', function() {
    it('should work for double clique.', function() {
      var graph = getDoubleCliqueGraph();
      var results = leiden.detailed(graph, {rng: rng()});

      var naiveQ = modularity(graph, {
        communities: {
          0: 0,
          1: 0,
          2: 0,
          3: 1,
          4: 1,
          5: 1
        }
      });

      console.log(results)

      assert.closeTo(naiveQ, results.modularity, 0.0001);

      assert.strictEqual(results.communities[0], results.communities[1]);
      assert.strictEqual(results.communities[1], results.communities[2]);

      assert.strictEqual(results.communities[3], results.communities[4]);
      assert.strictEqual(results.communities[4], results.communities[5]);
    });

    it.only('should work with Fig. C1 graph.', function() {
      var graph = generateFigC1Graph(Graph);
      var results = leiden.detailed(graph, {weighted: true});

      var naiveQ = modularity(graph, {
        communities: {
          0: 0,
          2: 0,
          3: 0,
          4: 0,
          1: 1,
          5: 1,
          6: 1,
          7: 1
        }
      });

      console.log(naiveQ);

      console.log(results);
    });
  });
});
