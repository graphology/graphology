/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert'),
    seedrandom = require('seedrandom'),
    Graph = require('graphology'),
    random = require('../random.js');

var rng = function() {
  return seedrandom('test');
};

describe('random', function() {

  it('should throw if provided with and invalid graph.', function() {
    assert.throws(function() {
      random(null);
    }, /graphology/);
  });

  it('should correctly produce a layout.', function() {
    var graph = new Graph();
    [1, 2, 3, 4].forEach(function(node) {
      graph.addNode(node);
    });

    var positions = random(graph, {rng: rng()});

    assert.deepEqual(
      positions,
      {
        1: {x: 0.8722025543160253, y: 0.4023928518604753},
        2: {x: 0.9647289658507073, y: 0.30479896375101545},
        3: {x: 0.3521069009157321, y: 0.2734533903544762},
        4: {x: 0.4635571187776387, y: 0.10034856760950056}
      }
    );
  });

  it('should be possible to assign the results to the nodes.', function() {
    var graph = new Graph();
    [1, 2, 3, 4].forEach(function(node) {
      graph.addNode(node);
    });

    var get = graph.getNodeAttributes.bind(graph);

    random.assign(graph, {rng: rng()});

    assert.deepEqual(
      {1: get(1), 2: get(2), 3: get(3), 4: get(4)},
      {
        1: {x: 0.8722025543160253, y: 0.4023928518604753},
        2: {x: 0.9647289658507073, y: 0.30479896375101545},
        3: {x: 0.3521069009157321, y: 0.2734533903544762},
        4: {x: 0.4635571187776387, y: 0.10034856760950056}
      }
    );
  });

  it('should be possible to map to the desired attributes.', function() {
    var graph = new Graph();
    [1, 2, 3, 4].forEach(function(node) {
      graph.addNode(node);
    });

    var get = graph.getNodeAttributes.bind(graph);

    random.assign(graph, {rng: rng(), attributes: {x: 'X', y: 'Y'}});

    assert.deepEqual(
      {1: get(1), 2: get(2), 3: get(3), 4: get(4)},
      {
        1: {X: 0.8722025543160253, Y: 0.4023928518604753},
        2: {X: 0.9647289658507073, Y: 0.30479896375101545},
        3: {X: 0.3521069009157321, Y: 0.2734533903544762},
        4: {X: 0.4635571187776387, Y: 0.10034856760950056}
      }
    );
  });

  it('should be possible to offset the center.', function() {
    var graph = new Graph();
    [1, 2, 3, 4].forEach(function(node) {
      graph.addNode(node);
    });

    var positions = random(graph, {rng: rng(), center: 0.7});

    assert.deepEqual(
      positions,
      {
        1: {x: 1.0722025543160254, y: 0.6023928518604753},
        2: {x: 1.1647289658507072, y: 0.5047989637510154},
        3: {x: 0.552106900915732, y: 0.47345339035447614},
        4: {x: 0.6635571187776387, y: 0.3003485676095005}
      }
    );
  });

  it('should be possible to scale the layout.', function() {
    var graph = new Graph();
    [1, 2, 3, 4].forEach(function(node) {
      graph.addNode(node);
    });

    var positions = random(graph, {rng: rng(), scale: 3});

    assert.deepEqual(
      positions,
      {
        1: {x: 0.8722025543160253 * 3, y: 0.4023928518604753 * 3},
        2: {x: 0.9647289658507073 * 3, y: 0.30479896375101545 * 3},
        3: {x: 0.3521069009157321 * 3, y: 0.2734533903544762 * 3},
        4: {x: 0.4635571187776387 * 3, y: 0.10034856760950056 * 3}
      }
    );
  });
});
