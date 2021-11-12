/**
 * Graphology Iteration Specs
 * ===========================
 *
 * Testing the iteration-related methods of the graph.
 */
import assert from 'assert';
import nodeTests from './nodes';
import edgeTests from './edges';
import neighborTests from './neighbors';

export default function iteration(Graph, checkers) {
  return {
    Adjacency: {
      '#.forEachAdjacencyEntry': {
        'it should iterate over the relevant elements.': function () {
          function test(multi) {
            const graph = new Graph({multi});

            graph.addNode('John', {hello: 'world'});

            const [e1] = graph.mergeUndirectedEdge('John', 'Mary', {weight: 3});
            graph.mergeUndirectedEdge('Thomas', 'John');

            graph.mergeDirectedEdge('John', 'Thomas');

            let count = 0;
            graph.forEachAdjacencyEntry(
              (
                node,
                neighbor,
                attr,
                neighborAttr,
                edge,
                edgeAttr,
                undirected
              ) => {
                count++;

                if (node === 'John') {
                  assert.deepStrictEqual(attr, {hello: 'world'});
                } else {
                  assert.deepStrictEqual(attr, {});
                }

                if (neighbor === 'John') {
                  assert.deepStrictEqual(neighborAttr, {hello: 'world'});
                } else {
                  assert.deepStrictEqual(neighborAttr, {});
                }

                if (edge === e1) {
                  assert.deepStrictEqual(edgeAttr, {weight: 3});
                } else {
                  assert.deepStrictEqual(edgeAttr, {});
                }

                assert.strictEqual(graph.isUndirected(edge), undirected);
              }
            );

            assert.strictEqual(
              count,
              graph.directedSize + graph.undirectedSize * 2
            );

            graph.addNode('Disconnected');

            count = 0;

            graph.forEachAdjacencyEntryWithOrphans(
              (
                node,
                neighbor,
                attr,
                neighborAttr,
                edge,
                edgeAttr,
                undirected
              ) => {
                count++;

                if (node !== 'Disconnected') return;

                assert.strictEqual(neighbor, null);
                assert.strictEqual(neighborAttr, null);
                assert.strictEqual(edge, null);
                assert.strictEqual(edgeAttr, null);
                assert.strictEqual(undirected, null);
              },
              true
            );

            assert.strictEqual(
              count,
              graph.directedSize + graph.undirectedSize * 2 + 1
            );
          }

          test(false);
          test(true);
        }
      },

      '#.forEachAssymetricAdjacencyEntry': {
        'it should iterate over the relevant elements.': function () {
          function test(multi) {
            const graph = new Graph({multi});

            graph.addNode('John', {hello: 'world'});

            graph.mergeUndirectedEdge('John', 'Mary', {weight: 3});
            graph.mergeUndirectedEdge('Thomas', 'John');

            graph.mergeDirectedEdge('John', 'Thomas');

            const edges = [];

            graph.forEachAssymetricAdjacencyEntry(
              (
                node,
                neighbor,
                attr,
                neighborAttr,
                edge,
                edgeAttr,
                undirected
              ) => {
                if (undirected) {
                  assert.strictEqual(node < neighbor, true);
                }

                edges.push(edge);
              }
            );

            assert.strictEqual(
              edges.length,
              graph.directedSize + graph.undirectedSize
            );

            assert.deepStrictEqual(new Set(edges).size, edges.length);

            graph.addNode('Disconnected');

            let count = 0;
            let nulls = 0;

            graph.forEachAssymetricAdjacencyEntryWithOrphans(
              (
                node,
                neighbor,
                attr,
                neighborAttr,
                edge,
                edgeAttr,
                undirected
              ) => {
                count++;

                if (neighbor) return;

                nulls++;
                assert.strictEqual(neighbor, null);
                assert.strictEqual(neighborAttr, null);
                assert.strictEqual(edge, null);
                assert.strictEqual(edgeAttr, null);
                assert.strictEqual(undirected, null);
              },
              true
            );

            assert.strictEqual(
              count,
              graph.directedSize + graph.undirectedSize + 3
            );

            assert.strictEqual(nulls, 3);
          }

          test(false);
          test(true);
        }
      }
    },
    Nodes: nodeTests(Graph, checkers),
    Edges: edgeTests(Graph, checkers),
    Neighbors: neighborTests(Graph, checkers)
  };
}
