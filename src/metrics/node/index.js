var wd = require('./weighted-degree.js');

exports.clusteringAmbiguity = require('./clustering-ambiguity.js');
exports.eccentricity = require('./eccentricity.js');

exports.weightedDegree = wd.weightedDegree;
exports.weightedInDegree = wd.weightedInDegree;
exports.weightedOutDegree = wd.weightedOutDegree;
exports.weightedInboundDegree = wd.weightedInboundDegree;
exports.weightedOutboundDegree = wd.weightedOutboundDegree;
exports.weightedUndirectedDegree = wd.weightedUndirectedDegree;
exports.weightedDirectedDegree = wd.weightedDirectedDegree;
