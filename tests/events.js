/**
 * Graphology Events Specs
 * ========================
 *
 * Testing the graph's events.
 */
import assert from 'assert';
import {spy, addNodesFrom} from './helpers';

const VALID_TYPES = new Set(['set', 'merge', 'replace', 'remove']);

export default function events(Graph) {
  return {
    'nodeAdded': {
      'it should fire when a node is added.': function() {
        const graph = new Graph();

        const handler = spy(data => {
          assert.strictEqual(data.key, 'John');
          assert.deepStrictEqual(data.attributes, {age: 34});
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
          assert.deepStrictEqual(data.attributes, {weight: 1});
          assert.strictEqual(data.source, 'John');
          assert.strictEqual(data.target, 'Thomas');
          assert.strictEqual(data.undirected, false);
        });

        graph.on('edgeAdded', handler);

        addNodesFrom(graph, ['John', 'Thomas']);
        graph.addEdgeWithKey('J->T', 'John', 'Thomas', {weight: 1});

        assert(handler.called);
      }
    },

    'nodeDropped': {
      'it should fire when a node is dropped.': function() {
        const graph = new Graph();

        const handler = spy(data => {
          assert.strictEqual(data.key, 'John');
          assert.deepStrictEqual(data.attributes, {age: 34});
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
          assert.deepStrictEqual(data.attributes, {weight: 1});
          assert.strictEqual(data.source, 'John');
          assert.strictEqual(data.target, 'Thomas');
          assert.strictEqual(data.undirected, false);
        });

        graph.on('edgeDropped', handler);

        addNodesFrom(graph, ['John', 'Thomas']);
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
    },

    'attributesUpdated': {
      'it should fire when a graph attribute is updated.': function() {
        const graph = new Graph();

        const handler = spy(payload => {
          const {type, meta} = payload;

          assert(VALID_TYPES.has(type));

          if (type === 'set') {
            assert.strictEqual(meta.name, 'name');
            assert.strictEqual(meta.value, 'Awesome graph');
          }
          else if (type === 'remove') {
            assert.strictEqual(meta.name, 'name');
          }
          else if (type === 'merge') {
            assert.deepStrictEqual(meta.data, {name: 'Shitty graph', author: 'John'});
          }
        });

        graph.on('attributesUpdated', handler);

        graph.setAttribute('name', 'Awesome graph');
        graph.replaceAttributes({name: 'Shitty graph'});
        graph.mergeAttributes({author: 'John'});
        graph.removeAttribute('name');

        assert.strictEqual(handler.times, 4);
      }
    },

    'nodeAttributesUpdated': {
      'it should fire when a node\'s attributes are updated.': function() {
        const graph = new Graph();

        const handler = spy(payload => {
          const {key, type, meta} = payload;

          assert.strictEqual(key, 'John');

          assert(VALID_TYPES.has(type));

          if (type === 'set') {
            assert.strictEqual(meta.name, 'age');
            assert.strictEqual(meta.value, 34);
          }
          else if (type === 'remove') {
            assert.strictEqual(meta.name, 'eyes');
          }
          else if (type === 'merge') {
            assert.deepStrictEqual(meta.data, {eyes: 'blue'});
          }

          assert.strictEqual(payload.attributes, graph.getNodeAttributes(key));
        });

        graph.on('nodeAttributesUpdated', handler);

        graph.addNode('John');
        graph.setNodeAttribute('John', 'age', 34);
        graph.replaceNodeAttributes('John', {age: 56});
        graph.mergeNodeAttributes('John', {eyes: 'blue'});
        graph.removeNodeAttribute('John', 'eyes');

        assert.strictEqual(handler.times, 4);
      },

      'it should fire when a node is merged.': function() {
        const graph = new Graph();

        const handler = spy(payload => {
          assert.deepStrictEqual(payload, {
            type: 'merge',
            key: 'John',
            attributes: {count: 2},
            meta: {data: {count: 2}}
          });

          assert.deepStrictEqual(graph.getNodeAttributes(payload.key), {count: 2});
        });

        graph.on('nodeAttributesUpdated', handler);

        graph.mergeNode('John', {count: 1});
        graph.mergeNode('John', {count: 2});

        assert.strictEqual(handler.times, 1);
      },

      'it should fire when a node is updated.': function() {
        const graph = new Graph();

        const handler = spy(payload => {
          assert.deepStrictEqual(payload, {
            type: 'replace',
            key: 'John',
            attributes: {count: 2},
            meta: {}
          });

          assert.deepStrictEqual(graph.getNodeAttributes(payload.key), {count: 2});
        });

        graph.on('nodeAttributesUpdated', handler);

        graph.mergeNode('John', {count: 1});
        graph.updateNode('John', attr => ({...attr, count: attr.count + 1}));

        assert.strictEqual(handler.times, 1);
      }
    },

    'edgeAttributesUpdated': {
      'it should fire when an edge\'s attributes are updated.': function() {
        const graph = new Graph();

        const handler = spy(payload => {
          const {key, type, meta} = payload;

          assert.strictEqual(key, 'J->T');

          assert(VALID_TYPES.has(type));

          if (type === 'set') {
            assert.strictEqual(meta.name, 'weight');
            assert.strictEqual(meta.value, 34);
          }
          else if (type === 'remove') {
            assert.strictEqual(meta.name, 'type');
          }
          else if (type === 'merge') {
            assert.deepStrictEqual(meta.data, {type: 'KNOWS'});
          }

          assert.strictEqual(payload.attributes, graph.getEdgeAttributes(key));
        });

        graph.on('edgeAttributesUpdated', handler);

        addNodesFrom(graph, ['John', 'Thomas']);
        graph.addEdgeWithKey('J->T', 'John', 'Thomas');
        graph.setEdgeAttribute('J->T', 'weight', 34);
        graph.replaceEdgeAttributes('J->T', {weight: 56});
        graph.mergeEdgeAttributes('J->T', {type: 'KNOWS'});
        graph.removeEdgeAttribute('J->T', 'type');

        assert.strictEqual(handler.times, 4);
      },

      'it should fire when an edge is merged.': function() {
        const graph = new Graph();

        const handler = spy(payload => {
          assert.deepStrictEqual(payload, {
            type: 'merge',
            key: graph.edge('John', 'Mary'),
            attributes: {weight: 2},
            meta: {data: {weight: 2}}
          });

          assert.deepStrictEqual(graph.getEdgeAttributes(payload.key), {weight: 2});
        });

        graph.on('edgeAttributesUpdated', handler);

        graph.mergeEdge('John', 'Mary', {weight: 1});
        graph.mergeEdge('John', 'Mary', {weight: 2});

        assert.strictEqual(handler.times, 1);
      },

      'it should fire when an edge is updated.': function() {
        const graph = new Graph();

        const handler = spy(payload => {
          assert.deepStrictEqual(payload, {
            type: 'replace',
            key: 'j->m',
            attributes: {weight: 2},
            meta: {}
          });

          assert.deepStrictEqual(graph.getEdgeAttributes(payload.key), {weight: 2});
        });

        graph.on('edgeAttributesUpdated', handler);

        graph.mergeEdgeWithKey('j->m', 'John', 'Mary', {weight: 1});
        graph.updateEdgeWithKey('j->m', 'John', 'Mary', attr => ({...attr, weight: attr.weight + 1}));

        assert.strictEqual(handler.times, 1);
      }
    }
  };
}
