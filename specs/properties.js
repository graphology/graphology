/**
 * Graphology Properties Specs
 * ============================
 *
 * Testing the properties of the graph.
 */
import assert from 'assert';

const PROPERTIES = [
  'order',
  'size',
  'type',
  'multi',
  'map',
  'selfLoops'
];

export default function(Graph, implementation) {

  return {

    /**
     * Regarding all properties.
     */
    'misc': {

      'all expected properties should be set.': function() {

      },

      'properties should be read-only.': function() {

      }
    },

    /**
     * Order.
     */
    '#.order': {

      'it should be 0 if the graph is empty.': function() {
        const graph = new Graph();

        assert(typeof graph.order === 'number');
        assert.strictEqual(graph.order, 0);
      }
    }
  };
}
