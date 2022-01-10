/**
 * Graphology DAG Unit Tests
 * ==========================
 */
const {DirectedGraph} = require('graphology');
const path = require('graphology-generators/classic/path');
const assert = require('assert');
const willCreateCycle = require('./will-create-cycle.js');

describe('graphology-dag', function () {
  describe('willCreateCycle', function () {
    it('should throw if given invalid arguments.', function () {
      assert.throws(function () {
        willCreateCycle(null);
      }, /graphology/);
    });

    it('should return false when one of the node does not exist.', function () {
      const graph = new DirectedGraph();

      graph.addNode('test');

      assert.strictEqual(willCreateCycle(graph, 'test', 'other'), false);
      assert.strictEqual(willCreateCycle(graph, 'other', 'test'), false);
      assert.strictEqual(willCreateCycle(graph, 'other1', 'other2'), false);
    });

    it('should return true when adding a self loop.', function () {
      const graph = new DirectedGraph();
      graph.addNode('A');

      assert.strictEqual(willCreateCycle(graph, 'A', 'A'), true);
    });

    it('should work with a simple path graph.', function () {
      const graph = path(DirectedGraph, 4);

      assert.strictEqual(willCreateCycle(graph, 0, 3), false);
      assert.strictEqual(willCreateCycle(graph, 1, 0), true);
      assert.strictEqual(willCreateCycle(graph, 2, 0), true);
      assert.strictEqual(willCreateCycle(graph, 3, 0), true);
      assert.strictEqual(willCreateCycle(graph, 2, 1), true);
      assert.strictEqual(willCreateCycle(graph, 3, 2), true);
      assert.strictEqual(willCreateCycle(graph, 3, 1), true);
      assert.strictEqual(willCreateCycle(graph, 0, 4), false);
    });

    it('should return false if edge already exists and true when adding a mutual edge.', function () {
      const graph = new DirectedGraph();
      graph.mergeEdge(0, 1);

      assert.strictEqual(willCreateCycle(graph, 0, 1), false);
      assert.strictEqual(willCreateCycle(graph, 1, 0), true);
    });

    it('should work with a DAG forest.', function () {
      const graph = path(DirectedGraph, 4);
      graph.mergeEdge(5, 6);

      assert.strictEqual(willCreateCycle(graph, 0, 3), false);
      assert.strictEqual(willCreateCycle(graph, 0, 5), false);
      assert.strictEqual(willCreateCycle(graph, 6, 5), true);
    });

    it('should work with a simple DAG.', function () {
      const graph = new DirectedGraph();
      graph.mergeEdge(0, 1);
      graph.mergeEdge(0, 2);
      graph.mergeEdge(1, 2);
      graph.mergeEdge(2, 3);

      assert.strictEqual(willCreateCycle(graph, 0, 3), false);
      assert.strictEqual(willCreateCycle(graph, 3, 0), true);
      assert.strictEqual(willCreateCycle(graph, 3, 1), true);
      assert.strictEqual(willCreateCycle(graph, 3, 2), true);
    });
  });
});
