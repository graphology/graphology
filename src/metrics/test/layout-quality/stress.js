/**
 * Graphology Stress Unit Tests
 * =============================
 */
var assert = require('chai').assert,
    Graph = require('graphology'),
    stress = require('../../layout-quality/stress'),
    karateClub = require('graphology-generators/social/karate-club'),
    circularLayout = require('graphology-layout/circular'),
    rioData = require('../datasets/rio.json');

var KARATE = karateClub(Graph);
var RIO = Graph.from(rioData, {type: 'directed'});

describe('stress', function() {
  it('should throw when given invalid arguments.', function() {
    assert.throws(function() {
      stress(null);
    }, /graphology/);

    assert.throws(function() {
      stress(new Graph());
    }, /null/);
  });

  it('should return the correct metric.', function() {
    var karate = KARATE.copy();
    circularLayout.assign(karate, {scale: 10});

    var m = stress(karate);
    assert.closeTo(m, 24510.2914, 0.001);

    assert.closeTo(stress(RIO), 1525246942.0164, 0.001);
  });
});
