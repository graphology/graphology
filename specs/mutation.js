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

      'it should throw if the given node already exist.': function() {
        const graph = new Graph();
        graph.addNode('Martha');

        assert.throws(function() {
          graph.addNode('Martha');
        }, /exist/);
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
      },

      'it should throw if either the source or the target does not exist.': function() {
        const graph = new Graph();
        graph.addNode('Martha');

        assert.throws(function() {
          graph.addDirectedEdge('Thomas', 'Eric');
        }, /source/);

        assert.throws(function() {
          graph.addDirectedEdge('Martha', 'Eric');
        }, /target/);
      },

      'it should return the generated edge\'s key.': function() {
        const graph = new Graph();
        graph.addNode('Thomas');
        graph.addNode('Martha');

        const edge = graph.addDirectedEdge('Thomas', 'Martha');

        assert(typeof edge === 'string' || typeof edge === 'number');
        assert(!(edge instanceof Graph));
      }
    },

    '#.addDirectedEdgeWithKey': {

      'it should throw if an edge with the same key already exists.': function() {
        const graph = new Graph();

        graph.addNode('Thomas');
        graph.addNode('Martha');

        graph.addDirectedEdgeWithKey('T->M', 'Thomas', 'Martha');

        assert.throws(function() {
          graph.addDirectedEdgeWithKey('T->M', 'Thomas', 'Martha');
        }, /exist/);
      }
    },

    '#.addUndirectedEdgeWithKey': {

    }
  };
}
