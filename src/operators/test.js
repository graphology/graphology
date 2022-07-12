/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert');
var Graph = require('graphology');
var createTupleComparator =
  require('mnemonist/utils/comparators').createTupleComparator;
var mergeClique = require('graphology-utils/merge-clique');
var assertions = require('graphology-assertions');

var areSameGraphsDeep = assertions.areSameGraphsDeep;
var haveSameEdgesDeep = assertions.haveSameEdgesDeep;

var reverse = require('./reverse.js');
var subgraph = require('./subgraph');
var union = require('./union.js');
var disjointUnion = require('./disjoint-union.js');
var toDirected = require('./to-directed.js');
var toMixed = require('./to-mixed.js');
var toMulti = require('./to-multi.js');
var toSimple = require('./to-simple.js');
var toUndirected = require('./to-undirected.js');

function addNodesFrom(graph, nodes) {
  nodes.forEach(function (node) {
    graph.addNode(node);
  });
}

function sortedEdgePairs(graph) {
  return graph
    .edges()
    .map(function (edge) {
      return graph.extremities(edge).sort();
    })
    .sort(createTupleComparator(2));
}

describe('graphology-operators', function () {
  describe('unary', function () {
    describe('reverse', function () {
      it('should throw if graph is invalid.', function () {
        assert.throws(function () {
          reverse(null);
        }, /valid/);
      });

      it('should correctly reverse the given graph.', function () {
        var graph = new Graph();

        addNodesFrom(graph, ['John', 'Martha', 'Ada']);
        graph.addEdgeWithKey('J->M', 'John', 'Martha');
        graph.addUndirectedEdgeWithKey('M<->A', 'Martha', 'Ada');

        var reversed = reverse(graph);

        assert.strictEqual(graph.order, reversed.order);
        assert.strictEqual(graph.size, reversed.size);

        assert.strictEqual(reversed.hasDirectedEdge('Martha', 'John'), true);
      });
    });

    describe('subgraph', function () {
      it('should throw if given arguments are invalid.', function () {
        assert.throws(function () {
          subgraph(null);
        }, /valid/);

        assert.throws(function () {
          subgraph(new Graph(), null);
        }, /valid/);
      });

      it('should throw if given nodes are not found in the graph.', function () {
        assert.throws(function () {
          subgraph(new Graph(), ['test']);
        }, /node/);
      });

      it('should return an null graph if no node is given.', function () {
        var graph = new Graph();
        graph.mergeEdge(1, 2);

        function returnFalse() {
          return false;
        }

        assert.strictEqual(subgraph(graph, []).size, 0);
        assert.strictEqual(subgraph(graph, new Set()).size, 0);
        assert.strictEqual(subgraph(graph, returnFalse).size, 0);
      });

      it('should be possible to get a subgraph from an array of nodes.', function () {
        var graph = new Graph();
        mergeClique(graph, [0, 1, 2, 3]);

        var sub = subgraph(graph, [0, 1]);

        assert.strictEqual(sub.hasNode(0), true);
        assert.strictEqual(sub.hasNode(1), true);
        assert.strictEqual(sub.hasNode(2), false);
        assert.strictEqual(sub.hasNode(3), false);
        assert.strictEqual(sub.hasEdge(0, 1), true);
        assert.strictEqual(sub.hasEdge(1, 2), false);
        assert.strictEqual(sub.size, 1);
      });

      it('should be possible to get a subgraph from a set of nodes.', function () {
        var graph = new Graph();
        mergeClique(graph, [0, 1, 2, 3]);

        var sub = subgraph(graph, new Set([0, 1]));

        assert.strictEqual(sub.hasNode(0), true);
        assert.strictEqual(sub.hasNode(1), true);
        assert.strictEqual(sub.hasNode(2), false);
        assert.strictEqual(sub.hasNode(3), false);
        assert.strictEqual(sub.hasEdge(0, 1), true);
        assert.strictEqual(sub.hasEdge(1, 2), false);
        assert.strictEqual(sub.size, 1);
      });

      it('should be possible to get a subgraph from a filtering function', function () {
        var graph = new Graph();
        mergeClique(graph, [0, 1, 2, 3]);

        var sub = subgraph(graph, function (key, attr) {
          assert.deepStrictEqual(graph.getNodeAttributes(key), attr);

          if (key === '0' || key === '1') return true;

          return false;
        });

        assert.strictEqual(sub.hasNode(0), true);
        assert.strictEqual(sub.hasNode(1), true);
        assert.strictEqual(sub.hasNode(2), false);
        assert.strictEqual(sub.hasNode(3), false);
        assert.strictEqual(sub.hasEdge(0, 1), true);
        assert.strictEqual(sub.hasEdge(1, 2), false);
        assert.strictEqual(sub.size, 1);
      });
    });
  });

  describe('binary', function () {
    describe('union', function () {
      it('should throw if graphs are invalid.', function () {
        assert.throws(function () {
          union(null, new Graph());
        }, /valid/);

        assert.throws(function () {
          union(new Graph(), null);
        }, /valid/);
      });

      it('should throw if graphs are not both simple or both multi.', function () {
        var simpleGraph = new Graph(),
          multiGraph = new Graph({multi: true});

        assert.throws(function () {
          union(simpleGraph, multiGraph);
        }, /multi/);
      });

      it('should produce the correct union of the given graphs.', function () {
        var G = new Graph(),
          H = new Graph();

        addNodesFrom(G, [1, 2]);
        addNodesFrom(H, [1, 3]);

        G.addEdgeWithKey('1->2', '1', '2');
        H.addEdgeWithKey('1->3', '1', '3');

        var R = union(G, H);

        assert.deepStrictEqual(R.nodes(), ['1', '2', '3']);
        assert.deepStrictEqual(R.edges(), ['1->2', '1->3']);
      });
    });

    describe('disjoint-union', function () {
      it('should throw if graphs are invalid.', function () {
        assert.throws(function () {
          disjointUnion(null, new Graph());
        }, /valid/);

        assert.throws(function () {
          disjointUnion(new Graph(), null);
        }, /valid/);
      });

      it('should throw if graphs are not both simple or both multi.', function () {
        var simpleGraph = new Graph(),
          multiGraph = new Graph({multi: true});

        assert.throws(function () {
          disjointUnion(simpleGraph, multiGraph);
        }, /multi/);
      });

      it('should produce the correct disjoint union of the given graphs.', function () {
        var G = new Graph(),
          H = new Graph();

        addNodesFrom(G, [1, 2]);
        addNodesFrom(H, [1, 3]);

        G.addEdge('1', '2');
        H.addEdge('1', '3');

        var R = disjointUnion(G, H);

        assert.deepStrictEqual(R.nodes(), ['0', '1', '2', '3']);

        var edges = sortedEdgePairs(R);

        assert.deepStrictEqual(edges, [
          ['0', '1'],
          ['2', '3']
        ]);
      });

      it('should produce the correct disjoint union of the given graphs with keyed edges.', function () {
        var G = new Graph(),
          H = new Graph();

        addNodesFrom(G, [1, 2]);
        addNodesFrom(H, [1, 3]);

        G.addEdgeWithKey('1->2', '1', '2');
        H.addEdgeWithKey('1->3', '1', '3');

        var R = disjointUnion(G, H);

        assert.deepStrictEqual(R.nodes(), ['0', '1', '2', '3']);

        var edges = sortedEdgePairs(R);

        assert.deepStrictEqual(edges, [
          ['0', '1'],
          ['2', '3']
        ]);
      });
    });
  });

  describe('cast', function () {
    describe('toSimple', function () {
      it('should throw when given an invalid graph.', function () {
        assert.throws(function () {
          toSimple('test');
        }, /graphology/);
      });

      it('should only return a plain copy of a simple graph.', function () {
        var graph = new Graph();

        graph.mergeEdge(1, 2);

        var copy = toSimple(graph);

        assert.notStrictEqual(graph, copy);
        assert.deepStrictEqual(graph.nodes(), copy.nodes());
      });

      it('should return a simple graph from a multi one.', function () {
        var multiGraph = new Graph({multi: true});

        multiGraph.mergeEdge('one', 'two');
        multiGraph.addEdge('one', 'two');
        multiGraph.addEdge('one', 'two');

        assert.strictEqual(multiGraph.order, 2);
        assert.strictEqual(multiGraph.size, 3);

        var simpleGraph = toSimple(multiGraph);

        assert.strictEqual(simpleGraph.multi, false);
        assert.deepStrictEqual(simpleGraph.nodes(), ['one', 'two']);
        assert.strictEqual(simpleGraph.size, 1);
      });

      it('should be possible to aggregate edge attributes.', function () {
        var multiGraph = new Graph({multi: true});

        multiGraph.mergeEdge('one', 'two', {weight: 2});
        multiGraph.mergeEdge('one', 'two', {weight: 3});
        multiGraph.mergeEdge('one', 'two', {weight: 1});
        multiGraph.mergeEdge('two', 'three', {weight: 5});

        var simpleGraph = toSimple(multiGraph, function (a1, a2) {
          return {
            weight: a1.weight + a2.weight
          };
        });

        assert.strictEqual(simpleGraph.multi, false);

        var expectedGraph = new Graph();
        expectedGraph.mergeEdge('one', 'two', {weight: 6});
        expectedGraph.mergeEdge('two', 'three', {weight: 5});

        assert(areSameGraphsDeep(simpleGraph, expectedGraph));
      });
    });

    describe('toDirected', function () {
      it('should throw when given an invalid graph.', function () {
        assert.throws(function () {
          toDirected('test');
        }, /graphology/);
      });

      it('should only return a plain copy of a directed graph.', function () {
        var graph = new Graph({type: 'directed'});

        graph.mergeEdge(1, 2);

        var copy = toDirected(graph);

        assert.notStrictEqual(graph, copy);
        assert.deepStrictEqual(graph.nodes(), copy.nodes());
      });

      it('should properly cast graph to undirected version.', function () {
        var graph = new Graph({type: 'undirected'});

        graph.mergeEdge(1, 2);
        graph.mergeEdge(2, 1);
        graph.mergeEdge(3, 2, {weight: 30});

        var copy = toDirected(graph);

        assert.notStrictEqual(graph, copy);
        assert.strictEqual(copy.order, 3);
        assert.strictEqual(copy.size, 4);
        assert.strictEqual(copy.hasEdge(1, 2), true);
        assert.strictEqual(copy.hasEdge(2, 1), true);
        assert.strictEqual(copy.hasEdge(2, 3), true);
        assert.strictEqual(copy.hasEdge(3, 2), true);

        assert.deepStrictEqual(copy.getEdgeAttributes(3, 2), {weight: 30});
        assert.deepStrictEqual(copy.getEdgeAttributes(2, 3), {weight: 30});
      });

      it('should be possible to pass a `mergeEdge` function.', function () {
        var graph = new Graph();

        graph.mergeDirectedEdge(1, 2, {weight: 2});
        graph.mergeUndirectedEdge(1, 2, {weight: 4});

        var copy = toDirected(graph, function (current, next) {
          current.weight += next.weight;

          return current;
        });

        assert.notStrictEqual(graph, copy);
        assert.strictEqual(copy.type, 'directed');
        assert.strictEqual(copy.order, 2);
        assert.strictEqual(copy.size, 2);
        assert.strictEqual(copy.hasEdge(1, 2), true);
        assert.strictEqual(copy.hasEdge(2, 1), true);
        assert.strictEqual(copy.getEdgeAttribute(1, 2, 'weight'), 6);
        assert.strictEqual(copy.getEdgeAttribute(2, 1, 'weight'), 4);
      });

      it('should be possible to cast a graph containing self-loops.', function () {
        var graph = new Graph({type: 'undirected'});
        graph.mergeEdge(1, 1);
        graph.mergeEdge(2, 3);

        var directed = toDirected(graph);

        assert.strictEqual(directed.size, 3);
        assert.strictEqual(directed.selfLoopCount, 1);
      });

      it('should be possible to cast a multi graph.', function () {
        var graph = new Graph({multi: true, type: 'mixed'});

        graph.mergeUndirectedEdge(0, 1, {color: 'red'});
        graph.mergeUndirectedEdge(1, 0, {color: 'blue'});

        var copy = toDirected(graph);

        var expected = new Graph({multi: true, type: 'directed'});
        expected.mergeEdge(0, 1, {color: 'red'});
        expected.mergeEdge(1, 0, {color: 'blue'});
        expected.mergeEdge(1, 0, {color: 'red'});
        expected.mergeEdge(0, 1, {color: 'blue'});

        assert.strictEqual(areSameGraphsDeep(copy, expected), true);
      });
    });

    describe('toMixed', function () {
      it('should throw when given an invalid graph.', function () {
        assert.throws(function () {
          toMixed('test');
        }, /graphology/);
      });

      it('should only return a plain copy of a directed graph.', function () {
        var graph = new Graph({type: 'directed'});

        graph.mergeEdge(1, 2);

        var copy = toMixed(graph);

        assert.strictEqual(copy.type, 'mixed');
        assert.strictEqual(haveSameEdgesDeep(graph, copy), true);
      });
    });

    describe('toMulti', function () {
      it('should throw when given an invalid graph.', function () {
        assert.throws(function () {
          toMulti('test');
        }, /graphology/);
      });

      it('should only return a plain copy of a directed graph.', function () {
        var graph = new Graph({multi: false});

        graph.mergeEdge(1, 2);

        var copy = toMulti(graph);

        assert.strictEqual(copy.multi, true);
        assert.strictEqual(haveSameEdgesDeep(graph, copy), true);
      });
    });

    describe('toUndirected', function () {
      it('should throw when given an invalid graph.', function () {
        assert.throws(function () {
          toUndirected('test');
        }, /graphology/);
      });

      it('should only return a plain copy of an undirected graph.', function () {
        var graph = new Graph({type: 'undirected'});

        graph.mergeEdge(1, 2);

        var copy = toUndirected(graph);

        assert.notStrictEqual(graph, copy);
        assert.deepStrictEqual(graph.nodes(), copy.nodes());
      });

      it('should properly cast graph to undirected version.', function () {
        var graph = new Graph({type: 'directed'});

        graph.mergeEdge(1, 2);
        graph.mergeEdge(2, 1);
        graph.mergeEdge(3, 2);

        var copy = toUndirected(graph);

        assert.notStrictEqual(graph, copy);
        assert.strictEqual(copy.order, 3);
        assert.strictEqual(copy.size, 2);
        assert.strictEqual(copy.hasEdge(1, 2), true);
        assert.strictEqual(copy.hasEdge(2, 3), true);
      });

      it('should be possible to pass a `mergeEdge` function.', function () {
        var graph = new Graph({type: 'directed'});

        graph.mergeEdge(1, 2, {weight: 2});
        graph.mergeEdge(2, 1, {weight: 3});
        graph.mergeEdge(3, 2, {weight: 3});

        var copy = toUndirected(graph, function (current, next) {
          current.weight += next.weight;

          return current;
        });

        assert.notStrictEqual(graph, copy);
        assert.strictEqual(copy.order, 3);
        assert.strictEqual(copy.size, 2);
        assert.strictEqual(copy.hasEdge(1, 2), true);
        assert.strictEqual(copy.hasEdge(2, 3), true);
        assert.strictEqual(copy.getEdgeAttribute(1, 2, 'weight'), 5);
        assert.strictEqual(copy.getEdgeAttribute(3, 2, 'weight'), 3);
      });

      it('should be possible to cast a multi graph.', function () {
        var graph = new Graph({multi: true, type: 'directed'});

        graph.mergeEdge(0, 1, {color: 'blue'});
        graph.mergeEdge(0, 1, {color: 'red'});
        graph.mergeEdge(0, 1, {color: 'yellow'});
        graph.mergeEdge(1, 0);

        var copy = toUndirected(graph);

        var expected = new Graph({multi: true, type: 'undirected'});

        expected.mergeEdge(0, 1, {color: 'yellow'});
        expected.mergeEdge(1, 0, {color: 'red'});
        expected.mergeEdge(1, 0, {color: 'blue'});
        expected.mergeEdge(0, 1);

        assert.strictEqual(areSameGraphsDeep(copy, expected), true);
      });
    });
  });
});
