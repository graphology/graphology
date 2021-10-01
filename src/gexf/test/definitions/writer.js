/**
 * Graphology Browser GEXF Unit Tests Writer Definitions
 * ======================================================
 *
 * Definitions of the GEXF files stored in `./resources` so we can test
 * that the writer works as expected.
 */
var Graph = require('graphology');

var createBasicGraph = function() {
  var graph = new Graph();

  graph.setAttribute('lastModifiedDate', '2105-12-23');
  graph.setAttribute('author', 'Yomguithereal');
  graph.setAttribute('title', 'Basic Graph');

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
      formatNode: function(key, attributes) {
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
      formatEdge: function(key, attributes) {
        return {
          label: attributes.label ? '(Edge) - ' + attributes.label : '',
          weight: attributes.weight / 2,
          attributes: {
            number: attributes.number
          },
          viz: {
            shape: attributes.shape
          }
        };
      }
    }
  }
];
