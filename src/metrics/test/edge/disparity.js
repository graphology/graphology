/**
 * Graphology Edge Disparity Unit Tests
 * =====================================
 */
var assert = require('assert');
var Graph = require('graphology');
var complete = require('graphology-generators/classic/complete');
var disparity = require('../../edge/disparity');

var UndirectedGraph = Graph.UndirectedGraph;

describe('disparity', function () {
  it('should throw when given an invalid graph.', function () {
    assert.throws(function () {
      disparity(null);
    });
  });

  it('should return a constant result if all weights are the same.', function () {
    var graph = complete(UndirectedGraph, 4);

    var disparities = disparity(graph);

    assert.strictEqual(
      Object.keys(disparities).every(function (k, i, a) {
        if (i === 0) return true;
        return disparities[a[i]] === disparities[a[i - 1]];
      }),
      true
    );
  });

  it('should return the correct result.', function () {
    var graph = complete(UndirectedGraph, 5);

    graph.addNode(10);

    graph.dropEdge(0, 4);
    graph.dropEdge(1, 2);
    graph.dropEdge(2, 3);
    graph.dropEdge(3, 4);

    graph.updateEachEdgeAttributes(function (edge, attr, source) {
      attr.weight = source === '0' ? 25 : 1;

      return attr;
    });

    var disparities = disparity(graph);

    var indexed = {};

    for (var e in disparities)
      indexed[graph.extremities(e).join(',')] = disparities[e];

    assert.deepStrictEqual(indexed, {
      '0,1': 0.0054869684499314125,
      '0,2': 0.038461538461538436,
      '0,3': 0.038461538461538436,
      '1,3': 0.9272976680384089,
      '1,4': 0.5,
      '2,4': 0.5
    });
  });
});
