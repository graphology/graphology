/**
 * Graphology Bipartite Unit Tests
 * ================================
 */
const Graph = require('graphology');
const assert = require('assert');
const isBipartiteBy = require('./is-bipartite-by.js');

function createBipartiteGraph() {
  const graph = new Graph({type: 'undirected'});

  graph.addNode('John', {partition: 'people'});
  graph.addNode('Mary', {partition: 'people'});
  graph.addNode('Susan', {partition: 'people'});

  graph.addNode('red', {partition: 'color'});
  graph.addNode('blue', {partition: 'color'});
  graph.addNode('yellow', {partition: 'color'});
  graph.addNode('orange', {partition: 'color'});

  graph.addEdge('John', 'red');
  graph.addEdge('John', 'yellow');
  graph.addEdge('Mary', 'yellow');
  graph.addEdge('Mary', 'blue');
  graph.addEdge('Susan', 'blue');

  return graph;
}

describe('graphology-bipartite', function () {
  describe('isBipartiteBy', function () {
    it('should throw if given an invalid graph.', function () {
      assert.throws(function () {
        isBipartiteBy(null);
      });
    });

    it('should correctly return whether a graph is bipartite according to the given criterion.', function () {
      const graph = createBipartiteGraph();

      assert.strictEqual(isBipartiteBy(graph, 'partition'), true);
      assert.strictEqual(
        isBipartiteBy(graph, (_, a) => a.partition),
        true
      );
      assert.strictEqual(
        isBipartiteBy(graph, () => 'same'),
        false
      );
      assert.strictEqual(
        isBipartiteBy(graph, n => n),
        false
      );
    });
  });
});
