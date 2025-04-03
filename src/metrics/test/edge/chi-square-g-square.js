/**
 * Graphology Edge Chi Square/G Square Unit Tests
 * =====================================
 */
var assert = require('assert');
var Graph = require('graphology');
var chiSquare = require('../../edge/chi-square');
var gSquare = require('../../edge/g-square');

var UndirectedGraph = Graph.UndirectedGraph;

describe('chiSquareGSquare', function () {
  it('should throw when given an invalid graph.', function () {
    assert.throws(function () {
      chiSquare(null);
    });
    assert.throws(function () {
      gSquare(null);
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


    var chiSquareResults = chiSquare(graph, 'cooccurrence');

    assert.deepStrictEqual(chiSquareResults, {
      'catcat': undefined,
      'catdog': 0,
      'catrabbit': 0
    });

    var gSquareResults = gSquare(graph, 'cooccurrence');
    assert.deepStrictEqual(gSquareResults, {
      'catcat': undefined,
      'catdog': 0,
      'catrabbit': 0
    });
  });


  it('should provide relevance thresholds', function(){
    assert.strictEqual(chiSquare.thresholds['pValue<0.5'], 0.45)
    assert.strictEqual(gSquare.thresholds['pValue<0.5'], 0.45)
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



    var chiSquareResults = chiSquare(graph, 'occurrences');
    assert.deepStrictEqual(chiSquareResults, {
      'doc1Cat': 0.13888888888888884, 
      'doc1Dog': 0.8333333333333334,
      'doc2Cat': undefined,
      'doc2Rabbit': 1.8750000000000002
    });

    var gSquareResults = gSquare(graph, 'occurrences');
    assert.deepStrictEqual(gSquareResults, {
      'doc1Cat': 0.13844293808390656,
      'doc1Dog': 1.184939225613002,
      'doc2Cat': undefined,
      'doc2Rabbit': 2.231435513142098
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

    chiSquare.assign(graph, 'occurrences');
    gSquare.assign(graph, 'occurrences');
    
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
