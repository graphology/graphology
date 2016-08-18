/**
 * Graphology Nodes Iteration Specs
 * ================================
 *
 * Testing the nodes iteration-related methods of the graph.
 */
import assert from 'assert';

export default function nodesIteration(Graph) {
  return {
    '#.nodes': {
      'it should return the list of nodes of the graph.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['one', 'two', 'three']);

        assert.deepEqual(graph.nodes(), ['one', 'two', 'three']);
      }
    },
    'Reducers': {

      '#.reduceNodes': {
        'it should throw if a non-function is passed.': function() {
          const graph = new Graph();

          assert.throws(function() {
            graph.reduceNodes(true);
          }, /Graph/);
        },

        'it should correctly reduce the nodes of the graph.': function() {
          const graph = new Graph();
          graph.addNodesFrom(['one', 'two']);

          const value = graph.reduceNodes(function(current, node, index, instance) {
            assert(typeof index === 'number');
            assert.strictEqual(instance, graph);

            // We'll pass here only once
            assert.strictEqual(index, 1);
            assert.strictEqual(current, 'one');
            assert.strictEqual(node, 'two');

            return current + node;
          });

          assert.strictEqual(value, 'onetwo');
        },

        'it should correctly reduce the nodes of the graph using an initial value.': function() {
          const graph = new Graph();
          graph.addNodesFrom(['one', 'two']);

          const value = graph.reduceNodes(function(current, node, index) {
            return current.concat(index);
          }, []);

          assert.deepEqual(value, [0, 1]);
        }
      },

      '#.forEachNode': {
        'it should throw if a non-function is passed.': function() {
          const graph = new Graph();

          assert.throws(function() {
            graph.forEachNode(true);
          }, /Graph/);
        },

        'it should correctly iterate over the nodes of the graph.': function() {
          const graph = new Graph();
          graph.addNodesFrom(['one', 'two']);

          const returnValue = graph.forEachNode(function(node, index, instance) {
            assert(typeof index === 'number');
            assert.strictEqual(node, !index ? 'one' : 'two');
            assert.strictEqual(instance, graph);
          });

          assert.strictEqual(returnValue, graph);
        }
      },

      '#.mapNodes': {
        'it should throw if a non-function is passed.': function() {
          const graph = new Graph();

          assert.throws(function() {
            graph.mapNodes(true);
          }, /Graph/);
        },

        'it should correctly map the nodes of the graph.': function() {
          const graph = new Graph();
          graph.addNodesFrom({
            one: {age: 1},
            two: {age: 2}
          });

          const ages = graph.mapNodes(function(node) {
            return graph.getNodeAttribute(node, 'age');
          });

          assert.deepEqual(ages, [1, 2]);
        }
      },

      '#.filterNodes': {
        'it should throw if a non-function is passed.': function() {
          const graph = new Graph();

          assert.throws(function() {
            graph.filterNodes(true);
          }, /Graph/);
        },

        'it should correctly filter the nodes of the graph.': function() {
          const graph = new Graph();
          graph.addNodesFrom({
            one: {age: 1},
            two: {age: 2}
          });

          const nodes = graph.filterNodes(function(node) {
            return graph.getNodeAttribute(node, 'age') > 1;
          });

          assert.deepEqual(nodes, ['two']);
        }
      },

      '#.findNode': {
        'it should throw if a non-function is passed.': function() {
          const graph = new Graph();

          assert.throws(function() {
            graph.findNode(true);
          }, /Graph/);
        },

        'it should correctly find node or return undefined.': function() {
          const graph = new Graph();
          graph.addNodesFrom({
            one: {age: 1},
            two: {age: 2}
          });

          assert.strictEqual(
            graph.findNode(node => graph.getNodeAttribute(node, 'age') === 2),
            'two'
          );

          assert.strictEqual(
            graph.findNode(node => graph.getNodeAttribute(node, 'age') === 3),
            undefined
          );
        }
      },

      '#.someNode': {
        'it should throw if a non-function is passed.': function() {
          const graph = new Graph();

          assert.throws(function() {
            graph.someNode(true);
          }, /Graph/);
        },

        'it should correctly find node or return undefined.': function() {
          const graph = new Graph();
          graph.addNodesFrom({
            one: {age: 1},
            two: {age: 2}
          });

          assert.strictEqual(
            graph.someNode(node => graph.getNodeAttribute(node, 'age') === 2),
            true
          );

          assert.strictEqual(
            graph.someNode(node => graph.getNodeAttribute(node, 'age') === 3),
            false
          );
        }
      },

      '#.everyNode': {
        'it should throw if a non-function is passed.': function() {
          const graph = new Graph();

          assert.throws(function() {
            graph.everyNode(true);
          }, /Graph/);
        },

        'it should correctly find node or return undefined.': function() {
          const graph = new Graph();
          graph.addNodesFrom({
            one: {age: 1, value: 2},
            two: {age: 2, value: 2}
          });

          assert.strictEqual(
            graph.everyNode(node => graph.getNodeAttribute(node, 'age') === 2),
            false
          );

          assert.strictEqual(
            graph.everyNode(node => graph.getNodeAttribute(node, 'value') === 2),
            true
          );
        }
      }
    }
  };
}
