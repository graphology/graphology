/**
 * Graphology Iteration Specs
 * ===========================
 *
 * Testing the iteration-related methods of the graph.
 */
import assert from 'assert';
import take from 'obliterator/take';
import nodes from './nodes';
import edges from './edges';
import neighbors from './neighbors';

export default function iteration(Graph, checkers) {
  return {
    Adjacency: {

      'it should be possible to iterate over the graph\'s adjacency using callbacks.': function() {
        const graph = new Graph();

        graph.addNode(1);
        graph.addNode(2);
        graph.addNode(3);

        graph.addEdge(1, 2);
        graph.addEdge(2, 3);
        graph.addEdge(3, 1);
        graph.addUndirectedEdge(1, 2);

        graph.replaceNodeAttributes(2, {hello: 'world'});

        const adjacency = [];

        graph.forEach(function(s, t, sa, ta, e, ea, u, g) {
          adjacency.push([u, s, t]);
          assert.deepStrictEqual(sa, graph.getNodeAttributes(s));
          assert.deepStrictEqual(ta, graph.getNodeAttributes(t));
          assert.deepStrictEqual(ea, graph.getEdgeAttributes(e));
          assert.strictEqual(graph.isUndirected(e), u);
          assert.strictEqual(graph.hasGeneratedKey(e), g);
        });

        assert.deepStrictEqual(adjacency, [
          [false, '1', '2'],
          [true, '1', '2'],
          [false, '2', '3'],
          [true, '2', '1'],
          [false, '3', '1']
        ]);
      },

      'it should be possible to iterate over a multi graph\'s adjacency using callbacks.': function() {
        const graph = new Graph({multi: true});

        graph.addNode(1);
        graph.addNode(2);
        graph.addNode(3);

        graph.addEdge(1, 2);
        graph.addEdge(2, 3);
        graph.addEdge(3, 1);
        graph.addEdgeWithKey('test', 2, 3);
        graph.addUndirectedEdge(1, 2);

        graph.replaceNodeAttributes(2, {hello: 'world'});

        const adjacency = [];

        graph.forEach(function(s, t, sa, ta, e, ea, u, g) {
          adjacency.push([u, s, t]);
          assert.deepStrictEqual(sa, graph.getNodeAttributes(s));
          assert.deepStrictEqual(ta, graph.getNodeAttributes(t));
          assert.deepStrictEqual(ea, graph.getEdgeAttributes(e));
          assert.strictEqual(graph.isUndirected(e), u);
          assert.strictEqual(graph.hasGeneratedKey(e), g);

          if (!g)
            assert.strictEqual(e, 'test');
        });

        assert.deepStrictEqual(adjacency, [
          [false, '1', '2'],
          [true, '1', '2'],
          [false, '2', '3'],
          [false, '2', '3'],
          [true, '2', '1'],
          [false, '3', '1']
        ]);
      },

      'it should be possible to iterate over the graph\'s adjacency using callbacks until returning true.': function() {
        const graph = new Graph();

        graph.addNode(1);
        graph.addNode(2);
        graph.addNode(3);

        graph.addEdge(1, 2);
        graph.addEdge(2, 3);
        graph.addEdge(3, 1);
        graph.addUndirectedEdge(1, 2);

        graph.replaceNodeAttributes(2, {hello: 'world'});

        const adjacency = [];

        graph.forEachUntil(function(s, t, sa, ta, e, ea, u, g) {
          adjacency.push([u, s, t]);
          assert.deepStrictEqual(sa, graph.getNodeAttributes(s));
          assert.deepStrictEqual(ta, graph.getNodeAttributes(t));
          assert.deepStrictEqual(ea, graph.getEdgeAttributes(e));
          assert.strictEqual(graph.isUndirected(e), u);
          assert.strictEqual(graph.hasGeneratedKey(e), g);

          if (sa.hello === 'world')
            return true;
        });

        assert.deepStrictEqual(adjacency, [
          [false, '1', '2'],
          [true, '1', '2'],
          [false, '2', '3']
        ]);
      },

      'it should be possible to create an iterator over the graph\'s adjacency.': function() {
        const graph = new Graph();

        graph.mergeEdge(1, 2);
        graph.mergeEdge(2, 3);
        graph.mergeEdge(3, 1);

        graph.replaceNodeAttributes(2, {hello: 'world'});

        assert.deepStrictEqual(take(graph.adjacency()), graph.edges().map(edge => {
          const [source, target] = graph.extremities(edge);

          return [
            source,
            target,
            graph.getNodeAttributes(source),
            graph.getNodeAttributes(target),
            edge,
            graph.getEdgeAttributes(edge)
          ];
        }));
      },

      'it should be possible to iterate via Symbol.iterator.': function() {
        if (typeof Symbol === 'undefined')
          return;

        const graph = new Graph();

        graph.mergeEdge(1, 2);
        graph.mergeEdge(2, 3);
        graph.mergeEdge(3, 1);

        graph.replaceNodeAttributes(2, {hello: 'world'});

        assert.deepStrictEqual(take(graph[Symbol.iterator]()), graph.edges().map(edge => {
          const [source, target] = graph.extremities(edge);

          return [
            source,
            target,
            graph.getNodeAttributes(source),
            graph.getNodeAttributes(target),
            edge,
            graph.getEdgeAttributes(edge)
          ];
        }));
      }
    },
    Nodes: nodes(Graph, checkers),
    Edges: edges(Graph, checkers),
    Neighbors: neighbors(Graph, checkers)
  };
}
