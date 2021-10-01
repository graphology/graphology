/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert'),
    Graph = require('graphology'),
    seedrandom = require('seedrandom'),
    connectedComponents = require('graphology-components').connectedComponents;

var UndirectedGraph = Graph.UndirectedGraph,
    DirectedGraph = Graph.DirectedGraph;

var rng = function() {
  return seedrandom('test');
};

var classic = require('./classic'),
    community = require('./community'),
    random = require('./random'),
    small = require('./small'),
    social = require('./social');

describe('graphology-generators', function() {

  describe('classic', function() {

    describe('#.complete', function() {

      it('should throw if the provided constructor is invalid.', function() {
        assert.throws(function() {
          classic.complete(Array);
        }, /constructor/);
      });

      it('should return a complete graph.', function() {
        var undirectedGraph = classic.complete(UndirectedGraph, 5);

        assert.strictEqual(undirectedGraph.order, 5);
        assert.strictEqual(undirectedGraph.size, 5 * (5 - 1) / 2);

        var directedGraph = classic.complete(DirectedGraph, 5);

        assert.strictEqual(directedGraph.order, 5);
        assert.strictEqual(directedGraph.size, 5 * (5 - 1));

        var graph = classic.complete(Graph, 5);

        assert.strictEqual(graph.order, 5);
        assert.strictEqual(graph.size, (5 * (5 - 1) / 2) + (5 * (5 - 1)));
      });
    });

    describe('#.empty', function() {

      it('should throw if the provided constructor is invalid.', function() {
        assert.throws(function() {
          classic.empty(Array);
        }, /constructor/);
      });

      it('should return an empty graph.', function() {
        var emptyGraph = classic.empty(Graph, 6);

        assert.strictEqual(emptyGraph.order, 6);
        assert.strictEqual(emptyGraph.size, 0);
      });
    });

    describe('#.ladder', function() {

      it('should throw if the provided constructor is invalid.', function() {
        assert.throws(function() {
          classic.ladder(Array);
        }, /constructor/);
      });

      it('should return a valid ladder graph.', function() {
        var length = 50;

        var ladder = classic.ladder(UndirectedGraph, length);

        assert.strictEqual(ladder.order, length * 2);
        assert.strictEqual(ladder.size, (length - 1) * 2 + length);
      });
    });

    describe('#.path', function() {
      it('should throw if the provided constructor is invalid.', function() {
        assert.throws(function() {
          classic.path(Array);
        }, /constructor/);
      });

      it('should return a complete graph.', function() {
        var graph = classic.path(Graph, 5);

        assert.strictEqual(graph.order, 5);
        assert.strictEqual(graph.size, 4);

        var adj = graph.edges().map(function(e) {
          return graph.extremities(e);
        });

        assert.deepEqual(adj, [[0, 1], [1, 2], [2, 3], [3, 4]]);
      });
    });
  });

  describe('community', function() {

    describe('#.caveman', function() {
      it('should throw if the provided constructor is invalid.', function() {
        assert.throws(function() {
          community.caveman(Array);
        }, /constructor/);
      });

      it('should return a caveman graph.', function() {
        var graph = community.caveman(UndirectedGraph, 6, 8);

        assert.strictEqual(graph.order, 6 * 8);
        assert.strictEqual(graph.size, 168);

        var components = connectedComponents(graph);

        assert.strictEqual(components.length, 6);
      });
    });

    describe('#.connectedCaveman', function() {
      it('should throw if the provided constructor is invalid.', function() {
        assert.throws(function() {
          community.connectedCaveman(Array);
        }, /constructor/);
      });

      it('should return a connected caveman graph.', function() {
        var graph = community.connectedCaveman(UndirectedGraph, 6, 8);

        assert.strictEqual(graph.order, 6 * 8);
        assert.strictEqual(graph.size, 168);

        var components = connectedComponents(graph);

        assert.strictEqual(components.length, 1);
      });
    });
  });

  describe('random', function() {

    describe('#.clusters', function() {
      it('should throw if the provided constructor is invalid.', function() {
        assert.throws(function() {
          random.clusters(Array);
        }, /constructor/);
      });

      it('should throw if the options are invalid.', function() {
        assert.throws(function() {
          random.clusters(UndirectedGraph);
        }, /order/);

        assert.throws(function() {
          random.clusters(UndirectedGraph, {clusterDensity: null});
        }, /clusterDensity/);

        assert.throws(function() {
          random.clusters(UndirectedGraph, {rng: true});
        }, /rng/);

        assert.throws(function() {
          random.clusters(UndirectedGraph, {clusterDensity: 0.5});
        }, /order/);

        assert.throws(function() {
          random.clusters(UndirectedGraph, {clusterDensity: -10});
        }, /clusterDensity/);

        assert.throws(function() {
          random.clusters(UndirectedGraph, {clusterDensity: 0.5, order: 30});
        }, /size/);

        assert.throws(function() {
          random.clusters(UndirectedGraph, {clusterDensity: 0.5, order: -30});
        }, /order/);

        assert.throws(function() {
          random.clusters(UndirectedGraph, {clusterDensity: 0.5, order: 30, size: 100});
        }, /clusters/);

        assert.throws(function() {
          random.clusters(UndirectedGraph, {clusterDensity: 0.5, order: 30, size: -500});
        }, /size/);

        assert.throws(function() {
          random.clusters(UndirectedGraph, {clusterDensity: 0.5, order: 30, size: 100, clusters: -4});
        }, /clusters/);
      });

      it('should generate a correct graph.', function() {
        var graph = random.clusters(DirectedGraph, {
          order: 5,
          size: 20,
          clusters: 3,
          rng: rng()
        });

        assert.strictEqual(graph.order, 5);
        assert.strictEqual(graph.size, 6);
      });
    });

    describe('#.erdosRenyi', function() {
      var sparse = random.erdosRenyi.sparse;

      it('should throw if the provided constructor is invalid.', function() {
        assert.throws(function() {
          random.erdosRenyi(Array);
        }, /constructor/);

        assert.throws(function() {
          sparse(Array);
        }, /constructor/);
      });

      it('should return a graph without edges if probability is 0.', function() {
        var graph = random.erdosRenyi(UndirectedGraph, {order: 5, probability: 0});

        assert.strictEqual(graph.order, 5);
        assert.strictEqual(graph.size, 0);
        assert.deepEqual(graph.nodes(), [0, 1, 2, 3, 4]);

        graph = sparse(UndirectedGraph, {order: 5, probability: 0});

        assert.strictEqual(graph.order, 5);
        assert.strictEqual(graph.size, 0);
        assert.deepEqual(graph.nodes(), [0, 1, 2, 3, 4]);
      });

      it('should return a binomial graph.', function() {

        // Undirected
        var undirectedGraph = random.erdosRenyi(UndirectedGraph, {order: 5, probability: 0.5, rng: rng()});

        assert.strictEqual(undirectedGraph.size, 7);
        assert.strictEqual(undirectedGraph.order, 5);

        undirectedGraph = sparse(UndirectedGraph, {order: 5, probability: 0.5, rng: rng()});

        assert.strictEqual(undirectedGraph.size, 4);
        assert.strictEqual(undirectedGraph.order, 5);

        // Directed
        var directedGraph = random.erdosRenyi(DirectedGraph, {order: 5, probability: 0.5, rng: rng()});

        assert.strictEqual(directedGraph.size, 11);
        assert.strictEqual(directedGraph.order, 5);

        directedGraph = sparse(DirectedGraph, {order: 5, probability: 0.5, rng: rng()});

        assert.strictEqual(directedGraph.size, 11);
        assert.strictEqual(directedGraph.order, 5);

        // Mixed
        var graph = random.erdosRenyi(Graph, {order: 5, probability: 0.5, rng: rng()});

        assert.strictEqual(graph.size, 15);
        assert.strictEqual(graph.order, 5);

        // Sparse
        graph = sparse(Graph, {order: 5, probability: 0.5, rng: rng()});

        assert.strictEqual(graph.size, 14);
        assert.strictEqual(graph.order, 5);

        // Approximate size
        graph = random.erdosRenyi(Graph, {order: 5, approximateSize: 10, rng: rng()});

        assert.strictEqual(graph.size, 8);
        assert.strictEqual(graph.order, 5);

        graph = sparse(Graph, {order: 5, approximateSize: 10, rng: rng()});

        assert.strictEqual(graph.size, 10);
        assert.strictEqual(graph.order, 5);
      });
    });

    describe('#.girvanNewman', function() {

      it('should throw if the provided constructor is invalid.', function() {
        assert.throws(function() {
          random.girvanNewman(Array);
        }, /constructor/);
      });

      it('should return the expected graph.', function() {
        var graph = random.girvanNewman(Graph, {zOut: 4, rng: rng()});

        assert.strictEqual(graph.order, 128);
        assert.strictEqual(graph.size, 1042);
      });
    });
  });

  describe('small', function() {

    describe('#.krackhardtKite', function() {
      it('should throw if the provided constructor is invalid.', function() {
        assert.throws(function() {
          small.krackhardtKite(Array);
        }, /constructor/);
      });

      it('should return Krackhard\'s kite graph.', function() {
        var graph = small.krackhardtKite(UndirectedGraph);

        assert.strictEqual(graph.order, 10);
        assert.strictEqual(graph.size, 18);
      });
    });
  });

  describe('social', function() {

    describe('#.karate', function() {
      it('should throw if the provided constructor is invalid.', function() {
        assert.throws(function() {
          social.karateClub(Array);
        }, /constructor/);
      });

      it('should return Zachary\'s karate club graph.', function() {
        var graph = social.karateClub(Graph);

        assert.strictEqual(graph.order, 34);
        assert.strictEqual(graph.size, 78);
      });
    });

    describe('#.florentineFamilies', function() {
      it('should throw if the provided constructor is invalid.', function() {
        assert.throws(function() {
          social.florentineFamilies(Array);
        }, /constructor/);
      });

      it('should return Florentine families graph.', function() {
        var graph = social.florentineFamilies(Graph);

        assert.strictEqual(graph.order, 15);
        assert.strictEqual(graph.size, 20);
      });
    });
  });
});
