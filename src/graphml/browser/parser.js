/**
 * Graphology Browser GRAPHML Parser
 * ==================================
 *
 * Browser version of the graphology GRAPHML parser.
 */
var createParserFunction = require('../common/parser.js');

module.exports = createParserFunction(DOMParser, Document);
