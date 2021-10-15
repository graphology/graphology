/**
 * Graphology Misc Specs
 * ======================
 *
 * Testing the miscellaneous things about the graph.
 */
import assert from 'assert';
import {addNodesFrom} from './helpers';

export default function misc(Graph) {
  return {
    Structure: {
      'a simple mixed graph can have A->B, B->A & A<->B': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['Audrey', 'Benjamin']);

        assert.doesNotThrow(function () {
          graph.addEdge('Audrey', 'Benjamin');
          graph.addEdge('Benjamin', 'Audrey');
          graph.addUndirectedEdge('Benjamin', 'Audrey');
        });
      },

      'deleting the last edge between A & B should correctly clear neighbor index.':
        function () {
          const graph = new Graph({multi: true});
          graph.addNode('A');
          graph.addNode('B');

          graph.addEdge('A', 'B');
          graph.addEdge('A', 'B');

          graph.forEachEdge('A', edge => graph.dropEdge(edge));

          assert.deepStrictEqual(graph.neighbors('A'), []);
          assert.deepStrictEqual(graph.neighbors('B'), []);
        }

      // 'copy of the graph should work even with edge wrangling.': function () {
      //   const graph = new Graph();
      //   graph.addNode('n0');
      //   graph.addNode('n1');
      //   graph.addNode('n2');
      //   graph.addNode('n3');
      //   graph.addEdge('n0', 'n1');
      //   graph.addEdge('n1', 'n2');
      //   graph.addEdge('n2', 'n3');
      //   graph.addEdge('n3', 'n0');

      //   // Surgery
      //   const newNode = 'n12';
      //   graph.addNode(newNode);
      //   const e = graph.edge('n1', 'n2');
      //   graph.dropEdge(e);
      //   graph.addEdge('n1', newNode);
      //   graph.addEdgeWithKey(e, newNode, 'n2');

      //   console.log(graph);

      //   const copy = graph.copy();

      //   assert.strictEqual(graph.size, copy.size);
      // }
    },

    'Key coercion': {
      'keys should be correctly coerced to strings.': function () {
        const graph = new Graph();
        graph.addNode(1);
        graph.addNode('2');

        assert.strictEqual(graph.hasNode(1), true);
        assert.strictEqual(graph.hasNode('1'), true);
        assert.strictEqual(graph.hasNode(2), true);
        assert.strictEqual(graph.hasNode('2'), true);

        graph.addEdgeWithKey(3, 1, 2);

        assert.strictEqual(graph.hasEdge(3), true);
        assert.strictEqual(graph.hasEdge('3'), true);
      }
    }
  };
}
