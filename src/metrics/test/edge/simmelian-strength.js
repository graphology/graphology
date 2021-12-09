/**
 * Graphology Simmelian Strength Unit Tests
 * =========================================
 */
var assert = require('assert');
var Graph = require('graphology');
var complete = require('graphology-generators/classic/complete');
var simmelianStrength = require('../../edge/simmelian-strength.js');

var UndirectedGraph = Graph.UndirectedGraph;

describe('simmelianStrength', function () {
  it('should throw when given an invalid graph.', function () {
    assert.throws(function () {
      simmelianStrength(null);
    });
  });

  it('should return the correct result on a clique.', function () {
    [3, 4, 5, 6].forEach(function (n) {
      var K = complete(UndirectedGraph, n);
      var strengths = simmelianStrength(K);

      assert.deepStrictEqual(
        new Set(Object.keys(strengths)),
        new Set(K.edges())
      );

      for (var e in strengths) {
        assert.strictEqual(strengths[e], n - 2);
      }

      simmelianStrength.assign(K);

      var collectedStrengths = {};

      K.forEachEdge(function (edge, attr) {
        collectedStrengths[edge] = attr.simmelianStrength;
      });

      assert.deepStrictEqual(strengths, collectedStrengths);
    });
  });

  it('should properly work on an arbitrary graph.', function () {
    var graph = new UndirectedGraph();
    graph.mergeEdgeWithKey('0-1', 0, 1);
    graph.mergeEdgeWithKey('0-2', 0, 2);
    graph.mergeEdgeWithKey('0-5', 0, 5);
    graph.mergeEdgeWithKey('1-2', 1, 2);
    graph.mergeEdgeWithKey('1-3', 1, 3);
    graph.mergeEdgeWithKey('2-4', 2, 4);
    graph.mergeEdgeWithKey('2-6', 2, 6);
    graph.mergeEdgeWithKey('6-7', 6, 7);
    graph.mergeEdgeWithKey('7-8', 7, 8);
    graph.mergeEdgeWithKey('7-9', 7, 9);
    graph.mergeEdgeWithKey('8-9', 8, 9);
    graph.mergeEdgeWithKey('8-10', 8, 10);
    graph.mergeEdgeWithKey('8-11', 8, 11);
    graph.mergeEdgeWithKey('9-11', 9, 11);

    assert.strictEqual(graph.order, 12);
    assert.strictEqual(graph.size, 14);

    var strengths = simmelianStrength(graph);

    assert.deepStrictEqual(strengths, {
      '0-1': 1,
      '0-2': 1,
      '0-5': 0,
      '1-2': 1,
      '1-3': 0,
      '2-4': 0,
      '2-6': 0,
      '6-7': 0,
      '7-8': 1,
      '7-9': 1,
      '8-9': 2,
      '8-10': 0,
      '8-11': 1,
      '9-11': 1
    });
  });
});
