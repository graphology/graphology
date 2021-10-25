/**
 * Graphology Serializaton Specs
 * ==============================
 *
 * Testing the serialization methods of the graph.
 */
import assert from 'assert';
import {addNodesFrom} from './helpers';

export default function serialization(Graph, checkers) {
  const {invalid, notFound} = checkers;

  return {
    '#.exportNode': {
      'it should throw if the node does not exist.': function () {
        const graph = new Graph();

        assert.throws(function () {
          graph.exportNode('Test');
        }, notFound());
      },

      'it should properly serialize nodes.': function () {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Jack', {age: 34});

        assert.deepStrictEqual(graph.exportNode('John'), {key: 'John'});
        assert.deepStrictEqual(graph.exportNode('Jack'), {
          key: 'Jack',
          attributes: {age: 34}
        });
      }
    },

    '#.exportEdge': {
      'it should throw if the edge does not exist.': function () {
        const graph = new Graph();

        assert.throws(function () {
          graph.exportEdge('Test');
        }, notFound());
      },

      'it should properly serialize edges.': function () {
        const graph = new Graph({multi: true});
        addNodesFrom(graph, ['John', 'Martha']);
        graph.addEdgeWithKey('J->M•1', 'John', 'Martha');
        graph.addEdgeWithKey('J->M•2', 'John', 'Martha', {weight: 1});
        graph.addUndirectedEdgeWithKey('J<->M•1', 'John', 'Martha');
        graph.addUndirectedEdgeWithKey('J<->M•2', 'John', 'Martha', {
          weight: 2
        });

        assert.deepStrictEqual(graph.exportEdge('J->M•1'), {
          key: 'J->M•1',
          source: 'John',
          target: 'Martha'
        });
        assert.deepStrictEqual(graph.exportEdge('J->M•2'), {
          key: 'J->M•2',
          source: 'John',
          target: 'Martha',
          attributes: {weight: 1}
        });
        assert.deepStrictEqual(graph.exportEdge('J<->M•1'), {
          key: 'J<->M•1',
          source: 'John',
          target: 'Martha',
          undirected: true
        });
        assert.deepStrictEqual(graph.exportEdge('J<->M•2'), {
          key: 'J<->M•2',
          source: 'John',
          target: 'Martha',
          attributes: {weight: 2},
          undirected: true
        });
      }
    },

    '#.export': {
      'it should correctly return the serialized graph.': function () {
        const graph = new Graph({multi: true});
        graph.setAttribute('name', 'graph');
        addNodesFrom(graph, ['John', 'Jack', 'Martha']);
        graph.setNodeAttribute('John', 'age', 34);
        graph.addEdgeWithKey('J->J•1', 'John', 'Jack');
        graph.addEdgeWithKey('J->J•2', 'John', 'Jack', {weight: 2});
        graph.addEdgeWithKey('J->J•3', 'John', 'Jack');
        graph.addUndirectedEdgeWithKey('J<->J•1', 'John', 'Jack');
        graph.addUndirectedEdgeWithKey('J<->J•2', 'John', 'Jack', {
          weight: 3
        });

        assert.deepStrictEqual(graph.export(), {
          attributes: {
            name: 'graph'
          },
          nodes: [
            {key: 'John', attributes: {age: 34}},
            {key: 'Jack'},
            {key: 'Martha'}
          ],
          edges: [
            {key: 'J->J•1', source: 'John', target: 'Jack'},
            {
              key: 'J->J•2',
              source: 'John',
              target: 'Jack',
              attributes: {weight: 2}
            },
            {key: 'J->J•3', source: 'John', target: 'Jack'},
            {
              key: 'J<->J•1',
              source: 'John',
              target: 'Jack',
              undirected: true
            },
            {
              key: 'J<->J•2',
              source: 'John',
              target: 'Jack',
              attributes: {weight: 3},
              undirected: true
            }
          ],
          options: {
            allowSelfLoops: true,
            multi: true,
            type: 'mixed'
          }
        });
      }
    },

    '#.importNode': {
      'it should throw if the given serialized node is invalid.': function () {
        const graph = new Graph();

        assert.throws(function () {
          graph.importNode(false);
        }, invalid());

        assert.throws(function () {
          graph.importNode({hello: 'world'});
        }, invalid());

        assert.throws(function () {
          graph.importNode({key: 'test', attributes: false});
        }, invalid());
      },

      'it should correctly import the given node.': function () {
        const graph = new Graph();
        graph.importNode({key: 'John'});
        graph.importNode({key: 'Jack', attributes: {age: 34}});

        assert.deepStrictEqual(graph.nodes(), ['John', 'Jack']);
        assert.deepStrictEqual(graph.getNodeAttributes('Jack'), {age: 34});
      },

      'it should merge if the flag is true.': function () {
        const graph = new Graph();
        graph.addNode('John');
        graph.importNode({key: 'John', attributes: {age: 34}}, true);

        assert.deepStrictEqual(graph.nodes(), ['John']);
        assert.strictEqual(graph.getNodeAttribute('John', 'age'), 34);
      }
    },

    '#.importEdge': {
      'it should throw if the given serialized node is invalid.': function () {
        const graph = new Graph();

        assert.throws(function () {
          graph.importEdge(false);
        }, invalid());

        assert.throws(function () {
          graph.importEdge({hello: 'world'});
        }, invalid());

        assert.throws(function () {
          graph.importEdge({source: 'John', hello: 'world'});
        }, invalid());

        assert.throws(function () {
          graph.importEdge({
            source: 'John',
            target: 'Thomas',
            attributes: false
          });
        }, invalid());

        assert.throws(function () {
          graph.importEdge({
            source: 'John',
            target: 'Thomas',
            undirected: 'test'
          });
        }, invalid());
      },

      'it should correctly import the given edge.': function () {
        const graph = new Graph({multi: true});
        addNodesFrom(graph, ['John', 'Thomas']);

        graph.importEdge({
          source: 'John',
          target: 'Thomas'
        });

        graph.importEdge({
          key: 'J<->T',
          source: 'John',
          target: 'Thomas',
          attributes: {weight: 2},
          undirected: true
        });

        assert.strictEqual(graph.size, 2);
        assert.deepStrictEqual(graph.getEdgeAttributes('J<->T'), {weight: 2});
      },

      'it should merge if the flag is true.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['John', 'Thomas']);
        graph.addEdge('John', 'Thomas');

        graph.importEdge(
          {source: 'John', target: 'Thomas', attributes: {weight: 10}},
          true
        );

        assert.strictEqual(graph.size, 1);
        assert.strictEqual(
          graph.getEdgeAttribute('John', 'Thomas', 'weight'),
          10
        );
      }
    },

    '#.import': {
      'it should throw if the given data is invalid.': function () {
        const graph = new Graph();

        assert.throws(function () {
          graph.import(true);
        }, invalid());
      },

      'it should be possible to import a graph instance.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['John', 'Thomas']);
        graph.addEdge('John', 'Thomas');

        const other = new Graph();
        other.import(graph);

        assert.deepStrictEqual(graph.nodes(), other.nodes());
        assert.deepStrictEqual(graph.edges(), other.edges());
      },

      'it should be possible to import a serialized graph.': function () {
        const graph = new Graph();
        graph.import({
          nodes: [{key: 'John'}, {key: 'Thomas'}],
          edges: [{source: 'John', target: 'Thomas'}]
        });

        assert.deepStrictEqual(graph.nodes(), ['John', 'Thomas']);
        assert.strictEqual(graph.hasEdge('John', 'Thomas'), true);
      },

      'it should be possible to import only edges when merging.': function () {
        const graph = new Graph();

        graph.import(
          {
            edges: [{source: 'John', target: 'Thomas'}]
          },
          true
        );

        assert.deepStrictEqual(graph.nodes(), ['John', 'Thomas']);
        assert.strictEqual(graph.size, 1);
        assert.strictEqual(graph.hasEdge('John', 'Thomas'), true);
      },

      'it should be possible to import attributes.': function () {
        const graph = new Graph();

        graph.import({
          attributes: {
            name: 'graph'
          }
        });

        assert.deepStrictEqual(graph.getAttributes(), {name: 'graph'});
      }
    }
  };
}
