/**
 * Graphology Misc Specs
 * ======================
 *
 * Testing the miscellaneous things about the graph.
 */
import assert from 'assert';

export default function misc(Graph) {
  return {
    'Structure': {
      'a simple mixed graph can have A->B, B->A & A<->B': function() {
        const graph = new Graph();
        graph.addNodesFrom(['Audrey', 'Benjamin']);

        assert.doesNotThrow(function() {
          graph.addEdge('Audrey', 'Benjamin');
          graph.addEdge('Benjamin', 'Audrey');
          graph.addUndirectedEdge('Benjamin', 'Audrey');
        });
      },

      'deleting the last edge between A & B should correctly clear neighbor index.': function() {
        const graph = new Graph({multi: true});
        graph.addNode('A');
        graph.addNode('B');

        graph.addEdge('A', 'B');
        graph.addEdge('A', 'B');


        graph.forEachEdge('A', edge => graph.dropEdge(edge));

        assert.deepEqual(graph.neighbors('A'), []);
        assert.deepEqual(graph.neighbors('B'), []);
      }
    },

    'Key coercion': {
      'keys should be correctly coerced to strings.': function() {
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
