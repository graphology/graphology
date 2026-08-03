/**
 * Graphology Common DOT Writer
 * =============================
 *
 * DOT writer working for both node.js & the browser.
 */
var isGraph = require('graphology-utils/is-graph');
var inferType = require('graphology-utils/infer-type');

/**
 * Constants.
 */
var SPECIAL_ID_REGEX = /[\s"{}[\],;=:-><#]/;
var SIMPLE_ID_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

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
    value === ''
  );
}

/**
 * Function used to escape a string value for DOT output.
 * Escapes backslash, double quotes, and whitespace control characters
 * so the output is valid for Graphviz rendering.
 *
 * DOT recognizes the following escape sequences inside quoted strings:
 *   \\  -> backslash
 *   \"  -> double quote
 *   \n  -> newline
 *   \r  -> carriage return
 *   \t  -> tab
 *
 * @param  {string} value - Target value.
 * @return {string}
 */
function escapeString(value) {
  return (
    '"' +
    String(value)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t') +
    '"'
  );
}

/**
 * Function used to format an attribute value for DOT.
 *
 * @param  {any} value - Target value.
 * @return {string}
 */
function formatAttributeValue(value) {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return '' + value;
  if (typeof value === 'string') {
    // Simple identifiers don't need quoting
    if (SIMPLE_ID_REGEX.test(value) && !/^\d/.test(value)) {
      return value;
    }
    return escapeString(value);
  }
  return escapeString(String(value));
}

/**
 * Function used to format a node/edge id for DOT output.
 * Quoted if it contains special characters.
 *
 * @param  {string} id - Node or edge id.
 * @return {string}
 */
function formatId(id) {
  if (SPECIAL_ID_REGEX.test(String(id)) || /^\d/.test(String(id))) {
    return escapeString(String(id));
  }
  return String(id);
}

/**
 * Function used to write attributes in DOT format.
 *
 * @param  {object} attributes - Attributes to write.
 * @return {string}
 */
function writeAttributes(attributes) {
  if (!attributes) return '';

  var keys = Object.keys(attributes).filter(function (k) {
    return !isEmptyValue(attributes[k]);
  });

  if (keys.length === 0) return '';

  var parts = keys.map(function (k) {
    return k + '=' + formatAttributeValue(attributes[k]);
  });

  return ' [' + parts.join(', ') + ']';
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
 * Defaults.
 */
function identity(key, attributes) {
  return attributes;
}

var DEFAULTS = {
  formatNode: identity,
  formatEdge: identity
};

/**
 * Function taking a graphology instance & outputting a DOT string.
 *
 * @param  {Graph}   graph            - Target graphology instance.
 * @param  {object}  options          - Options:
 * @param  {function}  [formatNode]   - Function formatting nodes' attributes.
 * @param  {function}  [formatEdge]   - Function formatting edges' attributes.
 * @return {string}                   - DOT string.
 */
module.exports = function write(graph, options) {
  if (!isGraph(graph))
    throw new Error('graphology-dot/writer: invalid graphology instance.');

  options = options || {};

  var formatNode = options.formatNode || DEFAULTS.formatNode;
  var formatEdge = options.formatEdge || DEFAULTS.formatEdge;

  var graphType = inferType(graph);
  var isDirected = graphType === 'directed';

  var keyword = isDirected ? 'digraph' : 'graph';

  var lines = [];

  // Graph header
  var graphId = graph.getAttribute('id');
  var header = keyword;
  if (graphId && typeof graphId === 'string') {
    header += ' ' + formatId(graphId);
  }
  header += ' {';
  lines.push(header);

  // Collect node and edge data
  var nodes = collectNodeData(graph, formatNode);
  var edges = collectEdgeData(graph, formatEdge);

  // Graph-level attributes (excluding 'id' which is used for the graph name)
  var graphAttrs = graph.getAttributes();
  var graphAttrKeys = Object.keys(graphAttrs).filter(function (k) {
    return k !== 'id' && !isEmptyValue(graphAttrs[k]);
  });

  if (graphAttrKeys.length > 0) {
    var graphAttrParts = graphAttrKeys.map(function (k) {
      return k + '=' + formatAttributeValue(graphAttrs[k]);
    });
    lines.push('  graph [' + graphAttrParts.join(', ') + '];');
  }

  // Write nodes
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    var nodeLine = '  ' + formatId(node.key);
    var nodeAttrs = writeAttributes(node.attributes);
    if (nodeAttrs) nodeLine += nodeAttrs;
    nodeLine += ';';
    lines.push(nodeLine);
  }

  // Write edges
  for (var j = 0, m = edges.length; j < m; j++) {
    var edge = edges[j];
    var op = edge.undirected ? ' -- ' : ' -> ';
    var edgeLine =
      '  ' + formatId(edge.source) + op + formatId(edge.target);
    var edgeAttrs = writeAttributes(edge.attributes);
    if (edgeAttrs) edgeLine += edgeAttrs;
    edgeLine += ';';
    lines.push(edgeLine);
  }

  lines.push('}');

  return lines.join('\n');
};
