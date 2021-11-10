/**
 * Graphology Metrics Pagerank Unit Tests
 * =======================================
 */
var assert = require('chai').assert;
var Graph = require('graphology');
var pagerank = require('../../centrality/pagerank');

var DirectedGraph = Graph.DirectedGraph;
var MultiDirectedGraph = Graph.MultiDirectedGraph;

function deepApproximatelyEqual(t, o, precision) {
  for (var k in t) assert.approximately(t[k], o[k], precision);
}

describe('pagerank', function () {
  function getDirectedGraph() {
    var graph = new DirectedGraph();

    var edges = [
      [1, 2],
      [1, 3],
      [3, 1],
      [3, 2],
      [3, 5],
      [4, 5],
      [4, 6],
      [5, 4],
      [5, 6],
      [6, 4]
    ];

    edges.forEach(function (edge) {
      graph.mergeEdge(edge[0], edge[1]);
    });

    return graph;
  }

  it('should throw if provided with something which is not a graph.', function () {
    assert.throws(function () {
      pagerank({hello: 'world'});
    }, /graphology/);
  });

  it('should properly compute pagerank.', function () {
    var graph = getDirectedGraph();

    var p = pagerank(graph, {alpha: 0.9, tolerance: 1e-8});

    deepApproximatelyEqual(
      p,
      {
        1: 0.03721197,
        2: 0.05395735,
        3: 0.04150565,
        4: 0.37508082,
        5: 0.20599833,
        6: 0.28624589
      },
      1e-3
    );
  });

  it('should be possible to assign the result to the graph nodes.', function () {
    var graph = getDirectedGraph();

    pagerank.assign(graph, {alpha: 0.9, tolerance: 1e-8});

    var test = {
      1: 0.03721197,
      2: 0.05395735,
      3: 0.04150565,
      4: 0.37508082,
      5: 0.20599833,
      6: 0.28624589
    };

    for (var k in test)
      assert.approximately(
        graph.getNodeAttribute(k, 'pagerank'),
        test[k],
        1e-3
      );
  });

  it('should throw when failing to converge.', function () {
    var graph = getDirectedGraph();

    assert.throws(function () {
      pagerank(graph, {maxIterations: 0});
    }, /converge/);
  });

  it('should work with a weighted graph.', function () {
    var graph = new DirectedGraph();
    graph.mergeEdge('A', 'B', {weight: 0.5});
    graph.mergeEdge('A', 'C', {weight: 0.5});

    var p = pagerank(graph, {weighted: false});

    var unweighted = {
      A: 0.25974,
      B: 0.37013,
      C: 0.37013
    };

    var weighted = {
      A: 0.25974,
      B: 0.33333,
      C: 0.40693
    };

    deepApproximatelyEqual(p, unweighted, 1e-3);

    p = pagerank(graph, {weighted: true});

    deepApproximatelyEqual(p, unweighted, 1e-3);

    graph.setEdgeAttribute('A', 'C', 'weight', 1);

    p = pagerank(graph, {weighted: true});

    deepApproximatelyEqual(p, weighted, 1e-3);
  });

  it('should work with a multi graph.', function () {
    var graph = new DirectedGraph();
    graph.mergeEdge('A', 'B', {weight: 2});
    graph.mergeEdge('A', 'C', {weight: 1});

    var multiGraph = new MultiDirectedGraph();
    multiGraph.mergeEdge('A', 'B');
    multiGraph.mergeEdge('A', 'B');
    multiGraph.mergeEdge('A', 'C');

    var result = pagerank(graph, {weighted: true});
    var multiResult = pagerank(multiGraph);

    deepApproximatelyEqual(result, multiResult, 1e-7);
  });

  it('should work with a mixed graph.', function () {
    var graph = new Graph();
    graph.mergeEdge('A', 'B');
    graph.mergeEdge('B', 'A');
    graph.mergeEdge('A', 'C');

    var mixedGraph = new Graph();
    mixedGraph.mergeUndirectedEdge('A', 'B');
    mixedGraph.mergeEdge('A', 'C');

    var result = pagerank(graph);
    var mixedResult = pagerank(mixedGraph);

    deepApproximatelyEqual(result, mixedResult, 1e-7);
  });
});
