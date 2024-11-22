exports.hasCycle = require('./has-cycle.js');
exports.willCreateCycle = require('./will-create-cycle.js');

const transitive = require('./transitive');
exports.forEachTransitiveRelation = transitive.forEachTransitiveRelation;
exports.bypassNode = transitive.bypassNode;

const sort = require('./topological-sort');
exports.forEachNodeInTopologicalOrder = sort.forEachNodeInTopologicalOrder;
exports.topologicalSort = sort.topologicalSort;
exports.topologicalGenerations = sort.topologicalGenerations;
exports.forEachTopologicalGeneration = sort.forEachTopologicalGeneration;
