/**
 * Graphology Edge Uniformity Unit Tests
 * ======================================
 */
var assert = require('chai').assert,
    Graph = require('graphology'),
    edgeUniformity = require('../../layout-quality/edge-uniformity'),
    karateClub = require('graphology-generators/social/karate-club'),
    circularLayout = require('graphology-layout/circular'),
    rioData = require('../datasets/rio.json');

var KARATE = karateClub(Graph);
var RIO = Graph.from(rioData, {type: 'directed'});

describe('edge uniformity', function() {
  it('should throw when given invalid arguments.', function() {
    assert.throws(function() {
      edgeUniformity(null);
    }, /graphology/);
  });

  it('should return the correct metric.', function() {
    assert.strictEqual(edgeUniformity(new Graph()), 0);

    var karate = KARATE.copy();
    circularLayout.assign(karate, {scale: 10});

    var m = edgeUniformity(karate);

    assert.closeTo(m, 0.513, 0.001);

    var otherKarate = KARATE.copy();
    circularLayout.assign(otherKarate, {scale: 100});

    assert.closeTo(m, edgeUniformity(otherKarate), 0.001);

    assert.closeTo(edgeUniformity(RIO), 1.132, 0.001);
  });
});
