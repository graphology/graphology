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
      },

      'it should not need to tell whether edges are undirected if the graph is.':
        function () {
          const graph = new Graph({type: 'undirected'});

          graph.mergeEdgeWithKey(0, 1, 2);

          assert.deepStrictEqual(graph.export(), {
            options: {type: 'undirected', multi: false, allowSelfLoops: true},
            attributes: {},
            nodes: [{key: '1'}, {key: '2'}],
            edges: [{key: '0', source: '1', target: '2'}]
          });
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
      },

      'it should throw if nodes are absent, edges are present and we merge.':
        function () {
          const graph = new Graph();

          assert.throws(function () {
            graph.import({
              edges: [{source: '1', target: '2'}]
            });
          }, notFound());
        },

      'it should import undirected graphs properly.': function () {
        const graph = Graph.from({
          options: {type: 'undirected', multi: false, allowSelfLoops: true},
          attributes: {},
          nodes: [{key: '1'}, {key: '2'}],
          edges: [{key: '0', source: '1', target: '2'}]
        });

        assert.strictEqual(graph.order, 2);
        assert.strictEqual(graph.size, 1);
        assert.strictEqual(graph.hasEdge(2, 1), true);
      }
    }
  };
}
