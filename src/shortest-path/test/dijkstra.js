/**
 * Graphology Dijkstra Shortest Path Unit Tests
 * =============================================
 */
var assert = require('assert'),
    library = require('../dijkstra.js'),
    indexLibrary = require('../indexed-brandes.js'),
    graphology = require('graphology');

var UndirectedGraph = graphology.UndirectedGraph,
    DirectedGraph = graphology.DirectedGraph;

var EDGES = [
  [1, 2, 1],
  [1, 8, 3],
  [2, 3, 2],
  [2, 4, 3],
  [4, 5, 2],
  [5, 6, 1],
  [6, 7, 5],
  [7, 8, 4],
  [7, 9, 1],
  [8, 9, 10],
  [10, 11, 3]
];

describe('dijkstra', function() {

  var graph = new UndirectedGraph();

  EDGES.forEach(function(edge) {
    graph.mergeEdge(edge[0], edge[1], {weight: edge[2]});
  });

  describe('bidirectional', function() {
    it('should correctly find the shortest path between two nodes.', function() {
      var path = library.bidirectional(graph, 1, 9);

      assert.deepStrictEqual(path, ['1', '8', '7', '9']);

      path = library.bidirectional(graph, 1, 6);

      assert.deepStrictEqual(path, ['1', '2', '4', '5', '6']);

      path = library.bidirectional(graph, 1, 11);

      assert.strictEqual(path, null);
    });

    it('should work when weight is omitted.', function() {
      var otherGraph = new DirectedGraph();

      otherGraph.mergeEdge(1, 2, {weight: 3});
      otherGraph.mergeEdge(1, 3);
      otherGraph.mergeEdge(3, 2);

      var path = library.bidirectional(otherGraph, 1, 2);

      assert.deepStrictEqual(path, ['1', '3', '2']);
    });

    it('should work with 0 weights.', function() {
      var otherGraph = new DirectedGraph();
      otherGraph.addNode('A');
      otherGraph.addNode('B');
      otherGraph.addNode('C');

      otherGraph.addEdge('A', 'B', { weight: 0 });
      otherGraph.addEdge('A', 'C', { weight: 0 });
      otherGraph.addEdge('B', 'C', { weight: 1 });

      var path = library.bidirectional(otherGraph, 'A', 'C');

      assert.deepStrictEqual(path, ['A', 'C']);
    });
  });

  describe('singleSource', function() {
    it('should correctly find the shortest path between source and all other nodes.', function() {
      var paths = library.singleSource(graph, '1');

      assert.deepStrictEqual(paths, {
        1: ['1'],
        2: ['1', '2'],
        3: ['1', '2', '3'],
        4: ['1', '2', '4'],
        5: ['1', '2', '4', '5'],
        6: ['1', '2', '4', '5', '6'],
        7: ['1', '8', '7'],
        8: ['1', '8'],
        9: ['1', '8', '7', '9']
      });
    });
  });

  describe('brandes', function() {
    var nodeToIndex = {},
        indexToNode = graph.nodes(),
        i = 0;

    graph.forEachNode(function(node) {
      nodeToIndex[node] = i++;
    });

    var expected = [
      ['1', '2', '8', '3', '4', '5', '7', '6', '9'],
      {
        '1': [],
        '2': ['1'],
        '3': ['2'],
        '4': ['2'],
        '5': ['4'],
        '6': ['5'],
        '7': ['8'],
        '8': ['1'],
        '9': ['7'],
        '10': [],
        '11': []
      },
      {
        '1': 2,
        '2': 2,
        '3': 2,
        '4': 2,
        '5': 2,
        '6': 2,
        '7': 2,
        '8': 2,
        '9': 2,
        '10': 0,
        '11': 0
      }
    ];

    it('applying Ulrik Brandes\' method should work properly.', function() {
      var result = library.brandes(graph, '1');

      assert.deepStrictEqual(result, expected);
    });

    it('the indexed version should also work properly.', function() {
      var indexedBrandes = indexLibrary.createDijkstraIndexedBrandes(graph);

      var result = indexedBrandes(nodeToIndex[1]);

      var S = Array.from(result[0].toArray()).reverse().map(function(index) {
        return indexToNode[index];
      });

      result[0].clear();

      var P = {};

      result[1].forEach(function(s, i) {
        P[indexToNode[i]] = s.map(function(index) {
          return indexToNode[index];
        })
      });

      var sigma = {};

      result[2].forEach(function(s, i) {
        sigma[indexToNode[i]] = s;
      });

      assert.deepStrictEqual(S, expected[0]);
      assert.deepStrictEqual(P, expected[1]);
      assert.deepStrictEqual(sigma, expected[2]);

      assert.doesNotThrow(function() {
        graph.forEachNode(function(node) {
          result = indexedBrandes(node);
          result[0].clear();
        });
      });
    });
  });
});
