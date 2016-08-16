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
        }, /attributes/);
      },

      'it should return the added node.': function() {
        const graph = new Graph();

        assert.strictEqual(graph.addNode('John'), 'John');
      }
    },

    '#.addDirectedEdge': {

      'it should throw if given attributes is not an object.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.addDirectedEdge('source', 'target', true);
        }, /attributes/);
      },

      'it should throw if the graph is undirected.': function() {
        const graph = new Graph(null, {type: 'undirected'});

        assert.throws(function() {
          graph.addDirectedEdge('source', 'target');
        }, /undirected/);
      }
    },
  };
}
