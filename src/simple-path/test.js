/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert'),
    Graph = require('graphology'),
    complete = require('graphology-generators/classic/complete');

var lib = require('./');

function stringifyPath(p) {
  return p.join('§');
}

function assertSamePaths(A, B) {
  assert.deepStrictEqual(
    new Set(A.map(stringifyPath)),
    new Set(B.map(stringifyPath))
  );
}

function getSchema(multi) {
  var graph = multi ? new Graph.MultiDirectedGraph() : new Graph.DirectedGraph();

  // Nodes
  graph.addNode('Project');
  graph.addNode('Status');
  graph.addNode('Task');
  graph.addNode('Media');
  graph.addNode('Draft');
  graph.addNode('Draft_2');
  graph.addNode('Draft_3');
  graph.addNode('Comment');

  // Edges
  graph.addEdge('Project', 'Status', {label: 'status'});
  graph.addEdge('Project', 'Task', {label: 'tasks'});
  graph.addEdge('Project', 'Comment', {label: 'comments'});
  graph.addEdge('Task', 'Status', {label: 'status'});
  graph.addEdge('Task', 'Media', {label: 'media'});
  graph.addEdge('Task', 'Draft', {label: 'drafts'});
  graph.addEdge('Task', 'Task', {label: 'subTasks'});
  graph.addEdge('Task', 'Comment', {label: 'comments'});
  graph.addEdge('Draft', 'Draft_2', {label: 'draft_2'});
  graph.addEdge('Draft_2', 'Draft_3', {label: 'draft_3a'});
  graph.addEdge('Draft_2', 'Comment', {label: 'comment_short'});
  graph.addEdge('Draft_3', 'Comment', {label: 'comments'});
  graph.addEdge('Comment', 'Task', {label: 'commentTasks'});

  if (multi) {
    graph.addEdge('Task', 'Comment', {label: 'privateComments'});
    graph.addEdge('Draft_2', 'Draft_3', {label: 'draft_3b'});
  }

  return graph;
}

describe('graphology-simple-path', function() {
  describe('#.allSimplePaths', function() {
    it('should throw if given invalid arguments.', function() {
      assert.throws(function() {
        lib.allSimplePaths(null);
      }, /graphology/);

      assert.throws(function() {
        var graph = new Graph();
        lib.allSimplePaths(graph, 'test');
      }, /source/);

      assert.throws(function() {
        var graph = new Graph();
        graph.addNode('mary');
        lib.allSimplePaths(graph, 'mary', 'test');
      }, /target/);
    });

    it('should work properly.', function() {
      var graph = complete(Graph.UndirectedGraph, 4);

      var paths = lib.allSimplePaths(graph, '0', '3');

      assertSamePaths(paths, [
        ['0', '3'],
        ['0', '2', '3'],
        ['0', '2', '1', '3'],
        ['0', '1', '3'],
        ['0', '1', '2', '3']
      ]);
    });

    it('should work with an example.', function() {
      var graph = getSchema();

      var paths = lib.allSimplePaths(graph, 'Project', 'Comment');

      assertSamePaths(paths, [
        ['Project', 'Comment'],
        ['Project', 'Task', 'Comment'],
        ['Project', 'Task', 'Draft', 'Draft_2', 'Comment'],
        ['Project', 'Task', 'Draft', 'Draft_2', 'Draft_3', 'Comment']
      ]);

      var cycles = lib.allSimplePaths(graph, 'Task', 'Task');

      assertSamePaths(cycles, [
        ['Task', 'Comment', 'Task'],
        ['Task', 'Task'],
        ['Task', 'Draft', 'Draft_2', 'Comment', 'Task'],
        ['Task', 'Draft', 'Draft_2', 'Draft_3', 'Comment', 'Task']
      ]);
    });

    it('should work with a multigraph.', function() {
      var graph = new Graph.MultiDirectedGraph();

      graph.addNode(0);
      graph.addNode(1);
      graph.addNode(2);

      var i;

      for (i = 0; i < 2; i++) {
        graph.addEdge(0, 1);
        graph.addEdge(0, 2);
        graph.addEdge(1, 0);
        graph.addEdge(1, 2);
        graph.addEdge(2, 0);
        graph.addEdge(2, 1);
      }

      assert.strictEqual(graph.size, 6 * i);

      var paths = lib.allSimplePaths(graph, 0, 1);

      assertSamePaths(paths, [
        ['0', '1'],
        ['0', '2', '1']
      ]);

      graph.edges('1', '2').forEach(function(edge) {
        graph.dropEdge(edge);
      });

      paths = lib.allSimplePaths(graph, 0, 1);

      assertSamePaths(paths, [
        ['0', '1']
      ]);
    });
  });

  describe('#.allSimpleEdgePaths', function() {
    it('should throw if given invalid arguments.', function() {
      assert.throws(function() {
        lib.allSimpleEdgePaths(null);
      }, /graphology/);

      assert.throws(function() {
        var graph = new Graph();
        lib.allSimpleEdgePaths(graph, 'test');
      }, /source/);

      assert.throws(function() {
        var graph = new Graph({multi: true});
        lib.allSimpleEdgePaths(graph);
      }, /multi/);

      assert.throws(function() {
        var graph = new Graph();
        graph.addNode('mary');
        lib.allSimpleEdgePaths(graph, 'mary', 'test');
      }, /target/);
    });

    it('should work properly.', function() {
      var graph = new Graph.UndirectedGraph();

      var i, j;

      for (i = 0; i < 4; i++) {
        for (j = i + 1; j < 4; j++) {
          graph.mergeEdgeWithKey(i + '--' + j, i, j);
        }
      }

      var paths = lib.allSimpleEdgePaths(graph, '0', '3');

      assertSamePaths(paths, [
        ['0--3'],
        ['0--2', '2--3'],
        ['0--2', '1--2', '1--3'],
        ['0--1', '1--3'],
        ['0--1', '1--2', '2--3']
      ]);
    });

    it('should work with an example.', function() {
      var graph = getSchema();

      var paths = lib.allSimpleEdgePaths(graph, 'Project', 'Comment')
        .map(function(p) {
          return p.map(function(edge) {
            return [
              graph.source(edge) + '|' +
              graph.getEdgeAttribute(edge, 'label') + '|' +
              graph.target(edge)
            ];
          });
        });

      assertSamePaths(paths, [
        [['Project|comments|Comment']],
        [['Project|tasks|Task'], ['Task|comments|Comment']],
        [
          ['Project|tasks|Task'],
          ['Task|drafts|Draft'],
          ['Draft|draft_2|Draft_2'],
          ['Draft_2|comment_short|Comment']
        ],
        [
          ['Project|tasks|Task'],
          ['Task|drafts|Draft'],
          ['Draft|draft_2|Draft_2'],
          ['Draft_2|draft_3a|Draft_3'],
          ['Draft_3|comments|Comment']
        ]
      ]);

      var cycles = lib.allSimpleEdgePaths(graph, 'Task', 'Task')
        .map(function(p) {
          return p.map(function(edge) {
            return [
              graph.source(edge) + '|' +
              graph.getEdgeAttribute(edge, 'label') + '|' +
              graph.target(edge)
            ];
          });
        });

      assertSamePaths(cycles, [
        [['Task|comments|Comment'], ['Comment|commentTasks|Task']],
        [['Task|subTasks|Task']],
        [
          ['Task|drafts|Draft'],
          ['Draft|draft_2|Draft_2'],
          ['Draft_2|comment_short|Comment'],
          ['Comment|commentTasks|Task']
        ],
        [
          ['Task|drafts|Draft'],
          ['Draft|draft_2|Draft_2'],
          ['Draft_2|draft_3a|Draft_3'],
          ['Draft_3|comments|Comment'],
          ['Comment|commentTasks|Task']
        ]
      ]);
    });
  });

  describe('#.allSimpleEdgeGroupPaths', function() {
    it('should throw if given invalid arguments.', function() {
      assert.throws(function() {
        lib.allSimpleEdgeGroupPaths(null);
      }, /graphology/);

      assert.throws(function() {
        var graph = new Graph({multi: true});
        lib.allSimpleEdgeGroupPaths(graph, 'test');
      }, /source/);

      assert.throws(function() {
        var graph = new Graph({multi: true});
        graph.addNode('mary');
        lib.allSimpleEdgeGroupPaths(graph, 'mary', 'test');
      }, /target/);
    });

    it('should work with an example.', function() {
      var graph = getSchema(true);

      var paths = lib.allSimpleEdgeGroupPaths(graph, 'Project', 'Comment')
        .map(function(p) {
          return p.map(function(edges) {
            var source = graph.source(edges[0]);
            var target = graph.target(edges[0]);

            var labels = edges.map(function(edge) {
              return graph.getEdgeAttribute(edge, 'label');
            });

            return source + '(' + labels.join(',') + ')' + target;
          });
        });

      assertSamePaths(paths, [
        ['Project(comments)Comment'],
        ['Project(tasks)Task', 'Task(comments,privateComments)Comment'],
        [
          'Project(tasks)Task',
          'Task(drafts)Draft',
          'Draft(draft_2)Draft_2',
          'Draft_2(comment_short)Comment'
        ],
        [
          'Project(tasks)Task',
          'Task(drafts)Draft',
          'Draft(draft_2)Draft_2',
          'Draft_2(draft_3a,draft_3b)Draft_3',
          'Draft_3(comments)Comment'
        ]
      ]);

      var cycles = lib.allSimpleEdgeGroupPaths(graph, 'Task', 'Task')
        .map(function(p) {
          return p.map(function(edges) {
            var source = graph.source(edges[0]);
            var target = graph.target(edges[0]);

            var labels = edges.map(function(edge) {
              return graph.getEdgeAttribute(edge, 'label');
            });

            return source + '(' + labels.join(',') + ')' + target;
          });
        });

      assertSamePaths(cycles, [
        [
          'Task(comments,privateComments)Comment',
          'Comment(commentTasks)Task'
        ],
        ['Task(subTasks)Task'],
        [
          'Task(drafts)Draft',
          'Draft(draft_2)Draft_2',
          'Draft_2(comment_short)Comment',
          'Comment(commentTasks)Task'
        ],
        [
          'Task(drafts)Draft',
          'Draft(draft_2)Draft_2',
          'Draft_2(draft_3a,draft_3b)Draft_3',
          'Draft_3(comments)Comment',
          'Comment(commentTasks)Task'
        ]
      ]);
    });

    it('should work with a simple graph.', function() {
      var graph = getSchema();

      var paths = lib.allSimpleEdgeGroupPaths(graph, 'Project', 'Comment')
        .map(function(p) {
          return p.map(function(edges) {
            var source = graph.source(edges[0]);
            var target = graph.target(edges[0]);

            var labels = edges.map(function(edge) {
              return graph.getEdgeAttribute(edge, 'label');
            });

            return source + '(' + labels.join(',') + ')' + target;
          });
        });

      assertSamePaths(paths, [
        ['Project(comments)Comment'],
        ['Project(tasks)Task', 'Task(comments)Comment'],
        [
          'Project(tasks)Task',
          'Task(drafts)Draft',
          'Draft(draft_2)Draft_2',
          'Draft_2(comment_short)Comment'
        ],
        [
          'Project(tasks)Task',
          'Task(drafts)Draft',
          'Draft(draft_2)Draft_2',
          'Draft_2(draft_3a)Draft_3',
          'Draft_3(comments)Comment'
        ]
      ]);
    });
  });
});
