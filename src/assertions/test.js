/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert'),
  Graph = require('graphology'),
  lib = require('./index.js');

var hasSameNodes = lib.hasSameNodes;
var hasSameNodesDeep = lib.hasSameNodesDeep;

function addNodesFrom(g, nodes) {
  nodes.forEach(function (node) {
    g.addNode(node);
  });
}

describe('graphology-utils', function () {
  describe('#.hasSameNodes', function () {
    it("should return `true` if both graphs' nodes are the same.", function () {
      var G = new Graph(),
        H = new Graph();

      addNodesFrom(G, ['John', 'Martha', 'Elvis']);
      addNodesFrom(H, ['Martha', 'Elvis']);

      assert.strictEqual(hasSameNodes(G, H), false);

      H.addNode('John');

      assert.strictEqual(hasSameNodes(G, H), true);

      H.addNode('Estelle');

      assert.strictEqual(hasSameNodes(G, H), false);
    });
  });

  describe('#.hasSameNodesDeep', function () {
    it("should return `true` if both graphs' nodes & their attributes are the same.", function () {
      var G = new Graph(),
        H = new Graph();

      addNodesFrom(G, ['John', 'Martha', 'Elvis']);
      addNodesFrom(H, ['Martha', 'Elvis']);

      assert.strictEqual(hasSameNodesDeep(G, H), false);

      H.addNode('John');

      assert.strictEqual(hasSameNodesDeep(G, H), true);

      H.setNodeAttribute('Martha', 'age', 45);

      assert.strictEqual(hasSameNodesDeep(G, H), false);

      G.setNodeAttribute('Martha', 'age', 45);

      assert.strictEqual(hasSameNodesDeep(G, H), true);
    });
  });
});
