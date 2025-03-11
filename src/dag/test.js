/**
 * Graphology DAG Unit Tests
 * ==========================
 */
const {
  Graph,
  UndirectedGraph,
  DirectedGraph,
  MultiDirectedGraph
} = require('graphology');
const path = require('graphology-generators/classic/path');
const mergePath = require('graphology-utils/merge-path');
const assert = require('assert');
const hasCycle = require('./has-cycle.js');
const willCreateCycle = require('./will-create-cycle.js');
const {
  topologicalSort,
  forEachNodeInTopologicalOrder,
  topologicalGenerations,
  forEachTopologicalGeneration
} = require('./topological-sort.js');
const {forEachTransitiveRelation, bypassNode} = require('./transitive.js');
const {NotFoundGraphError} = require('graphology');
const sinon = require('sinon');

function allEdges(graph) {
  return graph
    .edges()
    .map(graph.extremities.bind(graph))
    .sort(([src1, tg1], [src2, tg2]) => {
      const srcCmp = src1 - src2;
      return srcCmp !== 0 ? srcCmp : tg1 - tg2;
    });
}

describe('graphology-dag', function () {
  describe('hasCycle', function () {
    it('should throw if given invalid arguments.', function () {
      assert.throws(function () {
        hasCycle(null);
      }, /graphology/);
    });

    it('should return true if the graph has a self loop.', function () {
      const graph = new DirectedGraph();
      graph.mergeEdge('A', 'A');

      assert.strictEqual(hasCycle(graph), true);
    });

    it('should correctly return whether the given graph has a cycle.', function () {
      const graph = path(DirectedGraph, 4);

      assert.strictEqual(hasCycle(graph), false);

      graph.addEdge(3, 0);

      assert.strictEqual(hasCycle(graph), true);
    });

    it('should work with typical examples.', function () {
      const graph = new DirectedGraph();
      graph.mergeEdge(0, 1);
      graph.mergeEdge(0, 2);
      graph.mergeEdge(1, 2);
      graph.mergeEdge(2, 3);

      assert.strictEqual(hasCycle(graph), false);

      graph.mergeEdge(2, 0);

      assert.strictEqual(hasCycle(graph), true);

      graph.clear();
      graph.mergeEdge(0, 1);
      graph.mergeEdge(0, 2);
      graph.mergeEdge(1, 2);
      graph.mergeEdge(2, 3);

      assert.strictEqual(hasCycle(graph), false);
    });

    it('should work with disconnected graphs.', function () {
      const graph = new DirectedGraph();

      graph.mergeEdge(0, 1);
      graph.mergeEdge(1, 2);
      graph.mergeEdge(2, 3);

      graph.mergeEdge(4, 5);
      graph.mergeEdge(5, 6);
      graph.mergeEdge(6, 7);

      graph.addNode(8);

      assert.strictEqual(hasCycle(graph), false);

      graph.addEdge(2, 0);

      assert.strictEqual(hasCycle(graph), true);

      graph.dropEdge(2, 0);

      assert.strictEqual(hasCycle(graph), false);

      graph.addEdge(7, 4);

      assert.strictEqual(hasCycle(graph), true);
    });
  });

  describe('willCreateCycle', function () {
    it('should throw if given invalid arguments.', function () {
      assert.throws(function () {
        willCreateCycle(null);
      }, /graphology/);
    });

    it('should return false when one of the node does not exist.', function () {
      const graph = new DirectedGraph();

      graph.addNode('test');

      assert.strictEqual(willCreateCycle(graph, 'test', 'other'), false);
      assert.strictEqual(willCreateCycle(graph, 'other', 'test'), false);
      assert.strictEqual(willCreateCycle(graph, 'other1', 'other2'), false);
    });

    it('should return true when adding a self loop.', function () {
      const graph = new DirectedGraph();
      graph.addNode('A');

      assert.strictEqual(willCreateCycle(graph, 'A', 'A'), true);
    });

    it('should work with a simple path graph.', function () {
      const graph = path(DirectedGraph, 4);

      assert.strictEqual(willCreateCycle(graph, 0, 3), false);
      assert.strictEqual(willCreateCycle(graph, 1, 0), true);
      assert.strictEqual(willCreateCycle(graph, 2, 0), true);
      assert.strictEqual(willCreateCycle(graph, 3, 0), true);
      assert.strictEqual(willCreateCycle(graph, 2, 1), true);
      assert.strictEqual(willCreateCycle(graph, 3, 2), true);
      assert.strictEqual(willCreateCycle(graph, 3, 1), true);
      assert.strictEqual(willCreateCycle(graph, 0, 4), false);
    });

    it('should return false if edge already exists and true when adding a mutual edge.', function () {
      const graph = new DirectedGraph();
      graph.mergeEdge(0, 1);

      assert.strictEqual(willCreateCycle(graph, 0, 1), false);
      assert.strictEqual(willCreateCycle(graph, 1, 0), true);
    });

    it('should work with a DAG forest.', function () {
      const graph = path(DirectedGraph, 4);
      graph.mergeEdge(5, 6);

      assert.strictEqual(willCreateCycle(graph, 0, 3), false);
      assert.strictEqual(willCreateCycle(graph, 0, 5), false);
      assert.strictEqual(willCreateCycle(graph, 6, 5), true);
    });

    it('should work with a simple DAG.', function () {
      const graph = new DirectedGraph();
      graph.mergeEdge(0, 1);
      graph.mergeEdge(0, 2);
      graph.mergeEdge(1, 2);
      graph.mergeEdge(2, 3);

      assert.strictEqual(willCreateCycle(graph, 0, 3), false);
      assert.strictEqual(willCreateCycle(graph, 3, 0), true);
      assert.strictEqual(willCreateCycle(graph, 3, 1), true);
      assert.strictEqual(willCreateCycle(graph, 3, 2), true);
    });
  });

  describe('topologicalSort', function () {
    it('should throw if given invalid arguments.', function () {
      assert.throws(function () {
        topologicalSort(null);
      }, /graphology/);

      assert.throws(function () {
        topologicalSort(new UndirectedGraph());
      }, /directed/);
    });

    it('should work on a path.', function () {
      const P5 = path(DirectedGraph, 5);

      const sorted = topologicalSort(P5);

      assert.deepStrictEqual(sorted, ['0', '1', '2', '3', '4']);
    });

    it('should throw on a cycle.', function () {
      const C5 = path(DirectedGraph, 5);
      C5.addEdge(4, 0);

      assert.throws(() => {
        topologicalSort(C5);
      }, /acyclic/);

      const DC5 = path(DirectedGraph, 5);
      DC5.mergeEdge(10, 11);
      DC5.mergeEdge(11, 12);
      DC5.mergeEdge(12, 10);

      assert.throws(() => {
        topologicalSort(DC5);
      }, /acyclic/);
    });

    it('should work on a typical example.', function () {
      const graph = new DirectedGraph();
      graph.mergeEdge(5, 11);
      graph.mergeEdge(11, 2);
      graph.mergeEdge(7, 11);
      graph.mergeEdge(7, 8);
      graph.mergeEdge(3, 8);
      graph.mergeEdge(3, 10);
      graph.mergeEdge(11, 9);
      graph.mergeEdge(11, 10);
      graph.mergeEdge(8, 9);

      assert.strictEqual(graph.order, 8);
      assert.strictEqual(graph.size, 9);

      const sorted = topologicalSort(graph);

      assert.deepStrictEqual(sorted, [
        '5',
        '7',
        '3',
        '11',
        '8',
        '2',
        '10',
        '9'
      ]);
    });

    it('should work with disconnected graphs.', function () {
      const graph = path(DirectedGraph, 4);
      mergePath(graph, [10, 11, 12]);

      const sorted = topologicalSort(graph);

      assert.deepStrictEqual(sorted, ['0', '10', '1', '11', '2', '12', '3']);
    });

    it('should work on falsely mixed graphs.', function () {
      const graph = path(Graph, 3);

      const sorted = topologicalSort(graph);

      assert.deepEqual(sorted, ['0', '1', '2']);
    });

    it('should work on a multi graphs.', function () {
      const multiGraph = new MultiDirectedGraph();
      multiGraph.mergeEdge(0, 1);
      multiGraph.mergeEdge(0, 1);
      multiGraph.mergeEdge(0, 1);
      multiGraph.mergeEdge(1, 2);
      multiGraph.mergeEdge(1, 2);
      multiGraph.mergeEdge(0, 3);

      const simpleGraph = new DirectedGraph();
      simpleGraph.mergeEdge(0, 1);
      simpleGraph.mergeEdge(1, 2);
      simpleGraph.mergeEdge(0, 3);

      const multiSorted = topologicalSort(multiGraph);
      const simpleSorted = topologicalSort(simpleGraph);

      assert.deepStrictEqual(multiSorted, simpleSorted);
    });

    it('should work using a callback.', function () {
      const graph = new DirectedGraph();
      graph.addNode('0', {color: 'red'});
      graph.addNode('1', {color: 'blue'});
      graph.addNode('2', {color: 'yellow'});
      mergePath(graph, ['2', '1', 0]);

      const sorted = [];

      forEachNodeInTopologicalOrder(graph, (node, attr, gen) => {
        sorted.push([node, attr, gen]);
      });

      assert.deepStrictEqual(sorted, [
        ['2', {color: 'yellow'}, 0],
        ['1', {color: 'blue'}, 1],
        ['0', {color: 'red'}, 2]
      ]);
    });

    it('should return the correct topological generations of a path.', function () {
      const P6 = path(DirectedGraph, 6);

      assert.strictEqual(P6.order, 6);
      assert.strictEqual(P6.size, 5);

      const generations = topologicalGenerations(P6);
      const generationsSet = generations.map(gen => {
        return new Set(gen);
      });

      assert.deepStrictEqual(generationsSet, [
        new Set(['0']),
        new Set(['1']),
        new Set(['2']),
        new Set(['3']),
        new Set(['4']),
        new Set(['5'])
      ]);
    });

    it('should return correct topological generations with disconnected graphs.', function () {
      const graph = new DirectedGraph();
      graph.addNode(3);

      graph.mergeEdge(5, 11);
      graph.mergeEdge(11, 2);
      graph.mergeEdge(7, 11);
      graph.mergeEdge(7, 8);
      graph.mergeEdge(11, 9);
      graph.mergeEdge(11, 10);
      graph.mergeEdge(8, 9);

      assert.strictEqual(graph.order, 8);
      assert.strictEqual(graph.size, 7);

      const generations = topologicalGenerations(graph);
      const generationsSet = generations.map(gen => {
        return new Set(gen);
      });

      assert.deepStrictEqual(generationsSet, [
        new Set(['5', '7', '3']),
        new Set(['11', '8']),
        new Set(['2', '9', '10'])
      ]);
    });

    it('should be possible to iterate over generations using a callback.', function () {
      const graph = new DirectedGraph();

      graph.mergeEdge(5, 11);
      graph.mergeEdge(11, 2);
      graph.mergeEdge(7, 11);
      graph.mergeEdge(7, 8);
      graph.mergeEdge(3, 8);
      graph.mergeEdge(3, 10);
      graph.mergeEdge(11, 9);
      graph.mergeEdge(11, 10);
      graph.mergeEdge(8, 9);

      assert.strictEqual(graph.order, 8);
      assert.strictEqual(graph.size, 9);

      const generations = [];

      forEachTopologicalGeneration(graph, gen => {
        generations.push(new Set(gen));
      });

      assert.deepStrictEqual(generations, [
        new Set(['5', '7', '3']),
        new Set(['11', '8']),
        new Set(['2', '9', '10'])
      ]);
    });

    it('should work even if the graph has only one generation.', function () {
      const graph = new DirectedGraph();
      graph.mergeNode(1);
      graph.mergeNode(2);
      graph.mergeNode(3);

      const generations = [];
      forEachTopologicalGeneration(graph, gen => {
        generations.push(new Set(gen));
      });

      assert.deepStrictEqual(generations, [new Set(['1', '2', '3'])]);
    });

    it('should do nothing if the graph is empty.', function () {
      const graph = new DirectedGraph();

      const nodes = [];

      forEachNodeInTopologicalOrder(graph, node => {
        nodes.push(node);
      });

      assert.deepStrictEqual(nodes, []);

      const generations = [];

      forEachTopologicalGeneration(graph, gen => {
        generations.push(gen);
      });

      assert.deepStrictEqual(generations, []);
    });
  });

  describe('forEachTransitiveRelation', function () {
    it('should throw error if the node is not in the graph', function () {
      const graph = new DirectedGraph();
      assert.throws(() => bypassNode(graph, '0'), NotFoundGraphError);
    });

    it('should do nothing on disconnected nodes', function () {
      const graph = new DirectedGraph();
      graph.addNode(0);
      graph.addNode(1);
      const callback = sinon.spy();
      forEachTransitiveRelation(graph, 0, callback);
      assert.strictEqual(callback.callCount, 0);
    });

    it('should do nothing on root nodes', function () {
      const graph = new DirectedGraph();
      graph.mergeEdge(0, 1);
      const callback = sinon.spy();
      forEachTransitiveRelation(graph, 0, callback);
      assert.strictEqual(callback.callCount, 0);
    });

    it('should do nothing on leaf nodes', function () {
      const graph = new DirectedGraph();
      graph.mergeEdge(0, 1);
      const callback = sinon.spy();
      forEachTransitiveRelation(graph, 1, callback);
      assert.strictEqual(callback.callCount, 0);
    });

    it('should patch through 1-1 nodes', function () {
      const graph = new DirectedGraph();
      const [edge01] = graph.mergeEdge(0, 1);
      const [edge12] = graph.mergeEdge(1, 2);
      const callback = sinon.spy();
      forEachTransitiveRelation(graph, 1, callback);
      assert.strictEqual(callback.callCount, 1);
      assert.strictEqual(callback.calledWith(edge01, edge12), true);
    });

    it('should patch through many-to-1 nodes', function () {
      const graph = new DirectedGraph();
      const [edge01] = graph.mergeEdge(0, 1);
      const [edge12] = graph.mergeEdge(1, 2);
      const [edge13] = graph.mergeEdge(1, 3);
      const callback = sinon.spy();
      forEachTransitiveRelation(graph, 1, callback);
      assert.strictEqual(callback.callCount, 2);
      assert.strictEqual(callback.calledWith(edge01, edge12), true);
      assert.strictEqual(callback.calledWith(edge01, edge13), true);
    });

    it('should patch through 1-to-many nodes', function () {
      const graph = new DirectedGraph();
      const [edge02] = graph.mergeEdge(0, 2);
      const [edge12] = graph.mergeEdge(1, 2);
      const [edge23] = graph.mergeEdge(2, 3);
      const callback = sinon.spy();
      forEachTransitiveRelation(graph, 2, callback);
      assert.strictEqual(callback.callCount, 2);
      assert.strictEqual(callback.calledWith(edge02, edge23), true);
      assert.strictEqual(callback.calledWith(edge12, edge23), true);
    });

    it('should cross-connect many-to-many nodes', function () {
      const graph = new DirectedGraph();
      const [edge02] = graph.mergeEdge(0, 2);
      const [edge12] = graph.mergeEdge(1, 2);
      const [edge23] = graph.mergeEdge(2, 3);
      const [edge24] = graph.mergeEdge(2, 4);
      const callback = sinon.spy();
      forEachTransitiveRelation(graph, 2, callback);
      assert.strictEqual(callback.callCount, 4);
      assert.strictEqual(callback.calledWith(edge02, edge23), true);
      assert.strictEqual(callback.calledWith(edge12, edge23), true);
      assert.strictEqual(callback.calledWith(edge02, edge24), true);
      assert.strictEqual(callback.calledWith(edge12, edge24), true);
    });

    it('should pass node and edge attributes', () => {
      const graph = new DirectedGraph();
      graph.addNode(0, {node0attr: '0'});
      graph.addNode(1, {node1attr: '1'});
      graph.addNode(2, {node2attr: '2'});
      const [inEdge] = graph.mergeEdge(0, 1, {edge01attr: '0-1'});
      const [outEdge] = graph.mergeEdge(1, 2, {edge12attr: '1-2'});

      const callback = sinon.spy();
      forEachTransitiveRelation(graph, 1, callback);
      assert.strictEqual(callback.callCount, 1);
      assert.deepStrictEqual(callback.getCall(0).args, [
        inEdge,
        outEdge,
        {edge01attr: '0-1'},
        {edge12attr: '1-2'},
        '0',
        '1',
        '2',
        {node0attr: '0'},
        {node1attr: '1'},
        {node2attr: '2'}
      ]);
    });

    it('should connect all edges on a multi-graph', function () {
      const graph = new MultiDirectedGraph();
      const [in0] = graph.mergeEdge(0, 1);
      const [in1] = graph.mergeEdge(0, 1);
      const [out0] = graph.mergeEdge(1, 2);
      const [out1] = graph.mergeEdge(1, 2);

      const callback = sinon.spy();
      forEachTransitiveRelation(graph, 1, callback);

      assert.strictEqual(callback.callCount, 4);
      assert.strictEqual(callback.calledWith(in0, out0), true);
      assert.strictEqual(callback.calledWith(in0, out1), true);
      assert.strictEqual(callback.calledWith(in1, out0), true);
      assert.strictEqual(callback.calledWith(in1, out1), true);
    });
  });

  describe('bypassNode', function () {
    it('should throw error if the node is not in the graph', function () {
      const graph = new DirectedGraph();
      assert.throws(() => bypassNode(graph, '0'), NotFoundGraphError);
    });

    it('should do nothing on disconnected nodes', () => {
      const graph = new DirectedGraph();
      graph.addNode(0);
      graph.addNode(1);
      bypassNode(graph, 0);
      assert.deepStrictEqual(graph.nodes().sort(), ['0', '1']);
      assert.deepStrictEqual(graph.edges(), []);
    });

    it('should do nothing on root nodes', () => {
      const graph = new DirectedGraph();
      const [edgeKey] = graph.mergeEdge(0, 1);
      bypassNode(graph, 0);
      assert.deepStrictEqual(graph.nodes().sort(), ['0', '1']);
      assert.deepStrictEqual(graph.edges(), [edgeKey]);
    });

    it('should do nothing on leaf nodes', () => {
      const graph = new DirectedGraph();
      const [edgeKey] = graph.mergeEdge(0, 1);
      bypassNode(graph, 1);
      assert.deepStrictEqual(graph.nodes().sort(), ['0', '1']);
      assert.deepStrictEqual(graph.edges(), [edgeKey]);
    });

    it('should patch through 1-1 nodes', () => {
      const graph = new DirectedGraph();
      graph.mergeEdge(0, 1);
      graph.mergeEdge(1, 2);
      bypassNode(graph, 1);
      graph.dropNode(1);

      assert.deepStrictEqual(graph.nodes().sort(), ['0', '2']);
      assert.deepStrictEqual(allEdges(graph), [['0', '2']]);
    });

    it('should patch through many-to-1 nodes', () => {
      const graph = new DirectedGraph();
      graph.mergeEdge(0, 2);
      graph.mergeEdge(1, 2);
      graph.mergeEdge(2, 3);
      bypassNode(graph, 2);
      graph.dropNode(2);

      assert.deepStrictEqual(graph.nodes().sort(), ['0', '1', '3']);
      assert.deepStrictEqual(allEdges(graph), [
        ['0', '3'],
        ['1', '3']
      ]);
    });

    it('should patch through 1-to-many nodes', () => {
      const graph = new DirectedGraph();
      graph.mergeEdge(0, 1);
      graph.mergeEdge(1, 2);
      graph.mergeEdge(1, 3);
      bypassNode(graph, 1);
      graph.dropNode(1);

      assert.deepStrictEqual(graph.nodes().sort(), ['0', '2', '3']);
      assert.deepStrictEqual(allEdges(graph), [
        ['0', '2'],
        ['0', '3']
      ]);
    });

    it('should cross-connect many-to-many nodes', () => {
      const graph = new DirectedGraph();
      graph.mergeEdge(0, 2);
      graph.mergeEdge(1, 2);
      graph.mergeEdge(2, 3);
      graph.mergeEdge(2, 4);
      bypassNode(graph, 2);
      graph.dropNode(2);

      assert.deepStrictEqual(graph.nodes().sort(), ['0', '1', '3', '4']);
      assert.deepStrictEqual(allEdges(graph), [
        ['0', '3'],
        ['0', '4'],
        ['1', '3'],
        ['1', '4']
      ]);
    });

    it('should respect pre-existing edges', () => {
      const graph = new DirectedGraph();
      graph.mergeEdge(0, 1);
      graph.mergeEdge(0, 2, {preexistingAttr: 'abcd'});
      graph.mergeEdge(1, 2);
      bypassNode(graph, 1);
      graph.dropNode(1);
      assert.strictEqual(graph.edges(0, 2).length, 1);
    });

    it('should not create new edges even in a MultiGraph', () => {
      const graph = new MultiDirectedGraph();
      graph.mergeEdge(0, 1);
      graph.mergeEdge(0, 2, {preexistingAttr: 'abcd'});
      graph.mergeEdge(1, 2);
      bypassNode(graph, 1);
      graph.dropNode(1);
      assert.strictEqual(graph.edges(0, 2).length, 1);
    });
  });
});
