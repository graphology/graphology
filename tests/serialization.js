/**
 * Graphology Serializaton Specs
 * ==============================
 *
 * Testing the serialization methods of the graph.
 */
import assert from 'assert';

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
    }
  };
}
