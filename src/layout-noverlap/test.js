/**
 * Graphology Noverlap Layout Unit Tests
 * ======================================
 */
var assert = require('assert'),
  Graph = require('graphology');

var helpers = require('./helpers.js'),
  layout = require('./index.js');

// var seedrandom = require('seedrandom');

// var rng = function() {
//   return seedrandom('test');
// };

// var clusters = require('graphology-generators/random/clusters');
// var empty = require('graphology-generators/classic/empty');

describe('graphology-layout-forceatlas2', function () {
  describe('helpers', function () {
    describe('#.graphToByteArray', function () {
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

        var matrix = helpers.graphToByteArray(graph);

        assert.deepEqual(Array.from(matrix), [3, 4, 4, 10, 5, 1, 23, -2, 1]);
      });

      it('should work when given a reducer.', function () {
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

        var matrix = helpers.graphToByteArray(graph, function (_, attr) {
          return {
            x: attr.x * 10,
            y: attr.y * 100,
            size: 2
          };
        });

        assert.deepEqual(
          Array.from(matrix),
          [30, 400, 2, 100, 500, 2, 230, -200, 2]
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
          [4, 5, 4, 11, 6, 1, 24, -1, 1]
        );

        assert.deepEqual(positions, {
          John: {x: 4, y: 5},
          Martha: {x: 11, y: 6},
          Ada: {x: 24, y: -1}
        });

        function reducer(_, pos) {
          return {
            x: pos.x * 10,
            y: pos.y * 10
          };
        }

        positions = helpers.collectLayoutChanges(
          graph,
          [4, 5, 4, 11, 6, 1, 24, -1, 1],
          reducer
        );

        assert.deepEqual(positions, {
          John: {x: 40, y: 50},
          Martha: {x: 110, y: 60},
          Ada: {x: 240, y: -10}
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

        helpers.assignLayoutChanges(graph, [4, 5, 4, 11, 6, 1, 24, -1, 1]);

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

        function reducer(_, pos) {
          return {
            x: pos.x * 10,
            y: pos.y * 10
          };
        }

        helpers.assignLayoutChanges(
          graph,
          [4, 5, 4, 11, 6, 1, 24, -1, 1],
          reducer
        );

        positions = {
          John: graph.getNodeAttributes('John'),
          Martha: graph.getNodeAttributes('Martha'),
          Ada: graph.getNodeAttributes('Ada')
        };

        assert.deepEqual(positions, {
          John: {x: 40, y: 50},
          Martha: {x: 110, y: 60},
          Ada: {x: 240, y: -10}
        });
      });
    });
  });

  describe('synchronous', function () {
    it('should throw if the graph is invalid.', function () {
      assert.throws(function () {
        layout(null);
      }, /graphology/);
    });

    it('should throw if max iterations are not valid.', function () {
      assert.throws(function () {
        layout(new Graph(), -34);
      }, /positive/);
    });

    it('should throw if settings are invalid.', function () {
      assert.throws(function () {
        layout(new Graph(), {settings: {speed: -10}});
      }, /speed/);
    });

    it('should work properly.', function () {
      var graph = new Graph();

      graph.addNode('John', {x: 0, y: 1, size: 4});
      graph.addNode('Mary', {x: 1, y: 1, size: 5});
      graph.addNode('Lala', {x: 0.5, y: 0.5, size: 3});

      var result = layout(graph);

      assert.deepEqual(result, {
        John: {x: 0, y: 1},
        Mary: {x: 19, y: 1},
        Lala: {x: -6.163533687591553, y: -16.03751564025879}
      });
    });

    it('should work properly with a reducers.', function () {
      var graph = new Graph();

      graph.addNode('John', {x: 0, y: 1, size: 4});
      graph.addNode('Mary', {x: 1, y: 1, size: 5});
      graph.addNode('Lala', {x: 0.5, y: 0.5, size: 3});

      function inputReducer(_, attr) {
        return {
          x: attr.x * 10,
          y: attr.y * 10,
          size: attr.size * 10
        };
      }

      function outputReducer(_, pos) {
        return {
          x: pos.x + 20,
          y: pos.y + 20
        };
      }

      var result = layout(graph, {
        inputReducer: inputReducer,
        outputReducer: outputReducer
      });

      assert.deepEqual(result, {
        John: {x: 20, y: 30},
        Mary: {x: 128.40000915527344, y: 30},
        Lala: {x: 1.1669960021972656, y: -54.814414978027344}
      });
    });
  });
});
