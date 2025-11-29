/**
 * Graphology Canvas Unit Tests
 * =============================
 */
var assert = require('assert');
var DEFAULT_NODE_REDUCER = require('../defaults.js').DEFAULT_NODE_REDUCER;
var { refineSettings, DEFAULTS } = require('../defaults.js');

describe('graphology-canvas', function () {

  it('should throw if some node has no position.', function () {
    assert.throws(function () {
      DEFAULT_NODE_REDUCER({}, 'John', { color: 'green' });
    }, /position/);
  });

  describe('refineSettings', function () {

    it('works with nullish structures', function () {
      const res2 = refineSettings();
      const res1 = refineSettings(null);
      const res3 = refineSettings({});
      assert.deepEqual(res1, DEFAULTS);
      assert.deepEqual(res2, DEFAULTS);
      assert.deepEqual(res3, DEFAULTS);
    });

    it('squarifies when only width or height provided', function () {
      const resW = refineSettings({ width: 100 });
      assert.deepEqual(resW, {
        ...DEFAULTS,
        width: 100,
        height: 100
      });
      const resH = refineSettings({ height: 200 });
      assert.deepEqual(resH, {
        ...DEFAULTS,
        width: 200,
        height: 200
      });
    });

    it('works with reducers', function () {
      const TEST_REDUCER = () => { };
      const res = refineSettings({
        nodes: { reducer: TEST_REDUCER },
        edges: { reducer: TEST_REDUCER },
      });
      assert.deepEqual(res, {
        ...DEFAULTS,
        nodes: { reducer: TEST_REDUCER, defaultColor: DEFAULTS.nodes.defaultColor },
        edges: { reducer: TEST_REDUCER, defaultColor: DEFAULTS.edges.defaultColor },
      });
    });

  });

});
