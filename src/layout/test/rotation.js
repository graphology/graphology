/**
 * Graphology Rotation Helper Unit Tests
 * ======================================
 */
var assert = require('assert');
var deepApproximatelyEqual = require('./utils.js').deepApproximatelyEqual;
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
});
