/**
 * Graphology Shortest Path
 * =========================
 *
 * Library endpoint.
 */
var unweighted = require('./unweighted.js');
var utils = require('./utils.js');

exports.unweighted = unweighted;
exports.dijkstra = require('./dijkstra.js');
exports.astar = require('./astar.js');

exports.bidirectional = unweighted.bidirectional;
exports.singleSource = unweighted.singleSource;
exports.singleSourceLength = unweighted.singleSourceLength;
exports.undirectedSingleSourceLength = unweighted.undirectedSingleSourceLength;
exports.brandes = unweighted.brandes;

exports.edgePathFromNodePath = utils.edgePathFromNodePath;
