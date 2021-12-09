/**
 * Graphology Weighted Size Unit Tests
 * ====================================
 */
var assert = require('assert');
var Graph = require('graphology');
var weightedSize = require('../../graph/weighted-size.js');

describe('weightedSize', function () {
  it('should throw if given wrong arguments.', function () {
    assert.throws(function () {
      weightedSize(null);
    }, /instance/);
  });

  it('should return 0 is the graph is empty.', function () {
    var graph = new Graph();

    graph.addNode(1);

    assert.strictEqual(weightedSize(graph), 0);
  });

  it('should return the correct sum.', function () {
    var graph = new Graph();
    graph.mergeEdge(1, 2, {weight: 30});
    graph.mergeEdge(2, 3, {weight: 4});

    assert.strictEqual(weightedSize(graph), 34);
  });

  it('should work with custom weight name', function () {
    var graph = new Graph();
    graph.mergeEdge(1, 2, {w: 30});
    graph.mergeEdge(2, 3, {w: 4});

    assert.strictEqual(weightedSize(graph, 'w'), 34);
  });

  it('should work with a custom getter.', function () {
    var graph = new Graph();
    graph.mergeEdge(1, 2, {importance: 12});
    graph.mergeEdge(2, 3, {importance: 8});

    assert.strictEqual(
      weightedSize(graph, function (_, attr) {
        return attr.importance;
      }),
      20
    );
  });
});
