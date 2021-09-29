/**
 * Graphology Extent Unit Tests
 * =============================
 */
var assert = require('chai').assert,
    Graph = require('graphology'),
    lib = require('../extent.js');

describe('extent', function() {
  var graph = new Graph();

  var data = {
    one: {
      x: 34,
      y: -12,
      size: 2
    },
    two: {
      x: 2,
      y: 2,
      size: 34
    },
    three: {
      x: -1,
      y: 22,
      size: 1
    }
  };

  for (var node in data)
    graph.addNode(node, data[node]);

  graph.addEdge('one', 'two', {
    size: 2,
    weight: 1.5
  });

  graph.addEdge('two', 'three', {
    size: 45,
    weight: 5.6
  });

  describe('nodes', function() {

    it('should return the extent of a single attribute.', function() {
      var extent = lib.nodeExtent(graph, 'size');

      assert.deepEqual(extent, [1, 34]);
    });

    it('should return the extent of multiple attributes.', function() {
      var extent = lib.nodeExtent(graph, ['x', 'y', 'size']);

      assert.deepEqual(extent, {x: [-1, 34], y: [-12, 22], size: [1, 34]});
    });
  });

  describe('edges', function() {

    it('should return the extent of a single attribute.', function() {
      var extent = lib.edgeExtent(graph, 'size');

      assert.deepEqual(extent, [2, 45]);
    });

    it('should return the extent of multiple attributes.', function() {
      var extent = lib.edgeExtent(graph, ['size', 'weight']);

      assert.deepEqual(extent, {size: [2, 45], weight: [1.5, 5.6]});
    });
  });
});
