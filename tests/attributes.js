/**
 * Graphology Attributes Specs
 * ============================
 *
 * Testing the attributes-related methods of the graph.
 */
import assert from 'assert';
import {deepMerge} from './helpers';

const METHODS = [
  'getNodeAttribute',
  'getNodeAttributes',
  'hasNodeAttribute',
  'getEdgeAttribute',
  'getEdgeAttributes',
  'hasEdgeAttribute',
  'setNodeAttribute',
  'setEdgeAttribute',
  'updateNodeAttribute',
  'updateEdgeAttribute',
  'removeNodeAttribute',
  'removeEdgeAttribute',
  'replaceNodeAttributes',
  'replaceEdgeAttributes',
  'mergeNodeAttributes',
  'mergeEdgeAttributes'
];

export default function attributes(Graph, checkers) {
  const {
    invalid,
    notFound
  } = checkers;

  function commonTests(method) {
    return {
      ['#.' + method]: {
        'it should throw if the given path is not found.': function() {
          if (!~method.indexOf('Edge'))
            return;

          const graph = new Graph();

          assert.throws(function() {
            graph[method]('source', 'target', 'name', 'value');
          }, notFound());
        },

        'it should throw if the element is not found in the graph.': function() {
          const graph = new Graph();

          assert.throws(function() {
            graph[method]('Test');
          }, notFound());
        }
      }
    };
  }

  const tests = {};

  METHODS.forEach(method => deepMerge(tests, commonTests(method)));

  return deepMerge(tests, {
    '#.getAttribute': {
      'it should return the correct value.': function() {
        const graph = new Graph();
        graph.setAttribute('name', 'graph');

        assert.strictEqual(graph.getAttribute('name'), 'graph');
      },

      'it should return undefined if the attribute does not exist.': function() {
        const graph = new Graph();

        assert.strictEqual(graph.getAttribute('name'), undefined);
      }
    },

    '#.getNodeAttribute': {

      'it should return the correct value.': function() {
        const graph = new Graph();
        graph.addNode('Martha', {age: 34});

        assert.strictEqual(graph.getNodeAttribute('Martha', 'age'), 34);
      },

      'it should return undefined if the attribute does not exist.': function() {
        const graph = new Graph();
        graph.addNode('Martha');

        assert.strictEqual(graph.getNodeAttribute('Martha', 'age'), undefined);
      }
    },

    '#.getEdgeAttribute': {

      'it should return the correct value.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Thomas']);
        const edge = graph.addEdge('John', 'Thomas', {weight: 2});


        assert.strictEqual(graph.getEdgeAttribute(edge, 'weight'), 2);
        assert.strictEqual(graph.getEdgeAttribute('John', 'Thomas', 'weight'), 2);
      },

      'it should return undefined if the attribute does not exist.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Thomas']);
        const edge = graph.addEdge('John', 'Thomas');

        assert.strictEqual(graph.getEdgeAttribute(edge, 'weight'), undefined);
      }
    },

    '#.getAttributes': {

      'it should return the correct value.': function() {
        const graph = new Graph();
        graph.setAttribute('name', 'graph');

        assert.deepEqual(graph.getAttributes(), {name: 'graph'});
      },

      'it should return an empty object if the node does not have attributes.': function() {
        const graph = new Graph();

        assert.deepEqual(graph.getAttributes(), {});
      }
    },

    '#.getNodeAttributes': {

      'it should return the correct value.': function() {
        const graph = new Graph();
        graph.addNode('Martha', {age: 34});

        assert.deepEqual(graph.getNodeAttributes('Martha'), {age: 34});
      },

      'it should return an empty object if the node does not have attributes.': function() {
        const graph = new Graph();
        graph.addNode('Martha');

        assert.deepEqual(graph.getNodeAttributes('Martha'), {});
      }
    },

    '#.getEdgeAttributes': {

      'it should return the correct value.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Thomas']);
        const edge = graph.addEdge('John', 'Thomas', {weight: 2});


        assert.deepEqual(graph.getEdgeAttributes(edge), {weight: 2});
        assert.deepEqual(graph.getEdgeAttributes('John', 'Thomas'), {weight: 2});
      },

      'it should return an empty object if the edge does not have attributes.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Thomas']);
        const edge = graph.addEdge('John', 'Thomas');

        assert.deepEqual(graph.getEdgeAttributes(edge), {});
      }
    },

    '#.hasAttribute': {

      'it should correctly return whether the attribute is set.': function() {
        const graph = new Graph();
        graph.setAttribute('name', 'graph');

        assert.strictEqual(graph.hasAttribute('name'), true);
        assert.strictEqual(graph.hasAttribute('info'), false);
      },

      'it does not fail with typical prototypal properties.': function() {
        const graph = new Graph();

        assert.strictEqual(graph.hasAttribute('toString'), false);
      }
    },

    '#.hasNodeAttribute': {

      'it should correctly return whether the attribute is set.': function() {
        const graph = new Graph();
        graph.addNode('John', {age: 20});

        assert.strictEqual(graph.hasNodeAttribute('John', 'age'), true);
        assert.strictEqual(graph.hasNodeAttribute('John', 'eyes'), false);
      },

      'it does not fail with typical prototypal properties.': function() {
        const graph = new Graph();
        graph.addNode('John', {age: 20});

        assert.strictEqual(graph.hasNodeAttribute('John', 'toString'), false);
      }
    },

    '#.hasEdgeAttribute': {

      'it should correctly return whether the attribute is set.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Martha']);
        graph.addEdgeWithKey('J->M', 'John', 'Martha', {weight: 10});

        assert.strictEqual(graph.hasEdgeAttribute('J->M', 'weight'), true);
        assert.strictEqual(graph.hasEdgeAttribute('J->M', 'type'), false);
      },

      'it does not fail with typical prototypal properties.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Martha']);
        graph.addEdgeWithKey('J->M', 'John', 'Martha', {weight: 10});

        assert.strictEqual(graph.hasEdgeAttribute('J->M', 'toString'), false);
      }
    },

    '#.setAttribute': {

      'it should correctly set the graph\'s attribute.': function() {
        const graph = new Graph();
        graph.setAttribute('name', 'graph');

        assert.strictEqual(graph.getAttribute('name'), 'graph');
      }
    },

    '#.setNodeAttribute': {

      'it should correctly set the node\'s attribute.': function() {
        const graph = new Graph();
        graph.addNode('John', {age: 20});

        graph.setNodeAttribute('John', 'age', 45);
        assert.strictEqual(graph.getNodeAttribute('John', 'age'), 45);
      }
    },

    '#.setEdgeAttribute': {
      'it should correctly set the edge\'s attribute.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Martha']);
        const edge = graph.addEdge('John', 'Martha', {weigth: 3});

        graph.setEdgeAttribute(edge, 'weigth', 40);
        assert.strictEqual(graph.getEdgeAttribute(edge, 'weigth'), 40);

        graph.setEdgeAttribute('John', 'Martha', 'weigth', 60);
        assert.strictEqual(graph.getEdgeAttribute(edge, 'weigth'), 60);
      }
    },

    '#.updateAttribute': {

      'it should correctly set the graph\'s attribute.': function() {
        const graph = new Graph();
        graph.setAttribute('name', 'graph');

        graph.updateAttribute('name', name => name + '1');
        assert.strictEqual(graph.getAttribute('name'), 'graph1');
      },

      'the given value should be undefined if not found.': function() {
        const graph = new Graph();

        const updater = x => {
          assert.strictEqual(x, undefined);
          return 'graph';
        };

        graph.updateAttribute('name', updater);
        assert.strictEqual(graph.getAttribute('name'), 'graph');
      }
    },

    '#.updateNodeAttribute': {

      'it should correctly set the node\'s attribute.': function() {
        const graph = new Graph();
        graph.addNode('John', {age: 20});

        graph.updateNodeAttribute('John', 'age', x => x + 1);
        assert.strictEqual(graph.getNodeAttribute('John', 'age'), 21);
      },

      'the given value should be undefined if not found.': function() {
        const graph = new Graph();
        graph.addNode('John');

        const updater = x => {
          assert.strictEqual(x, undefined);
          return 10;
        };

        graph.updateNodeAttribute('John', 'age', updater);
        assert.strictEqual(graph.getNodeAttribute('John', 'age'), 10);
      }
    },

    '#.updateEdgeAttribute': {
      'it should correctly set the edge\'s attribute.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Martha']);
        const edge = graph.addEdge('John', 'Martha', {weigth: 3});

        graph.updateEdgeAttribute(edge, 'weigth', x => x + 1);
        assert.strictEqual(graph.getEdgeAttribute(edge, 'weigth'), 4);

        graph.updateEdgeAttribute('John', 'Martha', 'weigth', x => x + 2);
        assert.strictEqual(graph.getEdgeAttribute(edge, 'weigth'), 6);
      },

      'the given value should be undefined if not found.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Martha']);
        const edge = graph.addEdge('John', 'Martha');

        const updater = x => {
          assert.strictEqual(x, undefined);
          return 10;
        };

        graph.updateEdgeAttribute(edge, 'weight', updater);
        assert.strictEqual(graph.getEdgeAttribute(edge, 'weight'), 10);
      }
    },

    '#.removeAttribute': {
      'it should correctly remove the attribute.': function() {
        const graph = new Graph();
        graph.setAttribute('name', 'graph');

        graph.removeAttribute('name');

        assert.strictEqual(graph.hasAttribute('name'), false);
        assert.deepEqual(graph.getAttributes(), {});
      }
    },

    '#.removeNodeAttribute': {
      'it should correctly remove the attribute.': function() {
        const graph = new Graph();
        graph.addNode('Martha', {age: 34});

        graph.removeNodeAttribute('Martha', 'age');

        assert.strictEqual(graph.hasNodeAttribute('Martha', 'age'), false);
        assert.deepEqual(graph.getNodeAttributes('Martha'), {});
      }
    },

    '#.removeEdgeAttribute': {
      'it should correclty remove the attribute.': function() {
        const graph = new Graph();
        const edge = graph.mergeEdge('John', 'Martha', {weight: 1, size: 3});

        graph.removeEdgeAttribute('John', 'Martha', 'weight');
        graph.removeEdgeAttribute(edge, 'size');

        assert.strictEqual(graph.hasEdgeAttribute(edge, 'weight'), false);
        assert.strictEqual(graph.hasEdgeAttribute(edge, 'size'), false);

        assert.deepEqual(graph.getEdgeAttributes(edge), {});
      }
    },

    '#.replaceAttribute': {
      'it should throw if given attributes are not a plain object.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.replaceAttributes(true);
        }, invalid());
      },

      'it should correctly replace attributes.': function() {
        const graph = new Graph();
        graph.setAttribute('name', 'graph');

        graph.replaceAttributes({name: 'other graph'});

        assert.deepEqual(graph.getAttributes(), {name: 'other graph'});
      }
    },

    '#.replaceNodeAttributes': {
      'it should throw if given attributes are not a plain object.': function() {
        const graph = new Graph();
        graph.addNode('John');

        assert.throws(function() {
          graph.replaceNodeAttributes('John', true);
        }, invalid());
      },

      'it should correctly replace attributes.': function() {
        const graph = new Graph();
        graph.addNode('John', {age: 45});

        graph.replaceNodeAttributes('John', {age: 23, eyes: 'blue'});

        assert.deepEqual(graph.getNodeAttributes('John'), {age: 23, eyes: 'blue'});
      }
    },

    '#.replaceEdgeAttributes': {
      'it should throw if given attributes are not a plain object.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Martha']);
        const edge = graph.addEdge('John', 'Martha');

        assert.throws(function() {
          graph.replaceEdgeAttributes(edge, true);
        }, invalid());
      },

      'it should correctly replace attributes.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Martha']);
        const edge = graph.addEdge('John', 'Martha', {weigth: 1});

        graph.replaceEdgeAttributes(edge, {weigth: 4, type: 'KNOWS'});

        assert.deepEqual(graph.getEdgeAttributes(edge), {weigth: 4, type: 'KNOWS'});
      }
    },

    '#.mergeAttributes': {
      'it should throw if given attributes are not a plain object.': function() {
        const graph = new Graph();

        assert.throws(function() {
          graph.mergeAttributes(true);
        }, invalid());
      },

      'it should correctly merge attributes.': function() {
        const graph = new Graph();
        graph.setAttribute('name', 'graph');

        graph.mergeAttributes({color: 'blue'});

        assert.deepEqual(graph.getAttributes(), {name: 'graph', color: 'blue'});
      }
    },

    '#.mergeNodeAttributes': {
      'it should throw if given attributes are not a plain object.': function() {
        const graph = new Graph();
        graph.addNode('John');

        assert.throws(function() {
          graph.mergeNodeAttributes('John', true);
        }, invalid());
      },

      'it should correctly merge attributes.': function() {
        const graph = new Graph();
        graph.addNode('John', {age: 45});

        graph.mergeNodeAttributes('John', {eyes: 'blue'});

        assert.deepEqual(graph.getNodeAttributes('John'), {age: 45, eyes: 'blue'});
      }
    },

    '#.mergeEdgeAttributes': {
      'it should throw if given attributes are not a plain object.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Martha']);
        const edge = graph.addEdge('John', 'Martha');

        assert.throws(function() {
          graph.mergeEdgeAttributes(edge, true);
        }, invalid());
      },

      'it should correctly merge attributes.': function() {
        const graph = new Graph();
        graph.addNodesFrom(['John', 'Martha']);
        const edge = graph.addEdge('John', 'Martha', {weigth: 1});

        graph.mergeEdgeAttributes(edge, {type: 'KNOWS'});

        assert.deepEqual(graph.getEdgeAttributes(edge), {weigth: 1, type: 'KNOWS'});
      }
    }
  });
}
