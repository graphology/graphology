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
  const {notFound, invalid} = checkers;

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
    const capitalized = name[0].toUpperCase() + name.slice(1, -1);

    const forEachName = 'forEach' + capitalized;
    const findName = 'find' + capitalized;
    const iteratorName = name.slice(0, -1) + 'Entries';
    const areName = 'are' + capitalized + 's';
    const mapName = 'map' + capitalized + 's';
    const filterName = 'filter' + capitalized + 's';
    const reduceName = 'reduce' + capitalized + 's';
    const someName = 'some' + capitalized;
    const everyName = 'every' + capitalized;

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

      // Map
      ['#.' + mapName]: {
        'it should be possible to map neighbors using a callback.':
          function () {
            const result = graph[mapName](data.node.key, function (target) {
              return target;
            });

            assert.deepStrictEqual(result, data.node.neighbors);
          }
      },

      // Filter
      ['#.' + filterName]: {
        'it should be possible to filter neighbors using a callback.':
          function () {
            let result = graph[filterName](data.node.key, function () {
              return true;
            });

            assert.deepStrictEqual(result, data.node.neighbors);

            result = graph[filterName](data.node.key, () => false);

            assert.deepStrictEqual(result, []);
          }
      },

      // Reduce
      ['#.' + reduceName]: {
        'it sould throw if not given an initial value.': function () {
          assert.throws(function () {
            graph[reduceName]('node', () => true);
          }, invalid());
        },

        'it should be possible to reduce neighbors using a callback.':
          function () {
            const result = graph[reduceName](
              data.node.key,
              function (acc, key) {
                return acc.concat(key);
              },
              []
            );

            assert.deepStrictEqual(result, data.node.neighbors);
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

      // Some
      ['#.' + someName]: {
        'it should always return false on empty set.': function () {
          const loneGraph = new Graph();
          loneGraph.addNode('alone');

          assert.strictEqual(
            loneGraph[someName]('alone', () => true),
            false
          );
        },

        'it should be possible to assert whether any neighbor matches a predicate.':
          function () {
            assert.strictEqual(
              graph[someName](data.node.key, () => true),
              data.node.neighbors.length > 0
            );
          }
      },

      // Every
      ['#.' + everyName]: {
        'it should always return true on empty set.': function () {
          const loneGraph = new Graph();
          loneGraph.addNode('alone');

          assert.strictEqual(
            loneGraph[everyName]('alone', () => true),
            true
          );
        },

        'it should be possible to assert whether any neighbor matches a predicate.':
          function () {
            assert.strictEqual(
              graph[everyName](data.node.key, () => true),
              data.node.neighbors.length > 0
            );
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
                return {
                  neighbor,
                  attributes: graph.getNodeAttributes(neighbor)
                };
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
            Array.from(directed.inNeighborEntries('Lucy')).map(x => x.neighbor),
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
            Array.from(directed.neighborEntries('Lucy')).map(x => x.neighbor),
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
