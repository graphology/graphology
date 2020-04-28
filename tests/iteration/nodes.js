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

        assert.deepEqual(graph.nodes(), ['one', 'two', 'three']);
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
          assert.deepEqual(attributes, count ? {age: 33} : {age: 34});
          count++;
        });

        assert.strictEqual(count, 2);
      }
    },

    '#.nodeEntries': {
      'it should be possible to create a nodes iterator.': function() {
        const graph = new Graph();
        addNodesFrom(graph, ['one', 'two', 'three']);

        graph.replaceNodeAttributes('two', {hello: 'world'});

        const iterator = graph.nodeEntries();

        assert.deepEqual(iterator.next().value, ['one', {}]);
        assert.deepEqual(iterator.next().value, ['two', {hello: 'world'}]);
        assert.deepEqual(iterator.next().value, ['three', {}]);
        assert.strictEqual(iterator.next().done, true);
      }
    }
  };
}
