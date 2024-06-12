/**
 * Graphology Connected Closeness Unit Tests
 * ==========================================
 */
var assert = require('assert');
var seedrandom = require('seedrandom');
var Graph = require('graphology');
var connectedCloseness = require('../../layout-quality/connected-closeness');

var celegansData = require('../datasets/celegans.json');

var CELEGANS = Graph.from(celegansData);

function createTestRng() {
  return seedrandom('test');
}

describe('connected closeness', function () {
  it('should throw when given invalid arguments.', function () {
    assert.throws(function () {
      connectedCloseness(null);
    }, /graphology/);
  });

  it('should return the correct results.', function () {
    var result = connectedCloseness(CELEGANS, {rng: createTestRng()});

    assert.deepStrictEqual(result, {
      deltaMax: 275.15902257058696,
      ePercentOfDeltaMax: 0.8311300639658848,
      pPercentOfDeltaMax: 0.27803837953091687,
      pEdgeOfDeltaMax: 0.037553967746876145,
      cMax: 0.553091684434968
    });
  });
});
