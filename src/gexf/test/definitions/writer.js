/**
 * Graphology Browser GEXF Unit Tests Writer Definitions
 * ======================================================
 *
 * Definitions of the GEXF files stored in `./resources` so we can test
 * that the writer works as expected.
 */
var Graph = require('graphology');

var createBasicGraph = function () {
  var graph = new Graph();

  graph.setAttribute('lastModifiedDate', '2105-12-23');
  graph.setAttribute('author', 'Yomguithereal');
  graph.setAttribute('title', 'Basic Graph');
  graph.setAttribute('isTest', true);
  graph.setAttribute('list', [1, 2, 3]);

  graph.addNode('Suzy', {
    label: 'Suzy, Ghost',
    male: false,
    age: 22,
    surname: 'Ghost',
    mixed: 45,
    x: 12,
    y: 35,
    size: 34,
    color: 'rgba(234,34,12,0.6)',
    shape: 'circle',
    useless: undefined
  });

  graph.addNode('John', {
    label: 'John, Appleseed',
    male: true,
    age: 34,
    surname: 'Appleseed',
    mixed: 'hello',
    color: '#ccc',
    size: 103,
    x: 45,
    y: 0,
    useless: null
  });

  graph.addEdgeWithKey('J-S', 'John', 'Suzy', {
    weight: 456,
    color: '#CCCFFF',
    thickness: 34,
    shape: 'dotted',
    label: 'Fine edge',
    set: new Set(['truc', 'machin']),
    number: 12,
    useless: ''
  });

  graph.addUndirectedEdgeWithKey('J~S', 'John', 'Suzy');

  return graph;
};

module.exports = [
  {
    title: 'Basic',
    gexf: 'basic',
    graph: createBasicGraph
  },
  {
    title: 'Formatted',
    gexf: 'basic_formatted',
    graph: createBasicGraph,
    options: {
      formatNode: function (key, attributes) {
        return {
          label: '(Node) - ' + attributes.label,
          attributes: {
            female: !attributes.male,
            surname: attributes.surname
          },
          viz: {
            color: attributes.color,
            x: attributes.x,
            y: attributes.y
          }
        };
      },
      formatEdge: function (key, attributes) {
        return {
          label: attributes.label ? '(Edge) - ' + attributes.label : '',
          weight: attributes.weight / 2,
          attributes: {
            number: attributes.number,
            set: attributes.set
          },
          viz: {
            shape: attributes.shape
          }
        };
      }
    }
  },
  {
    title: 'Pedantic',
    gexf: 'pedantic',
    graph: function () {
      var graph = new Graph();
      graph.replaceAttributes({creator: 'Test', title: 'Not Included!'});
      return graph;
    },
    options: {
      pedantic: true
    }
  },
  {
    title: 'v1.3',
    gexf: 'v1_3_writer',
    graph: function () {
      var graph = new Graph();
      graph.addNode('john', {
        color: '#fff',
        booleans: [true, false],
        numbers: [1, 3.5],
        colors: ['yellow', 'red', '"blue"', "'orange'", '\'purple"', '\n\r\t']
      });
      graph.addNode('suzy');
      graph.addEdgeWithKey('js', 'john', 'suzy', {kind: 'likes'});
      return graph;
    },
    options: {
      version: '1.3'
    }
  }
];
