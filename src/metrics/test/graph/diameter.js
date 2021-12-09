/**
 * Graphology Diameter Unit Tests
 * ==============================
 */
var assert = require('chai').assert;
var Graph = require('graphology');
var emptyGraph = require('graphology-generators/classic/empty');
var diameter = require('../../graph/diameter.js');

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
  } else {
    graph.addDirectedEdge(1, 2);
    graph.addDirectedEdge(2, 3);
    graph.addDirectedEdge(3, 1);
    graph.addDirectedEdge(3, 5);
    graph.addDirectedEdge(2, 4);
  }

  return graph;
}

describe('diameter', function () {
  it('should return infinity with multiple components.', function () {
    var graph = createGraph('undirected');
    graph.addNode('6');
    var result = diameter(graph);
    assert.strictEqual(result, Infinity);
  });

  it('should return infinity when all nodes cannot be reached from anywhere in a directed graph.', function () {
    var result = diameter(createGraph('directed'));
    assert.strictEqual(result, Infinity);
  });

  it('should return infinity if the graph is empty.', function () {
    var graph = emptyGraph(Graph, 6);
    assert.strictEqual(diameter(graph), Infinity);
  });

  it('should return the correct diameter.', function () {
    var result = diameter(createGraph('undirected'));
    assert.strictEqual(result, 3);
  });
});
