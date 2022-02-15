/**
 * Graphology Edges Iteration Specs
 * =================================
 *
 * Testing the edges iteration-related methods of the graph.
 */
import assert from 'assert';
import take from 'obliterator/take';
import map from 'obliterator/map';
import {deepMerge, sameMembers, addNodesFrom} from '../helpers';

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
  const {invalid, notFound} = checkers;

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

  const ALL_DIRECTED_EDGES = ['J->T', 'J->M', 'C->J'];

  const ALL_UNDIRECTED_EDGES = ['M<->R', 'M<->J', 'J<->R', 'T<->M'];

  const TEST_DATA = {
    edges: {
      all: ALL_EDGES,
      node: {
        key: 'John',
        edges: ['C->J', 'J->T', 'J->M', 'M<->J', 'J<->R']
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: ['J->M', 'M<->J']
      }
    },
    inEdges: {
      all: ALL_DIRECTED_EDGES,
      node: {
        key: 'John',
        edges: ['C->J']
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
        edges: ['J->T', 'J->M']
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: ['J->M']
      }
    },
    inboundEdges: {
      all: ALL_DIRECTED_EDGES.concat(ALL_UNDIRECTED_EDGES),
      node: {
        key: 'John',
        edges: ['C->J', 'M<->J', 'J<->R']
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: ['M<->J']
      }
    },
    outboundEdges: {
      all: ALL_DIRECTED_EDGES.concat(ALL_UNDIRECTED_EDGES),
      node: {
        key: 'John',
        edges: ['J->T', 'J->M', 'M<->J', 'J<->R']
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: ['J->M', 'M<->J']
      }
    },
    directedEdges: {
      all: ALL_DIRECTED_EDGES,
      node: {
        key: 'John',
        edges: ['C->J', 'J->T', 'J->M']
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: ['J->M']
      }
    },
    undirectedEdges: {
      all: ALL_UNDIRECTED_EDGES,
      node: {
        key: 'John',
        edges: ['M<->J', 'J<->R']
      },
      path: {
        source: 'John',
        target: 'Martha',
        edges: ['M<->J']
      }
    }
  };

  function commonTests(name) {
    return {
      ['#.' + name]: {
        'it should throw if too many arguments are provided.': function () {
          assert.throws(function () {
            graph[name](1, 2, 3);
          }, invalid());
        },

        'it should throw when the node is not found.': function () {
          assert.throws(function () {
            graph[name]('Test');
          }, notFound());
        },

        'it should throw if either source or target is not found.':
          function () {
            assert.throws(function () {
              graph[name]('Test', 'Alone');
            }, notFound());

            assert.throws(function () {
              graph[name]('Alone', 'Test');
            }, notFound());
          }
      }
    };
  }

  function specificTests(name, data) {
    const capitalized = name[0].toUpperCase() + name.slice(1, -1);

    const iteratorName = name.slice(0, -1) + 'Entries';
    const forEachName = 'forEach' + capitalized;
    const findName = 'find' + capitalized;
    const mapName = 'map' + capitalized + 's';
    const filterName = 'filter' + capitalized + 's';
    const reduceName = 'reduce' + capitalized + 's';
    const someName = 'some' + capitalized;
    const everyName = 'every' + capitalized;

    return {
      // Array-creators
      ['#.' + name]: {
        'it should return all the relevant edges.': function () {
          const edges = graph[name]().sort();

          assert.deepStrictEqual(edges, data.all.slice().sort());
        },

        "it should return a node's relevant edges.": function () {
          const edges = graph[name](data.node.key);

          assert.deepStrictEqual(edges, data.node.edges);
          assert.deepStrictEqual(graph[name]('Alone'), []);
        },

        'it should return all the relevant edges between source & target.':
          function () {
            const edges = graph[name](data.path.source, data.path.target);

            assert(sameMembers(edges, data.path.edges));
            assert.deepStrictEqual(graph[name]('Forever', 'Alone'), []);
          }
      },

      // ForEach
      ['#.' + forEachName]: {
        'it should possible to use callback iterators.': function () {
          const edges = [];

          graph[forEachName](function (
            key,
            attributes,
            source,
            target,
            sA,
            tA,
            u
          ) {
            edges.push(key);

            assert.deepStrictEqual(
              attributes,
              key === 'J->T' ? {weight: 14} : {}
            );
            assert.strictEqual(source, graph.source(key));
            assert.strictEqual(target, graph.target(key));

            assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
            assert.deepStrictEqual(graph.getNodeAttributes(target), tA);

            assert.strictEqual(graph.isUndirected(key), u);
          });

          edges.sort();

          assert.deepStrictEqual(edges, data.all.slice().sort());
        },

        "it should be possible to use callback iterators over a node's relevant edges.":
          function () {
            const edges = [];

            graph[forEachName](
              data.node.key,
              function (key, attributes, source, target, sA, tA, u) {
                edges.push(key);

                assert.deepStrictEqual(
                  attributes,
                  key === 'J->T' ? {weight: 14} : {}
                );
                assert.strictEqual(source, graph.source(key));
                assert.strictEqual(target, graph.target(key));

                assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
                assert.deepStrictEqual(graph.getNodeAttributes(target), tA);

                assert.strictEqual(graph.isUndirected(key), u);
              }
            );

            edges.sort();

            assert.deepStrictEqual(edges, data.node.edges.slice().sort());
          },

        'it should be possible to use callback iterators over all the relevant edges between source & target.':
          function () {
            const edges = [];

            graph[forEachName](
              data.path.source,
              data.path.target,
              function (key, attributes, source, target, sA, tA, u) {
                edges.push(key);

                assert.deepStrictEqual(
                  attributes,
                  key === 'J->T' ? {weight: 14} : {}
                );
                assert.strictEqual(source, graph.source(key));
                assert.strictEqual(target, graph.target(key));

                assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
                assert.deepStrictEqual(graph.getNodeAttributes(target), tA);

                assert.strictEqual(graph.isUndirected(key), u);
              }
            );

            assert(sameMembers(edges, data.path.edges));
          }
      },

      // Map
      ['#.' + mapName]: {
        'it should possible to map edges.': function () {
          const result = graph[mapName](function (key) {
            return key;
          });

          result.sort();

          assert.deepStrictEqual(result, data.all.slice().sort());
        },

        "it should be possible to map a node's relevant edges.": function () {
          const result = graph[mapName](data.node.key, function (key) {
            return key;
          });

          result.sort();

          assert.deepStrictEqual(result, data.node.edges.slice().sort());
        },

        'it should be possible to map the relevant edges between source & target.':
          function () {
            const result = graph[mapName](
              data.path.source,
              data.path.target,
              function (key) {
                return key;
              }
            );

            result.sort();

            assert(sameMembers(result, data.path.edges));
          }
      },

      // Filter
      ['#.' + filterName]: {
        'it should possible to filter edges.': function () {
          const result = graph[filterName](function (key) {
            return data.all.includes(key);
          });

          result.sort();

          assert.deepStrictEqual(result, data.all.slice().sort());
        },

        "it should be possible to filter a node's relevant edges.":
          function () {
            const result = graph[filterName](data.node.key, function (key) {
              return data.all.includes(key);
            });

            result.sort();

            assert.deepStrictEqual(result, data.node.edges.slice().sort());
          },

        'it should be possible to filter the relevant edges between source & target.':
          function () {
            const result = graph[filterName](
              data.path.source,
              data.path.target,
              function (key) {
                return data.all.includes(key);
              }
            );

            result.sort();

            assert(sameMembers(result, data.path.edges));
          }
      },

      // Reduce
      ['#.' + reduceName]: {
        'it should throw when given bad arguments.': function () {
          assert.throws(function () {
            graph[reduceName]('test');
          }, invalid());

          assert.throws(function () {
            graph[reduceName](1, 2, 3, 4, 5);
          }, invalid());

          assert.throws(function () {
            graph[reduceName]('notafunction', 0);
          }, TypeError);

          assert.throws(function () {
            graph[reduceName]('test', () => true);
          }, invalid());
        },

        'it should possible to reduce edges.': function () {
          const result = graph[reduceName](function (x) {
            return x + 1;
          }, 0);

          assert.strictEqual(result, data.all.length);
        },

        "it should be possible to reduce a node's relevant edges.":
          function () {
            const result = graph[reduceName](
              data.node.key,
              function (x) {
                return x + 1;
              },
              0
            );

            assert.strictEqual(result, data.node.edges.length);
          },

        'it should be possible to reduce the relevant edges between source & target.':
          function () {
            const result = graph[reduceName](
              data.path.source,
              data.path.target,
              function (x) {
                return x + 1;
              },
              0
            );

            assert.strictEqual(result, data.path.edges.length);
          }
      },

      // Find
      ['#.' + findName]: {
        'it should possible to find an edge.': function () {
          const edges = [];

          let found = graph[findName](function (
            key,
            attributes,
            source,
            target,
            sA,
            tA,
            u
          ) {
            edges.push(key);

            assert.deepStrictEqual(
              attributes,
              key === 'J->T' ? {weight: 14} : {}
            );
            assert.strictEqual(source, graph.source(key));
            assert.strictEqual(target, graph.target(key));

            assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
            assert.deepStrictEqual(graph.getNodeAttributes(target), tA);

            assert.strictEqual(graph.isUndirected(key), u);

            return true;
          });

          assert.strictEqual(found, edges[0]);
          assert.strictEqual(edges.length, 1);

          found = graph[findName](function () {
            return false;
          });

          assert.strictEqual(found, undefined);
        },

        "it should be possible to find a node's edge.": function () {
          const edges = [];

          let found = graph[findName](
            data.node.key,
            function (key, attributes, source, target, sA, tA, u) {
              edges.push(key);

              assert.deepStrictEqual(
                attributes,
                key === 'J->T' ? {weight: 14} : {}
              );
              assert.strictEqual(source, graph.source(key));
              assert.strictEqual(target, graph.target(key));

              assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
              assert.deepStrictEqual(graph.getNodeAttributes(target), tA);

              assert.strictEqual(graph.isUndirected(key), u);

              return true;
            }
          );

          assert.strictEqual(found, edges[0]);
          assert.strictEqual(edges.length, 1);

          found = graph[findName](data.node.key, function () {
            return false;
          });

          assert.strictEqual(found, undefined);
        },

        'it should be possible to find an edge between source & target.':
          function () {
            const edges = [];

            let found = graph[findName](
              data.path.source,
              data.path.target,
              function (key, attributes, source, target, sA, tA, u) {
                edges.push(key);

                assert.deepStrictEqual(
                  attributes,
                  key === 'J->T' ? {weight: 14} : {}
                );
                assert.strictEqual(source, graph.source(key));
                assert.strictEqual(target, graph.target(key));

                assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
                assert.deepStrictEqual(graph.getNodeAttributes(target), tA);

                assert.strictEqual(graph.isUndirected(key), u);

                return true;
              }
            );

            assert.strictEqual(found, edges[0]);
            assert.strictEqual(
              edges.length,
              graph[name](data.path.source, data.path.target).length ? 1 : 0
            );

            found = graph[findName](
              data.path.source,
              data.path.target,
              function () {
                return false;
              }
            );

            assert.strictEqual(found, undefined);
          }
      },

      // Some
      ['#.' + someName]: {
        'it should possible to assert whether any edge matches a predicate.':
          function () {
            const edges = [];

            let found = graph[someName](function (
              key,
              attributes,
              source,
              target,
              sA,
              tA,
              u
            ) {
              edges.push(key);

              assert.deepStrictEqual(
                attributes,
                key === 'J->T' ? {weight: 14} : {}
              );
              assert.strictEqual(source, graph.source(key));
              assert.strictEqual(target, graph.target(key));

              assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
              assert.deepStrictEqual(graph.getNodeAttributes(target), tA);

              assert.strictEqual(graph.isUndirected(key), u);

              return true;
            });

            assert.strictEqual(found, true);
            assert.strictEqual(edges.length, 1);

            found = graph[someName](function () {
              return false;
            });

            assert.strictEqual(found, false);
          },

        "it should possible to assert whether any node's edge matches a predicate.":
          function () {
            const edges = [];

            let found = graph[someName](
              data.node.key,
              function (key, attributes, source, target, sA, tA, u) {
                edges.push(key);

                assert.deepStrictEqual(
                  attributes,
                  key === 'J->T' ? {weight: 14} : {}
                );
                assert.strictEqual(source, graph.source(key));
                assert.strictEqual(target, graph.target(key));

                assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
                assert.deepStrictEqual(graph.getNodeAttributes(target), tA);

                assert.strictEqual(graph.isUndirected(key), u);

                return true;
              }
            );

            assert.strictEqual(found, true);
            assert.strictEqual(edges.length, 1);

            found = graph[someName](data.node.key, function () {
              return false;
            });

            assert.strictEqual(found, false);
          },

        'it should possible to assert whether any edge between source & target matches a predicate.':
          function () {
            const edges = [];

            let found = graph[someName](
              data.path.source,
              data.path.target,
              function (key, attributes, source, target, sA, tA, u) {
                edges.push(key);

                assert.deepStrictEqual(
                  attributes,
                  key === 'J->T' ? {weight: 14} : {}
                );
                assert.strictEqual(source, graph.source(key));
                assert.strictEqual(target, graph.target(key));

                assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
                assert.deepStrictEqual(graph.getNodeAttributes(target), tA);

                assert.strictEqual(graph.isUndirected(key), u);

                return true;
              }
            );

            assert.strictEqual(
              found,
              graph[name](data.path.source, data.path.target).length !== 0
            );
            assert.strictEqual(
              edges.length,
              graph[name](data.path.source, data.path.target).length ? 1 : 0
            );

            found = graph[someName](
              data.path.source,
              data.path.target,
              function () {
                return false;
              }
            );

            assert.strictEqual(found, false);
          },

        'it should always return false on empty sets.': function () {
          const empty = new Graph();

          assert.strictEqual(
            empty[someName](() => true),
            false
          );
        }
      },

      // Every
      ['#.' + everyName]: {
        'it should possible to assert whether all edges matches a predicate.':
          function () {
            const edges = [];

            let found = graph[everyName](function (
              key,
              attributes,
              source,
              target,
              sA,
              tA,
              u
            ) {
              edges.push(key);

              assert.deepStrictEqual(
                attributes,
                key === 'J->T' ? {weight: 14} : {}
              );
              assert.strictEqual(source, graph.source(key));
              assert.strictEqual(target, graph.target(key));

              assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
              assert.deepStrictEqual(graph.getNodeAttributes(target), tA);

              assert.strictEqual(graph.isUndirected(key), u);

              return true;
            });

            assert.strictEqual(found, true);

            found = graph[everyName](function () {
              return false;
            });

            assert.strictEqual(found, false);
          },

        "it should possible to assert whether all of a node's edges matches a predicate.":
          function () {
            const edges = [];

            let found = graph[everyName](
              data.node.key,
              function (key, attributes, source, target, sA, tA, u) {
                edges.push(key);

                assert.deepStrictEqual(
                  attributes,
                  key === 'J->T' ? {weight: 14} : {}
                );
                assert.strictEqual(source, graph.source(key));
                assert.strictEqual(target, graph.target(key));

                assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
                assert.deepStrictEqual(graph.getNodeAttributes(target), tA);

                assert.strictEqual(graph.isUndirected(key), u);

                return true;
              }
            );

            assert.strictEqual(found, true);

            found = graph[everyName](data.node.key, function () {
              return false;
            });

            assert.strictEqual(found, false);
          },

        'it should possible to assert whether all edges between source & target matches a predicate.':
          function () {
            const edges = [];

            let found = graph[everyName](
              data.path.source,
              data.path.target,
              function (key, attributes, source, target, sA, tA, u) {
                edges.push(key);

                assert.deepStrictEqual(
                  attributes,
                  key === 'J->T' ? {weight: 14} : {}
                );
                assert.strictEqual(source, graph.source(key));
                assert.strictEqual(target, graph.target(key));

                assert.deepStrictEqual(graph.getNodeAttributes(source), sA);
                assert.deepStrictEqual(graph.getNodeAttributes(target), tA);

                assert.strictEqual(graph.isUndirected(key), u);

                return true;
              }
            );

            const isEmpty =
              graph[name](data.path.source, data.path.target).length === 0;

            assert.strictEqual(found, true);

            found = graph[everyName](
              data.path.source,
              data.path.target,
              function () {
                return false;
              }
            );

            assert.strictEqual(found, isEmpty ? true : false);
          },

        'it should always return true on empty sets.': function () {
          const empty = new Graph();

          assert.strictEqual(
            empty[everyName](() => true),
            true
          );
        }
      },

      // Iterators
      ['#.' + iteratorName]: {
        'it should be possible to return an iterator over the relevant edges.':
          function () {
            const iterator = graph[iteratorName]();

            assert.deepStrictEqual(
              take(iterator),
              data.all.map(edge => {
                const [source, target] = graph.extremities(edge);

                return {
                  edge,
                  attributes: graph.getEdgeAttributes(edge),
                  source,
                  target,
                  sourceAttributes: graph.getNodeAttributes(source),
                  targetAttributes: graph.getNodeAttributes(target),
                  undirected: graph.isUndirected(edge)
                };
              })
            );
          },

        "it should be possible to return an iterator over a node's relevant edges.":
          function () {
            const iterator = graph[iteratorName](data.node.key);

            assert.deepStrictEqual(
              take(iterator),
              data.node.edges.map(edge => {
                const [source, target] = graph.extremities(edge);

                return {
                  edge,
                  attributes: graph.getEdgeAttributes(edge),
                  source,
                  target,
                  sourceAttributes: graph.getNodeAttributes(source),
                  targetAttributes: graph.getNodeAttributes(target),
                  undirected: graph.isUndirected(edge)
                };
              })
            );
          },

        'it should be possible to return an iterator over relevant edges between source & target.':
          function () {
            const iterator = graph[iteratorName](
              data.path.source,
              data.path.target
            );

            assert.deepStrictEqual(
              take(iterator),
              data.path.edges.map(edge => {
                const [source, target] = graph.extremities(edge);

                return {
                  edge,
                  attributes: graph.getEdgeAttributes(edge),
                  source,
                  target,
                  sourceAttributes: graph.getNodeAttributes(source),
                  targetAttributes: graph.getNodeAttributes(target),
                  undirected: graph.isUndirected(edge)
                };
              })
            );
          }
      }
    };
  }

  const tests = {
    Miscellaneous: {
      'simple graph indices should work.': function () {
        const simpleGraph = new Graph();
        addNodesFrom(simpleGraph, [1, 2, 3, 4]);
        simpleGraph.addEdgeWithKey('1->2', 1, 2);
        simpleGraph.addEdgeWithKey('1->3', 1, 3);
        simpleGraph.addEdgeWithKey('1->4', 1, 4);

        assert.deepStrictEqual(simpleGraph.edges(1), ['1->2', '1->3', '1->4']);
      },

      'it should also work with typed graphs.': function () {
        const undirected = new Graph({type: 'undirected'}),
          directed = new Graph({type: 'directed'});

        undirected.mergeEdgeWithKey('1--2', 1, 2);
        directed.mergeEdgeWithKey('1->2', 1, 2);

        assert.deepStrictEqual(undirected.edges(1, 2), ['1--2']);
        assert.deepStrictEqual(directed.edges(1, 2), ['1->2']);
      },

      'self loops should appear when using #.inEdges and should appear only once with #.edges.':
        function () {
          const directed = new Graph({type: 'directed'});

          directed.addNode('Lucy');
          directed.addEdgeWithKey('Lucy', 'Lucy', 'Lucy');

          assert.deepStrictEqual(directed.inEdges('Lucy'), ['Lucy']);
          assert.deepStrictEqual(
            Array.from(directed.inEdgeEntries('Lucy')).map(x => x.edge),
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
            Array.from(directed.edgeEntries('Lucy')).map(x => x.edge),
            ['Lucy']
          );
        },

      'it should be possible to retrieve self loops.': function () {
        const loopy = new Graph();

        loopy.addNode('John');
        loopy.addEdgeWithKey('d', 'John', 'John');
        loopy.addUndirectedEdgeWithKey('u', 'John', 'John');

        assert.deepStrictEqual(
          new Set(loopy.edges('John', 'John')),
          new Set(['d', 'u'])
        );
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
      },

      'self loops in multi graphs should work properly (#352).': function () {
        const loopy = new Graph({multi: true});

        loopy.addNode('n');
        loopy.addEdgeWithKey('e1', 'n', 'n');
        loopy.addEdgeWithKey('e2', 'n', 'n');
        loopy.addUndirectedEdgeWithKey('e3', 'n', 'n');

        // Arrays
        assert.deepStrictEqual(loopy.edges('n'), ['e2', 'e1', 'e3']);
        assert.deepStrictEqual(loopy.outboundEdges('n'), ['e2', 'e1', 'e3']);
        assert.deepStrictEqual(loopy.inboundEdges('n'), ['e2', 'e1', 'e3']);
        assert.deepStrictEqual(loopy.outEdges('n'), ['e2', 'e1']);
        assert.deepStrictEqual(loopy.inEdges('n'), ['e2', 'e1']);
        assert.deepStrictEqual(loopy.undirectedEdges('n'), ['e3']);
        assert.deepStrictEqual(loopy.directedEdges('n'), ['e2', 'e1']);

        assert.deepStrictEqual(loopy.edges('n', 'n'), ['e2', 'e1', 'e3']);
        assert.deepStrictEqual(loopy.outboundEdges('n', 'n'), [
          'e2',
          'e1',
          'e3'
        ]);
        assert.deepStrictEqual(loopy.inboundEdges('n', 'n'), [
          'e2',
          'e1',
          'e3'
        ]);
        assert.deepStrictEqual(loopy.outEdges('n', 'n'), ['e2', 'e1']);
        assert.deepStrictEqual(loopy.inEdges('n', 'n'), ['e2', 'e1']);
        assert.deepStrictEqual(loopy.undirectedEdges('n', 'n'), ['e3']);
        assert.deepStrictEqual(loopy.directedEdges('n', 'n'), ['e2', 'e1']);

        // Iterators
        const mapKeys = it => take(map(it, e => e.edge));

        assert.deepStrictEqual(mapKeys(loopy.edgeEntries('n')), [
          'e2',
          'e1',
          'e3'
        ]);
        assert.deepStrictEqual(mapKeys(loopy.outboundEdgeEntries('n')), [
          'e2',
          'e1',
          'e3'
        ]);
        assert.deepStrictEqual(mapKeys(loopy.inboundEdgeEntries('n')), [
          'e2',
          'e1',
          'e3'
        ]);
        assert.deepStrictEqual(mapKeys(loopy.outEdgeEntries('n')), [
          'e2',
          'e1'
        ]);
        assert.deepStrictEqual(mapKeys(loopy.inEdgeEntries('n')), ['e2', 'e1']);
        assert.deepStrictEqual(mapKeys(loopy.undirectedEdgeEntries('n')), [
          'e3'
        ]);
        assert.deepStrictEqual(mapKeys(loopy.directedEdgeEntries('n')), [
          'e2',
          'e1'
        ]);

        assert.deepStrictEqual(mapKeys(loopy.edgeEntries('n', 'n')), [
          'e2',
          'e1',
          'e3'
        ]);
        assert.deepStrictEqual(mapKeys(loopy.outboundEdgeEntries('n', 'n')), [
          'e2',
          'e1',
          'e3'
        ]);
        assert.deepStrictEqual(mapKeys(loopy.inboundEdgeEntries('n', 'n')), [
          'e2',
          'e1',
          'e3'
        ]);
        assert.deepStrictEqual(mapKeys(loopy.outEdgeEntries('n', 'n')), [
          'e2',
          'e1'
        ]);
        assert.deepStrictEqual(mapKeys(loopy.inEdgeEntries('n', 'n')), [
          'e2',
          'e1'
        ]);
        assert.deepStrictEqual(mapKeys(loopy.undirectedEdgeEntries('n', 'n')), [
          'e3'
        ]);
        assert.deepStrictEqual(mapKeys(loopy.directedEdgeEntries('n', 'n')), [
          'e2',
          'e1'
        ]);
      },

      'findOutboundEdge should work on multigraphs (#319).': function () {
        const loopy = new Graph({multi: true});

        loopy.mergeEdgeWithKey('e1', 'n', 'm');
        loopy.mergeEdgeWithKey('e2', 'n', 'n');

        assert.strictEqual(
          loopy.findOutboundEdge((_e, _a, s, t) => s === t),
          'e2'
        );

        assert.strictEqual(
          loopy.findOutboundEdge('n', (_e, _a, s, t) => s === t),
          'e2'
        );

        assert.strictEqual(
          loopy.findOutboundEdge('n', 'n', (_e, _a, s, t) => s === t),
          'e2'
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
