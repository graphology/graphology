/**
 * Graphology Edges Iteration Specs
 * ================================
 *
 * Testing the edges iteration-related methods of the graph.
 */
import assert from 'assert';

export default function edgesIteration(Graph) {
  const graph = new Graph();
  graph.addNodesFrom([
    'John',
    'Thomas',
    'Martha',
    'Roger',
    'Catherine',
    'Alone'
  ]);

  graph.addDirectedEdgeWithKey('J->T', 'John', 'Thomas');
  graph.addDirectedEdgeWithKey('J->M', 'John', 'Martha');
  graph.addDirectedEdgeWithKey('C->J', 'Catherine', 'John');

  graph.addUndirectedEdgeWithKey('M<->R', 'Martha', 'Roger');
  graph.addUndirectedEdgeWithKey('M<->J', 'Martha', 'John');
  graph.addUndirectedEdgeWithKey('J<->R', 'John', 'Roger');
  graph.addUndirectedEdgeWithKey('T<->M', 'Thomas', 'Martha');

  return {
    '#.edges': {

      'it should throw if too many arguments are provided.': function() {
        assert.throws(function() {
          graph.edges(1, 2, 3);
        }, /many/);
      },

      'it can return every edge\'s key.': function() {
        const edges = graph.edges();

        assert.deepEqual(edges, [
          'J->T',
          'J->M',
          'C->J',
          'M<->R',
          'M<->J',
          'J<->R',
          'T<->M'
        ]);
      },

      'it should throw when the node is not found.': function() {
        assert.throws(function() {
          graph.edges('Test');
        }, /node/);
      },

      'it should return a node\'s edges.': function() {
        assert.deepEqual(graph.edges('John'), [
          'C->J',
          'J->T',
          'J->M',
          'M<->J',
          'J<->R'
        ]);

        assert.deepEqual(graph.edges('Alone'), []);
      }
    },

    '#.inEdges': {
      'it should throw if too many arguments are provided.': function() {
        assert.throws(function() {
          graph.inEdges(1, 2, 3);
        }, /many/);
      },

      'it can return every directed edge\'s key.': function() {
        const edges = graph.inEdges();

        assert.deepEqual(edges, [
          'J->T',
          'J->M',
          'C->J'
        ]);
      },

      'it should throw when the node is not found.': function() {
        assert.throws(function() {
          graph.inEdges('Test');
        }, /node/);
      },

      'it should return a node\'s in edges.': function() {
        assert.deepEqual(graph.inEdges('John'), [
          'C->J',
        ]);

        assert.deepEqual(graph.inEdges('Alone'), []);
      }
    },

    '#.outEdges': {
      'it should throw if too many arguments are provided.': function() {
        assert.throws(function() {
          graph.outEdges(1, 2, 3);
        }, /many/);
      },

      'it can return every directed edge\'s key.': function() {
        const edges = graph.outEdges();

        assert.deepEqual(edges, [
          'J->T',
          'J->M',
          'C->J'
        ]);
      },

      'it should throw when the node is not found.': function() {
        assert.throws(function() {
          graph.outEdges('Test');
        }, /node/);
      },

      'it should return a node\'s out edges.': function() {
        assert.deepEqual(graph.outEdges('John'), [
          'J->T',
          'J->M'
        ]);

        assert.deepEqual(graph.outEdges('Alone'), []);
      }
    },

    '#.inboundEdges': {
      'it should throw if too many arguments are provided.': function() {
        assert.throws(function() {
          graph.inboundEdges(1, 2, 3);
        }, /many/);
      },

      'it can return every edge\'s key.': function() {
        const edges = graph.inboundEdges();

        assert.deepEqual(edges, [
          'J->T',
          'J->M',
          'C->J',
          'M<->R',
          'M<->J',
          'J<->R',
          'T<->M'
        ]);
      },

      'it should throw when the node is not found.': function() {
        assert.throws(function() {
          graph.inboundEdges('Test');
        }, /node/);
      },

      'it should return a node\'s outbound edges.': function() {
        assert.deepEqual(graph.inboundEdges('John'), [
          'C->J',
          'M<->J'
        ]);

        assert.deepEqual(graph.inboundEdges('Alone'), []);
      }
    },

    '#.outboundEdges': {
      'it should throw if too many arguments are provided.': function() {
        assert.throws(function() {
          graph.outboundEdges(1, 2, 3);
        }, /many/);
      },

      'it can return every edge\'s key.': function() {
        const edges = graph.outboundEdges();

        assert.deepEqual(edges, [
          'J->T',
          'J->M',
          'C->J',
          'M<->R',
          'M<->J',
          'J<->R',
          'T<->M'
        ]);
      },

      'it should throw when the node is not found.': function() {
        assert.throws(function() {
          graph.outboundEdges('Test');
        }, /node/);
      },

      'it should return a node\'s outbound edges.': function() {
        assert.deepEqual(graph.outboundEdges('John'), [
          'J->T',
          'J->M',
          'J<->R'
        ]);

        assert.deepEqual(graph.outboundEdges('Alone'), []);
      }
    },

    '#.directedEdges': {
      'it should throw if too many arguments are provided.': function() {
        assert.throws(function() {
          graph.directedEdges(1, 2, 3);
        }, /many/);
      },

      'it can return every directed edge\'s key.': function() {
        const edges = graph.directedEdges();

        assert.deepEqual(edges, [
          'J->T',
          'J->M',
          'C->J'
        ]);
      },

      'it should throw when the node is not found.': function() {
        assert.throws(function() {
          graph.directedEdges('Test');
        }, /node/);
      },

      'it should return a node\'s directed edges.': function() {
        assert.deepEqual(graph.directedEdges('John'), [
          'C->J',
          'J->T',
          'J->M'
        ]);

        assert.deepEqual(graph.directedEdges('Alone'), []);
      }
    },

    '#.undirectedEdges': {
      'it should throw if too many arguments are provided.': function() {
        assert.throws(function() {
          graph.undirectedEdges(1, 2, 3);
        }, /many/);
      },

      'it can return every undirected edge\'s key.': function() {
        const edges = graph.undirectedEdges();

        assert.deepEqual(edges, [
          'M<->R',
          'M<->J',
          'J<->R',
          'T<->M'
        ]);
      },

      'it should throw when the node is not found.': function() {
        assert.throws(function() {
          graph.undirectedEdges('Test');
        }, /node/);
      },

      'it should return a node\'s undirected edges.': function() {
        assert.deepEqual(graph.undirectedEdges('John'), [
          'M<->J',
          'J<->R'
        ]);

        assert.deepEqual(graph.undirectedEdges('Alone'), []);
      }
    }
  };
}
