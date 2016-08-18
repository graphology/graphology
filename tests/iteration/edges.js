/**
 * Graphology Edges Iteration Specs
 * ================================
 *
 * Testing the edges iteration-related methods of the graph.
 */
import assert from 'assert';

export default function edges(Graph) {
  const graph = new Graph();
  graph.addNodesFrom([
    'John',
    'Thomas',
    'Martha',
    'Roger',
    'Catherine'
  ]);

  graph.addDirectedEdgeWithKey('J->T', 'John', 'Thomas');
  graph.addDirectedEdgeWithKey('J->M', 'John', 'Martha');
  graph.addDirectedEdgeWithKey('C->J', 'Catherine', 'John');

  graph.addUndirectedEdgeWithKey('M<->R', 'Martha', 'Roger');
  graph.addUndirectedEdgeWithKey('T<->M', 'Thomas', 'Martha');

  return {
    '#.edges': {

      'it should throw if too many arguments are provided.': function() {
        assert.throws(function() {
          graph.edges(1, 2, 3);
        }, /many/);
      },

      'it can return every edge\'s key.': function() {
        const edges = graph.edges();

        assert.deepEqual(edges, [
          'J->T',
          'J->M',
          'C->J',
          'M<->R',
          'T<->M'
        ]);
      }
    },

    '#.inEdges': {
      'it should throw if too many arguments are provided.': function() {
        assert.throws(function() {
          graph.inEdges(1, 2, 3);
        }, /many/);
      },

      'it can return every directed edge\'s key.': function() {
        const edges = graph.inEdges();

        assert.deepEqual(edges, [
          'J->T',
          'J->M',
          'C->J'
        ]);
      }
    },

    '#.outEdges': {
      'it should throw if too many arguments are provided.': function() {
        assert.throws(function() {
          graph.outEdges(1, 2, 3);
        }, /many/);
      },

      'it can return every directed edge\'s key.': function() {
        const edges = graph.outEdges();

        assert.deepEqual(edges, [
          'J->T',
          'J->M',
          'C->J'
        ]);
      }
    },

    '#.inboundEdges': {
      'it should throw if too many arguments are provided.': function() {
        assert.throws(function() {
          graph.inboundEdges(1, 2, 3);
        }, /many/);
      },

      'it can return every edge\'s key.': function() {
        const edges = graph.inboundEdges();

        assert.deepEqual(edges, [
          'J->T',
          'J->M',
          'C->J',
          'M<->R',
          'T<->M'
        ]);
      }
    },

    '#.outboundEdges': {
      'it should throw if too many arguments are provided.': function() {
        assert.throws(function() {
          graph.outboundEdges(1, 2, 3);
        }, /many/);
      },

      'it can return every edge\'s key.': function() {
        const edges = graph.outboundEdges();

        assert.deepEqual(edges, [
          'J->T',
          'J->M',
          'C->J',
          'M<->R',
          'T<->M'
        ]);
      }
    },

    '#.directedEdges': {
      'it should throw if too many arguments are provided.': function() {
        assert.throws(function() {
          graph.directedEdges(1, 2, 3);
        }, /many/);
      },

      'it can return every directed edge\'s key.': function() {
        const edges = graph.directedEdges();

        assert.deepEqual(edges, [
          'J->T',
          'J->M',
          'C->J'
        ]);
      }
    },

    '#.undirectedEdges': {
      'it should throw if too many arguments are provided.': function() {
        assert.throws(function() {
          graph.undirectedEdges(1, 2, 3);
        }, /many/);
      },

      'it can return every undirected edge\'s key.': function() {
        const edges = graph.undirectedEdges();

        assert.deepEqual(edges, [
          'M<->R',
          'T<->M'
        ]);
      }
    }
  };
}
