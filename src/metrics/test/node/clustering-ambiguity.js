/**
 * Graphology Clustering Ambiguity Unit Tests
 * ==========================================
 */
var assert = require('chai').assert;
var Graph = require('graphology');
var empty = require('graphology-generators/classic/empty');
var complete = require('graphology-generators/classic/complete');
var louvain = require('graphology-communities-louvain');
var ambiguity = require('../../node/clustering-ambiguity.js');

var UndirectedGraph = Graph.UndirectedGraph;
var DirectedGraph = Graph.DirectedGraph;
var MultiGraph = Graph.MultiGraph;

var undirected500 = Graph.from(require('../datasets/undirected500.json'), {
  type: 'undirected'
});

function createConnectedCliques() {
  var graph = new UndirectedGraph();

  graph.addNode('1');
  graph.addNode('2');
  graph.addNode('3');
  graph.addNode('4');
  graph.addNode('5');
  graph.addNode('6');

  graph.addUndirectedEdge(1, 2);
  graph.addUndirectedEdge(1, 3);
  graph.addUndirectedEdge(2, 3);
  graph.addUndirectedEdge(4, 5);
  graph.addUndirectedEdge(4, 6);
  graph.addUndirectedEdge(5, 6);

  return graph;
}

function nlouvain(graph, n) {
  var clusterings = [];
  for (var i = 0; i < n; i++) clusterings.push(louvain(graph));
  return clusterings;
}

describe('ambiguity', function () {
  it('should throw if the graph is directed.', function () {
    assert.throws(function () {
      ambiguity(new DirectedGraph(), []);
    });
  });

  it('should throw if the graph is multi.', function () {
    assert.throws(function () {
      ambiguity(new MultiGraph(), []);
    });
  });

  it('should throw if there is no clustering.', function () {
    assert.throws(function () {
      ambiguity(new UndirectedGraph(), []);
    });
  });

  it('should throw if there is only one clustering.', function () {
    assert.throws(function () {
      ambiguity(new UndirectedGraph(), [{}]);
    });
  });

  it('should return empty object if the graph is empty.', function () {
    var graph = new UndirectedGraph();
    assert.deepStrictEqual(ambiguity(graph, [{}, {}]), {});
  });

  var clusterings = nlouvain(undirected500, 50);
  var ambiguities = ambiguity(undirected500, clusterings);

  it('should return an object with each node as a key.', function () {
    var nodesList = undirected500.nodes().sort();
    assert.deepStrictEqual(Object.keys(ambiguities).sort(), nodesList);
  });

  it('should return an object with each value comprised between 0 and 1.', function () {
    Object.values(ambiguities).forEach(function (v) {
      assert(v >= 0 && v <= 1);
    });
  });

  it('should return only ambiguities equal to 0 when given a set of identical clusterings.', function () {
    var identicalClusterings = [
      clusterings[0],
      clusterings[0],
      clusterings[0],
      clusterings[0],
      clusterings[0]
    ];
    ambiguities = ambiguity(undirected500, identicalClusterings);
    Object.values(ambiguities).forEach(function (v) {
      assert(v === 0);
    });
  });

  it('should return only ambiguities equal to 0 when given a complete graph.', function () {
    var graph = complete(UndirectedGraph, 10);
    ambiguities = ambiguity(graph, nlouvain(graph, 50));
    Object.values(ambiguities).forEach(function (v) {
      assert(v === 0);
    });
  });

  it('should return only ambiguities equal to 0 when given a graph composed of isolated nodes.', function () {
    var graph = empty(UndirectedGraph, 100);
    ambiguities = ambiguity(graph, nlouvain(graph, 50));
    Object.values(ambiguities).forEach(function (v) {
      assert(v === 0);
    });
  });

  it('should return only ambiguities equal to 0 when given a graph composed of connex cliques.', function () {
    var graph = createConnectedCliques();
    ambiguities = ambiguity(graph, nlouvain(graph, 50));
    Object.values(ambiguities).forEach(function (v) {
      assert(v === 0);
    });
  });

  it('should return only ambiguities equal to 0 when given a graph composed of cliques only connected through 2 nodes.', function () {
    var graph = createConnectedCliques();
    graph.addUndirectedEdge(1, 6);
    ambiguities = ambiguity(graph, nlouvain(graph, 50));
    Object.values(ambiguities).forEach(function (v) {
      assert(v === 0);
    });
  });

  /*  it('should return ambiguities equal to 0 for all nodes except one when given a graph composed of 2 cliques and 1 node connected to all others.', function () {
    var graph = createConnectedCliques();
    graph.addNode('7');
    graph.addNode('8');
    graph.addUndirectedEdge(7, 1);
    graph.addUndirectedEdge(7, 8);
    graph.addUndirectedEdge(8, 6);
    console.log(nlouvain(graph, 100));
    ambiguities = ambiguity(graph, nlouvain(graph, 50));
    Object.values(ambiguities).forEach(function(v) {
      assert(v === 0);
    });
  });*/
});
