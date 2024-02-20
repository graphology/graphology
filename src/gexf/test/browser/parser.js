/**
 * Graphology Browser GEXF Parser Unit Tests
 * ==========================================
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

  it('should throw if an edge points to an inexisting node.', function () {
    assert.throws(function () {
      parser(Graph, resources.missing_nodes);
    }, /inexisting/);
  });

  it('should throw an error if an attribute definition is missing.', function () {
    assert.throws(function () {
      parser(Graph, resources.undeclared_attribute);
    }, /graphology-gexf\/parser: Found undeclared attribute "url"/);
  });

  it('should respect the given typed constructor when asked.', function () {
    var graph = parser(Graph, resources.les_miserables, {
      respectInputGraphType: true
    });

    assert.strictEqual(graph.type, 'mixed');
  });

  it('should throw when typed constructor must be respected and the parsed graph has an invalid type.', function () {
    assert.throws(function () {
      parser(Graph, resources.celegans, {respectInputGraphType: true});
    }, /parallel/);

    assert.throws(function () {
      parser(Graph.DirectedGraph, resources.basic, {
        respectInputGraphType: true
      });
    }, /respect/);
  });

  common.testAllFiles(parser);
});
