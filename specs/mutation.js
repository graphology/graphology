/**
 * Graphology Mutation Specs
 * ==========================
 *
 * Testing the mutation methods of the graph.
 */
import assert from 'assert';

export default function mutation(Graph) {
  return {
    '#.addNode': {

      'it should throw if given attributes is not an object.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.addNode('test', true);
        }, /addNode/);
      },

      'it should return the added node.': function() {
        const graph = new Graph();

        assert.strictEqual(graph.addNode('John'), 'John');
      }
    },

    '#.addEdge': {

      'it should throw if given attributes is not an object.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.addEdge('source', 'target', true);
        }, /addEdge/);
      }
    }
  };
}
