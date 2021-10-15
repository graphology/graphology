/* eslint no-console: 0 */
/**
 * Graphology Minivan Unit Tests
 * ==============================
 */
require('util').inspect.defaultOptions.depth = null;

var chai = require('chai');
chai.use(require('chai-roughly'));
var assert = chai.assert;
var expect = chai.expect;
var deepclone = require('lodash/cloneDeep');
var range = require('lodash/range');

var path = require('path');
var fs = require('fs-extra');
var lib = require('../index.js');
var validate = require('../validate.js');
var gexf = require('graphology-gexf');
var Graph = require('graphology');

var buildBundle = lib.buildBundle;

var UndirectedGraph = Graph.UndirectedGraph;

var GRAPHS = {
  basic: {
    attributes: {
      title: 'Basic Graph'
    },
    nodes: [
      {
        key: 'A',
        attributes: {
          nb: 14,
          centrality: 0.8,
          color: 'red',
          category: 'fruit'
        }
      },
      {
        key: 'B',
        attributes: {
          nb: 67,
          centrality: -18.74,
          color: 'blue',
          category: 'vegetable'
        }
      },
      {
        key: 'C',
        attributes: {
          nb: 542,
          centrality: 13,
          color: 'red',
          category: 'fruit'
        }
      }
    ],
    edges: [
      {
        source: 'A',
        target: 'B',
        attributes: {
          weight: 0.556,
          cardinality: 34,
          predicate: 'HAS'
        },
        undirected: true
      },
      {
        source: 'B',
        target: 'C',
        attributes: {
          weight: 45,
          cardinality: 12,
          predicate: 'LIKES'
        },
        undirected: true
      }
    ]
  }
};

function loadResource(name) {
  var p = path.join(__dirname, 'resources', name + '.json');

  return fs.readJSONSync(p);
}

function loadGexfResource(name) {
  var p = path.join(__dirname, 'resources', name + '.gexf');

  var xml = fs.readFileSync(p, 'utf-8');

  return gexf.parse(Graph, xml);
}

var NORDIC_DESIGN = loadResource('nordic-design');
var ARCTIC = loadGexfResource('arctic');

describe('graphology-minivan', function () {
  describe('serialization', function () {
    it('should throw if given an invalid graph.', function () {
      assert.throws(function () {
        buildBundle({hello: 'world'});
      });
    });

    it('should produce a correct bundle.', function () {
      var graph = UndirectedGraph.from(GRAPHS.basic);

      var bundle = buildBundle(graph, {url: 'http://supergraph.sv'});

      var errors = validate(bundle);

      if (errors) console.error('Validation error:', errors);

      assert(!errors);

      var model = bundle.model;

      assert.strictEqual(model.defaultNodeSize, 'nb');
      assert.strictEqual(model.defaultEdgeSize, 'weight');
      assert.strictEqual(model.defaultNodeColor, 'category');
      assert.strictEqual(model.defaultEdgeColor, 'predicate');
    });

    it('should work even when some attributes are lacking.', function () {
      var data = deepclone(GRAPHS.basic);

      delete data.nodes[1].attributes;
      delete data.edges[0].attributes;

      var graph = UndirectedGraph.from(data);

      assert.doesNotThrow(function () {
        buildBundle(graph);
      });
    });

    it('should respect given hints.', function () {
      var graph = UndirectedGraph.from(GRAPHS.basic);

      // TODO: support to have only key of attr to index

      var hints = {
        model: {
          nodeAttributes: [
            {
              key: 'centrality',
              label: 'centrality',
              type: 'ranking-size',
              integer: true,
              areaScaling: {
                interpolation: 'pow-2',
                max: 1000
              }
            },
            {
              key: 'category',
              type: 'partition',
              modalities: {
                vegetable: {
                  color: '#00FF00'
                }
              }
            }
          ]
        }
      };

      var bundle = buildBundle(graph, hints);

      var centralityAttr = bundle.model.nodeAttributes.find(function (attr) {
        return attr.key === 'centrality';
      });

      assert.deepEqual(centralityAttr, {
        key: 'centrality',
        label: 'centrality',
        slug: 'centrality',
        count: 3,
        type: 'ranking-size',
        min: -18,
        max: 13,
        integer: true,
        areaScaling: {
          min: 10,
          max: 1000,
          interpolation: 'pow-2'
        }
      });

      var categoryAttr = bundle.model.nodeAttributes.find(function (attr) {
        return attr.key === 'category';
      });

      assert.strictEqual(categoryAttr.modalities.vegetable.color, '#00FF00');
    });

    it('should be possible to pass custom iwanthue settings.', function () {
      var graph = UndirectedGraph.from(GRAPHS.basic);

      var bundle = buildBundle(graph, null, {
        iwanthueSettings: {clustering: 'k-means'}
      });

      var categoryAttr = bundle.model.nodeAttributes.find(function (attr) {
        return attr.key === 'category';
      });

      var colors = Object.keys(categoryAttr.modalities).map(function (m) {
        return categoryAttr.modalities[m].color;
      });

      assert.deepEqual(colors, ['#aac790', '#c9a2ca']);
    });

    it('should be idempotent.', function () {
      var graph = new Graph(NORDIC_DESIGN.settings);
      graph.import(NORDIC_DESIGN.graph);

      var bundle = buildBundle(graph, NORDIC_DESIGN);

      // console.log(bundle.model.nodeAttributes.find(m => m.id === 'branch').stats)
      expect(bundle).to.roughly.deep.equal(NORDIC_DESIGN);
    });

    it("should be faster when we don't consolidate.", function () {
      var graph = new Graph(NORDIC_DESIGN.settings);
      graph.import(NORDIC_DESIGN.graph);

      buildBundle(graph, NORDIC_DESIGN, {consolidate: false});
    });

    it('should drop some partition types heuristically.', function () {
      var graph = new Graph(NORDIC_DESIGN.settings);
      graph.import(NORDIC_DESIGN.graph);

      var bundle = buildBundle(graph);

      assert(
        !bundle.model.nodeAttributes.some(function (attr) {
          return (
            (attr.key === 'name' && attr.type !== 'ignore') ||
            (attr.key === 'homepage' && attr.type !== 'ignore') ||
            (attr.key === 'prefixes' && attr.type !== 'ignore')
          );
        })
      );

      var partitions = bundle.model.nodeAttributes
        .filter(function (attr) {
          return attr.type === 'partition';
        })
        .map(function (attr) {
          return {
            key: attr.key,
            cardinality: attr.cardinality
          };
        });

      assert.deepEqual(partitions, [
        {
          key: 'country',
          cardinality: 7
        },
        {
          key: 'branch',
          cardinality: 4
        },
        {
          key: 'design-user-research',
          cardinality: 3
        },
        {
          key: 'digital-design',
          cardinality: 3
        },
        {
          key: 'experience-design',
          cardinality: 3
        },
        {
          key: 'graphic-and-visual-design',
          cardinality: 3
        },
        {
          key: 'management-facilitation-of-development-processes',
          cardinality: 3
        },
        {
          key: 'product-development',
          cardinality: 3
        },
        {
          key: 'service-design',
          cardinality: 3
        },
        {
          key: 'strategic-design',
          cardinality: 3
        },
        {
          key: 'styling-formgiving-of-products-physical-tactile-appearance',
          cardinality: 3
        },
        {
          key: 'discipline',
          cardinality: 9
        }
      ]);
    });

    it('should be able to process a graph from a gexf file while automatically hiding attributes.', function () {
      var bundle = buildBundle(ARCTIC);

      var errors = validate(bundle);

      assert(!errors);

      var nodeDefAttribute = bundle.model.nodeAttributes.find(function (attr) {
        return attr.key === 'nodedef';
      });

      assert.deepEqual(nodeDefAttribute, {
        count: 1715,
        type: 'ignore',
        key: 'nodedef',
        label: 'nodedef',
        slug: 'nodedef'
      });
    });

    it('should respect hints, albeit against its own heuristics.', function () {
      var graph = new UndirectedGraph();

      range(100).forEach(function (i) {
        graph.addNode(i, {ref: '' + i});
      });

      var bundle = buildBundle(graph);

      assert.strictEqual(bundle.model.nodeAttributes[0].type, 'ignore');

      bundle = buildBundle(graph, {
        model: {nodeAttributes: [{key: 'ref', type: 'partition'}]}
      });

      assert.strictEqual(bundle.model.nodeAttributes[0].type, 'partition');
    });

    it('should respect the ignore hints.', function () {
      var graph = UndirectedGraph.from(GRAPHS.basic);

      var bundle = buildBundle(graph, {
        model: {
          nodeAttributes: [
            {
              key: 'nb',
              type: 'ignore'
            },
            {
              key: 'centrality',
              type: 'ignore'
            },
            {
              key: 'category',
              type: 'ignore'
            }
          ]
        }
      });

      assert(
        bundle.model.nodeAttributes.every(function (attr) {
          return attr.type === 'ignore';
        })
      );
    });

    it('should respect modalities order given by user.', function () {
      var graph = UndirectedGraph.from(GRAPHS.basic);

      var bundle = buildBundle(graph);

      var ordering = bundle.model.nodeAttributes.find(function (attr) {
        return attr.key === 'category';
      }).modalitiesOrder;

      assert.deepEqual(ordering, ['fruit', 'vegetable']);

      bundle = buildBundle(graph, {
        model: {
          nodeAttributes: [
            {
              key: 'category',
              type: 'partition',
              modalitiesOrder: ['vegetable', 'fruit']
            }
          ]
        }
      });

      ordering = bundle.model.nodeAttributes.find(function (attr) {
        return attr.key === 'category';
      }).modalitiesOrder;

      assert.deepEqual(ordering, ['vegetable', 'fruit']);
    });
  });

  describe('helpers', function () {
    it('should be possible to use standalone type inference.', function () {
      var graph = UndirectedGraph.from(GRAPHS.basic);

      var inference = lib.performTypeInference(graph);

      assert.deepEqual(inference, {
        nodes: {
          nb: 'integer',
          centrality: 'float',
          color: 'string',
          category: 'string'
        },
        edges: {
          weight: 'float',
          cardinality: 'integer',
          predicate: 'string'
        }
      });
    });
  });
});
