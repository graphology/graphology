/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert');
var Graph = require('graphology');
var utils = require('../utils.js');

var collectLayout = utils.collectLayout;

var GRAPH = new Graph();
GRAPH.addNode('a', {x: 1, y: 2, z: 5});
GRAPH.addNode('b', {x: 3, y: 4});
GRAPH.addNode('c', {y: 6, z: 8});
GRAPH.addNode('d');

describe('utils', function () {
  describe('collectLayout', function () {
    it('should throw if provided with and invalid graph.', function () {
      assert.throws(function () {
        collectLayout(null);
      }, /graphology/);
    });

    it('should return the correct layout.', function () {
      var layout = collectLayout(GRAPH);

      assert.deepStrictEqual(layout, {a: {x: 1, y: 2}, b: {x: 3, y: 4}});

      layout = collectLayout(GRAPH, {dimensions: ['y', 'z']});

      assert.deepStrictEqual(layout, {a: {y: 2, z: 5}, c: {y: 6, z: 8}});

      layout = collectLayout(GRAPH, {exhaustive: false});

      assert.deepEqual(layout, {a: {x: 1, y: 2}, b: {x: 3, y: 4}, c: {y: 6}});
    });
  });
});
