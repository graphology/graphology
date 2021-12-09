/**
 * Graphology Simple Size Unit Tests
 * ==================================
 */
var assert = require('assert');
var Graph = require('graphology');
var simpleSize = require('../../graph/simple-size.js');

describe('simpleSize', function () {
  it('should throw if given wrong arguments.', function () {
    assert.throws(function () {
      simpleSize(null);
    }, /instance/);
  });

  it('should return 0 is the graph is empty.', function () {
    var graph = new Graph();

    graph.addNode(1);

    assert.strictEqual(simpleSize(graph), 0);
  });

  it('should return the correct size.', function () {
    var graph = new Graph();
    graph.mergeEdge(1, 2);
    graph.mergeEdge(2, 3);

    assert.strictEqual(simpleSize(graph), 2);

    graph = new Graph({multi: true});

    graph.mergeEdge(1, 2);
    graph.mergeEdge(1, 2);
    graph.mergeEdge(1, 2);

    graph.mergeEdge(3, 4);

    graph.mergeUndirectedEdge(4, 5);

    assert.strictEqual(simpleSize(graph), 3);
  });
});
