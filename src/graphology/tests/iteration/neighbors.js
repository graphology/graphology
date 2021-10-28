/**
 * Graphology Edges Iteration Specs
 * =================================
 *
 * Testing the edges iteration-related methods of the graph.
 */
import assert from 'assert';
import take from 'obliterator/take';
import {deepMerge, addNodesFrom} from '../helpers';

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
  const {notFound} = checkers;

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
        neighbors: ['Catherine', 'Martha', 'Roger']
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
        'it should throw when the node is not found.': function () {
          assert.throws(function () {
            graph[name]('Test');
          }, notFound());

          if (~name.indexOf('count')) return;

          assert.throws(function () {
            graph[name]('Test', 'SecondTest');
          }, notFound());
        }
      }
    };
  }

  function specificTests(name, data) {
    const forEachName = 'forEach' + name[0].toUpperCase() + name.slice(1, -1);
    const findName = 'find' + name[0].toUpperCase() + name.slice(1, -1);
    const iteratorName = name.slice(0, -1) + 'Entries';
    const areName = 'are' + name[0].toUpperCase() + name.slice(1);

    return {
      // Array-creators
      ['#.' + name]: {
        'it should return the correct neighbors array.': function () {
          const neighbors = graph[name](data.node.key);

          assert.deepStrictEqual(neighbors, data.node.neighbors);
          assert.deepStrictEqual(graph[name]('Alone'), []);
        }
      },

      // ForEach
      ['#.' + forEachName]: {
        'it should be possible to iterate over neighbors using a callback.':
          function () {
            const neighbors = [];

            graph[forEachName](data.node.key, function (target, attrs) {
              neighbors.push(target);

              assert.deepStrictEqual(graph.getNodeAttributes(target), attrs);
              assert.strictEqual(graph[areName](data.node.key, target), true);
            });

            assert.deepStrictEqual(neighbors, data.node.neighbors);
          }
      },

      // Find
      ['#.' + findName]: {
        'it should be possible to find neighbors.': function () {
          const neighbors = [];

          let found = graph[findName](data.node.key, function (target, attrs) {
            neighbors.push(target);

            assert.deepStrictEqual(graph.getNodeAttributes(target), attrs);
            assert.strictEqual(graph[areName](data.node.key, target), true);

            return true;
          });

          assert.strictEqual(found, neighbors[0]);
          assert.deepStrictEqual(neighbors, data.node.neighbors.slice(0, 1));

          found = graph[findName](data.node.key, function () {
            return false;
          });

          assert.strictEqual(found, undefined);
        }
      },

      // Iterators
      ['#.' + iteratorName]: {
        'it should be possible to create an iterator over neighbors.':
          function () {
            const iterator = graph[iteratorName](data.node.key);

            assert.deepStrictEqual(
              take(iterator),
              data.node.neighbors.map(neighbor => {
                return [neighbor, graph.getNodeAttributes(neighbor)];
              })
            );
          }
      }
    };
  }

  const tests = {
    Miscellaneous: {
      'self loops should appear when using #.inNeighbors and should appear only once with #.neighbors.':
        function () {
          const directed = new Graph({type: 'directed'});

          directed.addNode('Lucy');
          directed.addEdgeWithKey('test', 'Lucy', 'Lucy');

          assert.deepStrictEqual(directed.inNeighbors('Lucy'), ['Lucy']);
          assert.deepStrictEqual(
            Array.from(directed.inNeighborEntries('Lucy')).map(x => x[0]),
            ['Lucy']
          );

          let neighbors = [];

          directed.forEachInNeighbor('Lucy', neighbor => {
            neighbors.push(neighbor);
          });

          assert.deepStrictEqual(neighbors, ['Lucy']);

          assert.deepStrictEqual(directed.neighbors('Lucy'), ['Lucy']);

          neighbors = [];

          directed.forEachNeighbor('Lucy', neighbor => {
            neighbors.push(neighbor);
          });

          assert.deepStrictEqual(neighbors, ['Lucy']);

          assert.deepStrictEqual(
            Array.from(directed.neighborEntries('Lucy')).map(x => x[0]),
            ['Lucy']
          );
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
