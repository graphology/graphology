/**
 * Graphology Mutation Specs
 * ==========================
 *
 * Testing the mutation methods of the graph.
 */
import assert from 'assert';
import {addNodesFrom} from './helpers';

export default function mutation(Graph, checkers) {
  const {invalid, notFound, usage} = checkers;

  return {
    '#.addNode': {
      'it should throw if given attributes is not an object.': function () {
        const graph = new Graph();

        assert.throws(function () {
          graph.addNode('test', true);
        }, invalid());
      },

      'it should throw if the given node already exist.': function () {
        const graph = new Graph();
        graph.addNode('Martha');

        assert.throws(function () {
          graph.addNode('Martha');
        }, usage());
      },

      'it should return the added node.': function () {
        const graph = new Graph();

        assert.strictEqual(graph.addNode('John'), 'John');
      }
    },

    '#.mergeNode': {
      'it should add the node if it does not exist yet.': function () {
        const graph = new Graph();
        graph.mergeNode('John');

        assert.deepStrictEqual(graph.nodes(), ['John']);
      },

      'it should do nothing if the node already exists.': function () {
        const graph = new Graph();
        graph.addNode('John');
        graph.mergeNode('John');

        assert.deepStrictEqual(graph.nodes(), ['John']);
      },

      'it should merge the attributes.': function () {
        const graph = new Graph();
        graph.addNode('John', {eyes: 'blue'});
        graph.mergeNode('John', {age: 15});

        assert.deepStrictEqual(graph.nodes(), ['John']);
        assert.deepStrictEqual(graph.getNodeAttributes('John'), {
          eyes: 'blue',
          age: 15
        });
      },

      'it should coerce keys to string.': function () {
        const graph = new Graph();
        graph.addNode(4);

        assert.doesNotThrow(() => graph.mergeNode(4));
      },

      'it should return useful information.': function () {
        const graph = new Graph();

        let [key, wasAdded] = graph.mergeNode('Jack');

        assert.strictEqual(key, 'Jack');
        assert.strictEqual(wasAdded, true);

        [key, wasAdded] = graph.mergeNode('Jack');

        assert.strictEqual(key, 'Jack');
        assert.strictEqual(wasAdded, false);
      }
    },

    '#.updateNode': {
      'it should add the node if it does not exist yet.': function () {
        const graph = new Graph();
        graph.updateNode('John');

        assert.deepStrictEqual(graph.nodes(), ['John']);
      },

      'it should do nothing if the node already exists.': function () {
        const graph = new Graph();
        graph.addNode('John');
        graph.updateNode('John');

        assert.deepStrictEqual(graph.nodes(), ['John']);
      },

      'it should update the attributes.': function () {
        const graph = new Graph();
        graph.addNode('John', {eyes: 'blue', count: 1});
        graph.updateNode('John', attr => ({
          ...attr,
          count: attr.count + 1
        }));

        assert.deepStrictEqual(graph.nodes(), ['John']);
        assert.deepStrictEqual(graph.getNodeAttributes('John'), {
          eyes: 'blue',
          count: 2
        });
      },

      'it should be possible to start from blank attributes.': function () {
        const graph = new Graph();
        graph.updateNode('John', () => ({count: 2}));

        assert.deepStrictEqual(graph.getNodeAttributes('John'), {
          count: 2
        });
      },

      'it should coerce keys to string.': function () {
        const graph = new Graph();
        graph.addNode(4);

        assert.doesNotThrow(() => graph.updateNode(4));
      },

      'it should return useful information.': function () {
        const graph = new Graph();

        let [key, wasAdded] = graph.updateNode('Jack');

        assert.strictEqual(key, 'Jack');
        assert.strictEqual(wasAdded, true);

        [key, wasAdded] = graph.updateNode('Jack');

        assert.strictEqual(key, 'Jack');
        assert.strictEqual(wasAdded, false);
      }
    },

    '#.addDirectedEdge': {
      'it should throw if given attributes is not an object.': function () {
        const graph = new Graph();

        assert.throws(function () {
          graph.addDirectedEdge('source', 'target', true);
        }, invalid());
      },

      'it should throw if the graph is undirected.': function () {
        const graph = new Graph({type: 'undirected'});

        assert.throws(function () {
          graph.addDirectedEdge('source', 'target');
        }, usage());
      },

      'it should throw if either the source or the target does not exist.':
        function () {
          const graph = new Graph();
          graph.addNode('Martha');

          assert.throws(function () {
            graph.addDirectedEdge('Thomas', 'Eric');
          }, notFound());

          assert.throws(function () {
            graph.addDirectedEdge('Martha', 'Eric');
          }, notFound());
        },

      'it should throw if the edge is a loop and the graph does not allow it.':
        function () {
          const graph = new Graph({allowSelfLoops: false});

          graph.addNode('Thomas');

          assert.throws(function () {
            graph.addDirectedEdge('Thomas', 'Thomas');
          }, usage());
        },

      'it should be possible to add self loops.': function () {
        const graph = new Graph();

        graph.addNode('Thomas');

        const loop = graph.addDirectedEdge('Thomas', 'Thomas');

        assert.deepStrictEqual(graph.extremities(loop), ['Thomas', 'Thomas']);
      },

      'it should throw if the graph is not multi & we try to add twice the same edge.':
        function () {
          const graph = new Graph();
          graph.addNode('Thomas');
          graph.addNode('Martha');

          graph.addDirectedEdge('Thomas', 'Martha');

          assert.throws(function () {
            graph.addDirectedEdge('Thomas', 'Martha');
          }, usage());

          assert.throws(function () {
            graph.addDirectedEdgeWithKey('T->M', 'Thomas', 'Martha');
          }, usage());
        },

      "it should return the generated edge's key.": function () {
        const graph = new Graph();
        graph.addNode('Thomas');
        graph.addNode('Martha');

        const edge = graph.addDirectedEdge('Thomas', 'Martha');

        assert(typeof edge === 'string' || typeof edge === 'number');
        assert(!(edge instanceof Graph));
      }
    },

    '#.addEdge': {
      'it should add a directed edge if the graph is directed or mixed.':
        function () {
          const graph = new Graph(),
            directedGraph = new Graph({type: 'directed'});

          graph.addNode('John');
          graph.addNode('Martha');
          const mixedEdge = graph.addEdge('John', 'Martha');

          directedGraph.addNode('John');
          directedGraph.addNode('Martha');
          const directedEdge = directedGraph.addEdge('John', 'Martha');

          assert(graph.isDirected(mixedEdge));
          assert(directedGraph.isDirected(directedEdge));
        },

      'it should add an undirected edge if the graph is undirected.':
        function () {
          const graph = new Graph({type: 'undirected'});

          graph.addNode('John');
          graph.addNode('Martha');
          const edge = graph.addEdge('John', 'Martha');

          assert(graph.isUndirected(edge));
        }
    },

    '#.addDirectedEdgeWithKey': {
      'it should throw if an edge with the same key already exists.':
        function () {
          const graph = new Graph();

          graph.addNode('Thomas');
          graph.addNode('Martha');

          graph.addDirectedEdgeWithKey('T->M', 'Thomas', 'Martha');

          assert.throws(function () {
            graph.addDirectedEdgeWithKey('T->M', 'Thomas', 'Martha');
          }, usage());

          assert.throws(function () {
            graph.addUndirectedEdgeWithKey('T->M', 'Thomas', 'Martha');
          }, usage());
        }
    },

    '#.addUndirectedEdgeWithKey': {
      'it should throw if an edge with the same key already exists.':
        function () {
          const graph = new Graph();

          graph.addNode('Thomas');
          graph.addNode('Martha');

          graph.addUndirectedEdgeWithKey('T<->M', 'Thomas', 'Martha');

          assert.throws(function () {
            graph.addUndirectedEdgeWithKey('T<->M', 'Thomas', 'Martha');
          }, usage());

          assert.throws(function () {
            graph.addDirectedEdgeWithKey('T<->M', 'Thomas', 'Martha');
          }, usage());
        }
    },

    '#.addEdgeWithKey': {
      'it should add a directed edge if the graph is directed or mixed.':
        function () {
          const graph = new Graph(),
            directedGraph = new Graph({type: 'directed'});

          graph.addNode('John');
          graph.addNode('Martha');
          const mixedEdge = graph.addEdgeWithKey('J->M', 'John', 'Martha');

          directedGraph.addNode('John');
          directedGraph.addNode('Martha');
          const directedEdge = directedGraph.addEdgeWithKey(
            'J->M',
            'John',
            'Martha'
          );

          assert(graph.isDirected(mixedEdge));
          assert(directedGraph.isDirected(directedEdge));
        },

      'it should add an undirected edge if the graph is undirected.':
        function () {
          const graph = new Graph({type: 'undirected'});

          graph.addNode('John');
          graph.addNode('Martha');
          const edge = graph.addEdgeWithKey('J<->M', 'John', 'Martha');

          assert(graph.isUndirected(edge));
        }
    },

    '#.mergeEdge': {
      'it should add the edge if it does not yet exist.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['John', 'Martha']);

        graph.mergeEdge('John', 'Martha');

        assert.strictEqual(graph.size, 1);
        assert.strictEqual(graph.hasEdge('John', 'Martha'), true);
      },

      'it should do nothing if the edge already exists.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['John', 'Martha']);

        graph.addEdge('John', 'Martha');
        graph.mergeEdge('John', 'Martha');

        assert.strictEqual(graph.size, 1);
        assert.strictEqual(graph.hasEdge('John', 'Martha'), true);
      },

      'it should merge existing attributes if any.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['John', 'Martha']);

        graph.addEdge('John', 'Martha', {type: 'KNOWS'});
        graph.mergeEdge('John', 'Martha', {weight: 2});

        assert.strictEqual(graph.size, 1);
        assert.strictEqual(graph.hasEdge('John', 'Martha'), true);
        assert.deepStrictEqual(graph.getEdgeAttributes('John', 'Martha'), {
          type: 'KNOWS',
          weight: 2
        });
      },

      'it should add missing nodes in the path.': function () {
        const graph = new Graph();
        graph.mergeEdge('John', 'Martha');

        assert.strictEqual(graph.order, 2);
        assert.strictEqual(graph.size, 1);
        assert.deepStrictEqual(graph.nodes(), ['John', 'Martha']);
      },

      'it should throw in case of inconsistencies.': function () {
        const graph = new Graph();
        graph.mergeEdgeWithKey('J->M', 'John', 'Martha');

        assert.throws(function () {
          graph.mergeEdgeWithKey('J->M', 'John', 'Thomas');
        }, usage());
      },

      'it should be able to merge undirected edges in both directions.':
        function () {
          assert.doesNotThrow(function () {
            const graph = new Graph();
            graph.mergeUndirectedEdgeWithKey('J<->M', 'John', 'Martha');
            graph.mergeUndirectedEdgeWithKey('J<->M', 'John', 'Martha');
            graph.mergeUndirectedEdgeWithKey('J<->M', 'Martha', 'John');
          }, usage());
        },

      'it should distinguish between typed edges.': function () {
        const graph = new Graph();
        graph.mergeEdge('John', 'Martha', {type: 'LIKES'});
        graph.mergeUndirectedEdge('John', 'Martha', {weight: 34});

        assert.strictEqual(graph.size, 2);
      },

      'it should be possible to merge a self loop.': function () {
        const graph = new Graph();

        graph.mergeEdge('John', 'John', {type: 'IS'});

        assert.strictEqual(graph.order, 1);
        assert.strictEqual(graph.size, 1);
      },

      'it should return useful information.': function () {
        const graph = new Graph();

        let info = graph.mergeEdge('John', 'Jack');

        assert.deepStrictEqual(info, [
          graph.edge('John', 'Jack'),
          true,
          true,
          true
        ]);

        info = graph.mergeEdge('John', 'Jack');

        assert.deepStrictEqual(info, [
          graph.edge('John', 'Jack'),
          false,
          false,
          false
        ]);

        graph.addNode('Mary');

        info = graph.mergeEdge('Mary', 'Sue');

        assert.deepStrictEqual(info, [
          graph.edge('Mary', 'Sue'),
          true,
          false,
          true
        ]);

        info = graph.mergeEdge('Gwladys', 'Mary');

        assert.deepStrictEqual(info, [
          graph.edge('Gwladys', 'Mary'),
          true,
          true,
          false
        ]);

        graph.addNode('Quintin');

        info = graph.mergeEdge('Quintin', 'Mary');

        assert.deepStrictEqual(info, [
          graph.edge('Quintin', 'Mary'),
          true,
          false,
          false
        ]);
      }
    },

    '#.updateEdge': {
      'it should add the edge if it does not yet exist.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['John', 'Martha']);

        graph.updateEdge('John', 'Martha');

        assert.strictEqual(graph.size, 1);
        assert.strictEqual(graph.hasEdge('John', 'Martha'), true);
      },

      'it should do nothing if the edge already exists.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['John', 'Martha']);

        graph.addEdge('John', 'Martha');
        graph.updateEdge('John', 'Martha');

        assert.strictEqual(graph.size, 1);
        assert.strictEqual(graph.hasEdge('John', 'Martha'), true);
      },

      'it should be possible to start from blank attributes.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['John', 'Martha']);

        graph.updateEdge('John', 'Martha', attr => ({...attr, weight: 3}));

        assert.strictEqual(graph.size, 1);
        assert.strictEqual(graph.hasEdge('John', 'Martha'), true);
        assert.deepStrictEqual(graph.getEdgeAttributes('John', 'Martha'), {
          weight: 3
        });
      },

      'it should update existing attributes if any.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['John', 'Martha']);

        graph.addEdge('John', 'Martha', {type: 'KNOWS'});
        graph.updateEdge('John', 'Martha', attr => ({...attr, weight: 2}));

        assert.strictEqual(graph.size, 1);
        assert.strictEqual(graph.hasEdge('John', 'Martha'), true);
        assert.deepStrictEqual(graph.getEdgeAttributes('John', 'Martha'), {
          type: 'KNOWS',
          weight: 2
        });
      },

      'it should add missing nodes in the path.': function () {
        const graph = new Graph();
        graph.updateEdge('John', 'Martha');

        assert.strictEqual(graph.order, 2);
        assert.strictEqual(graph.size, 1);
        assert.deepStrictEqual(graph.nodes(), ['John', 'Martha']);
      },

      'it should throw in case of inconsistencies.': function () {
        const graph = new Graph();
        graph.updateEdgeWithKey('J->M', 'John', 'Martha');

        assert.throws(function () {
          graph.updateEdgeWithKey('J->M', 'John', 'Thomas');
        }, usage());
      },

      'it should distinguish between typed edges.': function () {
        const graph = new Graph();
        graph.updateEdge('John', 'Martha', () => ({type: 'LIKES'}));
        graph.updateUndirectedEdge('John', 'Martha', () => ({weight: 34}));

        assert.strictEqual(graph.size, 2);
      },

      'it should be possible to merge a self loop.': function () {
        const graph = new Graph();

        graph.updateEdge('John', 'John', () => ({type: 'IS'}));

        assert.strictEqual(graph.order, 1);
        assert.strictEqual(graph.size, 1);
      },

      'it should return useful information.': function () {
        const graph = new Graph();

        let info = graph.updateEdge('John', 'Jack');

        assert.deepStrictEqual(info, [
          graph.edge('John', 'Jack'),
          true,
          true,
          true
        ]);

        info = graph.updateEdge('John', 'Jack');

        assert.deepStrictEqual(info, [
          graph.edge('John', 'Jack'),
          false,
          false,
          false
        ]);

        graph.addNode('Mary');

        info = graph.updateEdge('Mary', 'Sue');

        assert.deepStrictEqual(info, [
          graph.edge('Mary', 'Sue'),
          true,
          false,
          true
        ]);

        info = graph.updateEdge('Gwladys', 'Mary');

        assert.deepStrictEqual(info, [
          graph.edge('Gwladys', 'Mary'),
          true,
          true,
          false
        ]);

        graph.addNode('Quintin');

        info = graph.updateEdge('Quintin', 'Mary');

        assert.deepStrictEqual(info, [
          graph.edge('Quintin', 'Mary'),
          true,
          false,
          false
        ]);
      }
    },

    '#.dropEdge': {
      'it should throw if the edge or nodes in the path are not found in the graph.':
        function () {
          const graph = new Graph();
          addNodesFrom(graph, ['John', 'Martha']);

          assert.throws(function () {
            graph.dropEdge('Test');
          }, notFound());

          assert.throws(function () {
            graph.dropEdge('Forever', 'Alone');
          }, notFound());

          assert.throws(function () {
            graph.dropEdge('John', 'Test');
          }, notFound());

          assert.throws(function () {
            graph.dropEdge('John', 'Martha');
          }, notFound());
        },

      'it should correctly remove the given edge from the graph.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['John', 'Margaret']);
        const edge = graph.addEdge('John', 'Margaret');

        graph.dropEdge(edge);

        assert.strictEqual(graph.order, 2);
        assert.strictEqual(graph.size, 0);
        assert.strictEqual(graph.degree('John'), 0);
        assert.strictEqual(graph.degree('Margaret'), 0);
        assert.strictEqual(graph.hasEdge(edge), false);
        assert.strictEqual(graph.hasDirectedEdge('John', 'Margaret'), false);
      },

      'it should be possible to remove an edge using source & target.':
        function () {
          const graph = new Graph();
          addNodesFrom(graph, ['John', 'Margaret']);
          graph.addEdge('John', 'Margaret');

          graph.dropEdge('John', 'Margaret');

          assert.strictEqual(graph.order, 2);
          assert.strictEqual(graph.size, 0);
          assert.strictEqual(graph.degree('John'), 0);
          assert.strictEqual(graph.degree('Margaret'), 0);
          assert.strictEqual(graph.hasEdge('John', 'Margaret'), false);
          assert.strictEqual(graph.hasDirectedEdge('John', 'Margaret'), false);
        },

      'it should work with self loops.': function () {
        const graph = new Graph();
        graph.mergeEdge('John', 'John');
        graph.dropEdge('John', 'John');

        assert.deepStrictEqual(graph.edges(), []);
        assert.deepStrictEqual(graph.edges('John'), []);
        assert.strictEqual(graph.size, 0);

        const multiGraph = new Graph({multi: true});
        multiGraph.mergeEdgeWithKey('j', 'John', 'John');
        multiGraph.mergeEdgeWithKey('k', 'John', 'John');
        multiGraph.dropEdge('j');

        assert.deepStrictEqual(multiGraph.edges(), ['k']);
        assert.deepStrictEqual(multiGraph.edges('John'), ['k']);
        assert.strictEqual(multiGraph.size, 1);
      }
    },

    '#.dropNode': {
      'it should throw if the edge is not found in the graph.': function () {
        const graph = new Graph();

        assert.throws(function () {
          graph.dropNode('Test');
        }, notFound());
      },

      'it should correctly remove the given node from the graph.': function () {
        const graph = new Graph();
        addNodesFrom(graph, ['John', 'Margaret']);
        const edge = graph.addEdge('John', 'Margaret');
        graph.mergeEdge('Jack', 'Trudy');

        graph.dropNode('Margaret');

        assert.strictEqual(graph.order, 3);
        assert.strictEqual(graph.size, 1);
        assert.strictEqual(graph.hasNode('Margaret'), false);
        assert.strictEqual(graph.hasEdge(edge), false);
        assert.strictEqual(graph.degree('John'), 0);
        assert.strictEqual(graph.hasDirectedEdge('John', 'Margaret'), false);
      },

      'it should also work with mixed, multi graphs and self loops.':
        function () {
          const graph = new Graph({multi: true});
          graph.mergeEdge('A', 'B');
          graph.mergeEdge('A', 'B');
          graph.mergeEdge('B', 'A');
          graph.mergeEdge('A', 'B');
          graph.mergeEdge('A', 'A');
          graph.mergeUndirectedEdge('A', 'B');
          graph.mergeUndirectedEdge('A', 'B');
          graph.mergeUndirectedEdge('A', 'A');

          const copy = graph.copy();

          graph.dropNode('B');

          assert.strictEqual(graph.size, 2);
          assert.strictEqual(graph.directedSelfLoopCount, 1);
          assert.strictEqual(graph.undirectedSelfLoopCount, 1);

          copy.dropNode('A');

          assert.strictEqual(copy.size, 0);
          assert.strictEqual(copy.directedSelfLoopCount, 0);
          assert.strictEqual(copy.undirectedSelfLoopCount, 0);
        },

      'it should also coerce keys as strings.': function () {
        function Key(name) {
          this.name = name;
        }

        Key.prototype.toString = function () {
          return this.name;
        };

        const graph = new Graph();

        const key = new Key('test');

        graph.addNode(key);
        graph.dropNode(key);

        assert.strictEqual(graph.order, 0);
        assert.strictEqual(graph.hasNode(key), false);
      }
    },

    '#.dropDirectedEdge': {
      'it should throw if given incorrect arguments.': function () {
        assert.throws(function () {
          const graph = new Graph({multi: true});
          graph.mergeEdge('a', 'b');
          graph.dropDirectedEdge('a', 'b');
        }, usage());

        assert.throws(function () {
          const graph = new Graph({multi: true});
          graph.mergeEdgeWithKey('1', 'a', 'b');
          graph.dropDirectedEdge('1');
        }, usage());

        assert.throws(function () {
          const graph = new Graph();
          graph.dropDirectedEdge('a', 'b');
        }, notFound());
      },

      'it should correctly drop the relevant edge.': function () {
        const graph = new Graph();
        graph.mergeUndirectedEdge('a', 'b');
        graph.mergeDirectedEdge('a', 'b');
        graph.dropDirectedEdge('a', 'b');

        assert.strictEqual(graph.directedSize, 0);
        assert.strictEqual(graph.hasDirectedEdge('a', 'b'), false);
        assert.strictEqual(graph.hasUndirectedEdge('a', 'b'), true);
      }
    },

    '#.dropUndirectedEdge': {
      'it should throw if given incorrect arguments.': function () {
        assert.throws(function () {
          const graph = new Graph({multi: true, type: 'undirected'});
          graph.mergeEdge('a', 'b');
          graph.dropUndirectedEdge('a', 'b');
        }, usage());

        assert.throws(function () {
          const graph = new Graph({multi: true, type: 'undirected'});
          graph.mergeEdgeWithKey('1', 'a', 'b');
          graph.dropUndirectedEdge('1');
        }, usage());

        assert.throws(function () {
          const graph = new Graph({type: 'undirected'});
          graph.dropUndirectedEdge('a', 'b');
        }, notFound());
      },

      'it should correctly drop the relevant edge.': function () {
        const graph = new Graph();
        graph.mergeUndirectedEdge('a', 'b');
        graph.mergeDirectedEdge('a', 'b');
        graph.dropUndirectedEdge('a', 'b');

        assert.strictEqual(graph.undirectedSize, 0);
        assert.strictEqual(graph.hasUndirectedEdge('a', 'b'), false);
        assert.strictEqual(graph.hasDirectedEdge('a', 'b'), true);
      }
    },

    '#.clear': {
      'it should empty the graph.': function () {
        const graph = new Graph();

        addNodesFrom(graph, ['Lindsay', 'Martha']);
        const edge = graph.addEdge('Lindsay', 'Martha');

        graph.clear();

        assert.strictEqual(graph.order, 0);
        assert.strictEqual(graph.size, 0);
        assert.strictEqual(graph.hasNode('Lindsay'), false);
        assert.strictEqual(graph.hasNode('Martha'), false);
        assert.strictEqual(graph.hasEdge(edge), false);
      },

      'it should be possible to use the graph normally afterwards.':
        function () {
          const graph = new Graph();

          addNodesFrom(graph, ['Lindsay', 'Martha']);
          graph.addEdge('Lindsay', 'Martha');

          graph.clear();

          addNodesFrom(graph, ['Lindsay', 'Martha']);
          const edge = graph.addEdge('Lindsay', 'Martha');

          assert.strictEqual(graph.order, 2);
          assert.strictEqual(graph.size, 1);
          assert.strictEqual(graph.hasNode('Lindsay'), true);
          assert.strictEqual(graph.hasNode('Martha'), true);
          assert.strictEqual(graph.hasEdge(edge), true);
        }
    },

    '#.clearEdges': {
      'it should drop every edge from the graph.': function () {
        const graph = new Graph();

        addNodesFrom(graph, ['Lindsay', 'Martha']);
        const edge = graph.addEdge('Lindsay', 'Martha');

        graph.clearEdges();

        assert.strictEqual(graph.order, 2);
        assert.strictEqual(graph.size, 0);
        assert.strictEqual(graph.hasNode('Lindsay'), true);
        assert.strictEqual(graph.hasNode('Martha'), true);
        assert.strictEqual(graph.hasEdge(edge), false);
      },

      'it should properly reset instance counters.': function () {
        const graph = new Graph();
        graph.mergeEdge(0, 1);

        assert.strictEqual(graph.directedSize, 1);

        graph.clearEdges();

        assert.strictEqual(graph.directedSize, 0);

        graph.mergeEdge(0, 1);

        graph.clear();

        assert.strictEqual(graph.directedSize, 0);
      },

      'it should properly clear node indices, regarding self loops notably.':
        function () {
          const graph = new Graph();
          graph.mergeEdge(1, 1);

          assert.strictEqual(graph.degree(1), 2);

          graph.clearEdges();

          assert.strictEqual(graph.degree(1), 0);
        }
    }
  };
}
