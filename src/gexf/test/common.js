/**
 * Graphology Browser GEXF Unit Tests Common Utilities
 * ====================================================
 *
 * Testing utilities used by both the browser & the node version.
 */
var assert = require('assert'),
  parserDefinitions = require('./definitions/parser.js'),
  writerDefinitions = require('./definitions/writer.js'),
  resources = require('./resources'),
  Graph = require('graphology');

/**
 * Testing the parser on all of our test files.
 */
exports.testAllFiles = function (parser) {
  parserDefinitions.forEach(function (definition) {
    if (definition.skip) return;

    var resource = resources[definition.gexf],
      info = definition.basics;

    it(
      'should properly parse the "' + definition.title + '" file.',
      function () {
        var graph = parser(Graph, resource, definition.options || {});

        assert.deepStrictEqual(graph.getAttributes(), info.meta);
        assert.strictEqual(graph.order, info.order);
        assert.strictEqual(graph.size, info.size);
        assert.strictEqual(graph.type, info.type);
        assert.strictEqual(graph.multi, info.multi);

        var node = info.node;

        assert.strictEqual(graph.hasNode(node.key), true);
        assert.deepStrictEqual(
          graph.getNodeAttributes(node.key),
          info.node.attributes || {}
        );

        var edge = info.edge;

        if (edge.key) assert.strictEqual(graph.hasEdge(edge.key), true);
        else assert.strictEqual(graph.hasEdge(edge.source, edge.target), true);

        if (edge.key) {
          assert.strictEqual(graph.source(edge.key), '' + edge.source);
          assert.strictEqual(graph.target(edge.key), '' + edge.target);
          assert.strictEqual(graph.isDirected(edge.key), !edge.undirected);
        }

        var attributes;

        if (edge.key) attributes = graph.getEdgeAttributes(edge.key);
        else attributes = graph.getEdgeAttributes(edge.source, edge.target);

        assert.deepStrictEqual(attributes, edge.attributes || {});
      }
    );
   
  });

};

/**
 * Testing the writer on all of our test graphs.
 */
exports.testWriter = function (writer, parser) {
  describe('Writer', function () {
    it('should throw when given an invalid graphology instance.', function () {
      assert.throws(function () {
        writer(null);
      }, /graphology/);
    });

    writerDefinitions.forEach(function (definition) {
      if (definition.skip) return;

      var resource = resources[definition.gexf],
        graph = definition.graph();

      it(
        'should correctly write the "' + definition.title + '" graph.',
        function () {
          var string = writer(graph, definition.options);

          assert.strictEqual(string, resource);
        }
      );
    });

    it('should output valid XML even if graph attributes have illegal characters.', function () {
      var graph = new Graph();
      graph.replaceAttributes({
        '"': 'should not be included',
        'Awesome Author': 'Yomguithereal'
      });

      var gexf = writer(graph);

      assert.strictEqual(gexf, resources.sanitized);
    });

    it('should write mixed graphs correctly.', function () {
      // Undirected graph hiding in a mixed one
      var graph = new Graph();

      graph.mergeUndirectedEdge(1, 2);

      var gexf = writer(graph);
      var parsed = parser(Graph, gexf);

      assert.strictEqual(parsed.type, 'undirected');
      assert.strictEqual(parsed.directedSize, 0);
      assert.strictEqual(parsed.undirectedSize, 1);

      // True mixed graph
      graph = new Graph();

      graph.mergeEdge(1, 2);
      graph.mergeUndirectedEdge(2, 3);

      gexf = writer(graph);
      parsed = parser(Graph, gexf);

      assert.strictEqual(parsed.type, 'mixed');
      assert.strictEqual(parsed.directedSize, 1);
      assert.strictEqual(parsed.undirectedSize, 1);
    });
  });
};
