/**
 * Graphology Browser GRAPHML Parser Unit Tests
 * =============================================
 */
var assert = require('assert'),
    Graph = require('graphology'),
    parser = require('../../browser/parser.js'),
    common = require('../common.js');

describe('Parser', function() {
  this.timeout(5 * 1000);

  it('should throw if not given a valid constructor.', function() {
    assert.throws(function() {
      parser(function() {});
    }, /constructor/);
  });

  it('should throw if source has invalid type.', function() {
    assert.throws(function() {
      parser(Graph, null);
    }, /source/);
  });

  common.testAllFiles(parser);
});
