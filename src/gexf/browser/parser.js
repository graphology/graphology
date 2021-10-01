/**
 * Graphology Browser GEXF Parser
 * ===============================
 *
 * Browser version of the graphology GEXF parser.
 */
var createParserFunction = require('../common/parser.js');

module.exports = createParserFunction(DOMParser, Document);
