/* eslint no-unused-vars: 0 */
/**
 * Graphology Instantiation Specs
 * ===============================
 *
 * Testing the instantiation of the graph.
 */
import assert from 'assert';
import {addNodesFrom} from './helpers';

const CONSTRUCTORS = [
  'DirectedGraph',
  'UndirectedGraph',
  'MultiGraph',
  'MultiDirectedGraph',
  'MultiUndirectedGraph'
];

const OPTIONS = [
  {multi: false, type: 'directed'},
  {multi: false, type: 'undirected'},
  {multi: true, type: 'mixed'},
  {multi: true, type: 'directed'},
  {multi: true, type: 'undirected'}
];

export default function instantiation(Graph, implementation, checkers) {
  const {invalid} = checkers;

  return {
    'Static #.from method': {
      'it should be possible to create a Graph from a Graph instance.':
        function () {
          const graph = new Graph();
          addNodesFrom(graph, ['John', 'Thomas']);
          graph.addEdge('John', 'Thomas');

          const other = Graph.from(graph);

          assert.deepStrictEqual(graph.nodes(), other.nodes());
          assert.deepStrictEqual(graph.edges(), other.edges());
        },

      'it should be possible to create a Graph from a serialized graph':
        function () {
          const graph = Graph.from({
            nodes: [{key: 'John'}, {key: 'Thomas'}],
            edges: [{source: 'John', target: 'Thomas'}]
          });

          assert.deepStrictEqual(graph.nodes(), ['John', 'Thomas']);
          assert.strictEqual(graph.hasEdge('John', 'Thomas'), true);
        },

      'it should be possible to provide options.': function () {
        const graph = Graph.from(
          {
            node: [{key: 'John'}],
            attributes: {
              name: 'Awesome graph'
            }
          },
          {type: 'directed'}
        );

        assert.strictEqual(graph.type, 'directed');
        assert.strictEqual(graph.getAttribute('name'), 'Awesome graph');
      },

      'it should be possible to take options from the serialized format.':
        function () {
          const graph = Graph.from({
            node: [{key: 'John'}],
            attributes: {
              name: 'Awesome graph'
            },
            options: {
              type: 'directed',
              multi: true
            }
          });

          assert.strictEqual(graph.type, 'directed');
          assert.strictEqual(graph.multi, true);
          assert.strictEqual(graph.getAttribute('name'), 'Awesome graph');
        },

      'given options should take precedence over the serialization ones.':
        function () {
          const graph = Graph.from(
            {
              node: [{key: 'John'}],
              attributes: {
                name: 'Awesome graph'
              },
              options: {
                type: 'directed',
                multi: true
              }
            },
            {type: 'undirected'}
          );

          assert.strictEqual(graph.type, 'undirected');
          assert.strictEqual(graph.multi, true);
          assert.strictEqual(graph.getAttribute('name'), 'Awesome graph');
        }
    },

    Options: {
      /**
       * allowSelfLoops
       */
      allowSelfLoops: {
        'providing a non-boolean value should throw.': function () {
          assert.throws(function () {
            const graph = new Graph({allowSelfLoops: 'test'});
          }, invalid());
        }
      },

      /**
       * multi
       */
      multi: {
        'providing a non-boolean value should throw.': function () {
          assert.throws(function () {
            const graph = new Graph({multi: 'test'});
          }, invalid());
        }
      },

      /**
       * type
       */
      type: {
        'providing an invalid type should throw.': function () {
          assert.throws(function () {
            const graph = new Graph({type: 'test'});
          }, invalid());
        }
      }
    },

    Constructors: {
      'all alternative constructors should be available.': function () {
        CONSTRUCTORS.forEach(name => assert(name in implementation));
      },

      'alternative constructors should have the correct options.': function () {
        CONSTRUCTORS.forEach((name, index) => {
          const graph = new implementation[name]();

          const {multi, type} = OPTIONS[index];

          assert.strictEqual(graph.multi, multi);
          assert.strictEqual(graph.type, type);
        });
      },

      'alternative constructors should throw if given inconsistent options.':
        function () {
          CONSTRUCTORS.forEach((name, index) => {
            const {multi, type} = OPTIONS[index];

            assert.throws(function () {
              const graph = new implementation[name]({multi: !multi});
            }, invalid());

            if (type === 'mixed') return;

            assert.throws(function () {
              const graph = new implementation[name]({
                type: type === 'directed' ? 'undirected' : 'directed'
              });
            }, invalid());
          });
        }
    }
  };
}
