/**
 * Graphology Iteration Specs
 * ===========================
 *
 * Testing the iteration-related methods of the graph.
 */
import assert from 'assert';
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

        const adjacency = [];

        graph.forEach(function(s, t, sa, ta, e, ea) {
          adjacency.push([s, t]);
          assert.deepEqual(sa, graph.getNodeAttributes(s));
          assert.deepEqual(ta, graph.getNodeAttributes(t));
          assert.deepEqual(ea, graph.getEdgeAttributes(e));
        });

        assert.deepEqual(adjacency, [
          [1, 2],
          [2, 3],
          [3, 1]
        ]);
      }
    },
    Nodes: nodes(Graph, checkers),
    Edges: edges(Graph, checkers),
    Neighbors: neighbors(Graph, checkers)
  };
}
