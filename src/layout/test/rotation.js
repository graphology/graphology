/**
 * Graphology Rotation Helper Unit Tests
 * ======================================
 */
var assert = require('assert');
var deepApproximatelyEqual = require('./test-utils.js').deepApproximatelyEqual;
var Graph = require('graphology');
var rotation = require('../rotation.js');

var line = new Graph();
line.addNode('a', {x: 0, y: -0.5});
line.addNode('b', {x: 0, y: 0.5});

var square = new Graph();
square.addNode('a', {x: 10, y: 10});
square.addNode('b', {x: 10, y: 20});
square.addNode('c', {x: 20, y: 20});
square.addNode('d', {x: 20, y: 10});

describe('rotation', function () {
  it('should throw if provided with and invalid graph.', function () {
    assert.throws(function () {
      rotation(null);
    }, /graphology/);
  });

  it('should throw when given invalid dimensions.', function () {
    assert.throws(function () {
      rotation(new Graph(), Math.PI / 2, {dimensions: 'test'});
    }, /dim/);

    assert.throws(function () {
      rotation(new Graph(), Math.PI / 2, {dimensions: []});
    }, /dim/);

    assert.throws(function () {
      rotation(new Graph(), Math.PI / 2, {dimensions: ['x', 'y', 'z']});
    }, /dim/);
  });

  it('should properly rotate a line.', function () {
    var positions = rotation(line, Math.PI / 2);

    deepApproximatelyEqual(positions, {a: {x: 0.5, y: 0}, b: {x: -0.5, y: 0}});

    var degreePositions = rotation(line, 90, {degrees: true});

    deepApproximatelyEqual(positions, degreePositions);
  });

  it('full rotation should be idempotent.', function () {
    var positions = rotation(line, Math.PI * 2);

    deepApproximatelyEqual(positions, {
      a: line.getNodeAttributes('a'),
      b: line.getNodeAttributes('b')
    });
  });

  it('should be possible to pass custom dimensions.', function () {
    var otherLine = new Graph();

    otherLine.addNode('a', {X: 0, Y: -0.5});
    otherLine.addNode('b', {X: 0, Y: 0.5});

    var positions = rotation(otherLine, Math.PI / 2, {dimensions: ['X', 'Y']});

    deepApproximatelyEqual(positions, {a: {X: 0.5, Y: 0}, b: {X: -0.5, Y: 0}});
  });

  it('should be possible to assign the result to the graph.', function () {
    var copy = line.copy();

    rotation.assign(copy, Math.PI / 2);

    deepApproximatelyEqual(
      {
        a: copy.getNodeAttributes('a'),
        b: copy.getNodeAttributes('b')
      },
      {a: {x: 0.5, y: 0}, b: {x: -0.5, y: 0}}
    );
  });

  it('should be possible to center on zero.', function () {
    var A = rotation(line, Math.PI / 2);
    var B = rotation(line, Math.PI / 2, {centeredOnZero: true});

    deepApproximatelyEqual(A, B);

    A = rotation(square, Math.PI / 2);
    B = rotation(square, Math.PI / 2, {centeredOnZero: true});

    assert.notDeepStrictEqual(A, B);
  });

  it('should work if the graph has only one node.', function () {
    var graph = new Graph();
    graph.addNode('a', {x: 10, y: 20});

    var positions = rotation(graph, Math.PI / 2);

    deepApproximatelyEqual(positions, {a: {x: 10, y: 20}});

    positions = rotation(graph, Math.PI / 2, {centeredOnZero: true});

    deepApproximatelyEqual(positions, {a: {x: -20, y: 10}});
  });

  it('should work if the graph is null.', function () {
    var graph = new Graph();

    var positions = rotation(graph, Math.PI / 2);

    assert.deepStrictEqual(positions, {});
  });
});
