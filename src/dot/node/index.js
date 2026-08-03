/**
 * Graphology Node DOT Endpoint
 * =============================
 *
 * Endpoint gathering both parser & writer for Node.js.
 */
var createParserFunction = require('../common/parser.js');

exports.parse = createParserFunction();
exports.write = require('../common/writer.js');
