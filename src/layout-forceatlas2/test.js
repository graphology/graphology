/**
 * Graphology FA2 Layout Unit Tests
 * =================================
 */
var assert = require('assert'),
    Graph = require('graphology');

var helpers = require('./helpers.js'),
    layout = require('./index.js');

var seedrandom = require('seedrandom');

var rng = function() {
  return seedrandom('test');
};

var clusters = require('graphology-generators/random/clusters');
var empty = require('graphology-generators/classic/empty');

describe('graphology-layout-forceatlas2', function() {

  describe('helpers', function() {

    describe('#.graphToByteArrays', function() {

      it('should work as expected.', function() {
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

        for (var node in data)
          graph.addNode(node, data[node]);

        graph.addEdge('John', 'Martha');
        graph.addEdge('Martha', 'Ada', {weight: 3});

        var matrices = helpers.graphToByteArrays(graph);

        assert.deepEqual(
          Array.from(matrices.nodes),
          [
            3, 4, 0, 0, 0, 0, 2, 1, 4, 0,
            10, 5, 0, 0, 0, 0, 3, 1, 1, 0,
            23, -2, 0, 0, 0, 0, 2, 1, 1, 0
          ]
        );

        assert.deepEqual(
          Array.from(matrices.edges),
          [
            0, 10, 0,
            10, 20, 3
          ]
        );
      });
    });

    describe('#.collectLayoutChanges', function() {

      it('should work as expected.', function() {
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

        for (var node in data)
          graph.addNode(node, data[node]);

        var positions = helpers.collectLayoutChanges(graph, [
          4, 5, 0, 0, 0, 0, 2, 1, 4, 0,
          11, 6, 0, 0, 0, 0, 3, 1, 1, 0,
          24, -1, 0, 0, 0, 0, 2, 1, 1, 0
        ]);

        assert.deepEqual(positions, {
          John: {x: 4, y: 5},
          Martha: {x: 11, y: 6},
          Ada: {x: 24, y: -1}
        });
      });
    });

    describe('#.assignLayoutChanges', function() {

      it('should work as expected.', function() {
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

        for (var node in data)
          graph.addNode(node, data[node]);

        helpers.assignLayoutChanges(graph, [
          4, 5, 0, 0, 0, 0, 2, 1, 4, 0,
          11, 6, 0, 0, 0, 0, 3, 1, 1, 0,
          24, -1, 0, 0, 0, 0, 2, 1, 1, 0
        ]);

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
    });
  });

  describe('synchronous', function() {

    it('should throw if the graph is invalid.', function() {
      assert.throws(function() {
        layout(null);
      }, /graphology/);
    });

    it('should throw if iterations are not valid.', function() {
      assert.throws(function() {
        layout(new Graph(), {});
      }, /number/);

      assert.throws(function() {
        layout(new Graph(), -34);
      }, /positive/);
    });

    it('should throw if settings are invalid.', function() {

      assert.throws(function() {
        layout(new Graph(), {iterations: 5, settings: {linLogMode: 45}});
      }, /linLogMode/);
    });
  });

  describe('#.inferSettings', function() {

    it('should correctly infer settings from given graph.', function() {
      var smallGraph = empty(Graph, 250),
          bigGraph = empty(Graph, 5000);

      var settings = layout.inferSettings(smallGraph);

      assert.strictEqual(settings.barnesHutOptimize, false);

      settings = layout.inferSettings(bigGraph);

      assert.strictEqual(settings.barnesHutOptimize, true);
    });

    it('should work if given the order of the graph.', function() {
      var settings = layout.inferSettings(250);

      assert.strictEqual(settings.barnesHutOptimize, false);

      settings = layout.inferSettings(5000);

      assert.strictEqual(settings.barnesHutOptimize, true);
    });
  });

  describe('Barnes-Hut optimization', function() {
    it('should converge on a large random graph with small coordinate values', function() {
      // Creating a random clustered graph
      var graph = clusters(Graph, {
        order: 1000,
        size: 5000,
        clusters: 5,
        rng: rng()
      });
      graph.nodes().forEach(function(n, i) {
        graph.setNodeAttribute(n, 'x', i % 2 ? -1 : 1);
        graph.setNodeAttribute(n, 'y', i % 2 ? -1 : 1);
      });
      assert.doesNotThrow(function() {
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
