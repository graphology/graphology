/* eslint no-self-compare: 0 */
/**
 * Graphology Common GEXF Writer
 * ==============================
 *
 * GEXF writer working for both node.js & the browser.
 */
var isGraph = require('graphology-utils/is-graph');
var inferType = require('graphology-utils/infer-type');
var XMLWriter = require('xml-writer');
var sanitizeTagName = require('./helpers.js').sanitizeTagName;

// TODO: handle object in color, position with object for viz

/**
 * Constants.
 */
var VIZ_RESERVED_NAMES = new Set([
  'color',
  'size',
  'x',
  'y',
  'z',
  'shape',
  'thickness'
]);

var RGBA_TEST = /^\s*rgba?\s*\(/i;
var RGBA_MATCH =
  /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)\s*(?:,\s*([.0-9]*))?\)\s*$/;

/**
 * Function used to transform a CSS color into a RGBA object.
 *
 * @param  {string} value - Target value.
 * @return {object}
 */
function CSSColorToRGBA(value) {
  if (!value || typeof value !== 'string') return {};

  if (value[0] === '#') {
    value = value.slice(1);

    return value.length === 3
      ? {
          r: parseInt(value[0] + value[0], 16),
          g: parseInt(value[1] + value[1], 16),
          b: parseInt(value[2] + value[2], 16)
        }
      : {
          r: parseInt(value[0] + value[1], 16),
          g: parseInt(value[2] + value[3], 16),
          b: parseInt(value[4] + value[5], 16)
        };
  } else if (RGBA_TEST.test(value)) {
    var result = {};

    value = value.match(RGBA_MATCH);
    result.r = +value[1];
    result.g = +value[2];
    result.b = +value[3];

    if (value[4]) result.a = +value[4];

    return result;
  }

  return {};
}

/**
 * Function used to map an element's attributes to a standardized map of
 * GEXF expected properties (label, viz, attributes).
 *
 * @param  {string} type       - The element's type.
 * @param  {string} key        - The element's key.
 * @param  {object} attributes - The element's attributes.
 * @return {object}
 */
function DEFAULT_ELEMENT_FORMATTER(type, key, attributes) {
  var output = {},
    name;

  for (name in attributes) {
    if (name === 'label') {
      output.label = attributes.label;
    } else if (type === 'edge' && name === 'weight') {
      output.weight = attributes.weight;
    } else if (VIZ_RESERVED_NAMES.has(name)) {
      output.viz = output.viz || {};
      output.viz[name] = attributes[name];
    } else {
      output.attributes = output.attributes || {};
      output.attributes[name] = attributes[name];
    }
  }

  return output;
}

var DEFAULT_NODE_FORMATTER = DEFAULT_ELEMENT_FORMATTER.bind(null, 'node'),
  DEFAULT_EDGE_FORMATTER = DEFAULT_ELEMENT_FORMATTER.bind(null, 'edge');

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

var TYPE_PRIORITIES = {
  string: 0,
  boolean: 1,
  integer: 2,
  long: 3,
  double: 4,
  empty: 5
};

/**
 * Function used to detect a JavaScript's value type in the GEXF model.
 *
 * @param  {any}    value - Target value.
 * @return {string}
 */
function inferScalarValueType(value) {
  if (isEmptyValue(value)) return 'empty';

  if (typeof value === 'boolean') return 'boolean';

  if (typeof value === 'object') return 'string';

  // Numbers
  if (typeof value === 'number') {
    // Integer
    if (value === (value | 0)) {
      // Long (JavaScript integer can go up to 53 bit)?
      return is32BitInteger(value) ? 'integer' : 'long';
    }

    // JavaScript numbers are 64 bit float, hence the double
    return 'double';
  }

  return 'string';
}

function inferListValueType(values) {
  var type = 'empty';
  var priority = TYPE_PRIORITIES[type];
  var value, t, p;

  for (var i = 0, l = values.length; i < l; i++) {
    value = values[i];
    t = inferScalarValueType(value);
    p = TYPE_PRIORITIES[t];

    if (p < priority) {
      type = t;
      priority = p;
    }
  }

  return type;
}

function inferValueType(value) {
  if (Array.isArray(value)) {
    return 'list' + inferListValueType(value);
  }

  return inferScalarValueType(value);
}

/**
 * Function used to cast the given value into the given type.
 *
 * @param  {string} type  - Target type.
 * @param  {any}    value - Value to cast.
 * @return {string}
 */
function cast(version, type, value) {
  if (type.startsWith('list') && Array.isArray(value)) {
    if (version === '1.3') {
      return JSON.stringify(value);
    } else {
      return value.join('|');
    }
  }

  return '' + value;
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
    var data = format(node, attr);
    data.key = node;
    nodes[i++] = data;
  });

  return nodes;
}

/**
 * Function used to collect data from a graph's edges.
 *
 * @param  {Graph}    graph   - Target graph.
 * @param  {function} reducer - Function reducing the edges attributes.
 * @return {array}
 */
function collectEdgeData(graph, reducer) {
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
    var data = reducer(edge, attr);
    data.key = edge;
    data.source = source;
    data.target = target;
    data.undirected = undirected;
    edges[i++] = data;
  });

  return edges;
}

/**
 * Function used to infer the model of the graph's nodes or edges.
 *
 * @param  {array} elements - The graph's relevant elements.
 * @return {array}
 */

// TODO: on large graph, we could also sample or let the user indicate the types
function inferModel(elements) {
  var model = {};
  var attributes;
  var type;
  var k;

  // Testing every attributes
  for (var i = 0, l = elements.length; i < l; i++) {
    attributes = elements[i].attributes;

    if (!attributes) continue;

    for (k in attributes) {
      type = inferValueType(attributes[k]);

      if (type === 'empty') continue;

      if (!model[k]) model[k] = type;
      else {
        if (TYPE_PRIORITIES[type] < TYPE_PRIORITIES[model[k]]) {
          model[k] = type;
        }
      }
    }
  }

  // TODO: check default values
  return model;
}

/**
 * Function used to write a model.
 *
 * @param {XMLWriter} writer     - The writer to use.
 * @param {object}    model      - Model to write.
 * @param {string}    modelClass - Class of the model.
 */
function writeModel(writer, model, modelClass) {
  var name;

  if (!Object.keys(model).length) return;

  writer.startElement('attributes');
  writer.writeAttribute('class', modelClass);

  for (name in model) {
    writer.startElement('attribute');
    writer.writeAttribute('id', name);
    writer.writeAttribute('title', name);
    writer.writeAttribute('type', model[name]);
    writer.endElement();
  }

  writer.endElement();
}

function writeElements(version, writer, type, model, elements) {
  var emptyModel = !Object.keys(model).length;
  var element;
  var name;
  var color;
  var value;
  var edgeType;
  var attributes;
  var weight;
  var viz;
  var k;
  var i;
  var l;

  writer.startElement(type + 's');

  for (i = 0, l = elements.length; i < l; i++) {
    element = elements[i];
    attributes = element.attributes;
    viz = element.viz;

    writer.startElement(type);
    writer.writeAttribute('id', element.key);

    if (type === 'edge') {
      edgeType = element.undirected ? 'undirected' : 'directed';

      if (edgeType !== writer.defaultEdgeType)
        writer.writeAttribute('type', edgeType);

      writer.writeAttribute('source', element.source);
      writer.writeAttribute('target', element.target);

      weight = element.weight;

      if (
        (typeof weight === 'number' && !isNaN(weight)) ||
        typeof weight === 'string'
      )
        writer.writeAttribute('weight', element.weight);
    }

    if (element.label) writer.writeAttribute('label', element.label);

    if (!emptyModel && attributes) {
      writer.startElement('attvalues');

      for (name in model) {
        if (name in attributes) {
          value = attributes[name];

          if (isEmptyValue(value)) continue;

          writer.startElement('attvalue');
          writer.writeAttribute('for', name);
          writer.writeAttribute('value', cast(version, model[name], value));
          writer.endElement();
        }
      }

      writer.endElement();
    }

    if (viz) {
      //-- 1) Color
      if (viz.color) {
        writer.startElementNS('viz', 'color');

        if (version === '1.3' && viz.color.startsWith('#')) {
          writer.writeAttribute('hex', viz.color);
        } else {
          color = CSSColorToRGBA(viz.color);

          for (k in color) writer.writeAttribute(k, color[k]);
        }
        writer.endElement();
      }

      //-- 2) Size
      if ('size' in viz) {
        writer.startElementNS('viz', 'size');
        writer.writeAttribute('value', viz.size);
        writer.endElement();
      }

      //-- 3) Position
      if ('x' in viz || 'y' in viz || 'z' in viz) {
        writer.startElementNS('viz', 'position');

        if ('x' in viz) writer.writeAttribute('x', viz.x);

        if ('y' in viz) writer.writeAttribute('y', viz.y);

        if ('z' in viz) writer.writeAttribute('z', viz.z);

        writer.endElement();
      }

      //-- 4) Shape
      if (viz.shape) {
        writer.startElementNS('viz', 'shape');
        writer.writeAttribute('value', viz.shape);
        writer.endElement();
      }

      //-- 5) Thickness
      if ('thickness' in viz) {
        writer.startElementNS('viz', 'thickness');
        writer.writeAttribute('value', viz.thickness);
        writer.endElement();
      }
    }

    writer.endElement();
  }

  writer.endElement();
}

/**
 * Defaults.
 */
var DEFAULTS = {
  encoding: 'UTF-8',
  pretty: true,
  version: '1.2',
  pedantic: false,
  formatNode: DEFAULT_NODE_FORMATTER,
  formatEdge: DEFAULT_EDGE_FORMATTER
};

/**
 * Function taking a graphology instance & outputting a gexf string.
 *
 * @param  {Graph}  graph        - Target graphology instance.
 * @param  {object} options      - Options:
 * @param  {string}   [encoding]   - Character encoding.
 * @param  {boolean}  [pretty]     - Whether to pretty print output.
 * @param  {string}   [version]    - Gexf version to emit.
 * @param  {boolean}  [pedantic]   - Pedantic output?
 * @param  {function} [formatNode] - Function formatting nodes' output.
 * @param  {function} [formatEdge] - Function formatting edges' output.
 * @return {string}              - GEXF string.
 */
module.exports = function write(graph, options) {
  if (!isGraph(graph))
    throw new Error('graphology-gexf/writer: invalid graphology instance.');

  options = options || {};

  var indent = options.pretty === false ? false : '  ';
  var pedantic = options.pedantic === true;

  var formatNode = options.formatNode || DEFAULTS.formatNode;
  var formatEdge = options.formatEdge || DEFAULTS.formatEdge;

  var writer = new XMLWriter(indent);

  writer.startDocument('1.0', options.encoding || DEFAULTS.encoding);

  // Starting gexf
  var version = options.version || DEFAULTS.version;

  if (version !== '1.2' && version !== '1.3') {
    throw new Error(
      'graphology-gexf/writer: invalid gexf version "' +
        version +
        '". Expecting 1.2 or 1.3.'
    );
  }

  writer.startElement('gexf');
  writer.writeAttribute('version', version);

  if (version === '1.2') {
    writer.writeAttribute('xmlns', 'http://www.gexf.net/1.2draft');
    writer.writeAttribute('xmlns:viz', 'http:///www.gexf.net/1.1draft/viz');
  } else if (version === '1.3') {
    writer.writeAttribute('xmlns', 'http://gexf.net/1.3');
    writer.writeAttribute('xmlns:viz', 'http://gexf.net/1.3/viz');
    writer.writeAttribute(
      'xmlns:xsi',
      'http://www.w3.org/2001/XMLSchema-instance'
    );
    writer.writeAttribute(
      'xsi:schemaLocation',
      'http://gexf.net/1.3 http://gexf.net/1.3/gexf.xsd'
    );
  }

  // Processing meta
  writer.startElement('meta');
  var graphAttributes = graph.getAttributes();

  if (graphAttributes.lastModifiedDate)
    writer.writeAttribute('lastmodifieddate', graphAttributes.lastModifiedDate);

  var metaTagName;
  var graphAttribute;

  for (var k in graphAttributes) {
    if (k === 'lastModifiedDate') continue;

    if (pedantic && k !== 'creator' && k !== 'description' && k !== 'keywords')
      continue;

    metaTagName = sanitizeTagName(k);

    if (!metaTagName) continue;

    graphAttribute = graphAttributes[k];

    // NOTE: if the graph attribute is not a scalar, we do not bother writing
    // it as metadata in the gexf output. This means the writer/parser is not
    // idempotent, but we cannot do better because the gexf format does not
    // allow it, since it was not meant to handle complex values as graph
    // metadata anyway.
    if (
      typeof graphAttribute === 'string' ||
      typeof graphAttribute === 'number' ||
      typeof graphAttribute === 'boolean'
    ) {
      writer.writeElement(metaTagName, '' + graphAttribute);
    }
  }

  writer.endElement();
  writer.startElement('graph');

  var type = inferType(graph);

  writer.defaultEdgeType = type === 'mixed' ? 'directed' : type;

  writer.writeAttribute('defaultedgetype', writer.defaultEdgeType);

  // Processing model
  var nodes = collectNodeData(graph, formatNode);
  var edges = collectEdgeData(graph, formatEdge);

  var nodeModel = inferModel(nodes);

  writeModel(writer, nodeModel, 'node');

  var edgeModel = inferModel(edges);

  writeModel(writer, edgeModel, 'edge');

  // Processing nodes
  writeElements(version, writer, 'node', nodeModel, nodes);

  // Processing edges
  writeElements(version, writer, 'edge', edgeModel, edges);

  return writer.toString();
};
