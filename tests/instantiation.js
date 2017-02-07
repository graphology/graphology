/* eslint no-unused-vars: 0 */
/**
 * Graphology Instantiation Specs
 * ===============================
 *
 * Testing the instantiation of the graph.
 */
import assert from 'assert';
import {spy} from './helpers';

const CONSTRUCTORS = [
  'DirectedGraph',
  'UndirectedGraph',
  'MultiDirectedGraph',
  'MultiUndirectedGraph'
];

const OPTIONS = [
  {multi: false, type: 'directed'},
  {multi: false, type: 'undirected'},
  {multi: true, type: 'directed'},
  {multi: true, type: 'undirected'}
];

export default function instantiation(Graph, implementation, checkers) {
  const {
    invalid
  } = checkers;

  return {
    'Static #.from method': {

      'it should be possible to create a Graph from a Graph instance.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Thomas']);
        graph.addEdge('John', 'Thomas');

        const other = Graph.from(graph);

        assert.deepEqual(graph.nodes(), other.nodes());
        assert.deepEqual(graph.edges(), other.edges());
      },

      'it should be possible to create a Graph from a serialized graph': function() {
        const graph = Graph.from({
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
      },

      'it should be possible to provide options.': function() {
        const graph = Graph.from({
          node: [
            {key: 'John'}
          ],
          attributes: {
            name: 'Awesome graph'
          }
        }, {type: 'directed'});

        assert.strictEqual(graph.type, 'directed');
        assert.strictEqual(graph.getAttribute('name'), 'Awesome graph');
      }
    },

    'Options': {

      /**
       * allowSelfLoops
       */
      'allowSelfLoops': {

        'providing a non-boolean value should throw.': function() {
          assert.throws(function() {
            const graph = new Graph({allowSelfLoops: 'test'});
          }, invalid());
        }
      },

      /**
       * defaultEdgeAttributes
       */
      'defaultEdgeAttributes': {

        'providing something other than a plain object should throw.': function() {
          assert.throws(function() {
            const graph = new Graph({defaultEdgeAttributes: 'test'});
          }, invalid());
        },

        'it should set default attributes on edges.': function() {
          const graph = new Graph({defaultEdgeAttributes: {type: 'KNOWS'}, multi: true});

          graph.addNodesFrom(['John', 'Martha']);

          let edge = graph.addEdge('John', 'Martha');

          assert.deepEqual(graph.getEdgeAttributes(edge), {type: 'KNOWS'});

          edge = graph.addEdge('John', 'Martha', {weight: 3});

          assert.deepEqual(graph.getEdgeAttributes(edge), {weight: 3, type: 'KNOWS'});

          edge = graph.addEdge('John', 'Martha', {type: 'LIKES'});

          assert.deepEqual(graph.getEdgeAttributes(edge), {type: 'LIKES'});
        }
      },

      /**
       * defaultNodeAttributes
       */
      'defaultNodeAttributes': {

        'providing something other than a plain object should throw.': function() {
          assert.throws(function() {
            const graph = new Graph({defaultNodeAttributes: 'test'});
          }, invalid());
        },

        'it should set default attributes on nodes.': function() {
          const graph = new Graph({defaultNodeAttributes: {eyes: 'blue'}});

          graph.addNode('John');

          assert.deepEqual(graph.getNodeAttributes('John'), {eyes: 'blue'});

          graph.addNode('Thomas', {age: 23});

          assert.deepEqual(graph.getNodeAttributes('Thomas'), {age: 23, eyes: 'blue'});

          graph.addNode('Martha', {eyes: 'green'});

          assert.deepEqual(graph.getNodeAttributes('Martha'), {eyes: 'green'});
        }
      },

      /**
       * edgeKeyGenerator
       */
      'edgeKeyGenerator': {

        'providing something other than a function should throw.': function() {
          assert.throws(function() {
            const graph = new Graph({edgeKeyGenerator: 'test'});
          }, invalid());
        },

        'it should correctly give the edge an id.': function() {
          const edgeKeyGenerator = function({source, target}) {
            return `${source}->${target}`;
          };

          const graph = new Graph({edgeKeyGenerator});
          graph.addNodesFrom(['John', 'Martha', 'Clark']);
          graph.addEdge('John', 'Martha');
          graph.addEdge('Martha', 'Clark');

          assert.deepEqual(graph.edges(), ['John->Martha', 'Martha->Clark']);
        }
      },

      /**
       * multi
       */
      'multi': {

        'providing a non-boolean value should throw.': function() {
          assert.throws(function() {
            const graph = new Graph({multi: 'test'});
          }, invalid());
        }
      },

      /**
       * type
       */
      'type': {

        'providing an invalid type should throw.': function() {
          assert.throws(function() {
            const graph = new Graph({type: 'test'});
          }, invalid());
        }
      }
    },

    'Constructors': {

      'all alternative constructors should be available.': function() {
        CONSTRUCTORS.forEach(name => assert(name in implementation));
      },

      'alternative constructors should have the correct options.': function() {
        CONSTRUCTORS.forEach((name, index) => {
          const graph = new implementation[name]();

          const {
            multi,
            type
          } = OPTIONS[index];

          assert.strictEqual(graph.multi, multi);
          assert.strictEqual(graph.type, type);
        });
      }
    }
  };
}
