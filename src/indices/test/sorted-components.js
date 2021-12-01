/**
 * Graphology Indices Unit Tests
 * ==============================
 */
var assert = require('assert');
var mergeClique = require('graphology-utils/merge-clique');
var Graph = require('graphology');

var SortedComponentsIndex = require('../sorted-components.js');

describe('SortedComponentsIndex', function () {
  it('should return the correct indices.', function () {
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
    assert.deepStrictEqual(Array.from(index.offsets), [9, 0, 7, 4, 5, 6]);

    var components = Array.from(index.orders)
      .map(function (order, i) {
        var start = index.offsets[i];
        var end = start + order;

        assert(end <= index.nodes.length);

        return index.nodes.slice(start, end).sort().join(',');
      })
      .sort()
      .join('$');

    assert.strictEqual(components, '1,2,3,4$10,11,12,13,14$5,6$7$8$9');
  });
});
