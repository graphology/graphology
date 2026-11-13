/**
 * Regression tests for shortest-path multiplicities exceeding 32 bits.
 */
var assert = require('chai').assert;
var DirectedGraph = require('graphology').DirectedGraph;
var betweenness = require('../../centrality/betweenness');
var edgeBetweenness = require('../../centrality/edge-betweenness');
var brandes = require('graphology-shortest-path/indexed-brandes');

function layeredGraph(depth) {
  var graph = new DirectedGraph();
  var previous = ['source'];
  graph.addNode('source');

  for (var i = 0; i < depth; i++) {
    var layer = [i + 'a', i + 'b'];
    for (var j = 0; j < layer.length; j++) {
      graph.addNode(layer[j]);
      for (var k = 0; k < previous.length; k++)
        graph.addEdge(previous[k], layer[j], {weight: 1});
    }
    previous = layer;
  }

  graph.addNode('target');
  previous.forEach(function (node) {
    graph.addEdge(node, 'target', {weight: 1});
  });
  return graph;
}

describe('betweenness shortest-path multiplicities', function () {
  [false, true].forEach(function (weighted) {
    var label = weighted ? 'weighted' : 'unweighted';
    var getEdgeWeight = weighted ? 'weight' : null;

    it(
      'should retain ' + label + ' counts above 32 bits across calls.',
      function () {
        var graph = layeredGraph(32);
        var routine = weighted
          ? brandes.createDijkstraIndexedBrandes(graph, 'weight')
          : brandes.createUnweightedIndexedBrandes(graph);
        var target = routine.index.nodes.indexOf('target');
        var source = routine.index.nodes.indexOf('source');
        var result = routine(source);

        // Dijkstra Brandes doubles all counts, which cancels in dependency ratios.
        assert.strictEqual(result[2][target], Math.pow(2, weighted ? 33 : 32));
        result[0].clear();
        result = routine(target);
        assert.strictEqual(result[2][source], 0);
        result[0].clear();
        result = routine(source);
        assert.strictEqual(result[2][target], Math.pow(2, weighted ? 33 : 32));
        result[0].clear();
      }
    );

    [31, 32, 40].forEach(function (depth) {
      it(
        'should compute finite ' +
          label +
          ' node and edge scores at depth ' +
          depth,
        function () {
          var graph = layeredGraph(depth);
          var options = {getEdgeWeight: getEdgeWeight, normalized: false};
          var nodes = betweenness(graph, options);
          var edges = edgeBetweenness(graph, options);
          assert.strictEqual(nodes.source, 0);
          assert.strictEqual(nodes.target, 0);

          for (var i = 0; i < depth; i++) {
            // Each pair with endpoints before/after layer i uses either node equally.
            var expected = ((2 * i + 1) * (2 * (depth - i - 1) + 1)) / 2;
            assert.approximately(nodes[i + 'a'], expected, 1e-9);
            assert.approximately(nodes[i + 'b'], expected, 1e-9);
          }

          graph.forEachEdge(function (edge, attr, source, target) {
            var left = source === 'source' ? 1 : parseInt(source, 10) + 1.5;
            var right =
              target === 'target' ? 1 : depth - parseInt(target, 10) + 0.5;
            assert.approximately(edges[edge], left * right, 1e-9);
          });

          betweenness.assign(graph, options);
          edgeBetweenness.assign(graph, options);
          graph.forEachNode(function (node, attr) {
            assert.strictEqual(attr.betweennessCentrality, nodes[node]);
          });
          graph.forEachEdge(function (edge, attr) {
            assert.strictEqual(attr.betweennessCentrality, edges[edge]);
          });
        }
      );
    });
  });
});
