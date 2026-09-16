/**
 * Graphology DOT Parser
 * ======================
 *
 * graphology DOT parser using a recursive descent parser.
 */
var isGraphConstructor = require('graphology-utils/is-graph-constructor');
var mergeEdge = require('graphology-utils/add-edge').mergeEdge;
var toMixed = require('graphology-operators/to-mixed');
var toMulti = require('graphology-operators/to-multi');

var DEFAULTS = require('./defaults.js');
var DEFAULT_FORMATTER = DEFAULTS.DEFAULT_FORMATTER;

/**
 * Token types.
 */
var TOKEN = {
  LBRACE: '{',
  RBRACE: '}',
  LBRACK: '[',
  RBRACK: ']',
  SEMI: ';',
  COMMA: ',',
  EQUALS: '=',
  COLON: ':',
  ARROW: '->',
  DASH: '--',
  ID: 'ID',
  NUM: 'NUM',
  STRING: 'STRING',
  HTML: 'HTML',
  EOF: 'EOF'
};

/**
 * Tokenizer class.
 */
function Tokenizer(string) {
  this.string = string;
  this.pos = 0;
  this.line = 1;
  this.col = 1;
}

Tokenizer.prototype.peek = function () {
  if (this.pos >= this.string.length) return '';
  return this.string[this.pos];
};

Tokenizer.prototype.advance = function () {
  var ch = this.string[this.pos++];
  if (ch === '\n') {
    this.line++;
    this.col = 1;
  } else {
    this.col++;
  }
  return ch;
};

Tokenizer.prototype.skipWhitespace = function () {
  while (this.pos < this.string.length) {
    var ch = this.peek();
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      this.advance();
    } else {
      break;
    }
  }
};

Tokenizer.prototype.skipLineComment = function () {
  while (this.pos < this.string.length && this.peek() !== '\n') {
    this.advance();
  }
};

Tokenizer.prototype.skipBlockComment = function () {
  this.advance(); // skip *
  while (this.pos < this.string.length) {
    var ch = this.advance();
    if (ch === '*' && this.peek() === '/') {
      this.advance(); // skip /
      return;
    }
  }
};

Tokenizer.prototype.readString = function () {
  this.advance(); // skip opening "
  var result = '';
  while (this.pos < this.string.length) {
    var ch = this.advance();
    if (ch === '"') return result;
    if (ch === '\\') {
      var next = this.advance();
      if (next === 'n') result += '\n';
      else if (next === 't') result += '\t';
      else if (next === 'r') result += '\r';
      else result += next;
    } else {
      result += ch;
    }
  }
  return result;
};

Tokenizer.prototype.readHTML = function () {
  var result = '<';
  var depth = 1;
  while (this.pos < this.string.length) {
    var ch = this.advance();
    result += ch;
    if (ch === '<' && this.peek() !== '>') depth++;
    if (ch === '>') {
      depth--;
      if (depth === 0) return result;
    }
  }
  return result;
};

Tokenizer.prototype.readIdentifier = function () {
  var result = '';
  while (this.pos < this.string.length) {
    var ch = this.peek();
    if (/[a-zA-Z0-9_.]/.test(ch)) {
      result += this.advance();
    } else {
      break;
    }
  }
  return result;
};

Tokenizer.prototype.readNumber = function () {
  var result = '';
  var hasDot = false;
  while (this.pos < this.string.length) {
    var ch = this.peek();
    if (/[0-9]/.test(ch)) {
      result += this.advance();
    } else if (ch === '.' && !hasDot) {
      hasDot = true;
      result += this.advance();
    } else {
      break;
    }
  }
  return result;
};

Tokenizer.prototype.nextToken = function () {
  while (this.pos < this.string.length) {
    this.skipWhitespace();

    if (this.pos >= this.string.length) break;

    var ch = this.peek();

    // Comments
    if (ch === '/' && this.string[this.pos + 1] === '/') {
      this.advance();
      this.advance();
      this.skipLineComment();
      continue;
    }

    if (ch === '/' && this.string[this.pos + 1] === '*') {
      this.advance();
      this.skipBlockComment();
      continue;
    }

    // Line comment with #
    if (ch === '#') {
      this.advance();
      this.skipLineComment();
      continue;
    }

    // Single-character tokens
    if (ch === '{') { this.advance(); return {type: TOKEN.LBRACE, value: '{'}; }
    if (ch === '}') { this.advance(); return {type: TOKEN.RBRACE, value: '}'}; }
    if (ch === '[') { this.advance(); return {type: TOKEN.LBRACK, value: '['}; }
    if (ch === ']') { this.advance(); return {type: TOKEN.RBRACK, value: ']'}; }
    if (ch === ';') { this.advance(); return {type: TOKEN.SEMI, value: ';'}; }
    if (ch === ',') { this.advance(); return {type: TOKEN.COMMA, value: ','}; }
    if (ch === '=') { this.advance(); return {type: TOKEN.EQUALS, value: '='}; }
    if (ch === ':') { this.advance(); return {type: TOKEN.COLON, value: ':'}; }

    // Edge operators
    if (ch === '-' && this.string[this.pos + 1] === '>') {
      this.advance();
      this.advance();
      return {type: TOKEN.ARROW, value: '->'};
    }

    if (ch === '-' && this.string[this.pos + 1] === '-') {
      this.advance();
      this.advance();
      return {type: TOKEN.DASH, value: '--'};
    }

    // Strings
    if (ch === '"') {
      return {type: TOKEN.STRING, value: this.readString()};
    }

    // HTML strings
    if (ch === '<') {
      var html = this.readHTML();
      return {type: TOKEN.HTML, value: html};
    }

    // Numbers (including negative)
    if (ch === '-' && /[0-9]/.test(this.string[this.pos + 1])) {
      var num = '-' + this.readNumber();
      return {type: TOKEN.NUM, value: parseFloat(num)};
    }

    if (/[0-9]/.test(ch)) {
      return {type: TOKEN.NUM, value: parseFloat(this.readNumber())};
    }

    // Identifiers
    if (/[a-zA-Z_]/.test(ch)) {
      var id = this.readIdentifier();
      return {type: TOKEN.ID, value: id};
    }

    // Skip unknown character
    this.advance();
  }

  return {type: TOKEN.EOF, value: null};
};

/**
 * Parser class.
 */
function Parser(tokens) {
  this.tokens = tokens;
  this.pos = 0;
}

Parser.prototype.peek = function () {
  return this.tokens[this.pos];
};

Parser.prototype.consume = function () {
  return this.tokens[this.pos++];
};

Parser.prototype.expect = function (type) {
  var token = this.peek();
  if (token.type !== type)
    throw new Error(
      'graphology-dot/parser: expected "' +
        type +
        '" but got "' +
        token.type +
        '"'
    );
  return this.consume();
};

Parser.prototype.maybeConsume = function (type) {
  if (this.peek().type === type) return this.consume();
  return null;
};

Parser.prototype.maybeConsumeSemi = function () {
  this.maybeConsume(TOKEN.SEMI);
  this.maybeConsume(TOKEN.COMMA);
};

/**
 * Function used to cast an attribute value to its proper type.
 */
function castValue(value, tokenType) {
  // Numbers are already parsed as numbers by the tokenizer
  if (tokenType === TOKEN.NUM) return value;

  // Strings are always strings
  if (tokenType === TOKEN.STRING) return value;

  // ID tokens: check for booleans
  if (tokenType === TOKEN.ID) {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }

  return value;
}

/**
 * Parses an a_list and returns a map of key-value pairs.
 */
Parser.prototype.parseAList = function () {
  var attrs = {};
  this.expect(TOKEN.LBRACK);

  while (this.peek().type !== TOKEN.RBRACK && this.peek().type !== TOKEN.EOF) {
    var key = this.expect(TOKEN.ID).value;

    if (this.peek().type === TOKEN.EQUALS) {
      this.consume(); // skip =
      var valueToken = this.peek();
      if (
        valueToken.type === TOKEN.ID ||
        valueToken.type === TOKEN.NUM ||
        valueToken.type === TOKEN.STRING
      ) {
        attrs[key] = castValue(this.consume().value, valueToken.type);
      } else {
        throw new Error(
          'graphology-dot/parser: expected attribute value but got "' +
            valueToken.type +
            '"'
        );
      }
    } else {
      // Bare key means boolean true
      attrs[key] = true;
    }

    this.maybeConsume(TOKEN.COMMA);
    this.maybeConsume(TOKEN.SEMI);
  }

  this.expect(TOKEN.RBRACK);
  return attrs;
};

/**
 * Parses a node_id which can have port/compass syntax.
 */
Parser.prototype.parseNodeId = function () {
  var id = '';
  var token = this.peek();

  if (token.type === TOKEN.ID) {
    id = this.consume().value;
  } else if (token.type === TOKEN.STRING) {
    id = this.consume().value;
  } else if (token.type === TOKEN.NUM) {
    id = '' + this.consume().value;
  } else {
    throw new Error(
      'graphology-dot/parser: expected node id but got "' + token.type + '"'
    );
  }

  // Port syntax: node:port or node:port:compass
  if (this.peek().type === TOKEN.COLON) {
    this.consume(); // skip :
    var port = this.peek();
    if (port.type === TOKEN.ID || port.type === TOKEN.STRING) {
      id += ':' + this.consume().value;
    }

    if (this.peek().type === TOKEN.COLON) {
      this.consume(); // skip :
      var compass = this.peek();
      if (compass.type === TOKEN.ID || compass.type === TOKEN.STRING) {
        id += ':' + this.consume().value;
      }
    }
  }

  return id;
};

/**
 * Parses an attribute statement: graph|node|edge [attrs]
 */
Parser.prototype.parseAttrStmt = function () {
  var kind = this.consume().value; // graph, node, or edge
  var attrs = this.parseAList();
  return {type: 'attr_stmt', kind: kind, attrs: attrs};
};

/**
 * Parses a subgraph.
 */
Parser.prototype.parseSubgraph = function () {
  var name = null;

  // Optional 'subgraph' keyword
  if (this.peek().type === TOKEN.ID && this.peek().value === 'subgraph') {
    this.consume(); // skip subgraph

    // Optional name
    var token = this.peek();
    if (
      token.type === TOKEN.ID ||
      token.type === TOKEN.STRING ||
      token.type === TOKEN.NUM
    ) {
      // Don't consume if it's '{' — anonymous subgraph
      if (token.type !== TOKEN.ID || token.value !== 'subgraph') {
        name = '' + this.consume().value;
      }
    }
  }

  this.expect(TOKEN.LBRACE);
  var stmts = this.parseStmtList();
  this.expect(TOKEN.RBRACE);

  return {type: 'subgraph', name: name, stmts: stmts};
};

/**
 * Parses a node statement: node_id [attrs]
 */
Parser.prototype.parseNodeStmt = function (nodeId) {
  var id = nodeId || this.parseNodeId();
  var attrs = {};

  if (this.peek().type === TOKEN.LBRACK) {
    attrs = this.parseAList();
  }

  return {type: 'node_stmt', id: id, attrs: attrs};
};

/**
 * Parses an edge statement: (node_id | subgraph) edge_op (node_id | subgraph) [edge_op ...] [attrs]
 */
Parser.prototype.parseEdgeStmt = function (firstNode) {
  var nodes = [];
  var edgeOps = [];

  // First node could be a subgraph or node
  if (firstNode && firstNode.type === 'subgraph') {
    nodes.push(firstNode);
  } else if (firstNode) {
    nodes.push({type: 'node_id', id: firstNode});
  } else {
    var token = this.peek();
    if (token.type === TOKEN.ID && token.value === 'subgraph') {
      nodes.push(this.parseSubgraph());
    } else if (token.type === TOKEN.LBRACE) {
      // Anonymous subgraph
      this.consume();
      var stmts = this.parseStmtList();
      this.expect(TOKEN.RBRACE);
      nodes.push({type: 'subgraph', name: null, stmts: stmts});
    } else {
      nodes.push({type: 'node_id', id: this.parseNodeId()});
    }
  }

  // Parse edge operators and targets
  while (
    this.peek().type === TOKEN.ARROW ||
    this.peek().type === TOKEN.DASH
  ) {
    edgeOps.push(this.consume().value);

    var nextToken = this.peek();
    if (nextToken.type === TOKEN.ID && nextToken.value === 'subgraph') {
      nodes.push(this.parseSubgraph());
    } else if (nextToken.type === TOKEN.LBRACE) {
      // Anonymous subgraph
      this.consume();
      var stmts2 = this.parseStmtList();
      this.expect(TOKEN.RBRACE);
      nodes.push({type: 'subgraph', name: null, stmts: stmts2});
    } else {
      nodes.push({type: 'node_id', id: this.parseNodeId()});
    }
  }

  // Optional trailing attribute list
  var attrs = {};
  if (this.peek().type === TOKEN.LBRACK) {
    attrs = this.parseAList();
  }

  return {type: 'edge_stmt', nodes: nodes, edgeOps: edgeOps, attrs: attrs};
};

/**
 * Parses a single statement.
 */
Parser.prototype.parseStmt = function () {
  var token = this.peek();

  if (token.type === TOKEN.EOF || token.type === TOKEN.RBRACE) {
    return null;
  }

  // Subgraph
  if (
    token.type === TOKEN.ID &&
    token.value === 'subgraph'
  ) {
    // Peek ahead - if next is {, it's anonymous subgraph wrapped in keyword
    // Actually it's just subgraph { ... } or subgraph name { ... }
    return this.parseSubgraph();
  }

  // Anonymous subgraph: { ... }
  if (token.type === TOKEN.LBRACE) {
    this.consume();
    var stmts = this.parseStmtList();
    this.expect(TOKEN.RBRACE);
    return {type: 'subgraph', name: null, stmts: stmts};
  }

  // Attribute statement: graph | node | edge
  if (
    token.type === TOKEN.ID &&
    (token.value === 'graph' ||
      token.value === 'node' ||
      token.value === 'edge')
  ) {
    // Peek ahead to see if this is an attr_stmt (followed by '[')
    // or an edge start where a node is named 'graph', 'node', or 'edge'
    var nextPos = this.pos + 1;
    if (
      nextPos < this.tokens.length &&
      this.tokens[nextPos].type === TOKEN.LBRACK
    ) {
      return this.parseAttrStmt();
    }
  }

  // At this point, we expect a node_id or an edge statement
  var firstToken = this.peek();

  // It's an edge if after the first node_id/subgraph comes -> or --
  // But we need to look ahead. First, check if we have a node_id
  var firstNode;
  var savedPos = this.pos;

  try {
    if (firstToken.type === TOKEN.ID && firstToken.value === 'subgraph') {
      firstNode = this.parseSubgraph();
    } else if (firstToken.type === TOKEN.LBRACE) {
      this.consume();
      var innerStmts = this.parseStmtList();
      this.expect(TOKEN.RBRACE);
      firstNode = {type: 'subgraph', name: null, stmts: innerStmts};
    } else {
      firstNode = this.parseNodeId();
    }
  } catch (e) {
    this.pos = savedPos;
    throw e;
  }

  // Check if next is an edge operator
  if (
    this.peek().type === TOKEN.ARROW ||
    this.peek().type === TOKEN.DASH
  ) {
    return this.parseEdgeStmt(
      typeof firstNode === 'string'
        ? firstNode
        : firstNode
    );
  }

  // Otherwise it's a node statement
  if (typeof firstNode === 'string') {
    return this.parseNodeStmt(firstNode);
  }

  // firstNode is a subgraph used as a standalone — in DOT this is valid
  return firstNode;
};

/**
 * Parses a statement list until } or EOF.
 */
Parser.prototype.parseStmtList = function () {
  var stmts = [];

  while (
    this.peek().type !== TOKEN.EOF &&
    this.peek().type !== TOKEN.RBRACE
  ) {
    var stmt = this.parseStmt();
    if (stmt) stmts.push(stmt);
    this.maybeConsumeSemi();
  }

  return stmts;
};

/**
 * Parses the top-level graph.
 */
Parser.prototype.parse = function () {
  // Optional 'strict' keyword
  var strict = false;
  if (this.peek().type === TOKEN.ID && this.peek().value === 'strict') {
    strict = true;
    this.consume();
  }

  // graph or digraph
  var token = this.expect(TOKEN.ID);
  var isDirected;

  if (token.value === 'graph') {
    isDirected = false;
  } else if (token.value === 'digraph') {
    isDirected = true;
  } else {
    throw new Error(
      'graphology-dot/parser: expected "graph" or "digraph" but got "' +
        token.value +
        '"'
    );
  }

  // Optional graph name/id
  var graphId = null;
  var next = this.peek();
  if (
    next.type === TOKEN.ID ||
    next.type === TOKEN.STRING ||
    next.type === TOKEN.NUM
  ) {
    graphId = '' + this.consume().value;
  }

  this.expect(TOKEN.LBRACE);
  var stmts = this.parseStmtList();
  this.expect(TOKEN.RBRACE);

  return {
    type: 'graph',
    strict: strict,
    directed: isDirected,
    id: graphId,
    stmts: stmts
  };
};

/**
 * Extracts node ids from an AST node/subgraph reference.
 */
function getNodeIds(node) {
  if (!node) return [];

  if (node.type === 'node_id') {
    return [node.id];
  }

  if (node.type === 'subgraph') {
    var ids = [];
    for (var i = 0, l = node.stmts.length; i < l; i++) {
      var stmt = node.stmts[i];
      if (stmt.type === 'node_stmt') {
        ids.push(stmt.id);
      } else if (stmt.type === 'subgraph') {
        ids = ids.concat(getNodeIds(stmt));
      }
    }
    return ids;
  }

  // Direct string (from parseEdgeStmt)
  return ['' + node];
}

/**
 * Process the AST into a graphology instance.
 */
function processGraph(Graph, ast, options) {
  var hasOptions = !!options;

  var graphType = ast.directed ? 'directed' : 'undirected';
  var graph = new Graph({type: graphType});

  if (hasOptions) {
    // Reserved for future parser options.
  }

  // Set graph id
  if (ast.id) graph.setAttribute('id', ast.id);

  var defaultNodeAttrs = {};
  var defaultEdgeAttrs = {};

  /**
   * Flattens subgraph statements into the parent list.
   */
  function flattenStmts(stmts) {
    var result = [];
    for (var i = 0, l = stmts.length; i < l; i++) {
      var stmt = stmts[i];
      if (stmt.type === 'subgraph') {
        result = result.concat(flattenStmts(stmt.stmts));
      } else {
        result.push(stmt);
      }
    }
    return result;
  }

  var flatStmts = flattenStmts(ast.stmts);

  // First pass: collect graph attributes and default attrs
  for (var i = 0, l = flatStmts.length; i < l; i++) {
    var stmt = flatStmts[i];

    if (stmt.type === 'attr_stmt') {
      if (stmt.kind === 'graph') {
        for (var k in stmt.attrs) {
          graph.setAttribute(k, stmt.attrs[k]);
        }
      } else if (stmt.kind === 'node') {
        for (var nk in stmt.attrs) {
          defaultNodeAttrs[nk] = stmt.attrs[nk];
        }
      } else if (stmt.kind === 'edge') {
        for (var ek in stmt.attrs) {
          defaultEdgeAttrs[ek] = stmt.attrs[ek];
        }
      }
    }
  }

  // Second pass: process nodes and edges
  for (var j = 0, l2 = flatStmts.length; j < l2; j++) {
    var stmt2 = flatStmts[j];

    if (stmt2.type === 'node_stmt') {
      var nodeId = stmt2.id;
      var nodeAttrs = {};

      // Apply defaults
      for (var dk in defaultNodeAttrs) {
        nodeAttrs[dk] = defaultNodeAttrs[dk];
      }

      // Apply specific attrs
      for (var ak in stmt2.attrs) {
        nodeAttrs[ak] = stmt2.attrs[ak];
      }

      nodeAttrs = DEFAULT_FORMATTER(nodeAttrs);

      if (!graph.hasNode(nodeId)) {
        graph.addNode(nodeId, nodeAttrs);
      } else {
        graph.mergeNodeAttributes(nodeId, nodeAttrs);
      }
    } else if (stmt2.type === 'edge_stmt') {
      var edgeAttrs = {};

      // Apply defaults
      for (var edk in defaultEdgeAttrs) {
        edgeAttrs[edk] = defaultEdgeAttrs[edk];
      }

      // Apply specific attrs
      for (var eak in stmt2.attrs) {
        edgeAttrs[eak] = stmt2.attrs[eak];
      }

      edgeAttrs = DEFAULT_FORMATTER(edgeAttrs);

      // Process edge chain: a -> b -> c creates edges a->b and b->c
      var nodes = stmt2.nodes;
      var edgeOps = stmt2.edgeOps;

      for (var e = 0, el = edgeOps.length; e < el; e++) {
        var sourceNode = nodes[e];
        var targetNode = nodes[e + 1];
        var op = edgeOps[e];

        // Extract source/target ids from nodes/subgraphs
        var sourceIds = getNodeIds(sourceNode);
        var targetIds = getNodeIds(targetNode);

        // Determine edge type
        var isEdgeDirected;
        if (op === '->') isEdgeDirected = true;
        else if (op === '--') isEdgeDirected = false;
        else isEdgeDirected = ast.directed;

        // Auto-upgrade graph type if needed
        if (graph.type !== 'mixed') {
          if (isEdgeDirected && graph.type === 'undirected') {
            graph = toMixed(graph);
          } else if (!isEdgeDirected && graph.type === 'directed') {
            graph = toMixed(graph);
          }
        }

        // Create edges between source and target nodes
        for (var si = 0, sl = sourceIds.length; si < sl; si++) {
          for (var ti = 0, tl = targetIds.length; ti < tl; ti++) {
            var s = sourceIds[si];
            var t = targetIds[ti];

            // Auto-upgrade to multi if needed
            if (!graph.multi) {
              if (!isEdgeDirected) {
                if (graph.hasUndirectedEdge(s, t)) graph = toMulti(graph);
              } else if (graph.hasDirectedEdge(s, t)) graph = toMulti(graph);
              else if (
                graph.type === 'mixed' &&
                graph.hasUndirectedEdge(s, t)
              ) {
                graph = toMulti(graph);
              }
            }

            mergeEdge(
              graph,
              !isEdgeDirected,
              null,
              s,
              t,
              edgeAttrs
            );

            // DOT format allows implicit node creation through edge statements,
            // so we always allow addMissingNodes behavior.
          }
        }
      }
    }
  }

  return graph;
}

/**
 * Main parser function.
 */
function parse(Graph, source, options) {
  if (!isGraphConstructor(Graph))
    throw new Error('graphology-dot/parser: invalid Graph constructor.');

  if (typeof source !== 'string')
    throw new Error(
      'graphology-dot/parser: source should be a string.'
    );

  var tokenizer = new Tokenizer(source);
  var tokens = [];
  var token;
  while ((token = tokenizer.nextToken()).type !== TOKEN.EOF) {
    tokens.push(token);
  }

  var parser = new Parser(tokens);
  var ast = parser.parse();

  return processGraph(Graph, ast, options);
}

/**
 * Factory returning the parser function.
 * DOT parser is text-based so it doesn't need DOMParser/Document.
 */
module.exports = function createParserFunction() {
  return parse;
};
