/**
 * Graphology Properties Specs
 * ============================
 *
 * Testing the properties of the graph.
 */
import assert from 'assert';

const PROPERTIES = [
  'order',
  'size',
  'directedSize',
  'undirectedSize',
  'type',
  'multi',
  'allowSelfLoops',
  'implementation',
  'selfLoopCount',
  'directedSelfLoopCount',
  'undirectedSelfLoopCount'
];

export default function properties(Graph) {
  return {
    /**
     * Regarding all properties.
     */
    misc: {
      'all expected properties should be set.': function () {
        const graph = new Graph();

        PROPERTIES.forEach(property => {
          assert(property in graph, property);
        });
      },

      'properties should be read-only.': function () {
        const graph = new Graph();

        // Attempting to mutate the properties
        PROPERTIES.forEach(property => {
          assert.throws(function () {
            graph[property] = 'test';
          }, TypeError);
        });
      }
    },

    /**
     * Order.
     */
    '#.order': {
      'it should be 0 if the graph is empty.': function () {
        const graph = new Graph();
        assert.strictEqual(graph.order, 0);
      },

      'adding nodes should increase order.': function () {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Jack');
        assert.strictEqual(graph.order, 2);
      }
    },

    /**
     * Size.
     */
    '#.size': {
      'it should be 0 if the graph is empty.': function () {
        const graph = new Graph();
        assert.strictEqual(graph.size, 0);
      },

      'adding & dropping edges should affect size.': function () {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Jack');
        graph.addDirectedEdge('John', 'Jack');
        assert.strictEqual(graph.size, 1);

        graph.dropEdge('John', 'Jack');
        assert.strictEqual(graph.size, 0);
      }
    },

    /**
     * Directed Size.
     */
    '#.directedSize': {
      'it should be 0 if the graph is empty.': function () {
        const graph = new Graph();
        assert.strictEqual(graph.directedSize, 0);
      },

      'adding & dropping edges should affect directed size.': function () {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Jack');

        const directedEdge = graph.addDirectedEdge('John', 'Jack');
        assert.strictEqual(graph.directedSize, 1);

        const undirectedEdge = graph.addUndirectedEdge('John', 'Jack');
        assert.strictEqual(graph.directedSize, 1);

        graph.dropEdge(directedEdge);
        assert.strictEqual(graph.directedSize, 0);

        graph.dropEdge(undirectedEdge);
        assert.strictEqual(graph.directedSize, 0);
      }
    },

    /**
     * Undirected Size.
     */
    '#.undirectedSize': {
      'it should be 0 if the graph is empty.': function () {
        const graph = new Graph();
        assert.strictEqual(graph.undirectedSize, 0);
      },

      'adding & dropping edges should affect undirected size.': function () {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Jack');

        const directedEdge = graph.addDirectedEdge('John', 'Jack');
        assert.strictEqual(graph.undirectedSize, 0);

        const undirectedEdge = graph.addUndirectedEdge('John', 'Jack');
        assert.strictEqual(graph.undirectedSize, 1);

        graph.dropEdge(directedEdge);
        assert.strictEqual(graph.undirectedSize, 1);

        graph.dropEdge(undirectedEdge);
        assert.strictEqual(graph.undirectedSize, 0);
      }
    },

    /**
     * Multi.
     */
    '#.multi': {
      'it should be false by default.': function () {
        const graph = new Graph();
        assert.strictEqual(graph.multi, false);
      }
    },

    /**
     * Type.
     */
    '#.type': {
      'it should be "mixed" by default.': function () {
        const graph = new Graph();
        assert.strictEqual(graph.type, 'mixed');
      }
    },

    /**
     * Self loops.
     */
    '#.allowSelfLoops': {
      'it should be true by default.': function () {
        const graph = new Graph();
        assert.strictEqual(graph.allowSelfLoops, true);
      }
    },

    /**
     * Implementation.
     */
    '#.implementation': {
      'it should exist and be a string.': function () {
        const graph = new Graph();
        assert.strictEqual(typeof graph.implementation, 'string');
      }
    },

    /**
     * Self Loop Count.
     */
    '#.selfLoopCount': {
      'it should exist and be correct.': function () {
        const graph = new Graph();

        graph.mergeDirectedEdge('John', 'John');
        graph.mergeDirectedEdge('Lucy', 'Lucy');
        graph.mergeUndirectedEdge('Joana', 'Joana');

        assert.strictEqual(graph.selfLoopCount, 3);
        assert.strictEqual(graph.directedSelfLoopCount, 2);
        assert.strictEqual(graph.undirectedSelfLoopCount, 1);

        graph.forEachEdge(edge => graph.dropEdge(edge));

        assert.strictEqual(graph.selfLoopCount, 0);
        assert.strictEqual(graph.directedSelfLoopCount, 0);
        assert.strictEqual(graph.undirectedSelfLoopCount, 0);
      }
    }
  };
}
