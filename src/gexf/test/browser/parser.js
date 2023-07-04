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

   it('should throw an error if an attribut definition is missing',
      function () {
      assert.throws(function () {
        parser(Graph, resources.undeclared_attribute);
      }, /graphology-gexf\/parser: Found undeclared attribute "url"/
      );
    }
  )

  common.testAllFiles(parser);
});
