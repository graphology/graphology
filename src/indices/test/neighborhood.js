/**
 * Graphology Indices Unit Tests
 * ==============================
 */
var assert = require('assert');
var Graph = require('graphology');
var reverse = require('graphology-operators/reverse');
var neighborhoodIndices = require('../neighborhood.js');

var NeighborhoodIndex = neighborhoodIndices.NeighborhoodIndex;
var WeightedNeighborhoodIndex = neighborhoodIndices.WeightedNeighborhoodIndex;

describe('NeighborhoodIndex', function () {
  it('should properly index the outbound neighborhood of the given graph.', function () {
    var graph = new Graph();
    graph.mergeEdge(1, 2);
    graph.mergeEdge(2, 3);
    graph.mergeEdge(2, 1);
    graph.mergeEdge(4, 5);

    var index = new NeighborhoodIndex(graph);
    assert.deepEqual(index.neighborhood, new Uint8Array([1, 0, 2, 4]));

    var projection = index.project();

    var neighbors = {};

    graph.forEachNode(function (node) {
      neighbors[node] = graph.outboundNeighbors(node);
    });

    assert.deepEqual(projection, neighbors);

    var results = [0.1, 0.2, 0.3, 0.4, 0.5];

    var resultIndex = {
      1: 0.1,
      2: 0.2,
      3: 0.3,
      4: 0.4,
      5: 0.5
    };

    assert.deepEqual(index.collect(results), resultIndex);

    index.assign('result', results);

    graph.forEachNode(function (node) {
      assert.strictEqual(
        graph.getNodeAttribute(node, 'result'),
        resultIndex[node]
      );
    });
  });

  it('should work with nodes having no edges.', function () {
    var graph = new Graph.UndirectedGraph();
    graph.addNode(1);
    graph.mergeEdge(2, 3);

    var index = new NeighborhoodIndex(graph);

    assert.deepEqual(index.project(), {
      1: [],
      2: ['3'],
      3: ['2']
    });
    assert.deepEqual(index.neighborhood, new Uint8Array([2, 1]));
    assert.deepEqual(index.starts, new Uint8Array([0, 0, 1, 2]));
  });

  it('should be possible to compute a reverse neighborhood index.', function () {
    var graph = new Graph();
    graph.mergeEdge(1, 2);
    graph.mergeUndirectedEdge(1, 2);
    graph.mergeEdge(2, 3);

    var index = new NeighborhoodIndex(graph, 'inbound');

    var reverseIndex = new NeighborhoodIndex(reverse(graph));

    assert.deepStrictEqual(index, reverseIndex);
  });
});

describe('WeightedNeighborhoodIndex', function () {
  it('should properly index the weighted outbound neighborhood of the given graph.', function () {
    var graph = new Graph();
    graph.mergeEdge(1, 2, {weight: 3});
    graph.mergeEdge(2, 3);
    graph.mergeEdge(2, 1, {weight: 1});
    graph.mergeEdge(4, 5, {weight: 34});

    var index = new WeightedNeighborhoodIndex(graph, 'weight');
    assert.deepEqual(index.neighborhood, new Uint8Array([1, 0, 2, 4]));
    assert.deepEqual(index.weights, new Float64Array([3, 1, 1, 34]));
    assert.deepEqual(index.outDegrees, new Float64Array([3, 2, 0, 34, 0]));

    var projection = index.project();

    var neighbors = {};

    graph.forEachNode(function (node) {
      neighbors[node] = graph.outboundNeighbors(node);
    });

    assert.deepEqual(projection, neighbors);

    var results = [0.1, 0.2, 0.3, 0.4, 0.5];

    var resultIndex = {
      1: 0.1,
      2: 0.2,
      3: 0.3,
      4: 0.4,
      5: 0.5
    };

    assert.deepEqual(index.collect(results), resultIndex);

    index.assign('result', results);

    graph.forEachNode(function (node) {
      assert.strictEqual(
        graph.getNodeAttribute(node, 'result'),
        resultIndex[node]
      );
    });

    // Unweighted fallback
    index = new WeightedNeighborhoodIndex(graph, null);

    assert.deepEqual(index.weights, new Float64Array([1, 1, 1, 1]));
    assert.deepEqual(index.outDegrees, new Float64Array([1, 2, 0, 1, 0]));
  });

  it('should be possible to compute a reverse neighborhood index.', function () {
    var graph = new Graph();
    graph.mergeEdge(1, 2, {weight: 3});
    graph.mergeUndirectedEdge(1, 2, {weight: 45});
    graph.mergeEdge(2, 3, {weight: -3});

    var index = new WeightedNeighborhoodIndex(graph, 'weight', 'inbound');

    var reverseIndex = new WeightedNeighborhoodIndex(reverse(graph), 'weight');

    assert.deepStrictEqual(index, reverseIndex);
  });

  it('should be possible to pass a weight getter.', function () {
    var graph = new Graph();
    graph.mergeEdge(1, 2, {importance: 3});
    graph.mergeEdge(2, 3, {importance: 5});

    var index = new WeightedNeighborhoodIndex(graph, function (_, attr) {
      return attr.importance;
    });

    assert.deepStrictEqual(Array.from(index.weights), [3, 5]);
  });
});
