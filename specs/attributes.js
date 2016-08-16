/**
 * Graphology Attributes Specs
 * ===============================
 *
 * Testing the attributes methods of the graph.
 */
import assert from 'assert';

export default function attributes(Graph) {
  return {
    '#.getNodeAttribute': {

      'it should throw if the node is not found in the graph.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.getNodeAttribute('John', 'test');
        }, /getNodeAttribute/);
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
    }
  };
}
