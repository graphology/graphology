/**
 * Graphology Utils
 * =================
 *
 * Library endpoint.
 */
var addEdgeModule = require('./add-edge');
var addNodeModule = require('./add-node');

exports.addEdge = addEdgeModule.addEdge;
exports.copyEdge = addEdgeModule.copyEdge;
exports.mergeEdge = addEdgeModule.mergeEdge;
exports.updateEdge = addEdgeModule.updateEdge;
exports.copyNode = addNodeModule.updateNode;
exports.inferType = require('./infer-type.js');
exports.isGraph = require('./is-graph.js');
exports.isGraphConstructor = require('./is-graph-constructor.js');
exports.mergeClique = require('./merge-clique.js');
exports.mergeCycle = require('./merge-cycle.js');
exports.mergePath = require('./merge-path.js');
exports.mergeStar = require('./merge-star.js');
exports.renameGraphKeys = require('./rename-graph-keys.js');
exports.updateGraphKeys = require('./update-graph-keys.js');
exports.memoizedForEach = require('./memoized-for-each.js');
