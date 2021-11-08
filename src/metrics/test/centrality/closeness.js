/**
 * Graphology Metrics Closeness Centrality Unit Tests
 * =====================================================
 */
var assert = require('chai').assert;
var Graph = require('graphology');
var path = require('graphology-generators/classic/path');
var reverse = require('graphology-operators/reverse');
var closenessCentrality = require('../../centrality/closeness');

function deepApproximatelyEqual(t, o, precision) {
  for (var k in t) assert.approximately(t[k], o[k], precision);
}

describe('closeness centrality', function () {
  it('should throw if provided with something which is not a graph.', function () {
    assert.throws(function () {
      closenessCentrality({hello: 'world'});
    }, /graphology/);
  });

  it('should return the correct results with a directed path graph.', function () {
    var graph = path(Graph.DirectedGraph, 3);
    var reversed = reverse(graph);

    var result = closenessCentrality(graph);
    var reversedResult = closenessCentrality(reversed);

    deepApproximatelyEqual(result, {0: 0, 1: 1, 2: 0.6666}, 1e-4);
    deepApproximatelyEqual(reversedResult, {0: 0.6666, 1: 1, 2: 0}, 1e-4);

    result = closenessCentrality(graph, {wassermanFaust: true});
    reversedResult = closenessCentrality(reversed, {wassermanFaust: true});

    deepApproximatelyEqual(result, {0: 0, 1: 0.5, 2: 0.6666}, 1e-4);
    deepApproximatelyEqual(reversedResult, {0: 0.6666, 1: 0.5, 2: 0}, 1e-4);
  });
});
