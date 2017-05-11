/**
 * Graphology Read Specs
 * ======================
 *
 * Testing the read methods of the graph.
 */
import assert from 'assert';

export default function read(Graph, checkers) {
  const {
    invalid,
    notFound,
    usage
  } = checkers;

  return {
    '#.hasNode': {

      'it should correctly return whether the given node is found in the graph.': function() {
        const graph = new Graph();

        assert.strictEqual(graph.hasNode('John'), false);

        graph.addNode('John');

        assert.strictEqual(graph.hasNode('John'), true);
      }
    },

    '#.hasDirectedEdge': {

      'it should throw if invalid arguments are provided.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.hasDirectedEdge(1, 2, 3);
        }, invalid());
      },

      'it should correctly return whether a matching edge exists in the graph.': function() {
        const graph = new Graph();
        graph.addNode('Martha');
        graph.addNode('Catherine');
        graph.addNode('John');
        graph.addDirectedEdgeWithKey('M->C', 'Martha', 'Catherine');
        graph.addUndirectedEdgeWithKey('C<->J', 'Catherine', 'John');

        assert.strictEqual(graph.hasDirectedEdge('M->C'), true);
        assert.strictEqual(graph.hasDirectedEdge('C<->J'), false);
        assert.strictEqual(graph.hasDirectedEdge('test'), false);
        assert.strictEqual(graph.hasDirectedEdge('Martha', 'Catherine'), true);
        assert.strictEqual(graph.hasDirectedEdge('Martha', 'Thomas'), false);
        assert.strictEqual(graph.hasDirectedEdge('Catherine', 'John'), false);
        assert.strictEqual(graph.hasDirectedEdge('John', 'Catherine'), false);
      }
    },

    '#.hasUndirectedEdge': {

      'it should throw if invalid arguments are provided.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.hasUndirectedEdge(1, 2, 3);
        }, invalid());
      },

      'it should correctly return whether a matching edge exists in the graph.': function() {
        const graph = new Graph();
        graph.addNode('Martha');
        graph.addNode('Catherine');
        graph.addNode('John');
        graph.addDirectedEdgeWithKey('M->C', 'Martha', 'Catherine');
        graph.addUndirectedEdgeWithKey('C<->J', 'Catherine', 'John');

        assert.strictEqual(graph.hasUndirectedEdge('M->C'), false);
        assert.strictEqual(graph.hasUndirectedEdge('C<->J'), true);
        assert.strictEqual(graph.hasUndirectedEdge('test'), false);
        assert.strictEqual(graph.hasUndirectedEdge('Martha', 'Catherine'), false);
        assert.strictEqual(graph.hasUndirectedEdge('Martha', 'Thomas'), false);
        assert.strictEqual(graph.hasUndirectedEdge('Catherine', 'John'), true);
        assert.strictEqual(graph.hasUndirectedEdge('John', 'Catherine'), true);
      }
    },

    '#.hasEdge': {

      'it should throw if invalid arguments are provided.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.hasEdge(1, 2, 3);
        }, invalid());
      },

      'it should correctly return whether a matching edge exists in the graph.': function() {
        const graph = new Graph();
        graph.addNode('Martha');
        graph.addNode('Catherine');
        graph.addNode('John');
        graph.addDirectedEdgeWithKey('M->C', 'Martha', 'Catherine');
        graph.addUndirectedEdgeWithKey('C<->J', 'Catherine', 'John');

        assert.strictEqual(graph.hasEdge('M->C'), true);
        assert.strictEqual(graph.hasEdge('C<->J'), true);
        assert.strictEqual(graph.hasEdge('test'), false);
        assert.strictEqual(graph.hasEdge('Martha', 'Catherine'), true);
        assert.strictEqual(graph.hasEdge('Martha', 'Thomas'), false);
        assert.strictEqual(graph.hasEdge('Catherine', 'John'), true);
        assert.strictEqual(graph.hasEdge('John', 'Catherine'), true);
      },

      'it should work properly with typed graphs.': function() {
        const directedGraph = new Graph({type: 'directed'}),
              undirectedGraph = new Graph({type: 'undirected'});

        directedGraph.addNodesFrom([1, 2]);
        undirectedGraph.addNodesFrom([1, 2]);

        assert.strictEqual(directedGraph.hasEdge(1, 2), false);
        assert.strictEqual(undirectedGraph.hasEdge(1, 2), false);
      }
    },

    '#.directedEdge': {

      'it should throw if invalid arguments are provided.': function() {
        const graph = new Graph(),
              multiGraph = new Graph({multi: true});

        graph.addNode('John');

        assert.throws(function() {
          multiGraph.directedEdge(1, 2);
        }, usage());

        assert.throws(function() {
          graph.directedEdge('Jack', 'John');
        }, notFound());

        assert.throws(function() {
          graph.directedEdge('John', 'Jack');
        }, notFound());
      },

      'it should return the correct edge.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['Jack', 'Lucy']);
        graph.addDirectedEdgeWithKey('J->L', 'Jack', 'Lucy');
        graph.addUndirectedEdgeWithKey('J<->L', 'Jack', 'Lucy');

        assert.strictEqual(graph.directedEdge('Lucy', 'Jack'), undefined);
        assert.strictEqual(graph.directedEdge('Jack', 'Lucy'), 'J->L');

        const undirectedGraph = new Graph({type: 'undirected'});
        undirectedGraph.mergeEdge('Jack', 'Lucy');
        assert.strictEqual(undirectedGraph.directedEdge('Jack', 'Lucy'), undefined);
      }
    },

    '#.undirectedEdge': {

      'it should throw if invalid arguments are provided.': function() {
        const graph = new Graph(),
              multiGraph = new Graph({multi: true});

        graph.addNode('John');

        assert.throws(function() {
          multiGraph.undirectedEdge(1, 2);
        }, usage());

        assert.throws(function() {
          graph.undirectedEdge('Jack', 'John');
        }, notFound());

        assert.throws(function() {
          graph.undirectedEdge('John', 'Jack');
        }, notFound());
      },

      'it should return the correct edge.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['Jack', 'Lucy']);
        graph.addDirectedEdgeWithKey('J->L', 'Jack', 'Lucy');
        graph.addUndirectedEdgeWithKey('J<->L', 'Jack', 'Lucy');

        assert.strictEqual(graph.undirectedEdge('Lucy', 'Jack'), 'J<->L');
        assert.strictEqual(graph.undirectedEdge('Jack', 'Lucy'), 'J<->L');

        const directedGraph = new Graph({type: 'directed'});
        directedGraph.mergeEdge('Jack', 'Lucy');
        assert.strictEqual(directedGraph.undirectedEdge('Jack', 'Lucy'), undefined);
      }
    },

    '#.edge': {

      'it should throw if invalid arguments are provided.': function() {
        const graph = new Graph(),
              multiGraph = new Graph({multi: true});

        graph.addNode('John');

        assert.throws(function() {
          multiGraph.edge(1, 2);
        }, usage());

        assert.throws(function() {
          graph.edge('Jack', 'John');
        }, notFound());

        assert.throws(function() {
          graph.edge('John', 'Jack');
        }, notFound());
      },

      'it should return the correct edge.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['Jack', 'Lucy']);
        graph.addDirectedEdgeWithKey('J->L', 'Jack', 'Lucy');
        graph.addUndirectedEdgeWithKey('J<->L', 'Jack', 'Lucy');

        assert.strictEqual(graph.edge('Lucy', 'Jack'), 'J<->L');
        assert.strictEqual(graph.edge('Jack', 'Lucy'), 'J->L');
      }
    },

    '#.source': {

      'it should throw if the edge is not in the graph.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.source('test');
        }, notFound());
      },

      'it should return the correct source.': function() {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Martha');

        const edge = graph.addDirectedEdge('John', 'Martha');

        assert.strictEqual(graph.source(edge), 'John');
      }
    },

    '#.target': {

      'it should throw if the edge is not in the graph.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.target('test');
        }, notFound());
      },

      'it should return the correct target.': function() {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Martha');

        const edge = graph.addDirectedEdge('John', 'Martha');

        assert.strictEqual(graph.target(edge), 'Martha');
      }
    },

    '#.extremities': {

      'it should throw if the edge is not in the graph.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.extremities('test');
        }, notFound());
      },

      'it should return the correct extremities.': function() {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Martha');

        const edge = graph.addDirectedEdge('John', 'Martha');

        assert.deepEqual(graph.extremities(edge), ['John', 'Martha']);
      }
    },

    '#.opposite': {

      'it should throw if either the node or the edge is not found in the graph.': function() {
        const graph = new Graph();
        graph.addNode('Thomas');

        assert.throws(function() {
          graph.opposite('Jeremy', 'T->J');
        }, notFound());

        assert.throws(function() {
          graph.opposite('Thomas', 'T->J');
        }, notFound());
      },

      'it should throw if the node & the edge are not related.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['Thomas', 'Isabella', 'Estelle']);
        graph.addEdgeWithKey('I->E', 'Isabella', 'Estelle');

        assert.throws(function() {
          graph.opposite('Thomas', 'I->E');
        }, notFound());
      },

      'it should return the correct node.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['Thomas', 'Estelle']);
        const edge = graph.addEdge('Thomas', 'Estelle');

        assert.strictEqual(
          graph.opposite('Thomas', edge),
          'Estelle'
        );
      }
    },

    '#.directed': {

      'it should throw if the edge is not in the graph.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.directed('test');
        }, notFound());
      },

      'it should correctly return whether the edge is directed or not.': function() {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Rachel');
        graph.addNode('Suzan');

        const directedEdge = graph.addDirectedEdge('John', 'Rachel'),
              undirectedEdge = graph.addUndirectedEdge('Rachel', 'Suzan');

        assert.strictEqual(graph.directed(directedEdge), true);
        assert.strictEqual(graph.directed(undirectedEdge), false);
      }
    },

    '#.undirected': {

      'it should throw if the edge is not in the graph.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.undirected('test');
        }, notFound());
      },

      'it should correctly return whether the edge is undirected or not.': function() {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Rachel');
        graph.addNode('Suzan');

        const directedEdge = graph.addDirectedEdge('John', 'Rachel'),
              undirectedEdge = graph.addUndirectedEdge('Rachel', 'Suzan');

        assert.strictEqual(graph.undirected(directedEdge), false);
        assert.strictEqual(graph.undirected(undirectedEdge), true);
      },
    },

    '#.selfLoop': {
      'it should throw if the edge is not in the graph.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.selfLoop('test');
        }, notFound());
      },

      'it should correctly return whether the edge is a self-loop or not.': function() {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Rachel');

        const selfLoop = graph.addDirectedEdge('John', 'John'),
              edge = graph.addUndirectedEdge('John', 'Rachel');

        assert.strictEqual(graph.selfLoop(selfLoop), true);
        assert.strictEqual(graph.selfLoop(edge), false);
      },
    },

    'Degree': {
      '#.inDegree': {

        'it should throw if the second argument is not boolean.': function() {
          const graph = new Graph();
          graph.addNode('Rahn');

          assert.throws(function() {
            graph.inDegree('Rahn', 'test');
          }, invalid());
        },

        'it should throw if the node is not found in the graph.': function() {
          const graph = new Graph();

          assert.throws(function() {
            graph.inDegree('Test');
          }, notFound());
        },

        'it should return the correct in degree.': function() {
          const graph = new Graph();
          graph.addNodesFrom(['Helen', 'Sue', 'William', 'John']);
          graph.addDirectedEdge('Helen', 'Sue');
          graph.addDirectedEdge('William', 'Sue');

          assert.strictEqual(graph.inDegree('Sue'), 2);

          graph.addDirectedEdge('Sue', 'Sue');

          assert.strictEqual(graph.inDegree('Sue'), 3);
          assert.strictEqual(graph.inDegree('Sue', false), 2);
        },

        'it should always return 0 in an undirected graph.': function() {
          const graph = new Graph({type: 'undirected'});
          graph.addNodesFrom(['Helen', 'Sue']);
          graph.addEdge('Helen', 'Sue');

          assert.strictEqual(graph.inDegree('Helen'), 0);
        }
      },

      '#.outDegree': {
        'it should throw if the second argument is not boolean.': function() {
          const graph = new Graph();
          graph.addNode('Rahn');

          assert.throws(function() {
            graph.outDegree('Rahn', 'test');
          }, invalid());
        },

        'it should throw if the node is not found in the graph.': function() {
          const graph = new Graph();

          assert.throws(function() {
            graph.outDegree('Test');
          }, notFound());
        },

        'it should return the correct out degree.': function() {
          const graph = new Graph();
          graph.addNodesFrom(['Helen', 'Sue', 'William', 'John']);
          graph.addDirectedEdge('Helen', 'Sue');
          graph.addDirectedEdge('Helen', 'William');

          assert.strictEqual(graph.outDegree('Helen'), 2);

          graph.addDirectedEdge('Helen', 'Helen');

          assert.strictEqual(graph.outDegree('Helen'), 3);
          assert.strictEqual(graph.outDegree('Helen', false), 2);
        },

        'it should always return 0 in an undirected graph.': function() {
          const graph = new Graph({type: 'undirected'});
          graph.addNodesFrom(['Helen', 'Sue']);
          graph.addEdge('Helen', 'Sue');

          assert.strictEqual(graph.outDegree('Sue'), 0);
        }
      },

      '#.directedDegree': {
        'it should throw if the second argument is not boolean.': function() {
          const graph = new Graph();
          graph.addNode('Rahn');

          assert.throws(function() {
            graph.directedDegree('Rahn', 'test');
          }, invalid());
        },

        'it should throw if the node is not found in the graph.': function() {
          const graph = new Graph();

          assert.throws(function() {
            graph.directedDegree('Test');
          }, notFound());
        },

        'it should return the correct directed degree.': function() {
          const graph = new Graph();
          graph.addNodesFrom(['Helen', 'Sue', 'William', 'John', 'Martha']);
          graph.addDirectedEdge('Helen', 'Sue');
          graph.addDirectedEdge('Helen', 'William');
          graph.addDirectedEdge('Martha', 'Helen');
          graph.addUndirectedEdge('Helen', 'John');

          assert.strictEqual(graph.directedDegree('Helen'), 3);
          assert.strictEqual(
            graph.directedDegree('Helen'),
            graph.inDegree('Helen') + graph.outDegree('Helen')
          );

          graph.addDirectedEdge('Helen', 'Helen');

          assert.strictEqual(graph.directedDegree('Helen'), 5);
          assert.strictEqual(graph.directedDegree('Helen', false), 3);
        },

        'it should always return 0 in an undirected graph.': function() {
          const graph = new Graph({type: 'undirected'});
          graph.addNodesFrom(['Helen', 'Sue']);
          graph.addEdge('Helen', 'Sue');

          assert.strictEqual(graph.inDegree('Helen'), 0);
        }
      },

      '#.undirectedDegree': {
        'it should throw if the second argument is not boolean.': function() {
          const graph = new Graph();
          graph.addNode('Rahn');

          assert.throws(function() {
            graph.undirectedDegree('Rahn', 'test');
          }, invalid());
        },

        'it should throw if the node is not found in the graph.': function() {
          const graph = new Graph();

          assert.throws(function() {
            graph.undirectedDegree('Test');
          }, notFound());
        },

        'it should return the correct undirected degree.': function() {
          const graph = new Graph();
          graph.addNodesFrom(['Helen', 'Sue', 'William', 'John']);
          graph.addDirectedEdge('Helen', 'Sue');
          graph.addDirectedEdge('Helen', 'William');
          graph.addUndirectedEdge('Helen', 'John');

          assert.strictEqual(graph.undirectedDegree('Helen'), 1);

          graph.addUndirectedEdge('Helen', 'Helen');

          assert.strictEqual(graph.undirectedDegree('Helen'), 3);
          assert.strictEqual(graph.undirectedDegree('Helen', false), 1);
        },

        'it should always return 0 in a directed graph.': function() {
          const graph = new Graph({type: 'directed'});
          graph.addNodesFrom(['Helen', 'Sue']);
          graph.addEdge('Helen', 'Sue');

          assert.strictEqual(graph.undirectedDegree('Helen'), 0);
        }
      },

      '#.degree': {
        'it should throw if the second argument is not boolean.': function() {
          const graph = new Graph();
          graph.addNode('Rahn');

          assert.throws(function() {
            graph.degree('Rahn', 'test');
          }, invalid());
        },

        'it should throw if the node is not found in the graph.': function() {
          const graph = new Graph();

          assert.throws(function() {
            graph.degree('Test');
          }, notFound());
        },

        'it should return the correct degree.': function() {
          const graph = new Graph();
          graph.addNodesFrom(['Helen', 'Sue', 'William', 'John', 'Martha']);
          graph.addDirectedEdge('Helen', 'Sue');
          graph.addDirectedEdge('Helen', 'William');
          graph.addDirectedEdge('Martha', 'Helen');
          graph.addUndirectedEdge('Helen', 'John');

          assert.strictEqual(graph.degree('Helen'), 4);
          assert.strictEqual(
            graph.degree('Helen'),
            graph.directedDegree('Helen') + graph.undirectedDegree('Helen')
          );

          graph.addUndirectedEdge('Helen', 'Helen');

          assert.strictEqual(graph.degree('Helen'), 6);
          assert.strictEqual(graph.degree('Helen', false), 4);
        }
      },

      'it should also work with typed graphs.': function() {
        const directedGraph = new Graph({type: 'directed'}),
              undirectedGraph = new Graph({type: 'undirected'});

        directedGraph.addNodesFrom([1, 2]);
        undirectedGraph.addNodesFrom([1, 2]);

        assert.strictEqual(directedGraph.degree(1), 0);
        assert.strictEqual(undirectedGraph.degree(1), 0);

        directedGraph.addDirectedEdge(1, 2);
        undirectedGraph.addUndirectedEdge(1, 2);

        assert.strictEqual(directedGraph.degree(1), 1);
        assert.strictEqual(undirectedGraph.degree(1), 1);
      }
    }
  };
}
