/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert'),
    Graph = require('graphology'),
    mergeCycle = require('graphology-utils/merge-cycle'),
    mergeStar = require('graphology-utils/merge-star'),
    erdosRenyi = require('graphology-generators/random/erdos-renyi');

var lib = require('./index');
var bfs = lib.bfs;
var dfs = lib.dfs;

var dfsFromNode = lib.dfsFromNode;
var bfsFromNode = lib.bfsFromNode;

describe('graphology-traversal', function() {
  describe('dfs', function() {

    it('should throw if given invalid arguments.', function() {
      assert.throws(function() {
        dfs(null);
      }, /graph/);

      assert.throws(function() {
        dfs(new Graph(), null);
      }, /function/);
    });

    it('should traverse the graph correctly.', function() {
      var graph = new Graph();

      graph.mergeEdge(1, 2);
      graph.mergeEdge(1, 3);
      graph.mergeEdge(2, 4);
      graph.mergeEdge(4, 3);

      graph.addNode(5, {hello: 'world'});
      graph.mergeEdge(6, 7);
      graph.mergeEdge(7, 8);
      graph.mergeEdge(8, 6);

      var path = [];

      dfs(graph, function(node, attr) {
        if (node === '5')
          assert.deepStrictEqual(attr, {hello: 'world'});
        else
          assert.deepStrictEqual(attr, {});

        path.push(node);
      });

      assert.deepStrictEqual(path, [
        '1', '3', '2', '4', '5', '6', '7', '8'
      ]);
    });

    it('should work with cycles.', function() {
      var graph = new Graph();
      mergeCycle(graph, [1, 2, 3, 4, 5]);

      var path = [];

      dfs(graph, function(node) {
        path.push(node);
      });

      assert.deepStrictEqual(path, ['1', '2', '3', '4', '5']);
    });

    it('should iterate on every node.', function() {
      var graph = erdosRenyi.sparse(Graph.DirectedGraph, {order: 100, probability: 0.1});

      var path = [];

      dfs(graph, function(node) {
        path.push(node);
      });

      assert.deepStrictEqual(new Set(graph.nodes()), new Set(path));
    });

    it('should produce the expected results with trees.', function() {
      var graph = new Graph();

      graph.mergeEdge(1, 2);
      graph.mergeEdge(1, 3);
      graph.mergeEdge(2, 4);
      graph.mergeEdge(2, 5);
      graph.mergeEdge(3, 6);
      graph.mergeEdge(3, 7);

      var path = [];

      dfs(graph, function(node) {
        path.push(node);
      });

      assert.deepStrictEqual(path, ['1', '3', '7', '6', '2', '5', '4']);
    });

    it('should expose traversal depth.', function() {
      var graph = new Graph();
      mergeCycle(graph, [1, 2, 3, 4]);

      var path = [];

      dfs(graph, function(node, attr, depth) {
        path.push([node, depth]);
      });

      assert.deepStrictEqual(path, [
        ['1', 0],
        ['2', 1],
        ['3', 2],
        ['4', 3]
      ]);
    });

    it('should be possible to start from a given node.', function() {
      var graph = new Graph();
      mergeCycle(graph, [1, 2, 3, 4]);
      graph.addNode(5);

      var path = [];

      dfsFromNode(graph, 3, function(node, attr, depth) {
        path.push([node, depth]);
      });

      assert.deepStrictEqual(path, [
        ['3', 0],
        ['4', 1],
        ['1', 2],
        ['2', 3]
      ]);
    });

    it('should work when the graph has no edge.', function() {
      var graph = new Graph();

      graph.addNode('0');
      graph.addNode('1');

      var path = new Set();

      dfs(graph, function(node) {
        path.add(node);
      });

      assert.deepStrictEqual(path, new Set(['0', '1']));

      path = new Set();

      dfsFromNode(graph, '0', function(node) {
        path.add(node);
      });

      assert.deepStrictEqual(path, new Set(['0']));
    });
  });

  describe('bfs', function() {

    it('should throw if given invalid arguments.', function() {
      assert.throws(function() {
        bfs(null);
      }, /graph/);

      assert.throws(function() {
        bfs(new Graph(), null);
      }, /function/);
    });

    it('should traverse the graph correctly.', function() {
      var graph = new Graph();
      mergeStar(graph, [1, 2, 3, 4]);
      mergeStar(graph, [2, 5, 6]);
      mergeStar(graph, [3, 7, 8]);
      graph.mergeEdge(4, 8);

      graph.addNode(9, {hello: 'world'});

      var path = [];

      bfs(graph, function(node, attr) {
        if (node === '9')
          assert.deepStrictEqual(attr, {hello: 'world'});
        else
          assert.deepStrictEqual(attr, {});

        path.push(node);
      });

      assert.deepStrictEqual(path, ['1', '2', '3', '4', '5', '6', '7', '8', '9']);

      var dfsPath = [];

      dfs(graph, function(node) {
        dfsPath.push(node);
      });

      assert.notDeepStrictEqual(path, dfsPath);
    });

    it('should iterate on every node.', function() {
      var graph = erdosRenyi.sparse(Graph.DirectedGraph, {order: 100, probability: 0.1});

      var path = [];

      bfs(graph, function(node) {
        path.push(node);
      });

      assert.deepStrictEqual(new Set(graph.nodes()), new Set(path));
    });

    it('should produce the expected results with trees.', function() {
      var graph = new Graph();

      graph.mergeEdge(1, 2);
      graph.mergeEdge(1, 3);
      graph.mergeEdge(2, 4);
      graph.mergeEdge(2, 5);
      graph.mergeEdge(3, 6);
      graph.mergeEdge(3, 7);

      var path = [];

      bfs(graph, function(node) {
        path.push(node);
      });

      assert.deepStrictEqual(path, ['1', '2', '3', '4', '5', '6', '7']);
    });

    it('should expose traversal depth.', function() {
      var graph = new Graph();
      mergeCycle(graph, [1, 2, 3, 4]);

      var path = [];

      bfs(graph, function(node, attr, depth) {
        path.push([node, depth]);
      });

      assert.deepStrictEqual(path, [
        ['1', 0],
        ['2', 1],
        ['3', 2],
        ['4', 3]
      ]);
    });

    it('should be possible to start from a given node.', function() {
      var graph = new Graph();
      mergeCycle(graph, [1, 2, 3, 4]);
      graph.addNode(5);

      var path = [];

      bfsFromNode(graph, 4, function(node, attr, depth) {
        path.push([node, depth]);
      });

      assert.deepStrictEqual(path, [
        ['4', 0],
        ['1', 1],
        ['2', 2],
        ['3', 3]
      ]);
    });

    it('should work when the graph has no edge.', function() {
      var graph = new Graph();

      graph.addNode('0');
      graph.addNode('1');

      var path = new Set();

      bfs(graph, function(node) {
        path.add(node);
      });

      assert.deepStrictEqual(path, new Set(['0', '1']));

      path = new Set();

      bfsFromNode(graph, '0', function(node) {
        path.add(node);
      });

      assert.deepStrictEqual(path, new Set(['0']));
    });
  });
});
