/**
 * Graphology Degree Unit Tests
 * ==============================
 */
var assert = require('chai').assert,
    Graph = require('graphology'),
    degree = require('../degree.js');

var inDegree = degree.inDegree;
var outDegree = degree.outDegree;
var undirectedDegree = degree.undirectedDegree;
var directedDegree = degree.directedDegree;
var allDegree = degree.allDegree;

function createGraph(type) {
  var graph = new Graph({type: type});

  graph.addNode('1');
  graph.addNode('2');
  graph.addNode('3');

  if (type === 'directed') {
    graph.addDirectedEdge(1, 2);
    graph.addDirectedEdge(2, 3);
    graph.addDirectedEdge(3, 2);
    graph.addDirectedEdge(3, 1);
  }
  else {
    graph.addUndirectedEdge(1, 2);
    graph.addUndirectedEdge(2, 3);
    graph.addUndirectedEdge(3, 1);
  }

  return graph;
}
describe('Degrees', function() {
  describe('degree', function() {
    it('should throw if given wrong arguments.', function() {
      assert.throws(function() {
        degree({});
      }, /instance/);
    });
    it('should calculate all degrees in a directed graph.', function() {
      assert.deepEqual(
        degree(createGraph('directed')),
        {1: 2, 2: 3, 3: 3}
      );
    });
    it('should calculate all degrees in an undirected graph.', function() {
      assert.deepEqual(
        degree(createGraph('undirected')),
        {1: 2, 2: 2, 3: 2}
      );
    });
    it('should calculate all degrees in an multi mixed graph.', function() {
      var graph = new Graph({multi: true, allowSelfLoops: true});

      graph.addNode(1);
      graph.addNode(2);
      graph.addNode(3);

      graph.addUndirectedEdge(1, 2);
      graph.addUndirectedEdge(2, 3);
      graph.addUndirectedEdge(3, 1);
      graph.addDirectedEdge(1, 3);
      graph.addDirectedEdge(1, 2);

      assert.deepEqual(
        degree(graph),
        {1: 4, 2: 3, 3: 3}
      );

      graph.addDirectedEdge(1, 3);
      graph.addDirectedEdge(2, 2);

      assert.deepEqual(
        degree(graph),
        {1: 5, 2: 5, 3: 4}
      );
    });
    it('should assign all degrees to their nodes', function() {
      var graph = createGraph('directed');
      degree.assign(graph);
      assert.equal(
        graph.getNodeAttribute('1', 'degree'),
        2
      );
    });
    it('should assign all degrees to their nodes with custom name', function() {
      var graph = createGraph('directed');
      degree.assign(graph, {
        attributes: {
          degree: 'caracole'
        }
      });
      assert.equal(
        graph.getNodeAttribute('1', 'caracole'),
        2
      );
    });
  });
  describe('inDegree', function() {
    it('should throw if given wrong arguments.', function() {
      assert.throws(function() {
        inDegree({});
      }, /instance/);
    });
    it('should thow an error if given Graph is undirected', function() {
      assert.throws(function() {
        inDegree(createGraph('undirected'));
      }, /undirected/);
    });
    it('should calculate all inDegrees', function() {
      assert.deepEqual(
        inDegree(createGraph('directed')),
        {1: 1, 2: 2, 3: 1}
      );
    });
    it('should assign to graph', function() {
      var graph = createGraph('directed');
      inDegree.assign(graph);
      assert.equal(
        graph.getNodeAttribute(1, 'inDegree'),
        1
      );
    });
    it('should assign all degrees to their nodes with custom name', function() {
      var graph = createGraph('directed');
      inDegree.assign(graph, {
        attributes: {
          inDegree: 'caracole'
        }
      });
      assert.equal(
        graph.getNodeAttribute(1, 'caracole'),
        1
      );
    });
  });
  describe('outDegree', function() {
    it('should throw if given wrong arguments.', function() {
      assert.throws(function() {
        outDegree({});
      }, /instance/);
    });
    it('should thow an error if given Graph is undirected', function() {
      assert.throws(function() {
        outDegree(createGraph('undirected'));
      }, /undirected/);
    });
    it('should calculate all outDegrees', function() {
      assert.deepEqual(
        outDegree(createGraph('directed')),
        {1: 1, 2: 1, 3: 2}
      );
    });
    it('should assign to graph', function() {
      var graph = createGraph('directed');
      outDegree.assign(graph);
      assert.equal(
        graph.getNodeAttribute(1, 'outDegree'),
        1
      );
    });
    it('should assign all degrees to their nodes with custom name', function() {
      var graph = createGraph('directed');
      outDegree.assign(graph, {
        attributes: {
          outDegree: 'caracole'
        }
      });
      assert.equal(
        graph.getNodeAttribute(1, 'caracole'),
        1
      );
    });
  });
  describe('undirectedDegree', function() {
    it('should throw if given wrong arguments.', function() {
      assert.throws(function() {
        undirectedDegree({});
      }, /instance/);
    });
    it('should thow an error if given Graph is directed', function() {
      assert.throws(function() {
        undirectedDegree(new Graph({type: 'directed'}));
      }, /directed/);
    });
    it('should calculate all undirected degrees', function() {
      assert.deepEqual(
        undirectedDegree(createGraph('undirected')),
        {1: 2, 2: 2, 3: 2}
      );
    });
    it('should assign to graph', function() {
      var graph = createGraph('undirected');
      undirectedDegree.assign(graph);
      assert.equal(
        graph.getNodeAttribute(1, 'undirectedDegree'),
        2
      );
    });
    it('should assign all degrees to their nodes with custom name', function() {
      var graph = createGraph('undirected');
      undirectedDegree.assign(graph, {
        attributes: {
          undirectedDegree: 'caracole'
        }
      });
      assert.equal(
        graph.getNodeAttribute(1, 'caracole'),
        2
      );
    });
  });
  describe('directedDegree', function() {
    it('should throw if given wrong arguments.', function() {
      assert.throws(function() {
        directedDegree(null);
      }, /instance/);
    });
    it('should thow an error if given Graph is undirected', function() {
      assert.throws(function() {
        directedDegree(new Graph({type: 'undirected'}));
      }, /undirected/);
    });
    it('should calculate all directed degrees', function() {
      assert.deepEqual(
        directedDegree(createGraph('directed')),
        {1: 2, 2: 3, 3: 3}
      );
    });
    it('should assign to graph', function() {
      var graph = createGraph('directed');
      directedDegree.assign(graph);
      assert.equal(
        graph.getNodeAttribute(1, 'directedDegree'),
        2
      );
    });
    it('should assign all degrees to their nodes with custom name', function() {
      var graph = createGraph('directed');
      directedDegree.assign(graph, {
        attributes: {
          directedDegree: 'caracole'
        }
      });
      assert.equal(
        graph.getNodeAttribute(1, 'caracole'),
        2
      );
    });
  });
  describe('allDegree', function() {
    it('should throw if given wrong arguments.', function() {
      assert.throws(function() {
        allDegree({});
      }, /instance/);
    });
    it('should calculate all degrees parameters on a directed graph', function() {
      assert.deepEqual(
        allDegree(createGraph('directed')),
        {
          1: {
            inDegree: 1,
            outDegree: 1
          },
          2: {
            inDegree: 2,
            outDegree: 1
          },
          3: {
            inDegree: 1,
            outDegree: 2
          }
        }
      );
    });
    it('should calculate all degrees parameters on an undirected graph', function() {
      assert.deepEqual(
        allDegree(createGraph('undirected')),
        {
          1: {
            undirectedDegree: 2
          },
          2: {
            undirectedDegree: 2
          },
          3: {
            undirectedDegree: 2
          }
        }
      );
    });
    it('should calculate all degrees parameters on a mixed multi graph', function() {
      var graph = new Graph({multi: true, allowSelfLoops: true});

      graph.addNode(1);
      graph.addNode(2);
      graph.addNode(3);

      graph.addUndirectedEdge(1, 2);
      graph.addUndirectedEdge(2, 3);
      graph.addUndirectedEdge(3, 1);

      graph.addDirectedEdge(1, 3);
      graph.addDirectedEdge(1, 2);

      assert.deepEqual(
        allDegree(graph),
        {
          1: {
            inDegree: 0,
            outDegree: 2,
            undirectedDegree: 2
          },
          2: {
            inDegree: 1,
            outDegree: 0,
            undirectedDegree: 2
          },
          3: {
            inDegree: 1,
            outDegree: 0,
            undirectedDegree: 2
          }
        }
      );

      graph.addDirectedEdge(1, 3);
      graph.addDirectedEdge(3, 3);

      assert.deepEqual(
        allDegree(graph),
        {
          1: {
            inDegree: 0,
            outDegree: 3,
            undirectedDegree: 2
          },
          2: {
            inDegree: 1,
            outDegree: 0,
            undirectedDegree: 2
          },
          3: {
            inDegree: 3,
            outDegree: 1,
            undirectedDegree: 2
          }
        }
      );
    });
    it('should be possible to customize attributes indexes', function() {
      assert.deepEqual(
        allDegree(
          createGraph('directed'),
          {
            attributes: {
              inDegree: 'in',
              outDegree: 'out'
            },
          }
        ),
        {
          1: {
            in: 1,
            out: 1
          },
          2: {
            in: 2,
            out: 1
          },
          3: {
            in: 1,
            out: 2
          }
        }
      );
    });
    it('should be possible to customize attributes indexes and select wanted types', function() {
      assert.deepEqual(
        allDegree(
          createGraph('directed'),
          {
            attributes: {
              inDegree: 'in',
              outDegree: 'out'
            },
            types: ['inDegree']
          }
        ),
        {
          1: {
            in: 1,
          },
          2: {
            in: 2,
          },
          3: {
            in: 1,
          }
        }
      );
    });
    it('should assign', function() {
      var graph = createGraph('directed');
      allDegree.assign(graph);
      assert.equal(
        graph.getNodeAttribute(1, 'inDegree'),
        1
      );
      assert.equal(
        graph.getNodeAttribute(2, 'inDegree'),
        2
      );
      assert.equal(
        graph.getNodeAttribute(3, 'inDegree'),
        1
      );
    });
    it('should assign with customized names', function() {
      var graph = createGraph('directed');
      allDegree.assign(graph, {
        attributes: {
          inDegree: 'in'
        }
      });
      assert.equal(
        graph.getNodeAttribute(1, 'in'),
        1
      );
      assert.equal(
        graph.getNodeAttribute(2, 'in'),
        2
      );
      assert.equal(
        graph.getNodeAttribute(3, 'in'),
        1
      );
    });
  });
});
