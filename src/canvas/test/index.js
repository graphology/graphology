/**
 * Graphology Canvas Unit Tests
 * =============================
 */
var assert = require('assert');
var Graph = require('graphology');
var canvasApi = require('canvas');
var lib = require('../');

function createContext(width, height) {
  var canvas = canvasApi.createCanvas(width || 2048, height || 2048);
  var context = canvas.getContext('2d');

  return context;
}

describe('graphology-canvas', function() {
  it('should throw if some node has no position.', function() {
    var graph = new Graph();

    graph.addNode('John', {x: 35, y: 76});
    graph.addNode('Mary', {y: 45});

    var context = createContext();

    assert.throws(function() {
      lib.render(graph, context);
    }, /position/);
  });
});
