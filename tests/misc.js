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
      }
    }
  };
}
