/**
 * Graphology FA2 Layout Unit Tests
 * =================================
 */
var assert = require('assert');
var Graph = require('graphology');

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

        assert.deepEqual(
          Array.from(matrices.nodes),
          [
            3, 4, 0, 0, 0, 0, 2, 1, 4, 0, 10, 5, 0, 0, 0, 0, 3, 1, 1, 0, 23, -2,
            0, 0, 0, 0, 2, 1, 1, 0
          ]
        );

        assert.deepEqual(Array.from(matrices.edges), [0, 10, 1, 10, 20, 3]);

        matrices = helpers.graphToByteArrays(graph, function () {
          return 1;
        });

        assert.deepEqual(Array.from(matrices.edges), [0, 10, 1, 10, 20, 1]);
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

        assert.deepEqual(positions, {
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

        assert.deepEqual(positions, {
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

        assert.deepEqual(positions, {
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

        assert.deepEqual(
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

      var result1 = layout(graph, {iterations: 5});

      assert.deepStrictEqual(result1, {
        1: {x: 85.54732513427734, y: -69.85941314697266},
        2: {x: 75.4516830444336, y: -57.49724578857422},
        3: {x: 73.4800796508789, y: -54.5100212097168},
        4: {x: 105.44530487060547, y: -97.62918090820312}
      });

      var result2 = layout(graph, {iterations: 5, getEdgeWeight: 'weight'});

      assert.deepStrictEqual(result2, {
        1: {x: 77.65608215332031, y: -59.46234130859375},
        2: {x: 68.56433868408203, y: -47.37741470336914},
        3: {x: 72.25889587402344, y: -52.28172302246094},
        4: {x: 101.06941986083984, y: -91.40707397460938}
      });

      var result3 = layout(graph, {
        iterations: 5
      });

      assert.deepStrictEqual(result3, result1);

      var result4 = layout(graph, {
        iterations: 5,
        getEdgeWeight: 'custom'
      });

      assert.deepStrictEqual(result4, {
        1: {x: 159.5399169921875, y: 4.618535041809082},
        2: {x: -64.91708374023438, y: -33.298091888427734},
        3: {x: 51.02663803100586, y: -9.252131462097168},
        4: {x: 120.32330322265625, y: -118.17190551757812}
      });
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
