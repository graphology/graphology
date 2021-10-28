/**
 * Graphology Node GEXF Endpoint
 * ==============================
 *
 * Endpoint gathering both parser & writer for Node.js.
 */
var xmldom = require('@xmldom/xmldom');
var createParserFunction = require('../common/parser.js');

var doc = new xmldom.DOMParser().parseFromString('<t></t>', 'application/xml');

exports.parse = createParserFunction(xmldom.DOMParser, doc.constructor);
exports.write = require('../common/writer.js');
