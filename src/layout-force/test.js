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
      1: {x: 0.980523899693169, y: 0.5583505760499181},
      2: {x: 1.2258878567135871, y: 0.2750873496064485},
      3: {x: 0.10131665093444275, y: 0.32840008186781516},
      4: {x: 0.3446480643101768, y: -0.08093067393385794}
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
        1: {x: 0.980523899693169, y: 0.5583505760499181},
        2: {x: 1.2258878567135871, y: 0.2750873496064485},
        3: {x: 0.10131665093444275, y: 0.32840008186781516},
        4: {x: 0.3446480643101768, y: -0.08093067393385794}
      }
    );
  });
});
