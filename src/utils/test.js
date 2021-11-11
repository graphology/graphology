/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert');
var Graph = require('graphology');
var inferType = require('./infer-type.js');
var isGraph = require('./is-graph.js');
var isGraphConstructor = require('./is-graph-constructor.js');
var mergeClique = require('./merge-clique.js');
var mergeCycle = require('./merge-cycle.js');
var mergePath = require('./merge-path.js');
var mergeStar = require('./merge-star.js');
var renameGraphKeys = require('./rename-graph-keys.js');
var updateGraphKeys = require('./update-graph-keys.js');
var getters = require('./getters.js');
var resolveDefaults = require('./defaults.js');

var UndirectedGraph = Graph.UndirectedGraph;
var createWeightGetter = getters.createWeightGetter;

describe('graphology-utils', function () {
  describe('inferType', function () {
    it('should correctly infer the type of the given graph.', function () {
      var graph = new Graph({type: 'mixed'});
      graph.mergeDirectedEdge(1, 2);

      assert.strictEqual(inferType(graph), 'directed');

      graph = new Graph({type: 'mixed'});
      graph.mergeUndirectedEdge(1, 2);

      assert.strictEqual(inferType(graph), 'undirected');

      graph = new Graph({type: 'mixed'});
      graph.mergeDirectedEdge(1, 2);
      graph.mergeUndirectedEdge(3, 4);

      assert.strictEqual(inferType(graph), 'mixed');

      graph = new Graph({type: 'mixed'});

      assert.strictEqual(inferType(graph), 'mixed');

      graph = new Graph({type: 'directed'});

      assert.strictEqual(inferType(graph), 'directed');

      graph = new Graph({type: 'undirected'});

      assert.strictEqual(inferType(graph), 'undirected');
    });
  });

  describe('isGraph', function () {
    it('should correctly return whether the given value is a graphology instance.', function () {
      var graph = new Graph(),
        multiDirectedGraph = new Graph(null, {multi: true, type: 'directed'});

      assert.strictEqual(isGraph(graph), true);
      assert.strictEqual(isGraph(multiDirectedGraph), true);

      var nonGraphs = [
        null,
        false,
        '',
        'test',
        0,
        -45,
        5380,
        6.4,
        {},
        [],
        {hello: 'world'},
        [1, 2, 3],
        new RegExp(),
        new Date()
      ];

      nonGraphs.forEach(function (value) {
        assert.strictEqual(isGraph(value), false);
      });
    });
  });

  describe('isGraphConstructor', function () {
    it('should correctly return whether the given value is a graphology constructor.', function () {
      assert.strictEqual(isGraphConstructor(Graph), true);
      assert.strictEqual(isGraphConstructor(UndirectedGraph), true);

      var nonGraphsConstructors = [
        null,
        false,
        '',
        'test',
        0,
        -45,
        5380,
        6.4,
        {},
        [],
        {hello: 'world'},
        [1, 2, 3],
        new RegExp(),
        new Date(),
        new Graph(),
        new UndirectedGraph()
      ];

      nonGraphsConstructors.forEach(function (value) {
        assert.strictEqual(isGraphConstructor(value), false);
      });
    });
  });

  describe('mergeClique', function () {
    it('should correctly add the given clique to the graph.', function () {
      var graph = new Graph();

      mergeClique(graph, ['1', '2', '3', '4', '5']);

      assert.strictEqual(graph.order, 5);
      assert.strictEqual(graph.size, 10);

      var adj = graph.edges().map(function (edge) {
        return graph.extremities(edge);
      });

      assert.deepStrictEqual(adj, [
        ['1', '2'],
        ['1', '3'],
        ['1', '4'],
        ['1', '5'],
        ['2', '3'],
        ['2', '4'],
        ['2', '5'],
        ['3', '4'],
        ['3', '5'],
        ['4', '5']
      ]);
    });
  });

  describe('mergeCycle', function () {
    it('should correctly add the given path to the graph.', function () {
      var graph = new Graph();

      mergeCycle(graph, ['1', '2', '3', '4', '5']);

      assert.strictEqual(graph.order, 5);
      assert.strictEqual(graph.size, 5);

      var adj = graph.edges().map(function (edge) {
        return graph.extremities(edge);
      });

      assert.deepStrictEqual(adj, [
        ['1', '2'],
        ['2', '3'],
        ['3', '4'],
        ['4', '5'],
        ['5', '1']
      ]);
    });
  });

  describe('mergePath', function () {
    it('should correctly add the given path to the graph.', function () {
      var graph = new Graph();

      mergePath(graph, ['1', '2', '3', '4', '5']);

      assert.strictEqual(graph.order, 5);
      assert.strictEqual(graph.size, 4);

      var adj = graph.edges().map(function (edge) {
        return graph.extremities(edge);
      });

      assert.deepStrictEqual(adj, [
        ['1', '2'],
        ['2', '3'],
        ['3', '4'],
        ['4', '5']
      ]);
    });
  });

  describe('mergeStar', function () {
    it('should correctly add the given star to the graph.', function () {
      var graph = new Graph();

      mergeStar(graph, ['1', '2', '3', '4', '5']);

      assert.strictEqual(graph.order, 5);
      assert.strictEqual(graph.size, 4);

      var adj = graph.edges().map(function (edge) {
        return graph.extremities(edge);
      });

      assert.deepStrictEqual(adj, [
        ['1', '2'],
        ['1', '3'],
        ['1', '4'],
        ['1', '5']
      ]);
    });
  });

  describe('renameGraphKeys', function () {
    it('should work with only node mapping.', function () {
      var graph = new Graph();
      graph.addNode('Martha');
      graph.addNode('Catherine');
      graph.addNode('John');
      graph.addEdgeWithKey('M->C', 'Martha', 'Catherine');
      graph.addEdgeWithKey('C->J', 'Catherine', 'John');

      var newGraph = renameGraphKeys(graph, {
        Martha: 1,
        Catherine: 2,
        John: 3
      });

      // Tests
      assert.strictEqual(newGraph.order, 3);
      assert.strictEqual(newGraph.size, 2);
      assert(newGraph.hasNode(1));
      assert(newGraph.hasNode(2));
      assert(newGraph.hasNode(3));
      assert.strictEqual(newGraph.edge(1, 2), 'M->C');
      assert.strictEqual(newGraph.edge(2, 3), 'C->J');
    });

    it('should work with full mapping.', function () {
      var graph = new Graph();
      graph.addNode('Martha');
      graph.addNode('Catherine');
      graph.addNode('John');
      graph.addEdgeWithKey('M->C', 'Martha', 'Catherine');
      graph.addEdgeWithKey('C->J', 'Catherine', 'John');

      var newGraph = renameGraphKeys(
        graph,
        {Martha: 1, Catherine: 2, John: 3},
        {'M->C': 'rel1', 'C->J': 'rel2'}
      );

      // Tests
      assert.strictEqual(newGraph.order, 3);
      assert.strictEqual(newGraph.size, 2);
      assert(newGraph.hasNode(1));
      assert(newGraph.hasNode(2));
      assert(newGraph.hasNode(3));
      assert.strictEqual(newGraph.edge(1, 2), 'rel1');
      assert.strictEqual(newGraph.edge(2, 3), 'rel2');
    });
  });

  describe('updateGraphKeys', function () {
    it('should work with only node mapping.', function () {
      var graph = new Graph();
      graph.addNode('Martha');
      graph.addNode('Catherine');
      graph.addNode('John');
      graph.addEdgeWithKey('M->C', 'Martha', 'Catherine');
      graph.addEdgeWithKey('C->J', 'Catherine', 'John');

      var newGraph = updateGraphKeys(graph, function (key) {
        if (key === 'Martha') return 1;
        if (key === 'Catherine') return 2;
        return 3;
      });

      // Tests
      assert.strictEqual(newGraph.order, 3);
      assert.strictEqual(newGraph.size, 2);
      assert(newGraph.hasNode(1));
      assert(newGraph.hasNode(2));
      assert(newGraph.hasNode(3));
      assert.strictEqual(newGraph.edge(1, 2), 'M->C');
      assert.strictEqual(newGraph.edge(2, 3), 'C->J');
    });

    it('should work with full mapping.', function () {
      var graph = new Graph();
      graph.addNode('Martha');
      graph.addNode('Catherine');
      graph.addNode('John');
      graph.addEdgeWithKey('M->C', 'Martha', 'Catherine');
      graph.addEdgeWithKey('C->J', 'Catherine', 'John');

      var newGraph = updateGraphKeys(
        graph,
        function (key) {
          if (key === 'Martha') return 1;
          if (key === 'Catherine') return 2;
          return 3;
        },
        function (key) {
          if (key === 'M->C') return 'rel1';
          return 'rel2';
        }
      );

      // Tests
      assert.strictEqual(newGraph.order, 3);
      assert.strictEqual(newGraph.size, 2);
      assert(newGraph.hasNode(1));
      assert(newGraph.hasNode(2));
      assert(newGraph.hasNode(3));
      assert.strictEqual(newGraph.edge(1, 2), 'rel1');
      assert.strictEqual(newGraph.edge(2, 3), 'rel2');
    });
  });

  describe('createWeightGetter', function () {
    it('should return valid weights from attributes.', function () {
      var graph = new Graph();
      graph.mergeEdge(1, 2, {weight: 3});
      graph.mergeEdge(3, 4, {custom: 2});
      graph.mergeEdge(4, 5);
      graph.mergeEdge(6, 7, {weight: NaN});
      graph.mergeEdge(8, 9, {weight: 'test'});

      var defaultGetter = createWeightGetter(null);
      var weightGetter = createWeightGetter('weight');
      var customGetter = createWeightGetter('custom');

      assert.strictEqual(defaultGetter(graph.getEdgeAttributes(1, 2)), 1);
      assert.strictEqual(weightGetter(graph.getEdgeAttributes(1, 2)), 3);
      assert.strictEqual(weightGetter(graph.getEdgeAttributes(3, 4)), 1);
      assert.strictEqual(customGetter(graph.getEdgeAttributes(3, 4)), 2);
      assert.strictEqual(weightGetter(graph.getEdgeAttributes(4, 5)), 1);
      assert.strictEqual(weightGetter(graph.getEdgeAttributes(6, 7)), 1);
      assert.strictEqual(weightGetter(graph.getEdgeAttributes(8, 9)), 1);
    });
  });

  describe('resolveDefaults', function () {
    it('should correctly resolve defaults.', function () {
      var defaults = {
        attributes: {
          weight: 'weight'
        },
        weighted: false
      };

      assert.deepStrictEqual(resolveDefaults({}, defaults), defaults);
      assert.deepStrictEqual(
        resolveDefaults({unkown: false, otherUnknown: 'test'}, defaults),
        defaults
      );
      assert.deepStrictEqual(resolveDefaults({weighted: true}, defaults), {
        attributes: {
          weight: 'weight'
        },
        weighted: true
      });
      assert.deepStrictEqual(
        resolveDefaults(
          {attributes: {unkown: 'test', weight: 'custom'}},
          defaults
        ),
        {
          attributes: {
            weight: 'custom'
          },
          weighted: false
        }
      );

      assert.deepStrictEqual(
        resolveDefaults({index: new Set([0, 1])}, {index: null}),
        {index: new Set([0, 1])}
      );

      assert.deepStrictEqual(
        resolveDefaults({index: null}, {index: new Set([0, 1])}),
        {index: new Set([0, 1])}
      );
    });
  });
});
