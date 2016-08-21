/**
 * Graphology Serializaton Specs
 * ==============================
 *
 * Testing the serialization methods of the graph.
 */
import assert from 'assert';
import {testBunches} from './helpers';

export default function serialization(Graph, checkers) {
  const {
    notFound
  } = checkers;

  return {
    '#.exportNode': {
      'it should throw if the node does not exist.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.exportNode('Test');
        }, notFound());
      },

      'it should properly serialize nodes.': function() {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Jack', {age: 34});

        assert.deepEqual(graph.exportNode('John'), ['John']);
        assert.deepEqual(graph.exportNode('Jack'), ['Jack', {age: 34}]);
      }
    },

    '#.exportEdge': {
      'it should throw if the edge does not exist.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.exportEdge('Test');
        }, notFound());
      },

      'it should properly serialize edges.': function() {
        const graph = new Graph(null, {multi: true});
        graph.addNodesFrom(['John', 'Martha']);
        graph.addEdgeWithKey('J->M•1', 'John', 'Martha');
        graph.addEdgeWithKey('J->M•2', 'John', 'Martha', {weight: 1});
        graph.addUndirectedEdgeWithKey('J<->M•1', 'John', 'Martha');
        graph.addUndirectedEdgeWithKey('J<->M•2', 'John', 'Martha', {weight: 2});

        assert.deepEqual(graph.exportEdge('J->M•1'), ['J->M•1', 'John', 'Martha']);
        assert.deepEqual(graph.exportEdge('J->M•2'), ['J->M•2', 'John', 'Martha', {weight: 1}]);
        assert.deepEqual(graph.exportEdge('J<->M•1'), ['J<->M•1', 'John', 'Martha', {}, true]);
        assert.deepEqual(graph.exportEdge('J<->M•2'), ['J<->M•2', 'John', 'Martha', {weight: 2}, true]);
      }
    },

    '#.exportNodes': {
      'it should throw if any of the provided nodes does not exist.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.exportNodes(['Test']);
        }, notFound());
      },

      'it should return all the nodes serialized if no arguments are provided.': function() {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Jack', {age: 34});

        assert.deepEqual(graph.exportNodes(), [
          ['John'],
          ['Jack', {age: 34}]
        ]);
      },

      'it should return the serialized nodes from the given bunch.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Jack', 'Martha']);

        testBunches(['John', 'Martha'], bunch => {
          assert.deepEqual(graph.exportNodes(bunch), [
            ['John'],
            ['Martha']
          ]);
        });
      }
    },

    '#.exportEdges': {
      'it should throw if any of the provided edges does not exist.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.exportEdges(['Test']);
        }, notFound());
      },

      'it should return all the edges serialized if no arguments are provided.': function() {
        const graph = new Graph(null, {multi: true});
        graph.addNode('John');
        graph.addNode('Jack');
        graph.addEdgeWithKey('J->J•1', 'John', 'Jack');
        graph.addEdgeWithKey('J->J•2', 'John', 'Jack', {weight: 2});

        assert.deepEqual(graph.exportEdges(), [
          ['J->J•1', 'John', 'Jack'],
          ['J->J•2', 'John', 'Jack', {weight: 2}]
        ]);
      },

      'it should return the serialized edges from the given bunch.': function() {
        const graph = new Graph(null, {multi: true});
        graph.addNodesFrom(['John', 'Jack', 'Martha']);
        graph.addEdgeWithKey('J->J•1', 'John', 'Jack');
        graph.addEdgeWithKey('J->J•2', 'John', 'Jack', {weight: 2});
        graph.addEdgeWithKey('J->J•3', 'John', 'Jack');

        testBunches(['J->J•1', 'J->J•3'], bunch => {
          assert.deepEqual(graph.exportEdges(bunch), [
            ['J->J•1', 'John', 'Jack'],
            ['J->J•3', 'John', 'Jack']
          ]);
        });
      }
    },

    '#.exportDirectedEdges': {
      'it should throw if any of the provided edges does not exist.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.exportDirectedEdges(['Test']);
        }, notFound());
      },

      'it should return all the directed edges serialized if no arguments are provided.': function() {
        const graph = new Graph(null, {multi: true});
        graph.addNode('John');
        graph.addNode('Jack');
        graph.addEdgeWithKey('J->J•1', 'John', 'Jack');
        graph.addEdgeWithKey('J->J•2', 'John', 'Jack', {weight: 2});
        graph.addUndirectedEdgeWithKey('J<->J•1', 'John', 'Jack');
        graph.addUndirectedEdgeWithKey('J<->J•2', 'John', 'Jack');

        assert.deepEqual(graph.exportDirectedEdges(), [
          ['J->J•1', 'John', 'Jack'],
          ['J->J•2', 'John', 'Jack', {weight: 2}]
        ]);
      },

      'it should return the serialized directed edges from the given bunch.': function() {
        const graph = new Graph(null, {multi: true});
        graph.addNodesFrom(['John', 'Jack', 'Martha']);
        graph.addEdgeWithKey('J->J•1', 'John', 'Jack');
        graph.addEdgeWithKey('J->J•2', 'John', 'Jack', {weight: 2});
        graph.addEdgeWithKey('J->J•3', 'John', 'Jack');
        graph.addUndirectedEdgeWithKey('J<->J•1', 'John', 'Jack');
        graph.addUndirectedEdgeWithKey('J<->J•2', 'John', 'Jack');

        testBunches(['J->J•1', 'J->J•3', 'J<->J•2'], bunch => {
          assert.deepEqual(graph.exportDirectedEdges(bunch), [
            ['J->J•1', 'John', 'Jack'],
            ['J->J•3', 'John', 'Jack']
          ]);
        });
      }
    },

    '#.exportUndirectedEdges': {
      'it should throw if any of the provided edges does not exist.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.exportUndirectedEdges(['Test']);
        }, notFound());
      },

      'it should return all the undirected edges serialized if no arguments are provided.': function() {
        const graph = new Graph(null, {multi: true});
        graph.addNode('John');
        graph.addNode('Jack');
        graph.addEdgeWithKey('J->J•1', 'John', 'Jack');
        graph.addEdgeWithKey('J->J•2', 'John', 'Jack', {weight: 2});
        graph.addUndirectedEdgeWithKey('J<->J•1', 'John', 'Jack');
        graph.addUndirectedEdgeWithKey('J<->J•2', 'John', 'Jack');

        assert.deepEqual(graph.exportUndirectedEdges(), [
          ['J<->J•1', 'John', 'Jack', {}, true],
          ['J<->J•2', 'John', 'Jack', {}, true]
        ]);
      },

      'it should return the serialized undirected edges from the given bunch.': function() {
        const graph = new Graph(null, {multi: true});
        graph.addNodesFrom(['John', 'Jack', 'Martha']);
        graph.addEdgeWithKey('J->J•1', 'John', 'Jack');
        graph.addEdgeWithKey('J->J•2', 'John', 'Jack', {weight: 2});
        graph.addEdgeWithKey('J->J•3', 'John', 'Jack');
        graph.addUndirectedEdgeWithKey('J<->J•1', 'John', 'Jack');
        graph.addUndirectedEdgeWithKey('J<->J•2', 'John', 'Jack');

        testBunches(['J->J•1', 'J->J•3', 'J<->J•2'], bunch => {
          assert.deepEqual(graph.exportUndirectedEdges(bunch), [
            ['J<->J•2', 'John', 'Jack', {}, true]
          ]);
        });
      }
    }
  };
}
