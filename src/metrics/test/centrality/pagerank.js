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

  it('should treat nodes with only zero-weight outbound edges as dangling.', function () {
    var graph = new DirectedGraph();
    graph.mergeEdge('a', 'b', {weight: 0});
    graph.mergeEdge('b', 'c', {weight: 1});
    graph.mergeEdge('c', 'a', {weight: 1});

    // Stationary distribution with the dangling node's mass spread uniformly.
    var expected = {
      a: 0.47441217150760717,
      b: 0.18441678192715535,
      c: 0.34117104656523745
    };

    deepApproximatelyEqual(
      pagerank(graph, {tolerance: 1e-12}),
      expected,
      1e-10
    );

    pagerank.assign(graph, {nodePagerankAttribute: 'score', tolerance: 1e-12});

    for (var node in expected)
      assert.approximately(
        graph.getNodeAttribute(node, 'score'),
        expected[node],
        1e-10
      );
  });

  [Graph.DirectedGraph, Graph.UndirectedGraph, Graph.MultiGraph].forEach(
    function (GraphClass) {
      it(
        'should ignore zero-weight edges in a ' + GraphClass.name + '.',
        function () {
          var graph = new GraphClass();
          graph.mergeEdge('a', 'b', {weight: 0});
          graph.mergeEdge('b', 'c', {weight: 2});
          graph.mergeEdge('c', 'b', {weight: 3});
          graph.mergeEdge('d', 'd', {weight: 0});
          graph.addNode('isolated');

          if (graph.multi) {
            graph.addEdge('a', 'b', {weight: 0});
            graph.addUndirectedEdge('a', 'd', {weight: 0});
          }

          var withoutZeroEdges = graph.copy();
          withoutZeroEdges.forEachEdge(function (edge, attr) {
            if (attr.weight === 0) withoutZeroEdges.dropEdge(edge);
          });

          var result = pagerank(graph);
          deepApproximatelyEqual(result, pagerank(withoutZeroEdges), 1e-10);

          var sum = 0;
          for (var node in result) {
            assert.isAtLeast(result[node], 0);
            sum += result[node];
          }
          assert.approximately(sum, 1, 1e-10);
        }
      );
    }
  );

  it('should return uniform scores when all edge weights are zero.', function () {
    var graph = new DirectedGraph();
    graph.mergeEdge('a', 'b', {weight: 0});
    graph.mergeEdge('b', 'a', {weight: 0});
    graph.mergeEdge('c', 'c', {weight: 0});
    graph.addNode('d');

    assert.deepEqual(pagerank(graph), {a: 0.25, b: 0.25, c: 0.25, d: 0.25});
  });

  it('should handle zero weights returned by a custom getter.', function () {
    var graph = new DirectedGraph();
    graph.mergeEdge('a', 'b', {customWeight: 0});
    graph.mergeEdge('b', 'c', {customWeight: 2});

    var options = {getEdgeWeight: 'customWeight'};
    var expectedGraph = graph.copy();
    expectedGraph.dropEdge('a', 'b');
    var expected = pagerank(expectedGraph, options);

    deepApproximatelyEqual(pagerank(graph, options), expected, 1e-10);
    deepApproximatelyEqual(
      pagerank(graph, {
        getEdgeWeight: function (_, attr) {
          return attr.customWeight;
        }
      }),
      expected,
      1e-10
    );
  });

  it('should preserve unweighted behavior when zero weights are ignored.', function () {
    var graph = new DirectedGraph();
    graph.mergeEdge('a', 'b', {weight: 0});
    graph.mergeEdge('b', 'c', {weight: 0});

    var unweighted = graph.copy();
    unweighted.forEachEdge(function (edge) {
      unweighted.setEdgeAttribute(edge, 'weight', 1);
    });

    deepApproximatelyEqual(
      pagerank(graph, {getEdgeWeight: null}),
      pagerank(unweighted),
      1e-10
    );
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
