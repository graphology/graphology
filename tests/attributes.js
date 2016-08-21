/**
 * Graphology Attributes Specs
 * ============================
 *
 * Testing the attributes-related methods of the graph.
 */
import assert from 'assert';
import {deepMerge} from './helpers';

const METHODS = [
  'getNodeAttribute',
  'getNodeAttributes',
  'getEdgeAttribute',
  'getEdgeAttributes',
  'setNodeAttribute',
  'setEdgeAttribute'
];

export default function attributes(Graph, checkers) {
  const {
    notFound
  } = checkers;

  function commonTests(method) {
    return {
      ['#.' + method]: {
        'it should throw if the given path is not found.': function() {
          if (!~method.indexOf('Edge'))
            return;

          const graph = new Graph();

          assert.throws(function() {
            graph[method]('source', 'target', 'name', 'value');
          }, notFound());
        },

        'it should throw if the element is not found in the graph.': function() {
          const graph = new Graph();

          assert.throws(function() {
            graph[method]('Test');
          }, notFound());
        }
      }
    };
  }

  const tests = {};

  METHODS.forEach(method => deepMerge(tests, commonTests(method)));

  return deepMerge(tests, {
    '#.getNodeAttribute': {

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
    },

    '#.getEdgeAttribute': {

      'it should return the correct value.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Thomas']);
        const edge = graph.addEdge('John', 'Thomas', {weight: 2});


        assert.strictEqual(graph.getEdgeAttribute(edge, 'weight'), 2);
        assert.strictEqual(graph.getEdgeAttribute('John', 'Thomas', 'weight'), 2);
      },

      'it should return undefined if the attribute does not exist.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Thomas']);
        const edge = graph.addEdge('John', 'Thomas');

        assert.strictEqual(graph.getEdgeAttribute(edge, 'weight'), undefined);
      }
    },

    '#.getNodeAttributes': {

      'it should return the correct value.': function() {
        const graph = new Graph();
        graph.addNode('Martha', {age: 34});

        assert.deepEqual(graph.getNodeAttributes('Martha'), {age: 34});
      },

      'it should return an empty object if the node does not have attributes.': function() {
        const graph = new Graph();
        graph.addNode('Martha');

        assert.deepEqual(graph.getNodeAttributes('Martha'), {});
      }
    },

    '#.getEdgeAttributes': {

      'it should return the correct value.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Thomas']);
        const edge = graph.addEdge('John', 'Thomas', {weight: 2});


        assert.deepEqual(graph.getEdgeAttributes(edge), {weight: 2});
        assert.deepEqual(graph.getEdgeAttributes('John', 'Thomas'), {weight: 2});
      },

      'it should return undefined if the edge does not have attributes.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Thomas']);
        const edge = graph.addEdge('John', 'Thomas');

        assert.deepEqual(graph.getEdgeAttributes(edge), {});
      }
    },

    '#.setNodeAttribute': {

      'it should correctly set the node\'s attribute.': function() {
        const graph = new Graph();
        graph.addNode('John', {age: 20});

        graph.setNodeAttribute('John', 'age', 45);
        assert.strictEqual(graph.getNodeAttribute('John', 'age'), 45);
      }
    },

    '#.setEdgeAttribute': {
      'it should correctly set the edge\'s attribute.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Martha']);
        const edge = graph.addEdge('John', 'Martha', {weigth: 3});

        graph.setEdgeAttribute(edge, 'weigth', 40);
        assert.strictEqual(graph.getEdgeAttribute(edge, 'weigth'), 40);

        graph.setEdgeAttribute('John', 'Martha', 'weigth', 60);
        assert.strictEqual(graph.getEdgeAttribute(edge, 'weigth'), 60);
      }
    }
  });
}
