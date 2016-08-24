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
  'GraphMap',
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
  {map: true, multi: false, type: 'mixed'},
  {map: true, multi: false, type: 'directed'},
  {map: true, multi: false, type: 'undirected'},
  {map: true, multi: true, type: 'directed'},
  {map: true, multi: true, type: 'undirected'}
];

export default function instantiation(Graph, inmplementation, checkers) {
  const {
    invalid
  } = checkers;

  return {
    'Hydratation': {

      'it should be possible to hydrate from a serialized graph.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Thomas']);
        graph.addEdge('John', 'Thomas');

        const other = new Graph(graph);

        assert.deepEqual(graph.nodes(), other.nodes());
        assert.deepEqual(graph.edges(), other.edges());
      },

      'it should be possible to hydrate from a Graph instance.': function() {
        const graph = new Graph({
          nodes: [
            {key: 'John'},
            {key: 'Thomas'}
          ],
          edges: [
            {source: 'John', target: 'Thomas'}
          ]
        });

        assert.deepEqual(graph.nodes(), ['John', 'Thomas']);
        assert.strictEqual(graph.hasEdge('John', 'Thomas'), true);
      }
    },

    'Options': {

      /**
       * edgeKeyGenerator
       */
      'edgeKeyGenerator': {

        'providing something other than a function should throw.': function() {
          assert.throws(function() {
            const graph = new Graph(null, {edgeKeyGenerator: 'test'});
          }, invalid());
        }
      },

      /**
       * map
       */
      'map': {

        'providing a non-boolean value should throw.': function() {
          assert.throws(function() {
            const graph = new Graph(null, {map: 'test'});
          }, invalid());
        }
      },

      /**
       * multi
       */
      'multi': {

        'providing a non-boolean value should throw.': function() {
          assert.throws(function() {
            const graph = new Graph(null, {multi: 'test'});
          }, invalid());
        }
      },

      /**
       * type
       */
      'type': {

        'providing an invalid type should throw.': function() {
          assert.throws(function() {
            const graph = new Graph(null, {type: 'test'});
          }, invalid());
        }
      },

      /**
       * selfLoops
       */
      'selfLoops': {

        'providing a non-boolean value should throw.': function() {
          assert.throws(function() {
            const graph = new Graph(null, {allowSelfLoops: 'test'});
          }, invalid());
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
