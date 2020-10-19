/**
 * Graphology Edges Iteration Specs
 * =================================
 *
 * Testing the edges iteration-related methods of the graph.
 */
import assert from 'assert';
import take from 'obliterator/take';
import {
  deepMerge,
  sameMembers,
  addNodesFrom
} from '../helpers';

const METHODS = [
  'edges',
  'inEdges',
  'outEdges',
  'inboundEdges',
  'outboundEdges',
  'directedEdges',
  'undirectedEdges'
];

export default function edgesIteration(Graph, checkers) {
  const {
    invalid,
    notFound
  } = checkers;

  const graph = new Graph({multi: true});

  addNodesFrom(graph, [
    'John',
    'Thomas',
    'Martha',
    'Roger',
    'Catherine',
    'Alone',
    'Forever'
  ]);

  graph.replaceNodeAttributes('John', {age: 13});
  graph.replaceNodeAttributes('Martha', {age: 15});

  graph.addDirectedEdgeWithKey('J->T', 'John', 'Thomas', {weight: 14});
  graph.addDirectedEdgeWithKey('J->M', 'John', 'Martha');
  graph.addDirectedEdgeWithKey('C->J', 'Catherine', 'John');

  graph.addUndirectedEdgeWithKey('M<->R', 'Martha', 'Roger');
  graph.addUndirectedEdgeWithKey('M<->J', 'Martha', 'John');
  graph.addUndirectedEdgeWithKey('J<->R', 'John', 'Roger');
  graph.addUndirectedEdgeWithKey('T<->M', 'Thomas', 'Martha');

  const ALL_EDGES = [
    'J->T',
    'J->M',
    'C->J',
    'M<->R',
    'M<->J',
    'J<->R',
    'T<->M'
  ];

  const ALL_DIRECTED_EDGES = [
    'J->T',
    'J->M',
    'C->J'
  ];

  const ALL_UNDIRECTED_EDGES = [
    'M<->R',
    'M<->J',
    'J<->R',
    'T<->M'
  ];

  const TEST_DATA = {
    edges: {
      all: ALL_EDGES,
      node: {
        key: 'John',
        edges: [
          'C->J',
          'J->T',
          'J->M',
          'M<->J',
          'J<->R'
        ]
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: [
          'J->M',
          'M<->J'
        ]
      }
    },
    inEdges: {
      all: ALL_DIRECTED_EDGES,
      node: {
        key: 'John',
        edges: [
          'C->J'
        ]
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: []
      }
    },
    outEdges: {
      all: ALL_DIRECTED_EDGES,
      node: {
        key: 'John',
        edges: [
          'J->T',
          'J->M'
        ]
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: [
          'J->M'
        ]
      }
    },
    inboundEdges: {
      all: ALL_DIRECTED_EDGES.concat(ALL_UNDIRECTED_EDGES),
      node: {
        key: 'John',
        edges: [
          'C->J',
          'M<->J',
          'J<->R'
        ]
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: [
          'M<->J'
        ]
      }
    },
    outboundEdges: {
      all: ALL_DIRECTED_EDGES.concat(ALL_UNDIRECTED_EDGES),
      node: {
        key: 'John',
        edges: [
          'J->T',
          'J->M',
          'M<->J',
          'J<->R'
        ]
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: [
          'J->M',
          'M<->J'
        ]
      }
    },
    directedEdges: {
      all: ALL_DIRECTED_EDGES,
      node: {
        key: 'John',
        edges: [
          'C->J',
          'J->T',
          'J->M'
        ]
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: [
          'J->M'
        ]
      }
    },
    undirectedEdges: {
      all: ALL_UNDIRECTED_EDGES,
      node: {
        key: 'John',
        edges: [
          'M<->J',
          'J<->R'
        ]
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: [
          'M<->J'
        ]
      }
    }
  };

  function commonTests(name) {
    return {
      ['#.' + name]: {
        'it should throw if too many arguments are provided.': function() {
          assert.throws(function() {
            graph[name](1, 2, 3);
          }, invalid());
        },

        'it should throw when the node is not found.': function() {
          assert.throws(function() {
            graph[name]('Test');
          }, notFound());
        },

        'it should throw if either source or target is not found.': function() {
          assert.throws(function() {
            graph[name]('Test', 'Alone');
          }, notFound());

          assert.throws(function() {
            graph[name]('Alone', 'Test');
          }, notFound());
        }
      }
    };
  }

  function specificTests(name, data) {
    const iteratorName = name.slice(0, -1) + 'Entries',
          forEachName = 'forEach' + name[0].toUpperCase() + name.slice(1, -1),
          forEachUntilName = forEachName + 'Until';

    return {

      // Array-creators
      ['#.' + name]: {
        'it should return all the relevant edges.': function() {
          const edges = graph[name]().sort();

          assert.deepStrictEqual(edges, data.all.slice().sort());
        },

        'it should return a node\'s relevant edges.': function() {
          const edges = graph[name](data.node.key);

          assert.deepStrictEqual(edges, data.node.edges);
          assert.deepStrictEqual(graph[name]('Alone'), []);
        },

        'it should return all the relevant edges between source & target.': function() {
          const edges = graph[name](data.path.source, data.path.target);

          assert(sameMembers(edges, data.path.edges));
          assert.deepStrictEqual(graph[name]('Forever', 'Alone'), []);
        }
      },

      // ForEach
      ['#.' + forEachName]: {
        'it should possible to use callback iterators.': function() {
          const edges = [];

          graph[forEachName](function(key, attributes, source, target, sA, tA) {
            edges.push(key);

            assert.deepStrictEqual(attributes, key === 'J->T' ? {weight: 14} : {});
            assert.strictEqual(source, graph.source(key));
            assert.strictEqual(target, graph.target(key));

            assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
            assert.deepStrictEqual(graph.getNodeAttributes(target), tA);
          });

          edges.sort();

          assert.deepStrictEqual(edges, data.all.slice().sort());
        },

        'it should be possible to use callback iterators over a node\'s relevant edges.': function() {
          const edges = [];

          graph[forEachName](data.node.key, function(key, attributes, source, target, sA, tA) {
            edges.push(key);

            assert.deepStrictEqual(attributes, key === 'J->T' ? {weight: 14} : {});
            assert.strictEqual(source, graph.source(key));
            assert.strictEqual(target, graph.target(key));

            assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
            assert.deepStrictEqual(graph.getNodeAttributes(target), tA);
          });

          edges.sort();

          assert.deepStrictEqual(edges, data.node.edges.slice().sort());
        },

        'it should be possible to use callback iterators over all the relevant edges between source & target.': function() {
          const edges = [];

          graph[forEachName](data.path.source, data.path.target, function(key, attributes, source, target, sA, tA) {
            edges.push(key);

            assert.deepStrictEqual(attributes, key === 'J->T' ? {weight: 14} : {});
            assert.strictEqual(source, graph.source(key));
            assert.strictEqual(target, graph.target(key));

            assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
            assert.deepStrictEqual(graph.getNodeAttributes(target), tA);
          });

          assert(sameMembers(edges, data.path.edges));
        }
      },

      // ForEachUntil
      ['#.' + forEachUntilName]: {
        'it should possible to use breakable callback iterators.': function() {
          const edges = [];

          graph[forEachUntilName](function(key, attributes, source, target, sA, tA) {
            edges.push(key);

            assert.deepStrictEqual(attributes, key === 'J->T' ? {weight: 14} : {});
            assert.strictEqual(source, graph.source(key));
            assert.strictEqual(target, graph.target(key));

            assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
            assert.deepStrictEqual(graph.getNodeAttributes(target), tA);

            return true;
          });

          assert.strictEqual(edges.length, 1);
        },

        'it should be possible to use breakable callback iterators over a node\'s relevant edges.': function() {
          const edges = [];

          graph[forEachUntilName](data.node.key, function(key, attributes, source, target, sA, tA) {
            edges.push(key);

            assert.deepStrictEqual(attributes, key === 'J->T' ? {weight: 14} : {});
            assert.strictEqual(source, graph.source(key));
            assert.strictEqual(target, graph.target(key));

            assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
            assert.deepStrictEqual(graph.getNodeAttributes(target), tA);

            return true;
          });

          assert.strictEqual(edges.length, 1);
        },

        'it should be possible to use breakable callback iterators over all the relevant edges between source & target.': function() {
          const edges = [];

          graph[forEachUntilName](data.path.source, data.path.target, function(key, attributes, source, target, sA, tA) {
            edges.push(key);

            assert.deepStrictEqual(attributes, key === 'J->T' ? {weight: 14} : {});
            assert.strictEqual(source, graph.source(key));
            assert.strictEqual(target, graph.target(key));

            assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
            assert.deepStrictEqual(graph.getNodeAttributes(target), tA);

            return true;
          });

          assert.strictEqual(edges.length, graph[name](data.path.source, data.path.target).length ? 1 : 0);
        }
      },

      // Iterators
      ['#.' + iteratorName]: {
        'it should be possible to return an iterator over the relevant edges.': function() {
          const iterator = graph[iteratorName]();

          assert.deepStrictEqual(take(iterator), data.all.map(edge => {
            const [source, target] = graph.extremities(edge);

            return [
              edge,
              graph.getEdgeAttributes(edge),
              source,
              target,
              graph.getNodeAttributes(source),
              graph.getNodeAttributes(target)
            ];
          }));
        },

        'it should be possible to return an iterator over a node\'s relevant edges.': function() {
          const iterator = graph[iteratorName](data.node.key);

          assert.deepStrictEqual(take(iterator), data.node.edges.map(edge => {
            const [source, target] = graph.extremities(edge);

            return [
              edge,
              graph.getEdgeAttributes(edge),
              source,
              target,
              graph.getNodeAttributes(source),
              graph.getNodeAttributes(target)
            ];
          }));
        },

        'it should be possible to return an iterator over relevant edges between source & target.': function() {
          const iterator = graph[iteratorName](data.path.source, data.path.target);

          assert.deepStrictEqual(take(iterator), data.path.edges.map(edge => {
            const [source, target] = graph.extremities(edge);

            return [
              edge,
              graph.getEdgeAttributes(edge),
              source,
              target,
              graph.getNodeAttributes(source),
              graph.getNodeAttributes(target)
            ];
          }));
        }
      }
    };
  }

  const tests = {
    'Miscellaneous': {
      'simple graph indices should work.': function() {
        const simpleGraph = new Graph();
        addNodesFrom(simpleGraph, [1, 2, 3, 4]);
        simpleGraph.addEdgeWithKey('1->2', 1, 2);
        simpleGraph.addEdgeWithKey('1->3', 1, 3);
        simpleGraph.addEdgeWithKey('1->4', 1, 4);

        assert.deepStrictEqual(simpleGraph.edges(1), ['1->2', '1->3', '1->4']);
      },

      'it should also work with typed graphs.': function() {
        const undirected = new Graph({type: 'undirected'}),
              directed = new Graph({type: 'directed'});

        undirected.mergeEdgeWithKey('1--2', 1, 2);
        directed.mergeEdgeWithKey('1->2', 1, 2);

        assert.deepStrictEqual(undirected.edges(1, 2), ['1--2']);
        assert.deepStrictEqual(directed.edges(1, 2), ['1->2']);
      },

      'self loops should appear when using #.inEdges and should appear only once with #.edges.': function() {
        const directed = new Graph({type: 'directed'});

        directed.addNode('Lucy');
        directed.addEdgeWithKey('Lucy', 'Lucy', 'Lucy');

        assert.deepStrictEqual(directed.inEdges('Lucy'), ['Lucy']);
        assert.deepStrictEqual(
          Array.from(directed.inEdgeEntries('Lucy')).map(x => x[0]),
          ['Lucy']
        );

        let edges = [];

        directed.forEachInEdge('Lucy', edge => {
          edges.push(edge);
        });

        assert.deepStrictEqual(edges, ['Lucy']);

        assert.deepStrictEqual(directed.edges('Lucy'), ['Lucy']);

        edges = [];

        directed.forEachEdge('Lucy', edge => {
          edges.push(edge);
        });

        assert.deepStrictEqual(edges, ['Lucy']);

        assert.deepStrictEqual(
          Array.from(directed.edgeEntries('Lucy')).map(x => x[0]),
          ['Lucy']
        );
      },

      'it should be possible to retrieve self loops.': function() {
        const loopy = new Graph();

        loopy.addNode('John');
        loopy.addEdgeWithKey('d', 'John', 'John');
        loopy.addUndirectedEdgeWithKey('u', 'John', 'John');

        assert.deepStrictEqual(new Set(loopy.edges('John', 'John')), new Set(['d', 'u']));
        assert.deepStrictEqual(loopy.directedEdges('John', 'John'), ['d']);
        assert.deepStrictEqual(loopy.undirectedEdges('John', 'John'), ['u']);

        let edges = [];
        loopy.forEachDirectedEdge('John', 'John', edge => {
          edges.push(edge);
        });

        assert.deepStrictEqual(edges, ['d']);

        edges = [];
        loopy.forEachUndirectedEdge('John', 'John', edge => {
          edges.push(edge);
        });

        assert.deepStrictEqual(edges, ['u']);
      }
    }
  };

  // Common tests
  METHODS.forEach(name => deepMerge(tests, commonTests(name)));

  // Specific tests
  for (const name in TEST_DATA)
    deepMerge(tests, specificTests(name, TEST_DATA[name]));

  return tests;
}
