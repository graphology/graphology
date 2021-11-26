/**
 * Graphology Circular Layout Unit Tests
 * ====================================
 */
var assert = require('assert');
var Graph = require('graphology');
var circular = require('../circular.js');

describe('circular', function () {
  it('should throw if provided with and invalid graph.', function () {
    assert.throws(function () {
      circular(null);
    }, /graphology/);
  });

  it('should throw when given invalid dimensions.', function () {
    assert.throws(function () {
      circular(new Graph(), {dimensions: 'test'});
    }, /dim/);

    assert.throws(function () {
      circular(new Graph(), {dimensions: []});
    }, /dim/);

    assert.throws(function () {
      circular(new Graph(), {dimensions: ['x', 'y', 'z']});
    }, /dim/);
  });

  it('should correctly produce a layout.', function () {
    var graph = new Graph();
    [1, 2, 3, 4].forEach(function (node) {
      graph.addNode(node);
    });

    var positions = circular(graph);

    assert.deepStrictEqual(positions, {
      1: {x: 1, y: 0},
      2: {x: 6.123233995736766e-17, y: 1},
      3: {x: -1, y: 1.2246467991473532e-16},
      4: {x: -1.8369701987210297e-16, y: -1}
    });
  });

  it('should be possible to assign the results to the nodes.', function () {
    var graph = new Graph();
    [1, 2, 3, 4].forEach(function (node) {
      graph.addNode(node);
    });

    var get = graph.getNodeAttributes.bind(graph);

    circular.assign(graph);

    assert.deepStrictEqual(
      {1: get(1), 2: get(2), 3: get(3), 4: get(4)},
      {
        1: {x: 1, y: 0},
        2: {x: 6.123233995736766e-17, y: 1},
        3: {x: -1, y: 1.2246467991473532e-16},
        4: {x: -1.8369701987210297e-16, y: -1}
      }
    );
  });

  it('should be possible to map to the desired attributes.', function () {
    var graph = new Graph();
    [1, 2, 3, 4].forEach(function (node) {
      graph.addNode(node);
    });

    var get = graph.getNodeAttributes.bind(graph);

    circular.assign(graph, {dimensions: ['X', 'Y']});

    assert.deepStrictEqual(
      {1: get(1), 2: get(2), 3: get(3), 4: get(4)},
      {
        1: {X: 1, Y: 0},
        2: {X: 6.123233995736766e-17, Y: 1},
        3: {X: -1, Y: 1.2246467991473532e-16},
        4: {X: -1.8369701987210297e-16, Y: -1}
      }
    );
  });

  it('should be possible to offset the center.', function () {
    var graph = new Graph();
    [1, 2, 3, 4].forEach(function (node) {
      graph.addNode(node);
    });

    var positions = circular(graph, {center: 0.7});

    assert.deepStrictEqual(positions, {
      1: {x: 1.2, y: 0.19999999999999996},
      2: {x: 0.2, y: 1.2},
      3: {x: -0.8, y: 0.20000000000000007},
      4: {x: 0.19999999999999976, y: -0.8}
    });
  });

  it('should be possible to scale the layout.', function () {
    var graph = new Graph();
    [1, 2, 3, 4].forEach(function (node) {
      graph.addNode(node);
    });

    var positions = circular(graph, {scale: 3});

    assert.deepStrictEqual(positions, {
      1: {x: 3, y: 0},
      2: {x: 1.8369701987210297e-16, y: 3},
      3: {x: -3, y: 3.6739403974420594e-16},
      4: {x: -5.51091059616309e-16, y: -3}
    });
  });
});
