/**
 * Graphology Weighted Size Unit Tests
 * ====================================
 */
var assert = require('assert');
var Graph = require('graphology');
var lib = require('../../node/weighted-degree.js');

function createEdgeAttributes(a, v) {
  var o = {};

  o[a] = v;

  return o;
}

function createGraph(weightAttribute) {
  var graph = new Graph();

  var w = weightAttribute || 'weight';

  graph.mergeEdge(1, 2, createEdgeAttributes(w, 3));
  graph.mergeEdge(1, 3, createEdgeAttributes(w, 5));
  graph.mergeEdge(3, 1, createEdgeAttributes(w, 2));

  return graph;
}

describe('weightedDegree', function () {
  it('should throw if given wrong arguments.', function () {
    assert.throws(function () {
      lib.weightedDegree(null);
    }, /instance/);
  });

  it('should return the correct weighted degree for the given node.', function () {
    var graph = createGraph();

    assert.strictEqual(lib.weightedDegree(graph, 1), 10);
    assert.strictEqual(lib.weightedInDegree(graph, 1), 2);
    assert.strictEqual(lib.weightedOutDegree(graph, 1), 8);
  });

  it('should be possible to use options for the given node.', function () {
    var graph = createGraph('w');

    assert.strictEqual(lib.weightedDegree(graph, 1, 'w'), 10);
    assert.strictEqual(lib.weightedInDegree(graph, 1, 'w'), 2);
    assert.strictEqual(lib.weightedOutDegree(graph, 1, 'w'), 8);
  });
});
