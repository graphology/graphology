/**
 * Graphology Browser GRAPHML Writer Unit Tests
 * ============================================
 */
var common = require('../common.js');
var parser = require('../../browser/parser.js');
var writer = require('../../browser/writer.js');

common.testWriter(writer, parser);
