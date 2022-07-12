/**
 * Graphology Operators To Simple Caster
 * ======================================
 *
 * Function used to cast a multi graph to a simple one.
 */
var isGraph = require('graphology-utils/is-graph');
var copyEdge = require('graphology-utils/add-edge').copyEdge;

module.exports = function toSimple(multiGraph, options) {
  if (!isGraph(multiGraph))
    throw new Error(
      'graphology-operators/to-simple: expecting a valid graphology instance.'
    );

  if (typeof options === 'function') options = {mergeEdge: options};

  options = options || {};

  var mergeEdge =
    typeof options.mergeEdge === 'function' ? options.mergeEdge : null;

  // The graph is not multi. We just return a plain copy
  if (!multiGraph.multi) return multiGraph.copy();

  // Creating a tweaked empty copy
  var simpleGraph = multiGraph.emptyCopy({multi: false});

  // Processing edges
  multiGraph.forEachEdge(function (
    edge,
    attr,
    source,
    target,
    _sa,
    _ta,
    undirected
  ) {
    var existingEdge = undirected
      ? simpleGraph.undirectedEdge(source, target)
      : simpleGraph.directedEdge(source, target);

    if (existingEdge) {
      if (mergeEdge) {
        simpleGraph.replaceEdgeAttributes(
          existingEdge,
          mergeEdge(simpleGraph.getEdgeAttributes(existingEdge), attr)
        );
      }
      return;
    }

    copyEdge(simpleGraph, undirected, edge, source, target, attr);
  });

  return simpleGraph;
};
