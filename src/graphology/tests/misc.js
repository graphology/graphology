/**
 * Graphology Misc Specs
 * ======================
 *
 * Testing the miscellaneous things about the graph.
 */
import assert from 'assert';
import {addNodesFrom} from './helpers';

export default function misc(Graph) {
  return {
    Structure: {
      'a simple mixed graph can have A->B, B->A & A<->B': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['Audrey', 'Benjamin']);

        assert.doesNotThrow(function () {
          graph.addEdge('Audrey', 'Benjamin');
          graph.addEdge('Benjamin', 'Audrey');
          graph.addUndirectedEdge('Benjamin', 'Audrey');
        });
      },

      'deleting the last edge between A & B should correctly clear neighbor index.':
        function () {
          const graph = new Graph({multi: true});
          graph.addNode('A');
          graph.addNode('B');

          graph.addEdge('A', 'B');
          graph.addEdge('A', 'B');

          graph.forEachEdge('A', edge => graph.dropEdge(edge));

          assert.deepStrictEqual(graph.neighbors('A'), []);
          assert.deepStrictEqual(graph.neighbors('B'), []);
        },

      'exhaustive deletion use-cases should not break doubly-linked lists implementation of multigraph edge storage.':
        function () {
          const graph = new Graph({multi: true});
          graph.mergeEdgeWithKey('1', 'A', 'B');
          graph.mergeEdgeWithKey('2', 'A', 'B');
          graph.mergeEdgeWithKey('3', 'A', 'B');
          graph.mergeEdgeWithKey('4', 'A', 'B');

          graph.dropEdge('1');
          graph.dropEdge('2');
          graph.dropEdge('3');
          graph.dropEdge('4');

          assert.strictEqual(graph.size, 0);
          assert.strictEqual(graph.areNeighbors('A', 'B'), false);

          graph.mergeEdgeWithKey('1', 'A', 'B');
          graph.mergeEdgeWithKey('2', 'A', 'B');
          graph.mergeEdgeWithKey('3', 'A', 'B');
          graph.mergeEdgeWithKey('4', 'A', 'B');

          assert.strictEqual(graph.size, 4);
          assert.strictEqual(graph.areNeighbors('A', 'B'), true);

          graph.dropEdge('2');
          graph.dropEdge('3');

          assert.strictEqual(graph.size, 2);
          assert.strictEqual(graph.areNeighbors('A', 'B'), true);

          graph.dropEdge('4');
          graph.dropEdge('1');

          assert.strictEqual(graph.size, 0);
          assert.strictEqual(graph.areNeighbors('A', 'B'), false);
        }
    },

    'Key coercion': {
      'keys should be correctly coerced to strings.': function () {
        const graph = new Graph();
        graph.addNode(1);
        graph.addNode('2');

        assert.strictEqual(graph.hasNode(1), true);
        assert.strictEqual(graph.hasNode('1'), true);
        assert.strictEqual(graph.hasNode(2), true);
        assert.strictEqual(graph.hasNode('2'), true);

        graph.addEdgeWithKey(3, 1, 2);

        assert.strictEqual(graph.hasEdge(3), true);
        assert.strictEqual(graph.hasEdge('3'), true);
      }
    }
  };
}
