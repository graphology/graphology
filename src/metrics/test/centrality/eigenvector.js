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

function getDirectedGraph() {
  var edges = [
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 2],
    [3, 5],
    [4, 2],
    [4, 5],
    [4, 6],
    [5, 6],
    [5, 7],
    [5, 8],
    [6, 8],
    [7, 1],
    [7, 5],
    [7, 8],
    [8, 6],
    [8, 7]
  ];

  var graph = new Graph.DirectedGraph();

  edges.forEach(function (pair) {
    // NOTE: reversed
    graph.mergeEdge(pair[1], pair[0], {weight: 2});
  });

  return graph;
}

describe('eigenvector centrality', function () {
  it('should throw if provided with something which is not a graph.', function () {
    assert.throws(function () {
      eigenvectorCentrality({hello: 'world'});
    }, /graphology/);
  });

  it('should return the correct results with a complete graph.', function () {
    var graph = complete(Graph.UndirectedGraph, 5);
    var result = eigenvectorCentrality(graph);

    var expected = graph.reduceNodes(function (o, node) {
      o[node] = Math.sqrt(1 / 5);
      return o;
    }, {});

    deepApproximatelyEqual(result, expected, 1e-7);

    // Assign
    eigenvectorCentrality.assign(graph);

    deepApproximatelyEqual(
      graph.reduceNodes(function (o, node, attr) {
        o[node] = attr.eigenvectorCentrality;
        return o;
      }, {}),
      expected,
      1e-7
    );
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

    graph.setEdgeAttribute(0, 1, 'weight', 5);

    deepApproximatelyEqual(
      eigenvectorCentrality(graph),
      {
        0: 0.6933,
        1: 0.7071,
        2: 0.1386
      },
      1e-4
    );
  });

  it('should work with directed graphs.', function () {
    var expected = {
      1: 0.25368793,
      2: 0.19576478,
      3: 0.32817092,
      4: 0.40430835,
      5: 0.48199885,
      6: 0.15724483,
      7: 0.51346196,
      8: 0.32475403
    };

    var graph = getDirectedGraph();

    var unweightedResult = eigenvectorCentrality(graph, {getEdgeWeight: null});
    var weightedResult = eigenvectorCentrality(graph);

    deepApproximatelyEqual(weightedResult, expected, 1e-5);
    deepApproximatelyEqual(unweightedResult, expected, 1e-5);

    graph.setEdgeAttribute(2, 4, 'weight', 45);

    weightedResult = eigenvectorCentrality(graph);

    assert.notDeepEqual(weightedResult, unweightedResult);

    weightedResult = eigenvectorCentrality(graph, {getEdgeWeight: 'test'});

    assert.deepStrictEqual(weightedResult, unweightedResult);
  });

  it('should work with a multi graph.', function () {
    var graph = new Graph.UndirectedGraph();
    graph.mergeEdge('A', 'B', {weight: 2});
    graph.mergeEdge('A', 'C', {weight: 1});

    var multiGraph = new Graph.MultiUndirectedGraph();
    multiGraph.mergeEdge('A', 'B');
    multiGraph.mergeEdge('A', 'B');
    multiGraph.mergeEdge('A', 'C');

    var result = eigenvectorCentrality(graph, {weighted: true});
    var multiResult = eigenvectorCentrality(multiGraph);

    deepApproximatelyEqual(result, multiResult, 1e-7);
  });

  it('should work with a mixed graph.', function () {
    var graph = new Graph.DirectedGraph();
    graph.mergeEdge('A', 'B');
    graph.mergeEdge('B', 'A');
    graph.mergeEdge('A', 'C');

    var mixedGraph = new Graph();
    mixedGraph.mergeUndirectedEdge('A', 'B');
    mixedGraph.mergeEdge('A', 'C');

    var result = eigenvectorCentrality(graph);
    var mixedResult = eigenvectorCentrality(mixedGraph);

    deepApproximatelyEqual(result, mixedResult, 1e-7);
  });
});
