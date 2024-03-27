/**
 * Graphology A* Shortest Path Unit Tests
 * =============================================
 */
var assert = require('assert');
var library = require('../astar.js');
var graphology = require('graphology');

var UndirectedGraph = graphology.UndirectedGraph;
var DirectedGraph = graphology.DirectedGraph;

var EDGES = [
  ['1', '2', 1],
  ['1', '8', 3],
  ['2', '3', 2],
  ['2', '4', 3],
  ['4', '5', 2],
  ['5', '6', 1],
  ['6', '7', 5],
  ['7', '8', 4],
  ['7', '9', 1],
  ['8', '9', 10],
  ['10', '11', 3]
];

var heuristic = function () {
  return 0;
};

describe('astar', function () {
  var graph = new UndirectedGraph();

  EDGES.forEach(function (edge) {
    graph.mergeEdge(edge[0], edge[1], {weight: edge[2]});
  });

  describe('bidirectional', function () {
    it('should correctly find the shortest path between two nodes.', function () {
      var path = library.bidirectional(graph, '1', '9', null, heuristic);

      assert.deepStrictEqual(path, ['1', '8', '7', '9']);

      path = library.bidirectional(graph, '1', '6', null, heuristic);

      assert.deepStrictEqual(path, ['1', '2', '4', '5', '6']);

      path = library.bidirectional(graph, '1', '11', null, heuristic);

      assert.strictEqual(path, null);
    });

    it('should work when weight is omitted.', function () {
      var otherGraph = new DirectedGraph();

      otherGraph.mergeEdge('1', '2', {weight: 3});
      otherGraph.mergeEdge('1', '3');
      otherGraph.mergeEdge('3', '2');

      var path = library.bidirectional(
        otherGraph,
        '1',
        '2',
        'weight',
        heuristic
      );

      assert.deepStrictEqual(path, ['1', '3', '2']);
    });

    it('should work with 0 weights.', function () {
      var otherGraph = new DirectedGraph();
      otherGraph.addNode('A');
      otherGraph.addNode('B');
      otherGraph.addNode('C');

      otherGraph.addEdge('A', 'B', {weight: 0});
      otherGraph.addEdge('A', 'C', {weight: 0});
      otherGraph.addEdge('B', 'C', {weight: 1});

      var path = library.bidirectional(
        otherGraph,
        'A',
        'C',
        'weight',
        heuristic
      );

      assert.deepStrictEqual(path, ['A', 'C']);
    });

    it('should work when heuristic not provided.', function () {
      var otherGraph = new DirectedGraph();

      otherGraph.mergeEdge('1', '2', {weight: 3});
      otherGraph.mergeEdge('1', '3');
      otherGraph.mergeEdge('3', '2');

      var path = library.bidirectional(otherGraph, '1', '2');

      assert.deepStrictEqual(path, ['1', '3', '2']);
    });
  });
});
