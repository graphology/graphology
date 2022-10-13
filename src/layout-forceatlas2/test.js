/**
 * Graphology FA2 Layout Unit Tests
 * =================================
 */
var assert = require('assert');
var Graph = require('graphology');
var toUndirected = require('graphology-operators/to-undirected');
var randomLayout = require('graphology-layout/random');
var layoutUtils = require('graphology-layout/utils');

var helpers = require('./helpers.js');
var layout = require('./index.js');

var seedrandom = require('seedrandom');

var rng = function () {
  return seedrandom('test');
};

var clusters = require('graphology-generators/random/clusters');
var empty = require('graphology-generators/classic/empty');

describe('graphology-layout-forceatlas2', function () {
  describe('helpers', function () {
    describe('#.graphToByteArrays', function () {
      it('should work as expected.', function () {
        var graph = new Graph();

        var data = {
          John: {
            size: 4,
            x: 3,
            y: 4
          },
          Martha: {
            x: 10,
            y: 5
          },
          Ada: {
            x: 23,
            y: -2
          }
        };

        for (var node in data) graph.addNode(node, data[node]);

        graph.addEdge('John', 'Martha');
        graph.addEdge('Martha', 'Ada', {weight: 3});

        var matrices = helpers.graphToByteArrays(graph, function (_, attr) {
          return attr.weight || 1;
        });

        assert.deepStrictEqual(
          Array.from(matrices.nodes),
          [
            3, 4, 0, 0, 0, 0, 2, 1, 4, 0, 10, 5, 0, 0, 0, 0, 5, 1, 1, 0, 23, -2,
            0, 0, 0, 0, 4, 1, 1, 0
          ]
        );

        assert.deepStrictEqual(
          Array.from(matrices.edges),
          [0, 10, 1, 10, 20, 3]
        );

        matrices = helpers.graphToByteArrays(graph, function () {
          return 1;
        });

        assert.deepStrictEqual(
          Array.from(matrices.edges),
          [0, 10, 1, 10, 20, 1]
        );
      });
    });

    describe('#.collectLayoutChanges', function () {
      it('should work as expected.', function () {
        var graph = new Graph();

        var data = {
          John: {
            size: 4,
            x: 3,
            y: 4
          },
          Martha: {
            x: 10,
            y: 5
          },
          Ada: {
            x: 23,
            y: -2
          }
        };

        for (var node in data) graph.addNode(node, data[node]);

        var positions = helpers.collectLayoutChanges(
          graph,
          [
            4, 5, 0, 0, 0, 0, 2, 1, 4, 0, 11, 6, 0, 0, 0, 0, 3, 1, 1, 0, 24, -1,
            0, 0, 0, 0, 2, 1, 1, 0
          ]
        );

        assert.deepStrictEqual(positions, {
          John: {x: 4, y: 5},
          Martha: {x: 11, y: 6},
          Ada: {x: 24, y: -1}
        });
      });

      it('should work as expected with a custom outputReducer.', function () {
        var graph = new Graph();

        var data = {
          John: {
            size: 4,
            x: 3,
            y: 4
          },
          Martha: {
            x: 10,
            y: 5
          },
          Ada: {
            x: 23,
            y: -2
          }
        };

        for (var node in data) graph.addNode(node, data[node]);

        var positions = helpers.collectLayoutChanges(
          graph,
          [
            4, 5, 0, 0, 0, 0, 2, 1, 4, 0, 11, 6, 0, 0, 0, 0, 3, 1, 1, 0, 24, -1,
            0, 0, 0, 0, 2, 1, 1, 0
          ],
          function (n, attributes) {
            return Object.assign({}, attributes, {y: n === 'John' ? 1 : 2});
          }
        );

        assert.deepStrictEqual(positions, {
          John: {x: 4, y: 1},
          Martha: {x: 11, y: 2},
          Ada: {x: 24, y: 2}
        });
      });
    });

    describe('#.assignLayoutChanges', function () {
      it('should work as expected.', function () {
        var graph = new Graph();

        var data = {
          John: {
            x: 3,
            y: 4
          },
          Martha: {
            x: 10,
            y: 5
          },
          Ada: {
            x: 23,
            y: -2
          }
        };

        for (var node in data) graph.addNode(node, data[node]);

        helpers.assignLayoutChanges(
          graph,
          [
            4, 5, 0, 0, 0, 0, 2, 1, 4, 0, 11, 6, 0, 0, 0, 0, 3, 1, 1, 0, 24, -1,
            0, 0, 0, 0, 2, 1, 1, 0
          ]
        );

        var positions = {
          John: graph.getNodeAttributes('John'),
          Martha: graph.getNodeAttributes('Martha'),
          Ada: graph.getNodeAttributes('Ada')
        };

        assert.deepStrictEqual(positions, {
          John: {x: 4, y: 5},
          Martha: {x: 11, y: 6},
          Ada: {x: 24, y: -1}
        });
      });

      it('should work as expected with a custom outputReducer.', function () {
        var graph = new Graph();

        var data = {
          John: {
            x: 3,
            y: 4
          },
          Martha: {
            x: 10,
            y: 5
          },
          Ada: {
            x: 23,
            y: -2
          }
        };

        for (var node in data) graph.addNode(node, data[node]);

        helpers.assignLayoutChanges(
          graph,
          [
            4, 5, 0, 0, 0, 0, 2, 1, 4, 0, 11, 6, 0, 0, 0, 0, 3, 1, 1, 0, 24, -1,
            0, 0, 0, 0, 2, 1, 1, 0
          ],
          function (n, attributes) {
            return Object.assign({}, attributes, {y: n === 'John' ? 1 : 2});
          }
        );

        assert.deepStrictEqual(
          {
            John: graph.getNodeAttributes('John'),
            Martha: graph.getNodeAttributes('Martha'),
            Ada: graph.getNodeAttributes('Ada')
          },
          {
            John: {x: 4, y: 1},
            Martha: {x: 11, y: 2},
            Ada: {x: 24, y: 2}
          }
        );
      });
    });
  });

  describe('synchronous', function () {
    it('should throw if the graph is invalid.', function () {
      assert.throws(function () {
        layout(null);
      }, /graphology/);
    });

    it('should throw if iterations are not valid.', function () {
      assert.throws(function () {
        layout(new Graph(), {});
      }, /number/);

      assert.throws(function () {
        layout(new Graph(), -34);
      }, /positive/);
    });

    it('should throw if settings are invalid.', function () {
      assert.throws(function () {
        layout(new Graph(), {iterations: 5, settings: {linLogMode: 45}});
      }, /linLogMode/);

      assert.throws(function () {
        layout(new Graph(), {
          iterations: 5,
          settings: {edgeWeightInfluence: 'test'}
        });
      }, /edgeWeightInfluence/);
    });

    it('should return correct results.', function () {
      var graph = new Graph();

      graph.addNode(1, {x: -12, y: 1});
      graph.addNode(2, {x: 100, y: 26});
      graph.addNode(3, {x: 34, y: -45});
      graph.addNode(4, {x: 300, y: -329});

      graph.addEdge(1, 2, {custom: 34});
      graph.addEdge(2, 3, {weight: 2});
      graph.addEdge(3, 1, {weight: 3});
      graph.addEdge(1, 4);

      var result1 = layout(graph, {iterations: 5, getEdgeWeight: null});

      assert.deepStrictEqual(result1, {
        1: {x: 85.54732513427734, y: -69.85941314697266},
        2: {x: 75.4516830444336, y: -57.49724578857422},
        3: {x: 73.4800796508789, y: -54.5100212097168},
        4: {x: 105.44530487060547, y: -97.62918090820312}
      });

      var result2 = layout(graph, {iterations: 5, getEdgeWeight: 'weight'});

      assert.deepStrictEqual(result2, {
        1: {x: 71.51148223876953, y: -56.78447723388672},
        2: {x: 62.813716888427734, y: -47.99095916748047},
        3: {x: 62.555992126464844, y: -44.131656646728516},
        4: {x: 94.73125457763672, y: -88.1897201538086}
      });

      var result3 = layout(graph, {
        iterations: 5
      });

      assert.deepStrictEqual(result2, result3);

      var result4 = layout(graph, {
        iterations: 5,
        getEdgeWeight: 'custom'
      });

      assert.deepStrictEqual(result4, {
        1: {x: 48.25226974487305, y: -2.7049994468688965},
        2: {x: 46.994510650634766, y: 1.001150369644165},
        3: {x: 37.2054443359375, y: -0.9540546536445618},
        4: {x: 77.8389663696289, y: -37.230648040771484}
      });
    });

    it('edges with weight = 0 should have to influence.', function () {
      var graph = new Graph();

      graph.mergeEdge(0, 1);
      graph.mergeEdge(1, 2);
      graph.mergeEdge(2, 0, {weight: 0});
      graph.mergeEdge(2, 3);
      graph.mergeEdge(0, 3, {weight: 0});
      graph.mergeEdge(1, 3);
      graph.mergeEdge(0, 5, {weight: 0});

      randomLayout.assign(graph);

      assert.strictEqual(graph.order, 5);
      assert.strictEqual(graph.size, 7);

      var graphWithoutIrrelevantEdges = graph.emptyCopy();

      graph.forEachEdge(function (_, attr, s, t) {
        if (attr.weight === 0) return;
        graphWithoutIrrelevantEdges.addEdge(s, t);
      });

      assert.strictEqual(graphWithoutIrrelevantEdges.order, 5);
      assert.strictEqual(graphWithoutIrrelevantEdges.size, 4);

      assert.deepStrictEqual(
        layout(graph, {iterations: 5}),
        layout(graphWithoutIrrelevantEdges, {iterations: 5})
      );
    });

    it('directed graphs should be treated like multigraphs.', function () {
      var graph = new Graph();
      graph.mergeEdge(0, 1);
      graph.mergeEdge(1, 0);
      graph.mergeEdge(0, 2);
      graph.mergeEdge(0, 3);
      graph.mergeEdge(3, 4);
      graph.mergeEdge(4, 3);
      graph.mergeEdge(4, 5);

      var multiGraph = new Graph({multi: true, type: 'undirected'});
      multiGraph.mergeEdge(0, 1);
      multiGraph.mergeEdge(0, 1);
      multiGraph.mergeEdge(0, 2);
      multiGraph.mergeEdge(0, 3);
      multiGraph.mergeEdge(3, 4);
      multiGraph.mergeEdge(3, 4);
      multiGraph.mergeEdge(4, 5);

      var l = randomLayout(graph);
      layoutUtils.assignLayout(graph, l);
      layoutUtils.assignLayout(multiGraph, l);

      assert.notDeepStrictEqual(
        layout(graph, {iterations: 5}),
        layout(toUndirected(graph), {iterations: 5})
      );

      assert.deepStrictEqual(
        layout(graph, {iterations: 5}),
        layout(multiGraph, {iterations: 5})
      );
    });
  });

  describe('#.inferSettings', function () {
    it('should correctly infer settings from given graph.', function () {
      var smallGraph = empty(Graph, 250),
        bigGraph = empty(Graph, 5000);

      var settings = layout.inferSettings(smallGraph);

      assert.strictEqual(settings.barnesHutOptimize, false);

      settings = layout.inferSettings(bigGraph);

      assert.strictEqual(settings.barnesHutOptimize, true);
    });

    it('should work if given the order of the graph.', function () {
      var settings = layout.inferSettings(250);

      assert.strictEqual(settings.barnesHutOptimize, false);

      settings = layout.inferSettings(5000);

      assert.strictEqual(settings.barnesHutOptimize, true);
    });
  });

  describe('Barnes-Hut optimization', function () {
    it('should converge on a large random graph with small coordinate values', function () {
      // Creating a random clustered graph
      var graph = clusters(Graph, {
        order: 1000,
        size: 5000,
        clusters: 5,
        rng: rng()
      });
      graph.nodes().forEach(function (n, i) {
        graph.setNodeAttribute(n, 'x', i % 2 ? -1 : 1);
        graph.setNodeAttribute(n, 'y', i % 2 ? -1 : 1);
      });
      assert.doesNotThrow(function () {
        layout(graph, {
          settings: {
            barnesHutOptimize: true
          },
          iterations: 10
        });
      }, /FATAL/);
    });
  });
});
