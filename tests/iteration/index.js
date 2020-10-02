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

        graph.mergeEdge(1, 2);
        graph.mergeEdge(2, 3);
        graph.mergeEdge(3, 1);

        graph.replaceNodeAttributes(2, {hello: 'world'});

        const adjacency = [];

        graph.forEach(function(s, t, sa, ta, e, ea) {
          adjacency.push([s, t]);
          assert.deepStrictEqual(sa, graph.getNodeAttributes(s));
          assert.deepStrictEqual(ta, graph.getNodeAttributes(t));
          assert.deepStrictEqual(ea, graph.getEdgeAttributes(e));
        });

        assert.deepStrictEqual(adjacency, [
          ['1', '2'],
          ['2', '3'],
          ['3', '1']
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
