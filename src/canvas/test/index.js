/**
 * Graphology Canvas Unit Tests
 * =============================
 */
var assert = require('assert');
var DEFAULT_NODE_REDUCER = require('../defaults.js').DEFAULT_NODE_REDUCER;
var defaults = require('../defaults.js');
var refineSettings = defaults.refineSettings;
var DEFAULTS = defaults.DEFAULTS;

describe('graphology-canvas', function () {
  it('should throw if some node has no position.', function () {
    assert.throws(function () {
      DEFAULT_NODE_REDUCER({}, 'John', {color: 'green'});
    }, /position/);
  });

  describe('refineSettings', function () {
    it('works with nullish structures', function () {
      var res2 = refineSettings();
      var res1 = refineSettings(null);
      var res3 = refineSettings({});
      assert.deepEqual(res1, DEFAULTS);
      assert.deepEqual(res2, DEFAULTS);
      assert.deepEqual(res3, DEFAULTS);
    });

    it('squarifies when only width or height provided', function () {
      var resW = refineSettings({width: 100});
      assert.deepEqual(
        resW,
        Object.assign({}, DEFAULTS, {
          width: 100,
          height: 100
        })
      );
      var resH = refineSettings({height: 200});
      assert.deepEqual(
        resH,
        Object.assign({}, DEFAULTS, {
          width: 200,
          height: 200
        })
      );
    });

    it('works with reducers', function () {
      var TEST_REDUCER = function () {};
      var res = refineSettings({
        nodes: {reducer: TEST_REDUCER},
        edges: {reducer: TEST_REDUCER}
      });
      assert.deepEqual(
        res,
        Object.assign({}, DEFAULTS, {
          nodes: {
            reducer: TEST_REDUCER,
            defaultColor: DEFAULTS.nodes.defaultColor
          },
          edges: {
            reducer: TEST_REDUCER,
            defaultColor: DEFAULTS.edges.defaultColor
          }
        })
      );
    });
  });
});
