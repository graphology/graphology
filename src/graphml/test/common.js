/**
 * Graphology Browser GRAPHML Unit Tests Common Utilities
 * =======================================================
 *
 * Testing utilities used by both the browser & the node version.
 */
var assert = require('assert'),
  parserDefinitions = require('./definitions/parser.js'),
  resources = require('./resources'),
  Graph = require('graphology');

/**
 * Testing the parser on all of our test files.
 */
exports.testAllFiles = function (parser) {
  parserDefinitions.forEach(function (definition) {
    if (definition.skip) return;

    var resource = resources[definition.graphml],
      info = definition.basics;

    it(
      'should properly parse the "' + definition.title + '" file.',
      function () {
        var graph = parser(Graph, resource, definition.options || {});
        // console.log(graph);

        assert.deepStrictEqual(graph.getAttributes(), info.meta);
        assert.strictEqual(graph.order, info.order);
        assert.strictEqual(graph.size, info.size);
        assert.strictEqual(graph.type, info.type);
        assert.strictEqual(graph.multi, info.multi);

        var node = info.node;

        assert.strictEqual(graph.hasNode(node.key), true);
        assert.deepStrictEqual(
          graph.getNodeAttributes(node.key),
          node.attributes || {}
        );

        var edge = info.edge;

        if (edge.key) assert.strictEqual(graph.hasEdge(edge.key), true);
        else assert.strictEqual(graph.hasEdge(edge.source, edge.target), true);

        if (edge.key) {
          assert.strictEqual(graph.source(edge.key), '' + edge.source);
          assert.strictEqual(graph.target(edge.key), '' + edge.target);
          assert.strictEqual(
            graph.isDirected(edge.key),
            !edge.undirected,
            'Wrong edge type for "' + edge.key + '"!'
          );
        }

        var attributes;

        if (edge.key) attributes = graph.getEdgeAttributes(edge.key);
        else attributes = graph.getEdgeAttributes(edge.source, edge.target);

        assert.deepStrictEqual(
          attributes,
          edge.attributes || {},
          'Edge attributes mismatch!'
        );
      }
    );
  });
};
