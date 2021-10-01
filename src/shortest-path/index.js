/**
 * Graphology Shortest Path
 * =========================
 *
 * Library endpoint.
 */
var dijkstra = require('./dijkstra.js');
var unweighted = require('./unweighted.js');

unweighted.dijkstra = dijkstra;
unweighted.unweighted = unweighted;

module.exports = unweighted;
