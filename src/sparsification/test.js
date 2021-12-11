/**
 * Graphology Sparsification Unit Tests
 * =====================================
 */
const Graph = require('graphology');
const assert = require('assert');
const {areSameGraphs, areSameGraphsDeep} = require('graphology-assertions');

const {globalThreshold} = require('./');

describe('graphology-sparsification', function () {
  describe('globalThreshold', function () {
    function getGraph() {
      const graph = new Graph();

      graph.mergeEdgeWithKey('30', 0, 1, {weight: 30});
      graph.mergeEdgeWithKey('20', 2, 1, {weight: 20});
      graph.mergeEdgeWithKey('10', 4, 2, {weight: 10});
      graph.mergeEdgeWithKey('40', 1, 5, {weight: 40});

      return graph;
    }

    it('should throw if given an invalid graph.', function () {
      assert.throws(function () {
        globalThreshold(null, 0.5);
      }, /invalid/);
    });

    it('should throw if given an invalid threshold.', function () {
      assert.throws(function () {
        globalThreshold(new Graph(), 'test');
      }, /threshold/);
    });

    it('should return the edges to prune.', function () {
      const graph = getGraph();

      const edges = globalThreshold(graph, 30);

      assert.deepStrictEqual(new Set(edges), new Set(['10', '20']));
    });

    it('should be possible to prune it directly.', function () {
      const graph = getGraph();
      const copy = graph.copy();
      copy.dropEdge('10');
      copy.dropEdge('20');

      globalThreshold.prune(graph, 30);

      assert(areSameGraphs(graph, copy));
    });

    it('should be possible to mark pruned edges.', function () {
      const graph = getGraph();
      const copy = graph.copy();

      globalThreshold.assign(graph, 30);

      copy.setEdgeAttribute('10', 'redundant', true);
      copy.setEdgeAttribute('20', 'redundant', true);

      assert(areSameGraphsDeep(graph, copy));

      globalThreshold.assign(graph, 30, {edgeRedundantAttribute: 'hidden'});

      assert(!areSameGraphsDeep(graph, copy));

      copy.setEdgeAttribute('10', 'hidden', true);
      copy.setEdgeAttribute('20', 'hidden', true);

      assert(areSameGraphsDeep(graph, copy));
    });
  });
});
