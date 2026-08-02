/* eslint no-self-compare: 0 */
/**
 * Graphology Common GRAPHML Writer
 * =================================
 *
 * GRAPHML writer working for both node.js & the browser.
 */
var isGraph = require('graphology-utils/is-graph');
var inferType = require('graphology-utils/infer-type');
var XMLWriter = require('xml-writer');

/**
 * Constants.
 */
var TYPE_PRIORITIES = {
  string: 0,
  double: 1,
  long: 2,
  int: 3,
  boolean: 4,
  empty: 5
};

/**
 * Function used to check whether the given integer is 32 bits or not.
 *
 * @param  {number} number - Target number.
 * @return {boolean}
 */
function is32BitInteger(number) {
  return number <= 0x7fffffff && number >= -0x7fffffff;
}

/**
 * Function used to check whether the given value is "empty".
 *
 * @param  {any} value - Target value.
 * @return {boolean}
 */
function isEmptyValue(value) {
  return (
    typeof value === 'undefined' ||
    value === null ||
    value === '' ||
    value !== value
  );
}

/**
 * Function used to infer a scalar value's GRAPHML type.
 *
 * @param  {any} value - Target value.
 * @return {string}
 */
function inferScalarValueType(value) {
  if (isEmptyValue(value)) return 'empty';

  if (typeof value === 'boolean') return 'boolean';

  // NOTE: JavaScript numbers are 64 bit float, hence the double
  if (typeof value === 'number') {
    if (value === (value | 0)) {
      return is32BitInteger(value) ? 'int' : 'long';
    }

    return 'double';
  }

  return 'string';
}

/**
 * Function used to infer a value's GRAPHML type.
 *
 * @param  {any} value - Target value.
 * @return {string}
 */
function inferValueType(value) {
  if (
    typeof value !== 'boolean' &&
    typeof value !== 'number' &&
    typeof value !== 'string'
  )
    return 'empty';

  return inferScalarValueType(value);
}

/**
 * Function used to infer the model of a set of elements.
 *
 * @param  {array} elements - The graph's relevant elements.
 * @return {object}
 */
function inferModel(elements) {
  var model = {};
  var attributes;
  var type, currentType;
  var k;

  // Testing every attributes
  for (var i = 0, l = elements.length; i < l; i++) {
    attributes = elements[i].attributes;

    if (!attributes) continue;

    for (k in attributes) {
      type = inferValueType(attributes[k]);

      if (type === 'empty') continue;

      currentType = model[k];

      if (!currentType) model[k] = type;
      else {
        if (
          type !== currentType &&
          TYPE_PRIORITIES[type] < TYPE_PRIORITIES[currentType]
        ) {
          model[k] = type;
        }
      }
    }
  }

  return model;
}

/**
 * Function used to collect data from a graph's nodes.
 *
 * @param  {Graph}    graph   - Target graph.
 * @param  {function} format  - Function formatting the nodes attributes.
 * @return {array}
 */
function collectNodeData(graph, format) {
  var nodes = new Array(graph.order);
  var i = 0;

  graph.forEachNode(function (node, attr) {
    nodes[i++] = {
      key: node,
      attributes: format(node, attr)
    };
  });

  return nodes;
}

/**
 * Function used to collect data from a graph's edges.
 *
 * @param  {Graph}    graph   - Target graph.
 * @param  {function} format  - Function formatting the edges attributes.
 * @return {array}
 */
function collectEdgeData(graph, format) {
  var edges = new Array(graph.size);
  var i = 0;

  graph.forEachEdge(function (
    edge,
    attr,
    source,
    target,
    _sa,
    _ta,
    undirected
  ) {
    edges[i++] = {
      key: edge,
      source: source,
      target: target,
      undirected: undirected,
      attributes: format(edge, attr)
    };
  });

  return edges;
}

/**
 * Function used to write a key.
 *
 * @param {XMLWriter} writer       - The writer to use.
 * @param {object}    spec         - The key's spec.
 * @param {string}    elementClass - Class of the key.
 * @param {string}    name         - Name of the key.
 */
function writeKey(writer, spec, elementClass, name) {
  writer.startElement('key');
  writer.writeAttribute('id', spec.id);
  writer.writeAttribute('for', elementClass);
  writer.writeAttribute('attr.name', name);
  writer.writeAttribute('attr.type', spec.type);
  writer.endElement();
}

/**
 * Function used to write a model.
 *
 * @param {XMLWriter} writer       - The writer to use.
 * @param {object}    model        - Model to write.
 * @param {string}    elementClass - Class of the model.
 */
function writeModel(writer, model, elementClass) {
  var name;

  for (name in model) writeKey(writer, model[name], elementClass, name);
}

/**
 * Function used to write an element's data.
 *
 * @param {XMLWriter} writer     - The writer to use.
 * @param {object}    model      - Model to use.
 * @param {object}    attributes - Element's attributes.
 */
function writeData(writer, model, attributes) {
  if (!attributes) return;

  var name, value;

  for (name in model) {
    if (!(name in attributes)) continue;

    value = attributes[name];

    if (isEmptyValue(value)) continue;

    writer.startElement('data');
    writer.writeAttribute('key', model[name].id);
    writer.text('' + value);
    writer.endElement();
  }
}

/**
 * Function used to write the graph's nodes or edges.
 *
 * @param {XMLWriter} writer             - The writer to use.
 * @param {string}    type               - Element's type.
 * @param {object}    model              - Model to use.
 * @param {array}     elements           - Elements to write.
 * @param {boolean}   defaultUndirected  - Whether the graph's default edge
 *                                          type is undirected.
 */
function writeElements(writer, type, model, elements, defaultUndirected) {
  var element, attributes;

  for (var i = 0, l = elements.length; i < l; i++) {
    element = elements[i];
    attributes = element.attributes;

    writer.startElement(type);
    writer.writeAttribute('id', element.key);

    if (type === 'edge') {
      if (element.undirected !== defaultUndirected) {
        writer.writeAttribute(
          'directed',
          element.undirected ? 'false' : 'true'
        );
      }

      writer.writeAttribute('source', element.source);
      writer.writeAttribute('target', element.target);
    }

    writeData(writer, model, attributes);

    writer.endElement();
  }
}

/**
 * Defaults.
 */
function identity(key, attributes) {
  return attributes;
}

var DEFAULTS = {
  encoding: 'UTF-8',
  pretty: true,
  formatNode: identity,
  formatEdge: identity
};

/**
 * Function taking a graphology instance & outputting a graphml string.
 *
 * @param  {Graph}   graph            - Target graphology instance.
 * @param  {object}  options          - Options:
 * @param  {string}    [encoding]     - Character encoding.
 * @param  {boolean}   [pretty]       - Whether to pretty print output.
 * @param  {function}  [formatNode]   - Function formatting nodes' attributes.
 * @param  {function}  [formatEdge]   - Function formatting edges' attributes.
 * @return {string}                   - GRAPHML string.
 */
module.exports = function write(graph, options) {
  if (!isGraph(graph))
    throw new Error('graphology-graphml/writer: invalid graphology instance.');

  options = options || {};

  var indent = options.pretty === false ? false : '  ';

  var formatNode = options.formatNode || DEFAULTS.formatNode;
  var formatEdge = options.formatEdge || DEFAULTS.formatEdge;

  var writer = new XMLWriter(indent);

  writer.startDocument('1.0', options.encoding || DEFAULTS.encoding);

  // Starting graphml
  writer.startElement('graphml');
  writer.writeAttribute('xmlns', 'http://graphml.graphdrawing.org/xmlns');

  // Collecting data
  var nodes = collectNodeData(graph, formatNode);
  var edges = collectEdgeData(graph, formatEdge);

  var nodeModel = inferModel(nodes);
  var edgeModel = inferModel(edges);

  // Graph attributes
  var graphAttributes = graph.getAttributes();
  var graphData = {};
  var graphId;
  var k;

  for (k in graphAttributes) {
    if (k === 'id') graphId = graphAttributes[k];
    else graphData[k] = graphAttributes[k];
  }

  var graphModel = inferModel([{attributes: graphData}]);

  // Assigning keys ids
  var counter = 0;
  var models = [nodeModel, edgeModel, graphModel];
  var name;

  for (var i = 0, l = models.length; i < l; i++) {
    for (name in models[i]) {
      models[i][name] = {
        id: 'd' + counter,
        type: models[i][name]
      };
      counter++;
    }
  }

  // Writing keys
  writeModel(writer, nodeModel, 'node');
  writeModel(writer, edgeModel, 'edge');
  writeModel(writer, graphModel, 'graph');

  // Writing graph
  writer.startElement('graph');

  if (typeof graphId !== 'undefined') writer.writeAttribute('id', graphId);

  var type = inferType(graph);
  var edgeDefaultType = type === 'mixed' ? 'undirected' : type;

  writer.writeAttribute('edgedefault', edgeDefaultType);

  // Writing graph data
  writeData(writer, graphModel, graphData);

  // Writing nodes & edges
  writeElements(
    writer,
    'node',
    nodeModel,
    nodes,
    edgeDefaultType === 'undirected'
  );
  writeElements(
    writer,
    'edge',
    edgeModel,
    edges,
    edgeDefaultType === 'undirected'
  );

  return writer.toString();
};
