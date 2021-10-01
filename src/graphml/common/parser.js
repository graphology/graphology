/**
 * Graphology GRAPHML Parser
 * ==========================
 *
 * graphology GRAPHML parser using DOMParser to function.
 */
var isGraphConstructor = require('graphology-utils/is-graph-constructor');

var DEFAULTS = require('./defaults.js');
var DEFAULT_FORMATTER = DEFAULTS.DEFAULT_FORMATTER;

function numericCaster(v) {
  return +v;
}

function identity(v) {
  return v;
}

var CASTERS = {
  boolean: function(v) {
    return v.toLowerCase() === 'true';
  },
  int: numericCaster,
  long: numericCaster,
  float: numericCaster,
  double: numericCaster,
  string: identity
};

function getGraphDataElements(graphElement) {
  var children = graphElement.childNodes;
  var dataElements = [];

  var element;

  for (var i = 0, l = children.length; i < l; i++) {
    element = children[i];

    if (element.nodeType !== 1)
      continue;

    if (element.tagName.toLowerCase() !== 'data')
      break;

    dataElements.push(element);
  }

  return dataElements;
}

function collectModel(modelElements) {
  var i, l, m, id, name, type, element, defaultElement, defaultValue;

  var models = {
    graph: {},
    node: {},
    edge: {}
  };

  var defaults = {
    graph: {},
    node: {},
    edge: {}
  };

  for (i = 0, l = modelElements.length; i < l; i++) {
    element = modelElements[i];
    m = element.getAttribute('for') || 'node';
    id = element.getAttribute('id');
    name = element.getAttribute('attr.name');
    type = element.getAttribute('attr.type') || 'string';

    defaultValue = undefined;
    defaultElement = element.getElementsByTagName('default');

    if (defaultElement.length !== 0)
      defaultValue = defaultElement[0].textContent;

    models[m][id] = {
      name: name,
      cast: CASTERS[type]
    };

    if (typeof defaultValue !== 'undefined')
      defaults[m][name] = defaultValue;
  }

  return {
    models: models,
    defaults: defaults
  };
}

function collectAttributes(model, defaults, element) {
  var dataElements = element.getElementsByTagName('data'),
      dataElement;

  var i, l, key, spec;

  var attr = {};

  for (i = 0, l = dataElements.length; i < l; i++) {
    dataElement = dataElements[i];
    key = dataElement.getAttribute('key');
    spec = model[key];

    if (typeof spec === 'undefined')
      attr[key] = dataElement.textContent;
    else
      attr[spec.name] = spec.cast(dataElement.textContent);
  }

  for (key in defaults) {
    if (!(key in attr))
      attr[key] = defaults[key];
  }

  return attr;
}

/**
 * Factory taking implementations of `DOMParser` & `Document` returning
 * the parser function.
 */
module.exports = function createParserFunction(DOMParser, Document) {

  /**
   * Function taking either a string or a document and returning a
   * graphology instance.
   *
   * @param  {function}        Graph  - A graphology constructor.
   * @param  {string|Document} source - The source to parse.
   */
  return function parse(Graph, source) {
    var xmlDoc = source;

    if (!isGraphConstructor(Graph))
      throw new Error('graphology-graphml/parser: invalid Graph constructor.');

    // If source is a string, we are going to parse it
    if (typeof source === 'string')
      xmlDoc = (new DOMParser()).parseFromString(source, 'application/xml');

    if (!(xmlDoc instanceof Document))
      throw new Error('graphology-gexf/parser: source should either be a XML document or a string.');

    var GRAPH_ELEMENT = xmlDoc.getElementsByTagName('graph')[0];
    var GRAPH_DATA_ELEMENTS = getGraphDataElements(GRAPH_ELEMENT);
    var MODEL_ELEMENTS = xmlDoc.getElementsByTagName('key');
    var NODE_ELEMENTS = xmlDoc.getElementsByTagName('node');
    var EDGE_ELEMENTS = xmlDoc.getElementsByTagName('edge');
    var EDGE_DEFAULT_TYPE = GRAPH_ELEMENT.getAttribute('edgedefault') || 'undirected';

    var MODEL = collectModel(MODEL_ELEMENTS);

    var graph = new Graph({type: EDGE_DEFAULT_TYPE});

    // Graph-level attributes
    var graphId = GRAPH_ELEMENT.getAttribute('id');

    if (graphId)
      graph.setAttribute('id', graphId);

    var dummyGraphElement = xmlDoc.createElement('graph');
    GRAPH_DATA_ELEMENTS.forEach(function(el) {
      dummyGraphElement.appendChild(el);
    });
    var graphAttributes = collectAttributes(MODEL.models.graph, MODEL.defaults.graph, dummyGraphElement);

    graph.mergeAttributes(graphAttributes);

    // Collecting nodes
    var i, l, nodeElement, id, attr;

    for (i = 0, l = NODE_ELEMENTS.length; i < l; i++) {
      nodeElement = NODE_ELEMENTS[i];
      id = nodeElement.getAttribute('id');

      attr = collectAttributes(MODEL.models.node, MODEL.defaults.node, nodeElement);
      attr = DEFAULT_FORMATTER(attr);

      graph.addNode(id, attr);
    }

    // Collecting edges
    var edgeElement, s, t, type;

    for (i = 0, l = EDGE_ELEMENTS.length; i < l; i++) {
      edgeElement = EDGE_ELEMENTS[i];
      id = edgeElement.getAttribute('id');
      s = edgeElement.getAttribute('source');
      t = edgeElement.getAttribute('target');
      type = edgeElement.getAttribute('directed') === 'true' ?
        'directed' :
        EDGE_DEFAULT_TYPE;

      attr = collectAttributes(MODEL.models.edge, MODEL.defaults.edge, edgeElement);
      attr = DEFAULT_FORMATTER(attr);

      // Should we upgrade to a mixed graph?
      if (!graph.type !== 'mixed' && type !== graph.type)
        graph.upgradeToMixed();

      // Should we upgrade to a multi graph?
      if (!graph.multi) {
        if (type === 'undirected') {
          if (graph.hasUndirectedEdge(s, t))
            graph.upgradeToMulti();
        }
        else if (graph.hasDirectedEdge(s, t))
          graph.upgradeToMulti();
      }

      if (type === 'undirected') {
        if (id)
          graph.addUndirectedEdgeWithKey(id, s, t, attr);
        else
          graph.addUndirectedEdge(s, t, attr);
      }
      else {
        if (id)
          graph.addDirectedEdgeWithKey(id, s, t, attr);
        else
          graph.addDirectedEdge(s, t, attr);
      }
    }

    return graph;
  };
};
