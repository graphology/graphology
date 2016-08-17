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

        assert(typeof edge === 'string' || typeof edge === 'number');
        assert(!(edge instanceof Graph));
      }
    },

    '#.addEdge': {
      'it should add a directed edge if the graph is directed or mixed.': function() {
        const graph = new Graph(),
              directedGraph = new Graph(null, {type: 'directed'});

        graph.addNode('John');
        graph.addNode('Martha');
        const mixedEdge = graph.addEdge('John', 'Martha');

        directedGraph.addNode('John');
        directedGraph.addNode('Martha');
        const directedEdge = directedGraph.addEdge('John', 'Martha');

        assert(graph.directed(mixedEdge));
        assert(directedGraph.directed(directedEdge));
      },

      'it should add an undirected edge if the graph is undirected.': function() {
        const graph = new Graph(null, {type: 'undirected'});

        graph.addNode('John');
        graph.addNode('Martha');
        const edge = graph.addEdge('John', 'Martha');

        assert(graph.undirected(edge));
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

        assert.throws(function() {
          graph.addUndirectedEdgeWithKey('T->M', 'Thomas', 'Martha');
        }, /exist/);

      }
    },

    '#.addUndirectedEdgeWithKey': {

      'it should throw if an edge with the same key already exists.': function() {
        const graph = new Graph();

        graph.addNode('Thomas');
        graph.addNode('Martha');

        graph.addUndirectedEdgeWithKey('T<->M', 'Thomas', 'Martha');

        assert.throws(function() {
          graph.addUndirectedEdgeWithKey('T<->M', 'Thomas', 'Martha');
        }, /exist/);

        assert.throws(function() {
          graph.addDirectedEdgeWithKey('T<->M', 'Thomas', 'Martha');
        }, /exist/);
      }
    },

    '#.addEdgeWithKey': {
      'it should add a directed edge if the graph is directed or mixed.': function() {
        const graph = new Graph(),
              directedGraph = new Graph(null, {type: 'directed'});

        graph.addNode('John');
        graph.addNode('Martha');
        const mixedEdge = graph.addEdgeWithKey('J->M', 'John', 'Martha');

        directedGraph.addNode('John');
        directedGraph.addNode('Martha');
        const directedEdge = directedGraph.addEdgeWithKey('J->M', 'John', 'Martha');

        assert(graph.directed(mixedEdge));
        assert(directedGraph.directed(directedEdge));
      },

      'it should add an undirected edge if the graph is undirected.': function() {
        const graph = new Graph(null, {type: 'undirected'});

        graph.addNode('John');
        graph.addNode('Martha');
        const edge = graph.addEdgeWithKey('J<->M', 'John', 'Martha');

        assert(graph.undirected(edge));
      }
    }
  };
}
