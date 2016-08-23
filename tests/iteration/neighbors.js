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
  'neighbors',
  'inNeighbors',
  'outNeighbors',
  'inboundNeighbors',
  'outboundNeighbors',
  'directedNeighbors',
  'undirectedNeighbors'
];

export default function neighborsIteration(Graph, checkers) {
  const {
    invalid,
    notFound
  } = checkers;

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

  const TEST_DATA = {
    neighbors: {
      node: {
        key: 'John',
        neighbors: ['Catherine', 'Thomas', 'Martha', 'Roger']
      }
    },
    inNeighbors: {
      node: {
        key: 'John',
        neighbors: ['Catherine']
      }
    },
    outNeighbors: {
      node: {
        key: 'John',
        neighbors: ['Thomas', 'Martha']
      }
    },
    inboundNeighbors: {
      node: {
        key: 'John',
        neighbors: ['Catherine', 'Martha']
      }
    },
    outboundNeighbors: {
      node: {
        key: 'John',
        neighbors: ['Thomas', 'Martha', 'Roger']
      }
    },
    directedNeighbors: {
      node: {
        key: 'John',
        neighbors: ['Catherine', 'Thomas', 'Martha']
      }
    },
    undirectedNeighbors: {
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
        },

        // 'it should throw if any of the provided bunch node is not found.': function() {
        //   assert.throws(function() {
        //     graph[name](['Test']);
        //   }, notFound());
        // },
      }
    };
  }

  function specificTests(name, data) {
    const counterName = 'count' + capitalize(name);

    return {

      // Array-creators
      ['#.' + name]: {
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

  const tests = {};

  // Common tests
  METHODS.forEach(name => deepMerge(tests, commonTests(name)));
  METHODS.forEach(name => deepMerge(tests, commonTests('count' + capitalize(name))));

  // Specific tests
  for (const name in TEST_DATA)
    deepMerge(tests, specificTests(name, TEST_DATA[name]));

  return tests;
}
