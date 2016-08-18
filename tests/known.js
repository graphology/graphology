/**
 * Graphology Known Methods Specs
 * ===============================
 *
 * Testing the known methods of the graph.
 */
import assert from 'assert';

export default function knownMethods(Graph) {
  return {
    '#.toString': {

      'it should return a useful string.': function() {
        const graph = new Graph();

        assert.strictEqual(graph.toString(), 'Graph<0 nodes, 0 edges>');
      },

      'it should handle pluralization correctly.': function() {
        const graph = new Graph();
        graph.addNode('John');

        assert.strictEqual(graph.toString(), 'Graph<1 node, 0 edges>');
      },

      'it should pretty print the numbers.': function() {
        const graph = new Graph();

        for (let i = 0; i < 1000; i++)
          graph.addNode(i);

        assert.strictEqual(graph.toString(), 'Graph<1,000 nodes, 0 edges>');
      }
    }
  };
}
