/**
 * Graphology Indices
 * ===================
 *
 * Library endpoint.
 */
var louvain = require('./louvain.js');
var neighborhood = require('./neighborhood.js');

exports.UndirectedLouvainIndex = louvain.UndirectedLouvainIndex;
exports.DirectedLouvainIndex = louvain.DirectedLouvainIndex;
exports.NeighborhoodIndex = neighborhood.NeighborhoodIndex;
exports.WeightedNeighborhoodIndex = neighborhood.WeightedNeighborhoodIndex;
exports.SortedComponentsIndex = require('./sorted-components.js');
