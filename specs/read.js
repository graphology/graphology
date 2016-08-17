/**
 * Graphology Read Specs
 * ======================
 *
 * Testing the read methods of the graph.
 */
import assert from 'assert';

// TODO: getEdge order

export default function read(Graph) {
  return {
    '#.hasNode': {

      'it should correctly return whether the given node is found in the graph.': function() {
        const graph = new Graph();

        assert.strictEqual(graph.hasNode('John'), false);

        graph.addNode('John');

        assert.strictEqual(graph.hasNode('John'), true);
      }
    },

    '#.getEdge': {
      'it should return undefined if no matching edge is found.': function() {
        const graph = new Graph();

        assert.strictEqual(graph.getEdge('John', 'Catherine'), undefined);
      },

      'it should return the first matching edge.': function() {
        const graph = new Graph();
        graph.addNode('Martha');
        graph.addNode('Catherine');
        graph.addDirectedEdgeWithKey('M->C', 'Martha', 'Catherine');

        assert.strictEqual(graph.getEdge('Martha', 'Catherine'), 'M->C');
      }
    },

    '#.hasEdge': {

      'it should throw if invalid arguments are provided.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.hasEdge(1, 2, 3);
        }, /arity/);
      },

      'it should correctly return whether a matching edge exists in the graph.': function() {
        const graph = new Graph();
        graph.addNode('Martha');
        graph.addNode('Catherine');
        graph.addDirectedEdgeWithKey('M->C', 'Martha', 'Catherine');

        assert.strictEqual(graph.hasEdge('M->C'), true);
        assert.strictEqual(graph.hasEdge('test'), false);
        assert.strictEqual(graph.hasEdge('Martha', 'Catherine'), true);
        assert.strictEqual(graph.hasEdge('Martha', 'Thomas'), false);
      }
    },

    '#.source': {

      'it should throw if the edge is not in the graph.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.source('test');
        }, /find/);
      },

      'it should return the correct source.': function() {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Martha');

        const edge = graph.addDirectedEdge('John', 'Martha');

        assert.strictEqual(graph.source(edge), 'John');
      }
    },

    '#.target': {

      'it should throw if the edge is not in the graph.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.target('test');
        }, /find/);
      },

      'it should return the correct target.': function() {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Martha');

        const edge = graph.addDirectedEdge('John', 'Martha');

        assert.strictEqual(graph.target(edge), 'Martha');
      }
    },

    '#.extremities': {

      'it should throw if the edge is not in the graph.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.extremities('test');
        }, /find/);
      },

      'it should return the correct extremities.': function() {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Martha');

        const edge = graph.addDirectedEdge('John', 'Martha');

        assert.deepEqual(graph.extremities(edge), ['John', 'Martha']);
      }
    },

    '#.directed': {

      'it should throw if the edge is not in the graph.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.directed('test');
        }, /find/);
      },

      'it should correctly return whether the edge is directed or not.': function() {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Rachel');
        graph.addNode('Suzan');

        const directedEdge = graph.addDirectedEdge('John', 'Rachel'),
              undirectedEdge = graph.addUndirectedEdge('Rachel', 'Suzan');

        assert.strictEqual(graph.directed(directedEdge), true);
        assert.strictEqual(graph.directed(undirectedEdge), false);
      }
    },

    '#.undirected': {

      'it should throw if the edge is not in the graph.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.undirected('test');
        }, /find/);
      },

      'it should correctly return whether the edge is undirected or not.': function() {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Rachel');
        graph.addNode('Suzan');

        const directedEdge = graph.addDirectedEdge('John', 'Rachel'),
              undirectedEdge = graph.addUndirectedEdge('Rachel', 'Suzan');

        assert.strictEqual(graph.undirected(directedEdge), false);
        assert.strictEqual(graph.undirected(undirectedEdge), true);
      }
    }
  };
}
