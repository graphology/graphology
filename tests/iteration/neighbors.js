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
  addNodesFrom
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

  graph.replaceNodeAttributes('John', {age: 34});
  graph.replaceNodeAttributes('Martha', {age: 35});

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
    inboundNeighbors: {
      are: [
        ['John', 'Thomas', false],
        ['John', 'Roger', true],
        ['Martha', 'John', true]
      ],
      node: {
        key: 'John',
        neighbors: ['Catherine', 'Martha', 'Roger']
      }
    },
    outboundNeighbors: {
      are: [
        ['John', 'Thomas', true],
        ['John', 'Roger', true],
        ['Martha', 'John', true],
        ['John', 'Catherine', false]
      ],
      node: {
        key: 'John',
        neighbors: ['Thomas', 'Martha', 'Roger']
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
    const forEachName = 'forEach' + name[0].toUpperCase() + name.slice(1, -1),
          iteratorName = name.slice(0, -1) + 'Entries';

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

      // ForEach
      ['#.' + forEachName]: {
        'it should be possible to iterate over neighbors using a callback.': function() {
          const neighbors = [];

          graph[forEachName](data.node.key, function(target, attrs) {
            neighbors.push(target);

            assert.deepEqual(graph.getNodeAttributes(target), attrs);
            assert.strictEqual(graph[name](data.node.key, target), true);
          });

          assert.deepEqual(neighbors, data.node.neighbors);
        }
      },

      // Iterators
      ['#.' + iteratorName]: {
        'it should be possible to create an iterator over neighbors.': function() {
          const iterator = graph[iteratorName](data.node.key);

          assert.deepEqual(take(iterator), data.node.neighbors.map(neighbor => {
            return [
              neighbor,
              graph.getNodeAttributes(neighbor)
            ];
          }));
        }
      }
    };
  }

  const tests = {};

  // Common tests
  METHODS.forEach(name => deepMerge(tests, commonTests(name)));

  // Specific tests
  for (const name in TEST_DATA)
    deepMerge(tests, specificTests(name, TEST_DATA[name]));

  return tests;
}
