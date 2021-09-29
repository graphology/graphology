/**
 * Graphology Weighted Size Unit Tests
 * ====================================
 */
var assert = require('assert'),
    Graph = require('graphology'),
    weightedDegree = require('../weighted-degree.js');

var UndirectedGraph = Graph.UndirectedGraph;

function createEdgeAttributes(a, v) {
  var o = {};

  o[a] = v;

  return o;
}

function createGraph(weightAttribute) {
  var graph = new Graph();

  var w = weightAttribute || 'weight';

  graph.mergeEdge(1, 2, createEdgeAttributes(w, 3));
  graph.mergeEdge(1, 3, createEdgeAttributes(w, 5));
  graph.mergeEdge(3, 1, createEdgeAttributes(w, 2));

  return graph;
}

function collect(graph, attr) {
  var o = {};

  graph.nodes().forEach(function(node) {
    o[node] = graph.getNodeAttribute(node, attr);
  });

  return o;
}

describe('weightedDegree', function() {

  it('should throw if given wrong arguments.', function() {

    assert.throws(function() {
      weightedDegree(null);
    }, /instance/);

    assert.throws(function() {
      weightedDegree.weightedInDegree(new UndirectedGraph());
    }, /undirected/);

    assert.throws(function() {
      weightedDegree.weightedOutDegree(new UndirectedGraph());
    }, /undirected/);
  });

  it('should return the correct weighted degree for the given node.', function() {
    var graph = createGraph();

    assert.strictEqual(weightedDegree(graph, 1), 10);
    assert.strictEqual(weightedDegree.weightedInDegree(graph, 1), 2);
    assert.strictEqual(weightedDegree.weightedOutDegree(graph, 1), 8);
  });

  it('should be possible to assign the result for the given node.', function() {
    var graph = createGraph();

    weightedDegree.assign(graph, 1);
    weightedDegree.weightedInDegree.assign(graph, 1);
    weightedDegree.weightedOutDegree.assign(graph, 1);

    var attributes = graph.getNodeAttributes(1);

    assert.deepEqual(attributes, {
      weightedDegree: 10,
      weightedInDegree: 2,
      weightedOutDegree: 8
    });
  });

  it('should be possible to use options for the given node.', function() {
    var graph = createGraph('w');

    weightedDegree.assign(graph, 1, {attributes: {weight: 'w', weightedDegree: 'wd'}});
    weightedDegree.weightedInDegree.assign(graph, 1, {attributes: {weight: 'w', weightedDegree: 'wid'}});
    weightedDegree.weightedOutDegree.assign(graph, 1, {attributes: {weight: 'w', weightedDegree: 'wod'}});

    var attributes = graph.getNodeAttributes(1);

    assert.deepEqual(attributes, {
      wd: 10,
      wid: 2,
      wod: 8
    });
  });

  it('should be possible to compute weighted degree for every node.', function() {
    var weightedDegrees = {
      1: 10,
      2: 3,
      3: 7
    };

    var weightedInDegrees = {
      1: 2,
      2: 3,
      3: 5
    };

    var weightedOutDegrees = {
      1: 8,
      2: 0,
      3: 2
    };

    var graph = createGraph();

    assert.deepEqual(weightedDegree(graph), weightedDegrees);
    weightedDegree.assign(graph);
    assert.deepEqual(collect(graph, 'weightedDegree'), weightedDegrees);

    graph = createGraph();

    assert.deepEqual(weightedDegree.weightedInDegree(graph), weightedInDegrees);
    weightedDegree.weightedInDegree.assign(graph);
    assert.deepEqual(collect(graph, 'weightedInDegree'), weightedInDegrees);

    graph = createGraph();

    assert.deepEqual(weightedDegree.weightedOutDegree(graph), weightedOutDegrees);
    weightedDegree.weightedOutDegree.assign(graph);
    assert.deepEqual(collect(graph, 'weightedOutDegree'), weightedOutDegrees);
  });
});
