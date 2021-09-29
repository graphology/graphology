/**
 * Graphology Diameter Unit Tests
 * ==============================
 */
var assert = require('chai').assert,
  Graph = require('graphology'),
  emptyGraph = require('graphology-generators/classic/empty'),
  diameter = require('../diameter.js');

function createGraph(type) {
  var graph = new Graph({type: type});

  graph.addNode('1');
  graph.addNode('2');
  graph.addNode('3');
  graph.addNode('4');
  graph.addNode('5');

  if (type === 'undirected') {
    graph.addUndirectedEdge(1, 2);
    graph.addUndirectedEdge(2, 3);
    graph.addUndirectedEdge(3, 1);
    graph.addUndirectedEdge(3, 5);
    graph.addUndirectedEdge(2, 4);
  }
  else {
    graph.addDirectedEdge(1, 2);
    graph.addDirectedEdge(2, 3);
    graph.addDirectedEdge(3, 1);
    graph.addDirectedEdge(3, 5);
    graph.addDirectedEdge(2, 4);
  }

  return graph;
}

describe('eccentricity', function() {
  it('should calculate the diameter of the given node in an undirected graph with two connected component.', function() {
    var graph = createGraph('undirected');
    graph.addNode('6');
    var result = diameter(graph);
    assert.strictEqual(result, Infinity);
  });

  it('should calculate the diameter of the given node in a directed graph.', function() {
    var result = diameter(createGraph('directed'));
    assert.strictEqual(result, Infinity);
  });

  it('should return Infinity if the graph is empty.', function() {
    var graph = emptyGraph(Graph, 6);
    assert.strictEqual(diameter(graph), Infinity);
  });

  it('should calculate the diameter of the given node in an undirected graph.', function() {
    var result = diameter(createGraph('undirected'));
    assert.strictEqual(result, 3);
  });
});
