/**
 * Graphology DAG Unit Tests
 * ==========================
 */
const {
  Graph,
  UndirectedGraph,
  DirectedGraph,
  MultiDirectedGraph
} = require('graphology');
const path = require('graphology-generators/classic/path');
const mergePath = require('graphology-utils/merge-path');
const assert = require('assert');
const hasCycle = require('./has-cycle.js');
const willCreateCycle = require('./will-create-cycle.js');
const topologicalSort = require('./topological-sort.js');

describe('graphology-dag', function () {
  describe('hasCycle', function () {
    it('should throw if given invalid arguments.', function () {
      assert.throws(function () {
        hasCycle(null);
      }, /graphology/);
    });

    it('should return true if the graph has a self loop.', function () {
      const graph = new DirectedGraph();
      graph.mergeEdge('A', 'A');

      assert.strictEqual(hasCycle(graph), true);
    });

    it('should correctly return whether the given graph has a cycle.', function () {
      const graph = path(DirectedGraph, 4);

      assert.strictEqual(hasCycle(graph), false);

      graph.addEdge(3, 0);

      assert.strictEqual(hasCycle(graph), true);
    });

    it('should work with typical examples.', function () {
      const graph = new DirectedGraph();
      graph.mergeEdge(0, 1);
      graph.mergeEdge(0, 2);
      graph.mergeEdge(1, 2);
      graph.mergeEdge(2, 3);

      assert.strictEqual(hasCycle(graph), false);

      graph.mergeEdge(2, 0);

      assert.strictEqual(hasCycle(graph), true);

      graph.clear();
      graph.mergeEdge(0, 1);
      graph.mergeEdge(0, 2);
      graph.mergeEdge(1, 2);
      graph.mergeEdge(2, 3);

      assert.strictEqual(hasCycle(graph), false);
    });

    it('should work with disconnected graphs.', function () {
      const graph = new DirectedGraph();

      graph.mergeEdge(0, 1);
      graph.mergeEdge(1, 2);
      graph.mergeEdge(2, 3);

      graph.mergeEdge(4, 5);
      graph.mergeEdge(5, 6);
      graph.mergeEdge(6, 7);

      graph.addNode(8);

      assert.strictEqual(hasCycle(graph), false);

      graph.addEdge(2, 0);

      assert.strictEqual(hasCycle(graph), true);

      graph.dropEdge(2, 0);

      assert.strictEqual(hasCycle(graph), false);

      graph.addEdge(7, 4);

      assert.strictEqual(hasCycle(graph), true);
    });
  });

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

  describe('topologicalSort', function () {
    it('should throw if given invalid arguments.', function () {
      assert.throws(function () {
        topologicalSort(null);
      }, /graphology/);

      assert.throws(function () {
        topologicalSort(new UndirectedGraph());
      }, /directed/);

      assert.throws(function () {
        topologicalSort(new MultiDirectedGraph());
      }, /multi/);
    });

    it('should work on a path.', function () {
      const P5 = path(DirectedGraph, 5);

      const sorted = topologicalSort(P5);

      assert.deepStrictEqual(sorted, ['0', '1', '2', '3', '4']);
    });

    it('should throw on a cycle.', function () {
      const C5 = path(DirectedGraph, 5);
      C5.addEdge(4, 0);

      assert.throws(() => {
        topologicalSort(C5);
      }, /acyclic/);

      const DC5 = path(DirectedGraph, 5);
      DC5.mergeEdge(10, 11);
      DC5.mergeEdge(11, 12);
      DC5.mergeEdge(12, 10);

      assert.throws(() => {
        topologicalSort(DC5);
      }, /acyclic/);
    });

    it('should work on a typical example.', function () {
      const graph = new DirectedGraph();
      graph.mergeEdge(5, 11);
      graph.mergeEdge(11, 2);
      graph.mergeEdge(7, 11);
      graph.mergeEdge(7, 8);
      graph.mergeEdge(3, 8);
      graph.mergeEdge(3, 10);
      graph.mergeEdge(11, 9);
      graph.mergeEdge(11, 10);
      graph.mergeEdge(8, 9);

      assert.strictEqual(graph.order, 8);
      assert.strictEqual(graph.size, 9);

      const sorted = topologicalSort(graph);

      assert.deepStrictEqual(sorted, [
        '5',
        '7',
        '3',
        '11',
        '8',
        '2',
        '10',
        '9'
      ]);
    });

    it('should work with disconnected graphs.', function () {
      const graph = path(DirectedGraph, 4);
      mergePath(graph, [10, 11, 12]);

      const sorted = topologicalSort(graph);

      assert.deepStrictEqual(sorted, ['0', '10', '1', '11', '2', '12', '3']);
    });

    it('should work on falsely mixed graphs.', function () {
      const graph = path(Graph, 3);

      const sorted = topologicalSort(graph);

      assert.deepEqual(sorted, ['0', '1', '2']);
    });
  });
});
