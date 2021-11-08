/**
 * Graphology Metrics Closeness Centrality Unit Tests
 * =====================================================
 */
var assert = require('chai').assert;
var Graph = require('graphology');
var path = require('graphology-generators/classic/path');
var complete = require('graphology-generators/classic/complete');
var florentineFamilies = require('graphology-generators/social/florentine-families');
var mergePath = require('graphology-utils/merge-path');
var reverse = require('graphology-operators/reverse');
var closenessCentrality = require('../../centrality/closeness');

function deepApproximatelyEqual(t, o, precision) {
  for (var k in t) assert.approximately(t[k], o[k], precision);
}

describe('closeness centrality', function () {
  it('should throw if provided with something which is not a graph.', function () {
    assert.throws(function () {
      closenessCentrality({hello: 'world'});
    }, /graphology/);
  });

  it('should return the correct results with a directed path graph.', function () {
    var graph = path(Graph.DirectedGraph, 3);
    var reversed = reverse(graph);

    var result = closenessCentrality(graph);
    var reversedResult = closenessCentrality(reversed);

    deepApproximatelyEqual(result, {0: 0, 1: 1, 2: 0.6666}, 1e-4);
    deepApproximatelyEqual(reversedResult, {0: 0.6666, 1: 1, 2: 0}, 1e-4);

    result = closenessCentrality(graph, {wassermanFaust: true});
    reversedResult = closenessCentrality(reversed, {wassermanFaust: true});

    deepApproximatelyEqual(result, {0: 0, 1: 0.5, 2: 0.6666}, 1e-4);
    deepApproximatelyEqual(reversedResult, {0: 0.6666, 1: 0.5, 2: 0}, 1e-4);
  });

  it('should compute the Wasserman-Faust normalization correctly.', function () {
    var graph = path(Graph.UndirectedGraph, 4);
    mergePath(graph, [4, 5, 6]);

    deepApproximatelyEqual(
      closenessCentrality(graph, {wassermanFaust: true}),
      {
        0: 0.25,
        1: 0.375,
        2: 0.375,
        3: 0.25,
        4: 0.222,
        5: 0.333,
        6: 0.222
      },
      1e-3
    );

    deepApproximatelyEqual(
      closenessCentrality(graph, {wassermanFaust: false}),
      {0: 0.5, 1: 0.75, 2: 0.75, 3: 0.5, 4: 0.667, 5: 1.0, 6: 0.667},
      1e-3
    );
  });

  it('should return the correct result with a complete graph.', function () {
    var graph = complete(Graph.UndirectedGraph, 5);

    deepApproximatelyEqual(
      closenessCentrality(graph),
      {0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1},
      1e-3
    );
  });

  it('should return the correct result with an undirected path graph.', function () {
    var graph = path(Graph.UndirectedGraph, 3);

    deepApproximatelyEqual(
      closenessCentrality(graph),
      {0: 0.6667, 1: 1, 2: 0.6667},
      1e-3
    );
  });

  it('should return the correct result with the Krackhardt kite.', function () {
    var graph = florentineFamilies(Graph.UndirectedGraph);

    deepApproximatelyEqual(
      closenessCentrality(graph),
      {
        Acciaiuoli: 0.368,
        Albizzi: 0.483,
        Barbadori: 0.4375,
        Bischeri: 0.4,
        Castellani: 0.389,
        Ginori: 0.333,
        Guadagni: 0.467,
        Lamberteschi: 0.326,
        Medici: 0.56,
        Pazzi: 0.286,
        Peruzzi: 0.368,
        Ridolfi: 0.5,
        Salviati: 0.389,
        Strozzi: 0.4375,
        Tornabuoni: 0.483
      },
      1e-3
    );
  });
});
