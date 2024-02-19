/**
 * Graphology Canvas Unit Tests
 * =============================
 */
var assert = require('assert');
var DEFAULT_NODE_REDUCER = require('../defaults.js').DEFAULT_NODE_REDUCER;

describe('graphology-canvas', function () {
  it('should throw if some node has no position.', function () {
    assert.throws(function () {
      DEFAULT_NODE_REDUCER({}, 'John', {color: 'green'});
    }, /position/);
  });
});
