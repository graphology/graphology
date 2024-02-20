/* eslint no-self-compare: 0 */
/**
 * Graphology Browser GEXF Parser
 * ===============================
 *
 * Browser version of the graphology GEXF parser using DOMParser to function.
 */
var isGraphConstructor = require('graphology-utils/is-graph-constructor');
var mergeEdge = require('graphology-utils/add-edge').mergeEdge;
var helpers = require('../common/helpers.js');

var parseValue = helpers.parseValue;

/**
 * Function checking whether the given value is a NaN.
 *
 * @param  {any} value - Value to test.
 * @return {boolean}
 */
function isReallyNaN(value) {
  return value !== value;
}

/**
 * Function used to convert a viz:color attribute into a CSS rgba? or hex string.
 *
 * @param  {Node}   element - DOM element.
 * @return {string}
 */
function getVizColor(element) {
  var hex = element.getAttribute('hex');

  if (hex) {
    return hex;
  }

  var a = element.getAttribute('a');
  var r = element.getAttribute('r');
  var g = element.getAttribute('g');
  var b = element.getAttribute('b');

  return a
    ? 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
    : 'rgb(' + r + ',' + g + ',' + b + ')';
}

/**
 * Function returning the first matching tag of the `viz` namespace matching
 * the desired tag name.
 *
 * @param  {Node}   element - Target DOM element.
 * @param  {string} name    - Tag name.
 * @return {Node}
 */
function getFirstMatchingVizTag(element, name) {
  var vizElement = element.getElementsByTagName('viz:' + name)[0];

  if (!vizElement) vizElement = element.getElementsByTagNameNS('viz', name)[0];

  if (!vizElement) vizElement = element.getElementsByTagName(name)[0];

  return vizElement;
}

/**
 * Function used to collect meta information.
 *
 * @param  {Array<Node>} elements - Target DOM element.
 * @return {object}
 */
function collectMeta(elements) {
  var meta = {};
  var element;
  var value;

  for (var i = 0, l = elements.length; i < l; i++) {
    element = elements[i];

    if (element.nodeName === '#text') continue;

    value = element.textContent.trim();

    if (value) meta[element.tagName.toLowerCase()] = element.textContent;
  }

  return meta;
}

/**
 * Function used to extract the model from the right elements.
 *
 * @param  {Array<Node>} elements - Target DOM elements.
 * @return {array}                - The model & default attributes.
 */
function extractModel(elements) {
  var model = {};
  var defaults = {};
  var element;
  var defaultElement;
  var id;

  for (var i = 0, l = elements.length; i < l; i++) {
    element = elements[i];
    id = element.getAttribute('id') || element.getAttribute('for');

    model[id] = {
      id: id,
      type: element.getAttribute('type') || 'string',
      title: !isReallyNaN(+id) ? element.getAttribute('title') || id : id
    };

    // Default?
    defaultElement = element.getElementsByTagName('default')[0];

    if (defaultElement)
      defaults[model[id].title] = parseValue(
        model[id].type,
        defaultElement.textContent
      );
  }

  return [model, defaults];
}

/**
 * Function used to collect an element's attributes.
 *
 * @param  {object}  model    - Data model to use.
 * @param  {object}  defaults - Default values.
 * @param  {Node}    element  - Target DOM element.
 * @param  {boolean} allowUndeclaredAttributes - Whether to allow undeclared attributes.
 * @return {object}           - The collected attributes.
 */
function collectAttributes(
  model,
  defaults,
  element,
  allowUndeclaredAttributes
) {
  var data = {};
  var label = element.getAttribute('label');
  var weight = element.getAttribute('weight');
  var kind = element.getAttribute('kind');

  if (label) data.label = label;
  if (weight) data.weight = +weight;
  if (kind) data.kind = kind;

  var valueElements = element.getElementsByTagName('attvalue');
  var valueElement;
  var attr;
  var title;
  var value;
  var type;
  var id;

  for (var i = 0, l = valueElements.length; i < l; i++) {
    valueElement = valueElements[i];
    id = valueElement.getAttribute('id') || valueElement.getAttribute('for');
    value = valueElement.getAttribute('value');
    attr = model[id];

    if (!attr) {
      if (allowUndeclaredAttributes) {
        title = id;
        type = 'string';
      } else {
        throw new Error(
          'graphology-gexf/parser: Found undeclared attribute "' + id + '"'
        );
      }
    } else {
      title = attr.title;
      type = attr.type;
    }

    data[title] = parseValue(type, value);
  }

  // Applying default values
  var k;

  for (k in defaults) {
    if (!(k in data)) data[k] = defaults[k];
  }

  // TODO: shortcut here to avoid viz when namespace is not set

  // Attempting to find viz namespace tags

  //-- 1) Color
  var vizElement = getFirstMatchingVizTag(element, 'color');

  if (vizElement) data.color = getVizColor(vizElement);

  //-- 2) Size
  vizElement = getFirstMatchingVizTag(element, 'size');

  if (vizElement) data.size = +vizElement.getAttribute('value');

  //-- 3) Position
  var x, y, z;

  vizElement = getFirstMatchingVizTag(element, 'position');

  if (vizElement) {
    x = vizElement.getAttribute('x');
    y = vizElement.getAttribute('y');
    z = vizElement.getAttribute('z');

    if (x) data.x = +x;
    if (y) data.y = +y;
    if (z) data.z = +z;
  }

  //-- 4) Shape
  vizElement = getFirstMatchingVizTag(element, 'shape');

  if (vizElement) data.shape = vizElement.getAttribute('value');

  //-- 5) Thickness
  vizElement = getFirstMatchingVizTag(element, 'thickness');

  if (vizElement) data.thickness = +vizElement.getAttribute('value');

  return data;
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
   * @param {function}        Graph  - A graphology constructor.
   * @param {string|Document} source - The source to parse.
   * @param {object}          options - Parsing options.
   */

  // TODO: option to map the data to the attributes for customization, nodeModel, edgeModel, nodeReducer, edgeReducer
  // TODO: option to disable the model mapping heuristic
  return function parse(Graph, source, options) {
    options = options || {};

    var addMissingNodes = options.addMissingNodes === true;
    var allowUndeclaredAttributes = options.allowUndeclaredAttributes === true;
    var respectInputGraphType = options.respectInputGraphType === true;
    var mergeResult;

    var xmlDoc = source;

    var element, result, type, attributes, id, s, t, i, l;

    if (!isGraphConstructor(Graph))
      throw new Error('graphology-gexf/parser: invalid Graph constructor.');

    // If source is a string, we are going to parse it
    if (typeof source === 'string')
      xmlDoc = new DOMParser().parseFromString(source, 'application/xml');

    if (!(xmlDoc instanceof Document))
      throw new Error(
        'graphology-gexf/parser: source should either be a XML document or a string.'
      );

    // Finding useful elements
    var GRAPH_ELEMENT = xmlDoc.getElementsByTagName('graph')[0];
    var META_ELEMENT = xmlDoc.getElementsByTagName('meta')[0];
    var META_ELEMENTS = (META_ELEMENT && META_ELEMENT.childNodes) || [];
    var NODE_ELEMENTS = xmlDoc.getElementsByTagName('node');
    var EDGE_ELEMENTS = xmlDoc.getElementsByTagName('edge');
    var MODEL_ELEMENTS = xmlDoc.getElementsByTagName('attributes');
    var NODE_MODEL_ELEMENTS = [];
    var EDGE_MODEL_ELEMENTS = [];

    for (i = 0, l = MODEL_ELEMENTS.length; i < l; i++) {
      element = MODEL_ELEMENTS[i];

      if (element.getAttribute('class') === 'node')
        NODE_MODEL_ELEMENTS = element.getElementsByTagName('attribute');
      else if (element.getAttribute('class') === 'edge')
        EDGE_MODEL_ELEMENTS = element.getElementsByTagName('attribute');
    }

    // Information
    var DEFAULT_EDGE_TYPE =
      GRAPH_ELEMENT.getAttribute('defaultedgetype') || 'undirected';

    if (DEFAULT_EDGE_TYPE === 'mutual') DEFAULT_EDGE_TYPE = 'undirected';

    // Computing models
    result = extractModel(NODE_MODEL_ELEMENTS);

    var NODE_MODEL = result[0];
    var NODE_DEFAULT_ATTRIBUTES = result[1];

    result = extractModel(EDGE_MODEL_ELEMENTS);

    var EDGE_MODEL = result[0];
    var EDGE_DEFAULT_ATTRIBUTES = result[1];

    // Polling the first edge to guess the type of the edges
    var graphType = EDGE_ELEMENTS[0]
      ? EDGE_ELEMENTS[0].getAttribute('type') || DEFAULT_EDGE_TYPE
      : 'mixed';

    // Instantiating our graph
    var graphOptions = respectInputGraphType ? {} : {type: graphType};

    var graph = new Graph(graphOptions);

    // Collecting meta
    var meta = collectMeta(META_ELEMENTS);
    var lastModifiedDate =
      META_ELEMENT && META_ELEMENT.getAttribute('lastmodifieddate');

    graph.replaceAttributes(meta);

    if (lastModifiedDate)
      graph.setAttribute('lastModifiedDate', lastModifiedDate);

    // Adding nodes
    for (i = 0, l = NODE_ELEMENTS.length; i < l; i++) {
      element = NODE_ELEMENTS[i];

      graph.addNode(
        element.getAttribute('id'),
        collectAttributes(
          NODE_MODEL,
          NODE_DEFAULT_ATTRIBUTES,
          element,
          allowUndeclaredAttributes
        )
      );
    }

    // Adding edges
    for (i = 0, l = EDGE_ELEMENTS.length; i < l; i++) {
      element = EDGE_ELEMENTS[i];

      id = element.getAttribute('id');
      type = element.getAttribute('type') || DEFAULT_EDGE_TYPE;
      s = element.getAttribute('source');
      t = element.getAttribute('target');
      attributes = collectAttributes(
        EDGE_MODEL,
        EDGE_DEFAULT_ATTRIBUTES,
        element,
        allowUndeclaredAttributes
      );

      // If we encountered an edge with a different type, we upgrade the graph
      if (type !== graph.type && graph.type !== 'mixed') {
        if (respectInputGraphType)
          throw new Error(
            "graphology-gexf/parser: one of the file's edges does not respect the input graph type: " +
              graph.type +
              '.'
          );

        graph = graph.copy({type: 'mixed'});
      }

      // If we encountered twice the same edge, we upgrade the graph
      if (
        !graph.multi &&
        ((type === 'directed' && graph.hasDirectedEdge(s, t)) ||
          graph.hasUndirectedEdge(s, t))
      ) {
        if (respectInputGraphType)
          throw new Error(
            'graphology-gexf/parser: the file contains parallel edges that the input graph type does not allow.'
          );

        graph = graph.copy({multi: true});
      }

      mergeResult = mergeEdge(
        graph,
        type !== 'directed',
        id || null,
        s,
        t,
        attributes
      );

      if (!addMissingNodes && (mergeResult[2] || mergeResult[3])) {
        throw new Error(
          'graphology-gexf/parser: one of your gexf file edges points to an inexisting node. Set the parser `addMissingNodes` option to `true` if you do not care.'
        );
      }
    }

    return graph;
  };
};
