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

    // console.log(positions);

    assert.deepStrictEqual(positions, {
      1: {x: 1.1219482482175678, y: 0.761968980751655},
      2: {x: 1.5668569046241632, y: 0.2362958661793019},
      3: {x: -0.2261150994411288, y: 0.40013848230763055},
      4: {x: 0.18940040279745846, y: -0.3176088516928669}
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
        1: {x: 1.1219482482175678, y: 0.761968980751655},
        2: {x: 1.5668569046241632, y: 0.2362958661793019},
        3: {x: -0.2261150994411288, y: 0.40013848230763055},
        4: {x: 0.18940040279745846, y: -0.3176088516928669}
      }
    );
  });
});
