/**
 * Graphology Indices Unit Tests
 * ==============================
 */
var assert = require('assert');
var mergeClique = require('graphology-utils/merge-clique');
var Graph = require('graphology');

var SortedComponentsIndex = require('../sorted-components.js');

describe('SortedComponentsIndex', function() {
  it('should return the correct indices.', function() {
    var graph = new Graph();

    mergeClique(graph, ['1', '2', '3', '4']);
    graph.addNode('7');
    graph.addNode('8');
    graph.addNode('9');
    mergeClique(graph, ['5', '6']);
    mergeClique(graph, ['10', '11', '12', '13', '14']);

    var index = new SortedComponentsIndex(graph);

    assert.strictEqual(index.count, 6);
    assert.deepStrictEqual(Array.from(index.orders), [5, 4, 2, 1, 1, 1]);
    assert.deepStrictEqual(Array.from(index.offsets), [0, 5, 9, 11, 12, 13, 14]);

    var components = Array.from(index.orders).map(function(order, i) {
      return new Set(index.nodes.slice(index.offsets[i], index.offsets[i + 1]));
    });

    assert.deepStrictEqual(components, [
      new Set(['10', '11', '12', '13', '14']),
      new Set(['1', '2', '3', '4']),
      new Set(['5', '6']),
      new Set(['8']),
      new Set(['9']),
      new Set(['7'])
    ]);
  });
});
