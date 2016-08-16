/**
 * Graphology Read Specs
 * ======================
 *
 * Testing the read methods of the graph.
 */
import assert from 'assert';

export default function read(Graph) {
  return {
    '#.hasNode': {

      'it should correctly return whether the given node is found in the graph.': function() {
        const graph = new Graph();

        assert.strictEqual(graph.hasNode('John'), false);

        graph.addNode('John');

        assert.strictEqual(graph.hasNode('John'), true);
      }
    }
  };
}
