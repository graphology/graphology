/**
 * Graphology Utils Specs
 * =======================
 *
 * Testing the utils methods.
 */
import assert from 'assert';
import {addNodesFrom} from './helpers';

const PROPERTIES = ['type', 'multi', 'map', 'selfLoops'];

export default function utils(Graph) {
  return {
    '#.nullCopy': {
      'it should create an null copy of the graph.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['John', 'Thomas']);
        graph.addEdge('John', 'Thomas');

        const copy = graph.nullCopy();

        assert.deepStrictEqual(copy.nodes(), []);
        assert.strictEqual(copy.order, 0);
        assert.strictEqual(copy.size, 0);

        PROPERTIES.forEach(property => {
          assert.strictEqual(graph[property], copy[property]);
        });
      },

      'it should be possible to pass options to merge.': function () {
        const graph = new Graph({type: 'directed'});

        const copy = graph.nullCopy({type: 'undirected'});

        assert.strictEqual(copy.type, 'undirected');

        assert.throws(function () {
          copy.addDirectedEdge('one', 'two');
        }, /addDirectedEdge/);
      }
    },

    '#.emptyCopy': {
      'it should create an empty copy of the graph.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['John', 'Thomas']);
        graph.addEdge('John', 'Thomas');

        const copy = graph.emptyCopy();

        assert.deepStrictEqual(copy.nodes(), ['John', 'Thomas']);
        assert.strictEqual(copy.order, 2);
        assert.strictEqual(copy.size, 0);

        PROPERTIES.forEach(property => {
          assert.strictEqual(graph[property], copy[property]);
        });

        copy.mergeEdge('Mary', 'Thomas');
        copy.setNodeAttribute('John', 'age', 32);

        assert.strictEqual(copy.order, 3);
        assert.strictEqual(copy.size, 1);
        assert.deepStrictEqual(copy.getNodeAttributes('John'), {age: 32});
        assert.deepStrictEqual(graph.getNodeAttributes('John'), {});
      },

      'it should be possible to pass options to merge.': function () {
        const graph = new Graph({type: 'directed'});

        const copy = graph.emptyCopy({type: 'undirected'});

        assert.strictEqual(copy.type, 'undirected');

        assert.throws(function () {
          copy.addDirectedEdge('one', 'two');
        }, /addDirectedEdge/);
      }
    },

    '#.copy': {
      'it should create a full copy of the graph.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['John', 'Thomas']);
        graph.addEdge('John', 'Thomas');

        const copy = graph.copy();

        assert.deepStrictEqual(copy.nodes(), graph.nodes());
        assert.deepStrictEqual(copy.edges(), graph.edges());
        assert.strictEqual(copy.order, 2);
        assert.strictEqual(copy.size, 1);

        PROPERTIES.forEach(property => {
          assert.strictEqual(graph[property], graph[property]);
        });
      },

      'it should not break when copying a graph with wrangled edge ids (issue #213).':
        function () {
          const graph = new Graph();
          graph.addNode('n0');
          graph.addNode('n1');
          graph.addNode('n2');
          graph.addNode('n3');
          graph.addEdge('n0', 'n1');
          graph.addEdge('n1', 'n2');
          graph.addEdge('n2', 'n3');
          graph.addEdge('n3', 'n0');

          assert.doesNotThrow(function () {
            graph.copy();
          });

          // Do surgery on second edge
          const edgeToSplit = graph.edge('n1', 'n2');
          const newNode = 'n12';
          graph.addNode(newNode);
          graph.dropEdge('n1', 'n2');
          graph.addEdge('n1', newNode);
          graph.addEdgeWithKey(edgeToSplit, newNode, 'n2');

          const copy = graph.copy();

          assert.deepStrictEqual(new Set(graph.nodes()), new Set(copy.nodes()));
          assert.deepStrictEqual(new Set(graph.edges()), new Set(copy.edges()));

          assert.notStrictEqual(
            graph.getNodeAttributes('n1'),
            copy.getNodeAttributes('n1')
          );

          assert.doesNotThrow(function () {
            copy.addEdge('n0', 'n12');
          });
        },

      'it should not break on adversarial inputs.': function () {
        const graph = new Graph();

        graph.mergeEdge(0, 1);
        graph.mergeEdge(1, 2);
        graph.mergeEdge(2, 0);

        const copy = graph.copy();

        copy.mergeEdge(3, 4);

        const serializedCopy = Graph.from(graph.export());

        assert.doesNotThrow(function () {
          serializedCopy.mergeEdge(3, 4);
        });

        assert.strictEqual(serializedCopy.size, 4);
      }
    },

    '#.upgradeToMixed': {
      'it should correctly upgrade the given graph to a mixed one.':
        function () {
          const graph = new Graph({type: 'directed'});
          addNodesFrom(graph, [1, 2, 3]);
          graph.addEdgeWithKey('1->2', 1, 2);

          graph.upgradeToMixed();

          assert.strictEqual(graph.type, 'mixed');

          graph.addUndirectedEdge(2, 3);

          assert.strictEqual(graph.size, 2);
          assert.strictEqual(graph.degree(2), 2);
        }
    },

    '#.upgradeToMulti': {
      'it should correctly upgrade the given graph to a multi one.':
        function () {
          const graph = new Graph();
          addNodesFrom(graph, [1, 2]);
          graph.addEdgeWithKey('dA', 1, 2);
          graph.addUndirectedEdgeWithKey('uA', 1, 2);

          graph.upgradeToMulti();

          assert.strictEqual(graph.multi, true);

          graph.addEdgeWithKey('dB', 1, 2);
          graph.addUndirectedEdgeWithKey('uB', 1, 2);

          assert.strictEqual(graph.size, 4);

          assert.deepStrictEqual(graph.edges(), ['dA', 'uA', 'dB', 'uB']);
        }
    }
  };
}
