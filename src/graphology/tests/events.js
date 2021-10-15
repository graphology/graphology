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
    nodeAdded: {
      'it should fire when a node is added.': function () {
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

    edgeAdded: {
      'it should fire when an edge is added.': function () {
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

    nodeDropped: {
      'it should fire when a node is dropped.': function () {
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

    edgeDropped: {
      'it should fire when an edge is added.': function () {
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

    cleared: {
      'it should fire when the graph is cleared.': function () {
        const graph = new Graph();

        const handler = spy();

        graph.on('cleared', handler);

        graph.clear();

        assert(handler.called);
      }
    },

    attributesUpdated: {
      'it should fire when a graph attribute is updated.': function () {
        const graph = new Graph();

        const handler = spy(payload => {
          assert(VALID_TYPES.has(payload.type));

          if (payload.type === 'set') {
            assert.strictEqual(payload.name, 'name');
          } else if (payload.type === 'remove') {
            assert.strictEqual(payload.name, 'name');
          } else if (payload.type === 'merge') {
            assert.deepStrictEqual(payload.data, {author: 'John'});
          }

          assert.deepStrictEqual(payload.attributes, graph.getAttributes());
        });

        graph.on('attributesUpdated', handler);

        graph.setAttribute('name', 'Awesome graph');
        graph.replaceAttributes({name: 'Shitty graph'});
        graph.mergeAttributes({author: 'John'});
        graph.removeAttribute('name');

        assert.strictEqual(handler.times, 4);
      }
    },

    nodeAttributesUpdated: {
      "it should fire when a node's attributes are updated.": function () {
        const graph = new Graph();

        const handler = spy(payload => {
          assert.strictEqual(payload.key, 'John');

          assert(VALID_TYPES.has(payload.type));

          if (payload.type === 'set') {
            assert.strictEqual(payload.name, 'age');
          } else if (payload.type === 'remove') {
            assert.strictEqual(payload.name, 'eyes');
          } else if (payload.type === 'merge') {
            assert.deepStrictEqual(payload.data, {eyes: 'blue'});
          }

          assert.strictEqual(
            payload.attributes,
            graph.getNodeAttributes(payload.key)
          );
        });

        graph.on('nodeAttributesUpdated', handler);

        graph.addNode('John');
        graph.setNodeAttribute('John', 'age', 34);
        graph.replaceNodeAttributes('John', {age: 56});
        graph.mergeNodeAttributes('John', {eyes: 'blue'});
        graph.removeNodeAttribute('John', 'eyes');

        assert.strictEqual(handler.times, 4);
      },

      'it should fire when a node is merged.': function () {
        const graph = new Graph();

        const handler = spy(payload => {
          assert.deepStrictEqual(payload, {
            type: 'merge',
            key: 'John',
            attributes: {count: 2},
            data: {count: 2}
          });

          assert.deepStrictEqual(graph.getNodeAttributes(payload.key), {
            count: 2
          });
        });

        graph.on('nodeAttributesUpdated', handler);

        graph.mergeNode('John', {count: 1});
        graph.mergeNode('John', {count: 2});

        assert.strictEqual(handler.times, 1);
      },

      'it should fire when a node is updated.': function () {
        const graph = new Graph();

        const handler = spy(payload => {
          assert.deepStrictEqual(payload, {
            type: 'replace',
            key: 'John',
            attributes: {count: 2}
          });

          assert.deepStrictEqual(graph.getNodeAttributes(payload.key), {
            count: 2
          });
        });

        graph.on('nodeAttributesUpdated', handler);

        graph.mergeNode('John', {count: 1});
        graph.updateNode('John', attr => ({
          ...attr,
          count: attr.count + 1
        }));

        assert.strictEqual(handler.times, 1);
      }
    },

    edgeAttributesUpdated: {
      "it should fire when an edge's attributes are updated.": function () {
        const graph = new Graph();

        const handler = spy(payload => {
          assert.strictEqual(payload.key, 'J->T');

          assert(VALID_TYPES.has(payload.type));

          if (payload.type === 'set') {
            assert.strictEqual(payload.name, 'weight');
          } else if (payload.type === 'remove') {
            assert.strictEqual(payload.name, 'type');
          } else if (payload.type === 'merge') {
            assert.deepStrictEqual(payload.data, {type: 'KNOWS'});
          }

          assert.strictEqual(
            payload.attributes,
            graph.getEdgeAttributes(payload.key)
          );
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

      'it should fire when an edge is merged.': function () {
        const graph = new Graph();

        const handler = spy(payload => {
          assert.deepStrictEqual(payload, {
            type: 'merge',
            key: graph.edge('John', 'Mary'),
            attributes: {weight: 2},
            data: {weight: 2}
          });

          assert.deepStrictEqual(graph.getEdgeAttributes(payload.key), {
            weight: 2
          });
        });

        graph.on('edgeAttributesUpdated', handler);

        graph.mergeEdge('John', 'Mary', {weight: 1});
        graph.mergeEdge('John', 'Mary', {weight: 2});

        assert.strictEqual(handler.times, 1);
      },

      'it should fire when an edge is updated.': function () {
        const graph = new Graph();

        const handler = spy(payload => {
          assert.deepStrictEqual(payload, {
            type: 'replace',
            key: 'j->m',
            attributes: {weight: 2}
          });

          assert.deepStrictEqual(graph.getEdgeAttributes(payload.key), {
            weight: 2
          });
        });

        graph.on('edgeAttributesUpdated', handler);

        graph.mergeEdgeWithKey('j->m', 'John', 'Mary', {weight: 1});
        graph.updateEdgeWithKey('j->m', 'John', 'Mary', attr => ({
          ...attr,
          weight: attr.weight + 1
        }));

        assert.strictEqual(handler.times, 1);
      }
    },

    eachNodeAttributesUpdated: {
      'it should fire when using #.updateEachNodeAttributes.': function () {
        const graph = new Graph();

        graph.addNode('John', {age: 34});
        graph.addNode('Mary', {age: 56});
        graph.addNode('Suz', {age: 13});

        const handler = spy(payload => {
          assert.strictEqual(payload.hints, null);
        });

        graph.on('eachNodeAttributesUpdated', handler);

        graph.updateEachNodeAttributes((node, attr) => {
          return {...attr, age: attr.age + 1};
        });

        assert.strictEqual(handler.times, 1);
      },

      'it should provide hints when user gave them.': function () {
        const graph = new Graph();

        graph.addNode('John', {age: 34});
        graph.addNode('Mary', {age: 56});
        graph.addNode('Suz', {age: 13});

        const handler = spy(payload => {
          assert.deepStrictEqual(payload.hints, {attributes: ['age']});
        });

        graph.on('eachNodeAttributesUpdated', handler);

        graph.updateEachNodeAttributes(
          (node, attr) => {
            return {...attr, age: attr.age + 1};
          },
          {attributes: ['age']}
        );

        assert.strictEqual(handler.times, 1);
      }
    },

    eachEdgeAttributesUpdated: {
      'it should fire when using #.updateEachEdgeAttributes.': function () {
        const graph = new Graph();

        graph.mergeEdgeWithKey(0, 'John', 'Lucy', {weight: 1});
        graph.mergeEdgeWithKey(1, 'John', 'Mary', {weight: 10});

        const handler = spy(payload => {
          assert.strictEqual(payload.hints, null);
        });

        graph.on('eachEdgeAttributesUpdated', handler);

        graph.updateEachEdgeAttributes((node, attr) => {
          return {...attr, age: attr.weight + 1};
        });

        assert.strictEqual(handler.times, 1);
      },

      'it should provide hints when user gave them.': function () {
        const graph = new Graph();

        graph.mergeEdgeWithKey(0, 'John', 'Lucy', {weight: 1});
        graph.mergeEdgeWithKey(1, 'John', 'Mary', {weight: 10});

        const handler = spy(payload => {
          assert.deepStrictEqual(payload.hints, {attributes: ['weight']});
        });

        graph.on('eachEdgeAttributesUpdated', handler);

        graph.updateEachEdgeAttributes(
          (node, attr) => {
            return {...attr, weight: attr.weight + 1};
          },
          {attributes: ['weight']}
        );

        assert.strictEqual(handler.times, 1);
      }
    }
  };
}
