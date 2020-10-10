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
      'it should return the list of nodes of the graph.': function() {
        const graph = new Graph();
        addNodesFrom(graph, ['one', 'two', 'three']);

        assert.deepStrictEqual(graph.nodes(), ['one', 'two', 'three']);
      }
    },

    '#.forEachNode': {
      'it should throw if given callback is not a function.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.forEachNode(null);
        }, invalid());
      },

      'it should be possible to iterate over nodes and their attributes.': function() {
        const graph = new Graph();

        graph.addNode('John', {age: 34});
        graph.addNode('Martha', {age: 33});

        let count = 0;

        graph.forEachNode(function(key, attributes) {
          assert.strictEqual(key, count ? 'Martha' : 'John');
          assert.deepStrictEqual(attributes, count ? {age: 33} : {age: 34});
          count++;
        });

        assert.strictEqual(count, 2);
      }
    },

    '#.forEachNodeUntil': {
      'it should throw if given callback is not a function.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.forEachNodeUntil(null);
        }, invalid());
      },

      'it should be possible to iterate over nodes and their attributes until the callback returns true.': function() {
        const graph = new Graph();

        graph.addNode('John', {age: 34});
        graph.addNode('Martha', {age: 33});

        let count = 0;

        graph.forEachNodeUntil(function(key, attributes) {
          assert.strictEqual(key, 'John');
          assert.deepStrictEqual(attributes, {age: 34});
          count++;

          if (key === 'John')
            return true;
        });

        assert.strictEqual(count, 1);
      }
    },

    '#.nodeEntries': {
      'it should be possible to create a nodes iterator.': function() {
        const graph = new Graph();
        addNodesFrom(graph, ['one', 'two', 'three']);

        graph.replaceNodeAttributes('two', {hello: 'world'});

        const iterator = graph.nodeEntries();

        assert.deepStrictEqual(iterator.next().value, ['one', {}]);
        assert.deepStrictEqual(iterator.next().value, ['two', {hello: 'world'}]);
        assert.deepStrictEqual(iterator.next().value, ['three', {}]);
        assert.strictEqual(iterator.next().done, true);
      }
    }
  };
}
