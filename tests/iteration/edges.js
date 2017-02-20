/**
 * Graphology Edges Iteration Specs
 * =================================
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
  'directedEdges',
  'undirectedEdges'
];

export default function edgesIteration(Graph, checkers) {
  const {
    invalid,
    notFound
  } = checkers;

  const graph = new Graph({multi: true});

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

  // const graphWithSelfLoops = new Graph({multi: true});
  // graphWithSelfLoops.addNodesFrom(['John', 'Tabitha', 'Marcia', 'Alone']);
  // graphWithSelfLoops.addEdgeWithKey('J->T', 'John', 'Tabitha');
  // graphWithSelfLoops.addEdgeWithKey('J1', 'John', 'John');
  // graphWithSelfLoops.addEdgeWithKey('J2', 'John', 'John');
  // graphWithSelfLoops.addEdgeWithKey('T1', 'Tabitha', 'Tabitha');
  // graphWithSelfLoops.addEdgeWithKey('M1', 'Marcia', 'Marcia');

  // const SELF_LOOPS_TEST_DATA = {
  //   selfLoops: {
  //     all: ['J1', 'J2', 'T1', 'M1'],
  //     node: {
  //       key: 'John',
  //       loops: ['J1', 'J2']
  //     },
  //     bunch: {
  //       keys: ['John', 'Tabitha'],
  //       edges: [
  //         'J1',
  //         'J2',
  //         'T1'
  //       ]
  //     }
  //   }
  // };

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

        'it should throw if any of the provided bunch node is not found.': function() {
          assert.throws(function() {
            graph[name](['Test']);
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

  const tests = {
    'Various cases': {
      'simple graph indices should work.': function() {
        const simpleGraph = new Graph();
        simpleGraph.addNodesFrom([1, 2, 3, 4]);
        simpleGraph.addEdgeWithKey('1->2', 1, 2);
        simpleGraph.addEdgeWithKey('1->3', 1, 3);
        simpleGraph.addEdgeWithKey('1->4', 1, 4);

        assert.deepEqual(simpleGraph.edges(1), ['1->2', '1->3', '1->4']);
      }
    }
  };

  // Common tests
  METHODS.forEach(name => deepMerge(tests, commonTests(name)));
  METHODS.forEach(name => deepMerge(tests, commonTests('count' + capitalize(name))));

  // Specific tests
  for (const name in TEST_DATA)
    deepMerge(tests, specificTests(name, TEST_DATA[name]));

  return tests;
}
