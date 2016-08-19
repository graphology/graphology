/**
 * Graphology Mutation Specs
 * ==========================
 *
 * Testing the mutation methods of the graph.
 */
import assert from 'assert';
import {BUNCH_TYPES, NON_BUNCH_TYPES, testBunches} from './helpers';

export default function mutation(Graph, checkers) {
  const {
    invalid,
    notFound,
    usage
  } = checkers;

  return {
    '#.addNode': {

      'it should throw if given attributes is not an object.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.addNode('test', true);
        }, invalid());
      },

      'it should throw if the given node already exist.': function() {
        const graph = new Graph();
        graph.addNode('Martha');

        assert.throws(function() {
          graph.addNode('Martha');
        }, usage());
      },

      'it should return the added node.': function() {
        const graph = new Graph();

        assert.strictEqual(graph.addNode('John'), 'John');
      }
    },

    '#.addNodesFrom': {

      'it should throw if the given bunch is not valid.': function() {
        const graph = new Graph();

        BUNCH_TYPES.forEach(bunch => {
          assert.doesNotThrow(() => graph.addNodesFrom(bunch));
        });

        NON_BUNCH_TYPES.forEach(bunch => {
          assert.throws(() => graph.addNodesFrom(bunch), /invalid/);
        });
      },

      'it should be possible to add nodes from various bunches.': function() {

        testBunches({Eliot: {age: 34}, Jasmin: {age: 25}}, (bunch, attr) => {
          const graph = new Graph();
          graph.addNodesFrom(bunch);

          assert(graph.order, 2);
          assert(graph.hasNode('Eliot'));
          assert(graph.hasNode('Jasmin'));

          if (attr) {
            assert.strictEqual(graph.getNodeAttribute('Eliot', 'age'), 34);
            assert.strictEqual(graph.getNodeAttribute('Jasmin', 'age'), 25);
          }
        });
      }
    },

    '#.addDirectedEdge': {

      'it should throw if given attributes is not an object.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.addDirectedEdge('source', 'target', true);
        }, invalid());
      },

      'it should throw if the graph is undirected.': function() {
        const graph = new Graph(null, {type: 'undirected'});

        assert.throws(function() {
          graph.addDirectedEdge('source', 'target');
        }, usage());
      },

      'it should throw if either the source or the target does not exist.': function() {
        const graph = new Graph();
        graph.addNode('Martha');

        assert.throws(function() {
          graph.addDirectedEdge('Thomas', 'Eric');
        }, notFound());

        assert.throws(function() {
          graph.addDirectedEdge('Martha', 'Eric');
        }, notFound());
      },

      'it should throw if the edge is a loop and the graph does not allow it.': function() {
        const graph = new Graph(null, {allowSelfLoops: false});

        graph.addNode('Thomas');

        assert.throws(function() {
          graph.addDirectedEdge('Thomas', 'Thomas');
        }, usage());
      },

      'it should be possible to add self loops.': function() {
        const graph = new Graph();

        graph.addNode('Thomas');

        const loop = graph.addDirectedEdge('Thomas', 'Thomas');

        assert.deepEqual(graph.extremities(loop), ['Thomas', 'Thomas']);
      },

      'it should throw if the graph is not multi & we try to add twice the same edge.': function() {
        const graph = new Graph();
        graph.addNode('Thomas');
        graph.addNode('Martha');

        graph.addDirectedEdge('Thomas', 'Martha');

        assert.throws(function() {
          graph.addDirectedEdge('Thomas', 'Martha');
        }, usage());

        assert.throws(function() {
          graph.addUndirectedEdge('Thomas', 'Martha');
        }, usage());

        assert.throws(function() {
          graph.addDirectedEdgeWithKey('T->M', 'Thomas', 'Martha');
        }, usage());

        assert.throws(function() {
          graph.addUndirectedEdgeWithKey('T<->M', 'Thomas', 'Martha');
        }, usage());
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
        }, usage());

        assert.throws(function() {
          graph.addUndirectedEdgeWithKey('T->M', 'Thomas', 'Martha');
        }, usage());

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
        }, usage());

        assert.throws(function() {
          graph.addDirectedEdgeWithKey('T<->M', 'Thomas', 'Martha');
        }, usage());
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
    },

    '#.clear': {

      'it should empty the graph.': function() {
        const graph = new Graph();

        graph.addNodesFrom(['Lindsay', 'Martha']);
        const edge = graph.addEdge('Lindsay', 'Martha');

        graph.clear();

        assert.strictEqual(graph.order, 0);
        assert.strictEqual(graph.size, 0);
        assert.strictEqual(graph.hasNode('Lindsay'), false);
        assert.strictEqual(graph.hasNode('Martha'), false);
        assert.strictEqual(graph.hasEdge(edge), false);
      },

      'it should be possible to use the graph normally afterwards.': function() {
        const graph = new Graph();

        graph.addNodesFrom(['Lindsay', 'Martha']);
        graph.addEdge('Lindsay', 'Martha');

        graph.clear();

        graph.addNodesFrom(['Lindsay', 'Martha']);
        const edge = graph.addEdge('Lindsay', 'Martha');

        assert.strictEqual(graph.order, 2);
        assert.strictEqual(graph.size, 1);
        assert.strictEqual(graph.hasNode('Lindsay'), true);
        assert.strictEqual(graph.hasNode('Martha'), true);
        assert.strictEqual(graph.hasEdge(edge), true);
      }
    }
  };
}
