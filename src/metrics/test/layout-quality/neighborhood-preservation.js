/**
 * Graphology Neighborhood Preservation Unit Tests
 * ================================================
 */
var assert = require('chai').assert,
    Graph = require('graphology'),
    neighborhoodPreservation = require('../../layout-quality/neighborhood-preservation.js'),
    emptyGraph = require('graphology-generators/classic/empty'),
    karateClub = require('graphology-generators/social/karate-club'),
    circularLayout = require('graphology-layout/circular'),
    rioData = require('../datasets/rio.json');

var KARATE = karateClub(Graph);
var RIO = Graph.from(rioData, {type: 'directed'});

describe('neighborhood preservation', function() {
  it('should throw when given invalid arguments.', function() {
    assert.throws(function() {
      neighborhoodPreservation(null);
    }, /graphology/);

    assert.throws(function() {
      neighborhoodPreservation(new Graph());
    }, /null/);
  });

  it('should return the correct metric.', function() {
    assert.strictEqual(neighborhoodPreservation(emptyGraph(Graph, 5)), 0);

    var karate = KARATE.copy();
    circularLayout.assign(karate, {scale: 10});

    var m = neighborhoodPreservation(karate);

    assert.closeTo(m, 0.166, 0.001);

    assert.closeTo(neighborhoodPreservation(RIO), 0.498, 0.001);
  });
});
