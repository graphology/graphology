/**
 * Graphology Edges Iteration Specs
 * =================================
 *
 * Testing the edges iteration-related methods of the graph.
 */
import assert from 'assert';
import {
  capitalize,
  deepMerge
} from '../helpers';

const METHODS = [
  'neighbors',
  'inNeighbors',
  'outNeighbors',
  'directedNeighbors',
  'undirectedNeighbors'
];

export default function neighborsIteration(Graph, checkers) {
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

  const TEST_DATA = {
    neighbors: {
      are: [
        ['John', 'Martha', true],
        ['Martha', 'Catherine', false]
      ],
      node: {
        key: 'John',
        neighbors: ['Catherine', 'Thomas', 'Martha', 'Roger']
      }
    },
    inNeighbors: {
      are: [
        ['John', 'Martha', false],
        ['John', 'Roger', false],
        ['Martha', 'Catherine', false],
        ['Thomas', 'John', true]
      ],
      node: {
        key: 'John',
        neighbors: ['Catherine']
      }
    },
    outNeighbors: {
      are: [
        ['John', 'Martha', true],
        ['John', 'Roger', false],
        ['Martha', 'Catherine', false]
      ],
      node: {
        key: 'John',
        neighbors: ['Thomas', 'Martha']
      }
    },
    directedNeighbors: {
      are: [
        ['John', 'Martha', true],
        ['John', 'Roger', false],
        ['Martha', 'Catherine', false]
      ],
      node: {
        key: 'John',
        neighbors: ['Catherine', 'Thomas', 'Martha']
      }
    },
    undirectedNeighbors: {
      are: [
        ['John', 'Martha', true],
        ['John', 'Roger', true],
        ['Martha', 'Catherine', false]
      ],
      node: {
        key: 'John',
        neighbors: ['Martha', 'Roger']
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

        'it should throw if too few arguments are provided.': function() {
          assert.throws(function() {
            graph[name]();
          }, invalid());
        },

        'it should throw when the node is not found.': function() {
          assert.throws(function() {
            graph[name]('Test');
          }, notFound());

          if (~name.indexOf('count'))
            return;

          assert.throws(function() {
            graph[name]('Test', 'SecondTest');
          }, notFound());

          assert.throws(function() {
            graph[name]('Forever', 'Test');
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
        'it should correctly return whether two nodes are neighbors.': function() {
          data.are.forEach(([node1, node2, expectation]) => {
            assert.strictEqual(graph[name](node1, node2), expectation, `${name}: ${node1} / ${node2}`);
            assert.strictEqual(graph[name]('Forever', 'Alone'), false);
          });
        },

        'it should return the correct neighbors array.': function() {
          const neighbors = graph[name](data.node.key);

          assert.deepEqual(neighbors, data.node.neighbors);
          assert.deepEqual(graph[name]('Alone'), []);
        }
      },

      // Counters
      ['#.' + counterName]: {
        'it should return the correct neighbors count.': function() {
          const neighbors = graph[counterName](data.node.key);

          assert.strictEqual(neighbors, data.node.neighbors.length);
          assert.strictEqual(graph[counterName]('Alone'), 0);
        }
      }
    };
  }

  const tests = {
    'Miscellaneous': {
      'it should be possible to count neighbors in simple graphs (probably relying on degree).': function() {
        const g = new Graph();
        g.addNodesFrom([1, 2]);
        g.addEdge(1, 2);

        assert.strictEqual(g.countNeighbors(1), 1);
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
