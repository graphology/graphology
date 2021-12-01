/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert');
var Graph = require('graphology');
var erdosRenyi = require('graphology-generators/random/erdos-renyi');
var disjointUnion = require('graphology-operators/disjoint-union');
var range = require('lodash/range');
var random = require('pandemonium/random');
var sortBy = require('lodash/sortBy');
var takeWhile = require('lodash/takeWhile');
var isEqual = require('lodash/isEqual');
var lib = require('./');
var subgraph = require('graphology-operators/subgraph');
var isGraph = require('graphology-utils/is-graph');
var assertions = require('graphology-assertions');

var areSameGraphs = assertions.areSameGraphs;
var areSameGraphsDeep = assertions.areSameGraphsDeep;

var countConnectedComponents = lib.countConnectedComponents;
var connectedComponents = lib.connectedComponents;
var largestConnectedComponent = lib.largestConnectedComponent;
var stronglyConnectedComponents = lib.stronglyConnectedComponents;
var largestConnectedComponentSubgraph = lib.largestConnectedComponentSubgraph;
var cropToLargestConnectedComponent = lib.cropToLargestConnectedComponent;
var forEachConnectedComponent = lib.forEachConnectedComponent;
var forEachConnectedComponentOrder = lib.forEachConnectedComponentOrder;
var forEachConnectedComponentOrderWithEdgeFilter =
  lib.forEachConnectedComponentOrderWithEdgeFilter;

var sortComponents = function (components) {
  components.forEach(function (c) {
    c.sort(function (a, b) {
      return a - b;
    });
  });
  components.sort(function (a, b) {
    return a[0] - b[0];
  });
};

function addNodesFrom(graph, nodes) {
  nodes.forEach(function (node) {
    graph.addNode(node);
  });
}

describe('graphology-components', function () {
  describe('#.connectedComponents', function () {
    it('should throw if given an invalid graph.', function () {
      assert.throws(function () {
        connectedComponents(null);
      }, /graphology/);
    });

    it('should handle empty graphs.', function () {
      var graph = new Graph();

      assert.deepStrictEqual(connectedComponents(graph), []);
    });

    it('should handle graphs without edges.', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);

      assert.deepStrictEqual(connectedComponents(graph), [['1'], ['2'], ['3']]);
    });

    it('should return the correct components.', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3, 4, 5, 6, 7]);
      graph.addEdge(1, 2);
      graph.addEdge(2, 3);
      graph.addEdge(3, 4);
      graph.addEdge(2, 4);

      graph.addEdge(5, 6);

      var components = connectedComponents(graph);
      assert.deepStrictEqual(components, [
        ['1', '2', '4', '3'],
        ['5', '6'],
        ['7']
      ]);

      assert.strictEqual(components.length, countConnectedComponents(graph));
    });

    it('should also work with self loops.', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);
      graph.addEdge(1, 2);
      graph.addEdge(1, 1);

      var components = connectedComponents(graph);

      assert.deepStrictEqual(components, [['1', '2'], ['3']]);

      assert.strictEqual(components.length, countConnectedComponents(graph));
    });

    it('should work in the directed case.', function () {
      var graph = new Graph({type: 'directed'});
      graph.addNode(1);
      graph.mergeEdge(1, 4);
      graph.mergeEdge(1, 5);
      graph.mergeEdge(4, 5);
      graph.mergeEdge(2, 1);
      graph.mergeEdge(2, 3);

      var components = connectedComponents(graph);

      assert.strictEqual(components.length, 1);

      var component = components[0];
      component.sort();

      assert.deepStrictEqual(component, ['1', '2', '3', '4', '5']);

      assert.strictEqual(components.length, countConnectedComponents(graph));
    });
  });

  describe('#.largestConnectedComponent', function () {
    it('should throw if given an invalid graph.', function () {
      assert.throws(function () {
        largestConnectedComponent(null);
      }, /graphology/);
    });

    it('should handle empty graphs.', function () {
      var graph = new Graph();

      assert.deepStrictEqual(largestConnectedComponent(graph), []);
    });

    it('should handle graphs without edges.', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);

      assert.deepStrictEqual(largestConnectedComponent(graph), ['1']);
    });

    it('should return the correct components.', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3, 4, 5, 6, 7]);
      graph.addEdge(1, 2);
      graph.addEdge(2, 3);
      graph.addEdge(3, 4);
      graph.addEdge(2, 4);

      graph.addEdge(5, 6);

      var component = largestConnectedComponent(graph);
      assert.deepStrictEqual(component, ['1', '2', '4', '3']);
    });

    it('should also work with self loops.', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);
      graph.addEdge(1, 2);
      graph.addEdge(1, 1);

      var component = largestConnectedComponent(graph);

      assert.deepStrictEqual(component, ['1', '2']);
    });

    it('should return correct results.', function () {
      var graph = range(8)
        .map(function () {
          return erdosRenyi.sparse(Graph.UndirectedGraph, {
            order: random(10, 100),
            probability: 0.05
          });
        })
        .reduce(function (a, b) {
          return disjointUnion(a, b);
        });

      var components = sortBy(connectedComponents(graph), function (c) {
        return c.length;
      }).reverse();

      components = takeWhile(components, function (c) {
        return c.length === components[0].length;
      });

      var largestComponent = largestConnectedComponent(graph);

      assert(
        components.some(function (c) {
          return isEqual(c, largestComponent);
        })
      );
    });
  });

  describe('#.largestConnectedComponentSubgraph', function () {
    it('should throw if given an invalid graph.', function () {
      assert.throws(function () {
        largestConnectedComponentSubgraph(null);
      }, /graphology/);
    });

    it('should handle empty graphs.', function () {
      var graph = new Graph();

      var largestComponentSubgraph = largestConnectedComponentSubgraph(graph);

      assert.strictEqual(largestComponentSubgraph.size, 0);
      assert.strictEqual(largestComponentSubgraph.order, 0);
    });

    it('should handle graphs without edges.', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);

      var resultSubgraph = new Graph();
      addNodesFrom(resultSubgraph, [1]);

      var largestComponentSubgraph = largestConnectedComponentSubgraph(graph);

      assert.strictEqual(largestComponentSubgraph.size, resultSubgraph.size);
      assert.strictEqual(largestComponentSubgraph.order, resultSubgraph.order);
    });

    it('should return a subgraph with the correct components.', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3, 4, 5, 6, 7]);
      graph.addEdge(1, 2);
      graph.addEdge(2, 3);
      graph.addEdge(3, 4);
      graph.addEdge(2, 4);

      graph.addEdge(5, 6);

      var resultGraph = new Graph();
      addNodesFrom(resultGraph, [1, 2, 3, 4]);
      resultGraph.addEdge(1, 2);
      resultGraph.addEdge(2, 3);
      resultGraph.addEdge(3, 4);
      resultGraph.addEdge(2, 4);

      var resultSubgraph = largestConnectedComponentSubgraph(graph);

      var result = areSameGraphs(resultSubgraph, resultGraph);

      assert.strictEqual(result, true);
    });

    it('should also work with self loops.', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);
      graph.addEdge(1, 2);
      graph.addEdge(1, 1);

      var resultGraph = new Graph();
      addNodesFrom(resultGraph, [1, 2]);
      resultGraph.addEdge(1, 2);
      resultGraph.addEdge(1, 1);

      var resultSubgraph = largestConnectedComponentSubgraph(graph);

      var result = areSameGraphs(resultSubgraph, resultGraph);

      assert.strictEqual(result, true);
    });

    it('should return a Graph instance.', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);
      graph.addEdge(1, 2);
      graph.addEdge(1, 1);

      assert.strictEqual(
        isGraph(largestConnectedComponentSubgraph(graph)),
        true
      );
    });

    it('should return a graph containing the same nodes as the largest component of the given graph.', function () {
      var graph = range(8)
        .map(function () {
          return erdosRenyi.sparse(Graph.UndirectedGraph, {
            order: random(10, 100),
            probability: 0.05
          });
        })
        .reduce(function (a, b) {
          return disjointUnion(a, b);
        });

      var largestComponent = largestConnectedComponent(graph);

      var largestComponentSubgraph = largestConnectedComponentSubgraph(graph);

      var nodesSubgraph = [];

      largestComponentSubgraph.forEachNode(function (node) {
        nodesSubgraph.push(node);
      });

      assert.deepStrictEqual(largestComponent, nodesSubgraph);
    });

    it('should return a graph containing the same number of edges as the largest component of the given graph.', function () {
      var graph = range(8)
        .map(function () {
          return erdosRenyi.sparse(Graph.UndirectedGraph, {
            order: random(10, 100),
            probability: 0.05
          });
        })
        .reduce(function (a, b) {
          return disjointUnion(a, b);
        });

      var largestComponent = new Set(largestConnectedComponent(graph));

      var edgesGraph = [];

      graph.forEachEdge(function (edge, attr, source, target) {
        if (largestComponent.has(source)) {
          edgesGraph.push([attr, source, target]);
        }
      });

      var largestComponentSubgraph = largestConnectedComponentSubgraph(graph);
      var edgesSubgraph = [];

      largestComponentSubgraph.forEachEdge(function (
        edge,
        attr,
        source,
        target
      ) {
        edgesSubgraph.push([attr, source, target]);
      });

      assert.strictEqual(edgesGraph.length, edgesSubgraph.length);
    });

    it('should return correct results.', function () {
      var graph = range(8)
        .map(function () {
          return erdosRenyi.sparse(Graph.UndirectedGraph, {
            order: random(10, 100),
            probability: 0.05
          });
        })
        .reduce(function (a, b) {
          return disjointUnion(a, b);
        });

      var largestComponent = largestConnectedComponent(graph);

      var resultSubgraph = subgraph(graph, largestComponent);
      var componentSubgraph = largestConnectedComponentSubgraph(graph);

      var result = areSameGraphsDeep(componentSubgraph, resultSubgraph);

      assert.strictEqual(result, true);
    });
  });

  describe('#.cropToLargestConnectedComponent', function () {
    it('should throw if given an invalid graph.', function () {
      assert.throws(function () {
        cropToLargestConnectedComponent(null);
      }, /graphology/);
    });

    it('should handle empty graphs.', function () {
      var graph = new Graph();
      var copy = graph.copy();

      cropToLargestConnectedComponent(graph);

      assert.deepStrictEqual(graph, copy);
    });

    it('should handle graphs without edges.', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);

      var resultGraph = new Graph();
      addNodesFrom(resultGraph, [1]);

      cropToLargestConnectedComponent(graph);

      var result = areSameGraphsDeep(graph, resultGraph);

      assert.strictEqual(result, true);
    });

    it('should also work with self loops.', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);
      graph.addEdge(1, 2);
      graph.addEdge(1, 1);

      var resultGraph = new Graph();
      addNodesFrom(resultGraph, [1, 2]);
      resultGraph.addEdge(1, 2);
      resultGraph.addEdge(1, 1);

      cropToLargestConnectedComponent(graph);

      var result = areSameGraphs(resultGraph, graph);

      assert.strictEqual(result, true);
    });

    it('should crop the given graph to a component containing the same nodes as its largest component.', function () {
      var graph = range(8)
        .map(function () {
          return erdosRenyi.sparse(Graph.UndirectedGraph, {
            order: random(10, 100),
            probability: 0.05
          });
        })
        .reduce(function (a, b) {
          return disjointUnion(a, b);
        });

      var largestComponent = largestConnectedComponent(graph);

      cropToLargestConnectedComponent(graph);

      var nodesResultGraph = graph.nodes();

      largestComponent.sort();
      nodesResultGraph.sort();

      assert.deepStrictEqual(largestComponent, nodesResultGraph);
    });

    it('should crop the given graph to a component containing the same edges as its largest component.', function () {
      var graph = range(8)
        .map(function () {
          return erdosRenyi.sparse(Graph.UndirectedGraph, {
            order: random(10, 100),
            probability: 0.05
          });
        })
        .reduce(function (a, b) {
          return disjointUnion(a, b);
        });

      var largestComponent = new Set(largestConnectedComponent(graph));

      var edgesGraph = [];

      graph.forEachEdge(function (edge, attr, source, target) {
        if (largestComponent.has(source)) {
          edgesGraph.push([attr, source, target]);
        }
      });

      cropToLargestConnectedComponent(graph);
      var edgesResultGraph = [];

      graph.forEachEdge(function (edge, attr, source, target) {
        edgesResultGraph.push([attr, source, target]);
      });

      assert.deepStrictEqual(edgesGraph, edgesResultGraph);
    });
  });

  describe('#.forEachConnectedComponentOrder', function () {
    it('should return the correct information.', function () {
      var graph = new Graph();
      graph.mergeEdge(1, 2);
      graph.mergeEdge(2, 3);

      graph.mergeEdge(5, 6);

      graph.addNode(7);

      var o1 = [];
      var o2 = [];

      forEachConnectedComponent(graph, function (component) {
        o1.push(component.length);
      });

      forEachConnectedComponentOrder(graph, function (order) {
        o2.push(order);
      });

      assert.deepStrictEqual(o1, o2);
    });
  });

  describe('#.forEachConnectedComponentOrderWithEdgeFilter', function () {
    it('should correctly return the correct orders.', function () {
      var graph = new Graph();
      graph.mergeEdge(1, 2, {hidden: true});
      graph.mergeEdge(2, 3);

      graph.mergeEdge(5, 6);

      graph.addNode(7);

      var orders = [];

      forEachConnectedComponentOrderWithEdgeFilter(
        graph,
        function () {
          return true;
        },
        function (order) {
          orders.push(order);
        }
      );

      assert.deepStrictEqual(new Set(orders), new Set([1, 2, 3]));

      orders = [];

      forEachConnectedComponentOrderWithEdgeFilter(
        graph,
        function () {
          return false;
        },
        function (order) {
          orders.push(order);
        }
      );

      assert.deepStrictEqual(orders, [1, 1, 1, 1, 1, 1]);

      orders = [];

      forEachConnectedComponentOrderWithEdgeFilter(
        graph,
        function (_, attr) {
          return !attr.hidden;
        },
        function (order) {
          orders.push(order);
        }
      );

      orders.sort();

      assert.deepStrictEqual(orders, [1, 1, 2, 2]);
    });
  });

  describe('#.stronglyConnectedComponents', function () {
    it('should throw if given an invalid graph.', function () {
      assert.throws(function () {
        stronglyConnectedComponents(null);
      }, /graphology/);
    });

    it('should handle empty graphs.', function () {
      var graph = new Graph();

      assert.deepStrictEqual(stronglyConnectedComponents(graph), []);
    });

    it('should handle graphs without edges.', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);

      assert.deepStrictEqual(stronglyConnectedComponents(graph), [
        ['1'],
        ['2'],
        ['3']
      ]);
    });

    it('should throw if the graph is undirected', function () {
      var graph = new Graph({type: 'undirected'});
      addNodesFrom(graph, [1, 2]);
      graph.addEdge(1, 2);

      assert.throws(function () {
        stronglyConnectedComponents(graph);
      }, /graphology/);
    });

    it('should return the correct components. (mixed edges)', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3, 4]);

      graph.addDirectedEdge(1, 2);
      graph.addUndirectedEdge(2, 3);
      graph.addDirectedEdge(3, 4);
      graph.addDirectedEdge(4, 2);

      var components = stronglyConnectedComponents(graph);
      sortComponents(components);
      assert.deepStrictEqual(components, [['1'], ['2', '3', '4']]);
    });

    it('should return the correct components. (simple directed graph)', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3]);

      graph.addDirectedEdge(1, 2);
      graph.addDirectedEdge(2, 1);
      graph.addDirectedEdge(3, 1);

      var components = stronglyConnectedComponents(graph);
      sortComponents(components);
      assert.deepStrictEqual(components, [['1', '2'], ['3']]);
    });

    it('should return the correct components. (disjointed components)', function () {
      var graph = new Graph();
      addNodesFrom(graph, [1, 2, 3, 4, 5, 6, 7, 8]);

      graph.addDirectedEdge(1, 2);
      graph.addDirectedEdge(2, 3);
      graph.addDirectedEdge(3, 1);

      graph.addDirectedEdge(3, 4);

      graph.addDirectedEdge(4, 5);
      graph.addDirectedEdge(5, 4);

      graph.addDirectedEdge(6, 7);
      graph.addDirectedEdge(7, 8);
      graph.addDirectedEdge(8, 6);

      var components = stronglyConnectedComponents(graph);
      sortComponents(components);

      assert.deepStrictEqual(components, [
        ['1', '2', '3'],
        ['4', '5'],
        ['6', '7', '8']
      ]);
    });
  });
});
