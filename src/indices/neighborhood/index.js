/**
 * Graphology Neighborhood Indices
 * ================================
 */
var outbound = require('./outbound.js'),
    louvain = require('./louvain.js');

exports.OutboundNeighborhoodIndex = outbound.OutboundNeighborhoodIndex;
exports.WeightedOutboundNeighborhoodIndex = outbound.WeightedOutboundNeighborhoodIndex;
exports.UndirectedLouvainIndex = louvain.UndirectedLouvainIndex;
exports.DirectedLouvainIndex = louvain.DirectedLouvainIndex;
