/**
 * Graphology Instantiation Specs
 * ===============================
 *
 * Testing the instantiation of the graph.
 */
import assert from 'assert';

export default function instantiation(Graph, implementation) {
  return {
    'Options': {

      /**
       * map
       */
      'map': {

        'providing a non-boolean value should throw.': function() {
          assert.throws(function() {
            const graph = new Graph(null, {map: 'test'});
          }, /constructor/);
        }
      },

      /**
       * multi
       */
      'multi': {

        'providing a non-boolean value should throw.': function() {
          assert.throws(function() {
            const graph = new Graph(null, {multi: 'test'});
          }, /constructor/);
        }
      },

      /**
       * type
       */
      'type': {

        'providing an invalid type should throw.': function() {
          assert.throws(function() {
            const graph = new Graph(null, {type: 'test'});
          }, /constructor/);
        }
      }
    }
  };
}
