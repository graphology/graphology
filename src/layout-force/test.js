/**
 * Graphology Force Layout Unit Tests
 * ===================================
 */
const assert = require('assert');
const Graph = require('graphology');
const randomLayout = require('graphology-layout/random');
const seedrandom = require('seedrandom');
const forceLayout = require('./');

const rng = () => seedrandom('test');

describe('graphology-layout-force', function () {
  it('should throw if not given proper arguments.', function () {
    assert.throws(function () {
      forceLayout('test');
    });

    assert.throws(function () {
      forceLayout(new Graph());
    });

    assert.throws(function () {
      forceLayout(new Graph(), -45);
    });
  });

  it('should correctly compute a layout.', function () {
    const graph = new Graph();
    graph.mergeEdge(1, 2);
    graph.mergeEdge(1, 3);
    graph.mergeEdge(3, 1);
    graph.mergeEdge(3, 4);

    randomLayout.assign(graph, {rng: rng()});

    const positions = forceLayout(graph, 5);

    assert.notDeepStrictEqual(
      positions,
      graph.mapNodes((_, attr) => ({x: attr.x, y: attr.y}))
    );

    assert.deepStrictEqual(positions, {
      1: {x: 0.8722025543160253, y: 0.4023928518604753},
      2: {x: 0.9647289658507073, y: 0.30479896375101545},
      3: {x: 0.3521069009157321, y: 0.2734533903544762},
      4: {x: 0.4635571187776387, y: 0.10034856760950056}
    });
  });

  it('should correctly assign a layout.', function () {
    const graph = new Graph();
    graph.mergeEdge(1, 2);
    graph.mergeEdge(1, 3);
    graph.mergeEdge(3, 1);
    graph.mergeEdge(3, 4);

    randomLayout.assign(graph, {rng: rng()});

    forceLayout.assign(graph, 5);

    assert.notDeepStrictEqual(
      graph.mapNodes((_, attr) => ({x: attr.x, y: attr.y})),
      {
        1: {x: 0.8722025543160253, y: 0.4023928518604753},
        2: {x: 0.9647289658507073, y: 0.30479896375101545},
        3: {x: 0.3521069009157321, y: 0.2734533903544762},
        4: {x: 0.4635571187776387, y: 0.10034856760950056}
      }
    );
  });
});
