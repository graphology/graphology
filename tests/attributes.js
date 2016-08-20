/**
 * Graphology Attributes Specs
 * ============================
 *
 * Testing the attributes-related methods of the graph.
 */
import assert from 'assert';

export default function attributes(Graph, checkers) {
  const {
    notFound
  } = checkers;

  return {
    '#.getNodeAttribute': {

      'it should throw if the node is not found in the graph.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.getNodeAttribute('John', 'test');
        }, notFound());
      },

      'it should return the correct value.': function() {
        const graph = new Graph();
        graph.addNode('Martha', {age: 34});

        assert.strictEqual(graph.getNodeAttribute('Martha', 'age'), 34);
      },

      'it should return undefined if the attribute does not exist.': function() {
        const graph = new Graph();
        graph.addNode('Martha');

        assert.strictEqual(graph.getNodeAttribute('Martha', 'age'), undefined);
      }
    },

    '#.getEdgeAttribute': {
      'it should throw if the edge is not found in the graph.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.getEdgeAttribute('J->M', 'test');
        }, notFound());
      },

      'it should return the correct value.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Thomas']);
        const edge = graph.addEdge('John', 'Thomas', {weight: 2});


        assert.strictEqual(graph.getEdgeAttribute(edge, 'weight'), 2);
      },

      'it should return undefined if the attribute does not exist.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Thomas']);
        const edge = graph.addEdge('John', 'Thomas');

        assert.strictEqual(graph.getEdgeAttribute(edge, 'weight'), undefined);
      }
    }
  };
}
