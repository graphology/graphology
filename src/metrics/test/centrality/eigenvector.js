/**
 * Graphology Metrics Eigenvector Centrality Unit Tests
 * =====================================================
 */
var assert = require('chai').assert;
var Graph = require('graphology');
var complete = require('graphology-generators/classic/complete');
var path = require('graphology-generators/classic/path');
var eigenvectorCentrality = require('../../centrality/eigenvector');

function deepApproximatelyEqual(t, o, precision) {
  for (var k in t) assert.approximately(t[k], o[k], precision);
}

describe('eigenvector centrality', function () {
  it('should throw if provided with something which is not a graph.', function () {
    assert.throws(function () {
      eigenvectorCentrality({hello: 'world'});
    }, /graphology/);
  });

  it('should throw if provided with a MultiGraph.', function () {
    assert.throws(function () {
      var graph = new Graph({multi: true});
      eigenvectorCentrality(graph);
    }, /multi/i);
  });

  it('should return the correct results with a complete graph.', function () {
    var graph = complete(Graph.UndirectedGraph, 5);
    var result = eigenvectorCentrality(graph);

    var expected = graph.reduceNodes(function (o, node) {
      o[node] = Math.sqrt(1 / 5);
      return o;
    }, {});

    deepApproximatelyEqual(result, expected, 1e-7);
  });

  it('should return the correct results with a path graph.', function () {
    var graph = path(Graph.UndirectedGraph, 3);

    deepApproximatelyEqual(
      eigenvectorCentrality(graph),
      {
        0: 0.5,
        1: 0.7071,
        2: 0.5
      },
      1e-4
    );
  });
});
