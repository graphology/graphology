/**
 * Graphology Edge Chi Square/G Square Unit Tests
 * =====================================
 */
var assert = require('assert');
var Graph = require('graphology');
var chiSquareGSquare = require('../../edge/chi-square-g-square');

var UndirectedGraph = Graph.UndirectedGraph;

describe('chiSquareGSquare', function () {
  it('should throw when given an invalid graph.', function () {
    assert.throws(function () {
        chiSquareGSquare(null);
    });
  });

  it('should return the correct result for cooccurrence network.', function () {
    var graph = new UndirectedGraph();

    graph.addNode('cat');
    graph.addNode('dog');
    graph.addNode('rabbit');

    graph.addEdgeWithKey('catcat','cat', 'cat', {'cooccurrence': 1});
    graph.addEdgeWithKey('catdog', 'cat', 'dog', {'cooccurrence': 1});
    graph.addEdgeWithKey('catrabbit', 'cat', 'rabbit', {'cooccurrence': 1});


    var measures = chiSquareGSquare(graph, 'cooccurrence');

    assert.deepStrictEqual(measures, {
      'catcat': {chiSquare:undefined, gSquare:undefined},
      'catdog': {chiSquare:0, gSquare:0},
      'catrabbit': {chiSquare:0, gSquare:0}
    });
  });
  it('should provide relevance thresholds', function(){
    assert.strictEqual(chiSquareGSquare.thresholds['pValue<0.5'], 0.45)
  })

  it('should return the correct result for occurrence network.', function () {
    var graph = new UndirectedGraph();

    graph.addNode('doc1');
    graph.addNode('doc2');
    graph.addNode('cat');
    graph.addNode('dog');
    graph.addNode('rabbit');

    graph.addEdgeWithKey('doc1Cat','doc1', 'cat', {'occurrences': 2});
    graph.addEdgeWithKey('doc1Dog', 'doc1', 'dog', {'occurrences': 1});
    graph.addEdgeWithKey('doc2Cat', 'doc2', 'cat', {'occurrences': 1});
    graph.addEdgeWithKey('doc2Rabbit', 'doc2', 'rabbit', {'occurrences': 1});



    var measures = chiSquareGSquare(graph, 'occurrences');
    assert.deepStrictEqual(measures, {
      'doc1Cat': {chiSquare:0.13888888888888884, gSquare:0.13844293808390656},
      'doc1Dog': {chiSquare:0.8333333333333334, gSquare:1.184939225613002},
      'doc2Cat': {chiSquare:undefined, gSquare:undefined},
      'doc2Rabbit': {chiSquare:1.8750000000000002, gSquare:2.231435513142098}
    });
  });
  it('should return the correct result for occurrence network when using assign.', function () {
    var graph = new UndirectedGraph();

    graph.addNode('doc1');
    graph.addNode('doc2');
    graph.addNode('cat');
    graph.addNode('dog');
    graph.addNode('rabbit');

    graph.addEdgeWithKey('doc1Cat','doc1', 'cat', {'occurrences': 2});
    graph.addEdgeWithKey('doc1Dog', 'doc1', 'dog', {'occurrences': 1});
    graph.addEdgeWithKey('doc2Cat', 'doc2', 'cat', {'occurrences': 1});
    graph.addEdgeWithKey('doc2Rabbit', 'doc2', 'rabbit', {'occurrences': 1});

    chiSquareGSquare.assign(graph, 'occurrences');
    var measures = graph.edges().reduce(function (acc,e) {
      acc[e] = graph.getEdgeAttributes(e);
      return acc;
    }, {})
    assert.deepStrictEqual(measures, {
      'doc1Cat': {occurrences: 2, chiSquare:0.13888888888888884, gSquare:0.13844293808390656},
      'doc1Dog': {occurrences: 1, chiSquare:0.8333333333333334, gSquare:1.184939225613002},
      'doc2Cat': {occurrences: 1, chiSquare:undefined, gSquare:undefined},
      'doc2Rabbit': {occurrences: 1, chiSquare:1.8750000000000002, gSquare:2.231435513142098}
    });
  });
});
