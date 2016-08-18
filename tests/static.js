/**
 * Graphology Static Specs
 * ==========================
 *
 * Testing the static methods of the graph.
 */
import assert from 'assert';

export default function staticMethods(Graph) {
  return {
    '@.isGraph': {
      'it should correctly return whether the given value is a graph.': function() {
        const graph = new Graph();

        const invalid = [
          true,
          false,
          '',
          'test',
          45,
          0,
          [],
          {},
          new Set(),
          new Map()
        ];

        assert.strictEqual(Graph.isGraph(graph), true);

        invalid.forEach(value => {
          assert.strictEqual(Graph.isGraph(value), false);
        });
      }
    }
  }
}
