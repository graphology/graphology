/**
 * Graphology Events Specs
 * ========================
 *
 * Testing the graph's events.
 */
import assert from 'assert';
import {spy} from './helpers';

export default function events(Graph) {
  return {
    'nodeAdded': {
      'it should fire when a node is added.': function() {
        const graph = new Graph();

        const handler = spy(data => {
          assert.strictEqual(data.key, 'John');
          assert.deepEqual(data.attributes, {age: 34});
        });

        graph.on('nodeAdded', handler);

        graph.addNode('John', {age: 34});

        assert(handler.called);
      }
    },

    'edgeAdded': {
      'it should fire when an edge is added.': function() {
        const graph = new Graph();

        const handler = spy(data => {
          assert.strictEqual(data.key, 'J->T');
          assert.deepEqual(data.attributes, {weight: 1});
          assert.strictEqual(data.source, 'John');
          assert.strictEqual(data.target, 'Thomas');
          assert.strictEqual(data.undirected, false);
        });

        graph.on('edgeAdded', handler);

        graph.addNodesFrom(['John', 'Thomas']);
        graph.addEdgeWithKey('J->T', 'John', 'Thomas', {weight: 1});

        assert(handler.called);
      }
    },

    'nodeDropped': {
      'it should fire when a node is dropped.': function() {
        const graph = new Graph();

        const handler = spy(data => {
          assert.strictEqual(data.key, 'John');
          assert.deepEqual(data.attributes, {age: 34});
        });

        graph.on('nodeDropped', handler);

        graph.addNode('John', {age: 34});
        graph.dropNode('John');

        assert(handler.called);
      }
    },

    'edgeDropped': {
      'it should fire when an edge is added.': function() {
        const graph = new Graph();

        const handler = spy(data => {
          assert.strictEqual(data.key, 'J->T');
          assert.deepEqual(data.attributes, {weight: 1});
          assert.strictEqual(data.source, 'John');
          assert.strictEqual(data.target, 'Thomas');
          assert.strictEqual(data.undirected, false);
        });

        graph.on('edgeDropped', handler);

        graph.addNodesFrom(['John', 'Thomas']);
        graph.addEdgeWithKey('J->T', 'John', 'Thomas', {weight: 1});
        graph.dropEdge('J->T');

        assert(handler.called);
      }
    },

    'cleared': {
      'it should fire when the graph is cleared.': function() {
        const graph = new Graph();

        const handler = spy();

        graph.on('cleared', handler);

        graph.clear();

        assert(handler.called);
      }
    }
  };
}
