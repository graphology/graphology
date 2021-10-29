/**
 * Graphology Nodes Iteration Specs
 * =================================
 *
 * Testing the nodes iteration-related methods of the graph.
 */
import assert from 'assert';
import {addNodesFrom} from '../helpers';

export default function nodesIteration(Graph, checkers) {
  const {invalid} = checkers;

  return {
    '#.nodes': {
      'it should return the list of nodes of the graph.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['one', 'two', 'three']);

        assert.deepStrictEqual(graph.nodes(), ['one', 'two', 'three']);
      }
    },

    '#.forEachNode': {
      'it should throw if given callback is not a function.': function () {
        const graph = new Graph();

        assert.throws(function () {
          graph.forEachNode(null);
        }, invalid());
      },

      'it should be possible to iterate over nodes and their attributes.':
        function () {
          const graph = new Graph();

          graph.addNode('John', {age: 34});
          graph.addNode('Martha', {age: 33});

          let count = 0;

          graph.forEachNode(function (key, attributes) {
            assert.strictEqual(key, count ? 'Martha' : 'John');
            assert.deepStrictEqual(attributes, count ? {age: 33} : {age: 34});
            count++;
          });

          assert.strictEqual(count, 2);
        }
    },

    '#.findNode': {
      'it should throw if given callback is not a function.': function () {
        const graph = new Graph();

        assert.throws(function () {
          graph.findNode(null);
        }, invalid());
      },

      'it should be possible to find a node in the graph.': function () {
        const graph = new Graph();

        graph.addNode('John', {age: 34});
        graph.addNode('Martha', {age: 33});

        let count = 0;

        let found = graph.findNode(function (key, attributes) {
          assert.strictEqual(key, 'John');
          assert.deepStrictEqual(attributes, {age: 34});
          count++;

          if (key === 'John') return true;
        });

        assert.strictEqual(found, 'John');
        assert.strictEqual(count, 1);

        found = graph.findNode(function () {
          return false;
        });

        assert.strictEqual(found, undefined);
      }
    },

    '#.mapNodes': {
      'it should be possible to map nodes.': function () {
        const graph = new Graph();
        graph.addNode('one', {weight: 2});
        graph.addNode('two', {weight: 3});

        const result = graph.mapNodes((node, attr) => {
          return attr.weight * 2;
        });

        assert.deepStrictEqual(result, [4, 6]);
      }
    },

    '#.someNode': {
      'it should always return false on empty sets.': function () {
        const graph = new Graph();

        assert.strictEqual(
          graph.someNode(() => true),
          false
        );
      },

      'it should be possible to find if some node matches a predicate.':
        function () {
          const graph = new Graph();
          graph.addNode('one', {weight: 2});
          graph.addNode('two', {weight: 3});

          assert.strictEqual(
            graph.someNode((node, attr) => attr.weight > 6),
            false
          );
          assert.strictEqual(
            graph.someNode((node, attr) => attr.weight > 2),
            true
          );
        }
    },

    '#.everyNode': {
      'it should always return true on empty sets.': function () {
        const graph = new Graph();

        assert.strictEqual(
          graph.everyNode(() => true),
          true
        );
      },

      'it should be possible to find if all node matches a predicate.':
        function () {
          const graph = new Graph();
          graph.addNode('one', {weight: 2});
          graph.addNode('two', {weight: 3});

          assert.strictEqual(
            graph.everyNode((node, attr) => attr.weight > 2),
            false
          );
          assert.strictEqual(
            graph.everyNode((node, attr) => attr.weight > 1),
            true
          );
        }
    },

    '#.filterNodes': {
      'it should be possible to filter nodes.': function () {
        const graph = new Graph();
        graph.addNode('one', {weight: 2});
        graph.addNode('two', {weight: 3});
        graph.addNode('three', {weight: 4});

        const result = graph.filterNodes((node, {weight}) => weight >= 3);

        assert.deepStrictEqual(result, ['two', 'three']);
      }
    },

    '#.reduceNodes': {
      'it should throw if initial value is not given.': function () {
        const graph = new Graph();

        assert.throws(function () {
          graph.reduceNodes((x, _, attr) => x + attr.weight);
        }, invalid());
      },

      'it should be possible to reduce nodes.': function () {
        const graph = new Graph();
        graph.addNode('one', {weight: 2});
        graph.addNode('two', {weight: 3});
        graph.addNode('three', {weight: 4});

        const result = graph.reduceNodes((x, _, attr) => x + attr.weight, 0);

        assert.strictEqual(result, 9);
      }
    },

    '#.nodeEntries': {
      'it should be possible to create a nodes iterator.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['one', 'two', 'three']);

        graph.replaceNodeAttributes('two', {hello: 'world'});

        const iterator = graph.nodeEntries();

        assert.deepStrictEqual(iterator.next().value, {
          node: 'one',
          attributes: {}
        });
        assert.deepStrictEqual(iterator.next().value, {
          node: 'two',
          attributes: {hello: 'world'}
        });
        assert.deepStrictEqual(iterator.next().value, {
          node: 'three',
          attributes: {}
        });
        assert.strictEqual(iterator.next().done, true);
      }
    }
  };
}
