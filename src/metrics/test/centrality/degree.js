/**
 * Graphology Degree Centrality Unit Tests
 * ========================================
 */
var assert = require('chai').assert,
    Graph = require('graphology'),
    degree = require('../../centrality/degree');

var UndirectedGraph = Graph.UndirectedGraph,
    DirectedGraph = Graph.DirectedGraph;

var GRAPHS = {
  basic: {
    nodes: [1, 2, 3, 4, 5, 6, 7, 8],
    edges: [
      [1, 3],
      [1, 4],
      [1, 5],
      [2, 1],
      [2, 3],
      [3, 6],
      [4, 7],
      [5, 4],
      [6, 5],
      [8, 4]
    ],
    degreeCentrality: {
      1: 4 / 7,
      2: 2 / 7,
      3: 3 / 7,
      4: 4 / 7,
      5: 3 / 7,
      6: 2 / 7,
      7: 1 / 7,
      8: 1 / 7
    },
    inDegreeCentrality: {
      1: 1 / 7,
      2: 0 / 7,
      3: 2 / 7,
      4: 3 / 7,
      5: 2 / 7,
      6: 1 / 7,
      7: 1 / 7,
      8: 0 / 7
    },
    outDegreeCentrality: {
      1: 3 / 7,
      2: 2 / 7,
      3: 1 / 7,
      4: 1 / 7,
      5: 1 / 7,
      6: 1 / 7,
      7: 0 / 7,
      8: 1 / 7
    }
  }
};

describe('degree centrality', function() {

  function getBasicGraph() {
    var graph = new DirectedGraph();

    GRAPHS.basic.nodes.forEach(function(node) {
      graph.addNode(node);
    });

    GRAPHS.basic.edges.forEach(function(edge) {
      graph.addEdge.apply(graph, edge);
    });

    return graph;
  }

  function collect(graph, attr) {
      var o = {};

      graph.nodes().forEach(function(node) {
        o[node] = graph.getNodeAttribute(node, attr);
      });

      return o;
    }

  it('should throw if an invalid graph is provided.', function() {
    assert.throws(function() {
      degree({hello: 'world'});
    }, /graphology/);
  });

  it('should throw when trying to compute in/out degree centrality on an undirected graph.', function() {
    assert.throws(function() {
      degree.inDegreeCentrality(new UndirectedGraph());
    }, /undirected/);

    assert.throws(function() {
      degree.outDegreeCentrality(new UndirectedGraph());
    }, /undirected/);
  });

  it('should properly compute degree centrality.', function() {
    var graph = getBasicGraph();

    // Degree
    var centralities = degree.degreeCentrality(graph);
    assert.deepEqual(centralities, GRAPHS.basic.degreeCentrality);

    degree.degreeCentrality.assign(graph);
    assert.deepEqual(collect(graph, 'degreeCentrality'), GRAPHS.basic.degreeCentrality);

    // InDegree
    centralities = degree.inDegreeCentrality(graph);
    assert.deepEqual(centralities, GRAPHS.basic.inDegreeCentrality);

    degree.inDegreeCentrality.assign(graph);
    assert.deepEqual(collect(graph, 'inDegreeCentrality'), GRAPHS.basic.inDegreeCentrality);

    // OutDegree
    centralities = degree.outDegreeCentrality(graph);
    assert.deepEqual(centralities, GRAPHS.basic.outDegreeCentrality);

    degree.outDegreeCentrality.assign(graph);
    assert.deepEqual(collect(graph, 'outDegreeCentrality'), GRAPHS.basic.outDegreeCentrality);
  });

  it('should be possible to give a custom attribute name.', function() {
    var graph = getBasicGraph();

    degree.degreeCentrality.assign(graph, {attributes: {centrality: 'centrality'}});
    assert.deepEqual(collect(graph, 'centrality'), GRAPHS.basic.degreeCentrality);
  });
});
