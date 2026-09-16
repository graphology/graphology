/**
 * Graphology Browser DOT Parser Unit Tests
 * =========================================
 */
var assert = require('assert');
var Graph = require('graphology');
var parser = require('../../browser/parser.js');
var common = require('../common.js');
var resources = require('../resources');

describe('Parser', function () {
  this.timeout(5 * 1000);

  it('should throw if not given a valid constructor.', function () {
    assert.throws(function () {
      parser(function () {});
    }, /constructor/);
  });

  it('should throw if source has invalid type.', function () {
    assert.throws(function () {
      parser(Graph, null);
    }, /source/);
  });

  it('should implicitly add missing nodes referenced in edges.', function () {
    var graph = parser(Graph, 'graph G { a -- b; }');
    assert.strictEqual(graph.order, 2);
    assert.strictEqual(graph.size, 1);
    assert.strictEqual(graph.hasNode('a'), true);
    assert.strictEqual(graph.hasNode('b'), true);
  });

  common.testAllFiles(parser);
});
