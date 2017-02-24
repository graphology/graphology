/**
 * Graphology Utils Specs
 * =======================
 *
 * Testing the utils methods.
 */
import assert from 'assert';

const PROPERTIES = [
  'type',
  'multi',
  'map',
  'selfLoops'
];

export default function utils(Graph) {
  return {
    '#.emptyCopy': {
      'it should create an empty copy of the graph.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Thomas']);
        graph.addEdge('John', 'Thomas');

        const copy = graph.emptyCopy();

        assert.deepEqual(copy.nodes(), []);
        assert.strictEqual(copy.order, 0);
        assert.strictEqual(copy.size, 0);

        PROPERTIES.forEach(property => {
          assert.strictEqual(graph[property], copy[property]);
        });
      }
    },

    '#.copy': {
      'it should create a full copy of the graph.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Thomas']);
        graph.addEdge('John', 'Thomas');

        const copy = graph.copy();

        assert.deepEqual(copy.nodes(), graph.nodes());
        assert.deepEqual(copy.edges(), graph.edges());
        assert.strictEqual(copy.order, 2);
        assert.strictEqual(copy.size, 1);

        PROPERTIES.forEach(property => {
          assert.strictEqual(graph[property], graph[property]);
        });
      }
    },

    '#.upgradeToMixed': {
      'it should correctly upgrade the given graph to a mixed one.': function() {
        const graph = new Graph({type: 'directed'});
        graph.addNodesFrom([1, 2, 3]);
        graph.addEdgeWithKey('1->2', 1, 2);

        graph.upgradeToMixed();

        assert.strictEqual(graph.type, 'mixed');

        graph.addUndirectedEdge(2, 3);

        assert.strictEqual(graph.size, 2);
        assert.strictEqual(graph.degree(2), 2);
      }
    },

    '#.upgradeToMulti': {
      'it should correctly upgrade the given graph to a multi one.': function() {
        const graph = new Graph();
        graph.addNodesFrom([1, 2]);
        graph.addEdgeWithKey('dA', 1, 2);
        graph.addUndirectedEdgeWithKey('uA', 1, 2);

        graph.upgradeToMulti();

        assert.strictEqual(graph.multi, true);

        graph.addEdgeWithKey('dB', 1, 2);
        graph.addUndirectedEdgeWithKey('uB', 1, 2);

        assert.strictEqual(graph.size, 4);

        assert.deepEqual(graph.edges(), ['dA', 'uA', 'dB', 'uB']);
      }
    }
  };
}
