/* eslint no-unused-vars: 0 */
/**
 * Graphology Instantiation Specs
 * ===============================
 *
 * Testing the instantiation of the graph.
 */
import assert from 'assert';

const CONSTRUCTORS = [
  'DirectedGraph',
  'UndirectedGraph',
  'MultiDirectedGraph',
  'MultiUndirectedGraph',
  'DirectedGraphMap',
  'UndirectedGraphMap',
  'MultiDirectedGraphMap',
  'MultiUndirectedGraphMap'
];

const OPTIONS = [
  {map: false, multi: false, type: 'directed'},
  {map: false, multi: false, type: 'undirected'},
  {map: false, multi: true, type: 'directed'},
  {map: false, multi: true, type: 'undirected'},
  {map: true, multi: false, type: 'directed'},
  {map: true, multi: false, type: 'undirected'},
  {map: true, multi: true, type: 'directed'},
  {map: true, multi: true, type: 'undirected'}
];

export default function instantiation(Graph, inmplementation) {
  return {
    'Options': {

      /**
       * edgeKeyGenerator
       */
      'edgeKeyGenerator': {

        'providing something other than a function should throw.': function() {
          assert.throws(function() {
            const graph = new Graph(null, {edgeKeyGenerator: 'test'});
          });
        }
      },

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
    },

    'Constructors': {

      'all alternative constructors should be available.': function() {
        CONSTRUCTORS.forEach(name => assert(name in inmplementation));
      },

      'alternative constructors should have the correct options.': function() {
        CONSTRUCTORS.forEach((name, index) => {
          const graph = new inmplementation[name]();

          const {
            map,
            multi,
            type
          } = OPTIONS[index];

          assert.strictEqual(graph.map, map);
          assert.strictEqual(graph.multi, multi);
          assert.strictEqual(graph.type, type);
        });
      }
    }
  };
}
