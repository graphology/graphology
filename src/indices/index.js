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
exports.OutboundNeighborhoodIndex = neighborhood.OutboundNeighborhoodIndex;
exports.WeightedOutboundNeighborhoodIndex =
  neighborhood.WeightedOutboundNeighborhoodIndex;
exports.SortedComponentsIndex = require('./sorted-components.js');
