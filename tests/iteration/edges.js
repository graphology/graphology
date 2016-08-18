/**
 * Graphology Edges Iteration Specs
 * ================================
 *
 * Testing the edges iteration-related methods of the graph.
 */
import assert from 'assert';
import {
  capitalize,
  deepMerge,
  sameMembers,
  testBunches
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

export default function edgesIteration(Graph) {
  const graph = new Graph(null, {multi: true});

  graph.addNodesFrom([
    'John',
    'Thomas',
    'Martha',
    'Roger',
    'Catherine',
    'Alone',
    'Forever'
  ]);

  graph.addDirectedEdgeWithKey('J->T', 'John', 'Thomas');
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
      bunch: {
        keys: ['Martha', 'Roger'],
        edges: [
          'J->M',
          'M<->R',
          'M<->J',
          'T<->M',
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
      bunch: {
        keys: ['Thomas', 'John'],
        edges: [
          'J->T',
          'C->J'
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
    outEdges: {
      all: ALL_DIRECTED_EDGES,
      node: {
        key: 'John',
        edges: [
          'J->T',
          'J->M'
        ]
      },
      bunch: {
        keys: ['John', 'Catherine'],
        edges: [
          'J->T',
          'J->M',
          'C->J'
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
      all: ALL_EDGES,
      node: {
        key: 'John',
        edges: [
          'C->J',
          'M<->J'
        ]
      },
      bunch: {
        keys: ['Thomas', 'John'],
        edges: [
          'J->T',
          'C->J',
          'M<->J'
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
    outboundEdges: {
      all: ALL_EDGES,
      node: {
        key: 'John',
        edges: [
          'J->T',
          'J->M',
          'J<->R'
        ]
      },
      bunch: {
        keys: ['John', 'Martha'],
        edges: [
          'J->T',
          'J->M',
          'J<->R',
          'M<->R',
          'M<->J'
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
      bunch: {
        keys: ['John', 'Catherine'],
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
      bunch: {
        keys: ['John', 'Martha'],
        edges: [
          'M<->R',
          'M<->J',
          'J<->R',
          'T<->M',
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
          }, /many/);
        },

        'it should throw when the node is not found.': function() {
          assert.throws(function() {
            graph[name]('Test');
          }, /node/);
        },

        'it should throw if any of the provided bunch node is not found.': function() {
          assert.throws(function() {
            graph[name](['Test']);
          }, /bunch/);
        },

        'it should throw if either source or target is not found.': function() {
          assert.throws(function() {
            graph[name]('Test', 'Alone');
          }, /find/);

          assert.throws(function() {
            graph[name]('Alone', 'Test');
          }, /find/);
        }
      }
    };
  }

  function specificTests(name, data) {
    const counterName = 'count' + capitalize(name);

    return {

      // Array-creators
      ['#.' + name]: {
        'it should return all the relevant edges.': function() {
          const edges = graph[name]();

          assert.deepEqual(edges, data.all);
        },

        'it should return a node\'s relevant edges.': function() {
          const edges = graph[name](data.node.key);

          assert.deepEqual(edges, data.node.edges);
          assert.deepEqual(graph[name]('Alone'), []);
        },

        'it should return a bunch of nodes\' relevant edges.': function() {
          testBunches(data.bunch.keys, bunch => {
            const edges = graph[name](bunch);

            assert(sameMembers(edges, data.bunch.edges));
            assert.deepEqual(graph[name](['Forever', 'Alone']), []);
          });
        },

        'it should return all the relevant edges between source & target.': function() {
          const edges = graph[name](data.path.source, data.path.target);

          assert(sameMembers(edges, data.path.edges));
          assert.deepEqual(graph[name]('Forever', 'Alone'), []);
        }
      },

      // Counters
      ['#.' + counterName]: {
        'it should count all the relevant edges.': function() {
          const nb = graph[counterName]();

          assert.strictEqual(nb, data.all.length);
        },

        'it should count all the relevant edges of a node.': function() {
          const nb = graph[counterName](data.node.key);

          assert.strictEqual(nb, data.node.edges.length);
          assert.deepEqual(graph[counterName]('Alone'), 0);
        },

        'it should count a bunch of nodes\' relevant edges.': function() {
          testBunches(data.bunch.keys, bunch => {

            assert.strictEqual(graph[counterName](bunch), data.bunch.edges.length);
            assert.deepEqual(graph[counterName](['Forever', 'Alone']), 0);
          });
        },

        'it should count all the relevant edges between source & target.': function() {
          const nb = graph[counterName](data.path.source, data.path.target);

          assert.strictEqual(nb, data.path.edges.length);
          assert.deepEqual(graph[counterName]('Forever', 'Alone'), 0);
        }
      }
    };
  }

  const tests = {};

  // Common tests
  METHODS.forEach(name => deepMerge(tests, commonTests(name)));
  METHODS.forEach(name => deepMerge(tests, commonTests('count' + capitalize(name))));

  // Specific tests
  for (const name in TEST_DATA)
    deepMerge(tests, specificTests(name, TEST_DATA[name]));

  return tests;
}
