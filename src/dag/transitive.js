const {NotFoundGraphError} = require('graphology');

/**
 * Graphology Transitive DAG operation
 * ====================================
 *
 * Function that takes a cartesian product of a node's in-edges with
 * its out-edges and performs an operation on each pair.
 *
 * This function is m*n in time and space, where m is the node's in-degree
 * and n is the node's out-degree.
 */
function forEachTransitiveRelation(graph, node, callback) {
  if (graph.getNodeAttributes(node) === undefined) {
    throw new NotFoundGraphError(`Node '${node}' not found`);
  }

  let currentInEdge, currentInEdgeAttrs, currentSrc, currentSrcAttrs;

  function execCb(
    outEdge,
    outEdgeAttrs,
    middleNode,
    target,
    middleNodeAttrs,
    targetAttrs
  ) {
    callback(
      currentInEdge,
      outEdge,
      currentInEdgeAttrs,
      outEdgeAttrs,
      currentSrc,
      middleNode,
      target,
      currentSrcAttrs,
      middleNodeAttrs,
      targetAttrs
    );
  }

  graph.forEachInboundEdge(
    node,
    (edge, attributes, source, target, sourceAttributes) => {
      currentInEdge = edge;
      currentInEdgeAttrs = attributes;
      currentSrc = source;
      currentSrcAttrs = sourceAttributes;
      graph.forEachOutboundEdge(node, execCb);
    }
  );
}

/**
 * Graphology Node Bypass
 * =======================
 *
 * Function that fully connects each of a node's in-neighbors to its
 * out-neighbors, so that the node can be dropped while preserving its
 * neighbors' relative order with one another.
 *
 * If an edge already exists between a particular pair of nodes, a new
 * edge is not created, even in a MultiGraph. The new edges have no
 * attributes even if attributes were present on the edges connecting
 * through the bypassed node.

 * This function is m*n in time and space, where m is the node's in-degree
 * and n is the node's out-degree.
 */
function bypassNode(graph, node) {
  if (graph.getNodeAttributes(node) === undefined) {
    throw new NotFoundGraphError(`Node '${node}' not found`);
  }

  const connectThrough = graph.multi
    ? (
        _inEdge,
        _outEdge,
        _inEdgeAttrs,
        _outEdgeAttrs,
        source,
        _node,
        target
      ) => {
        if (graph.edges(source, target).length === 0) {
          graph.addEdge(source, target);
        }
      }
    : (
        _inEdge,
        _outEdge,
        _inEdgeAttrs,
        _outEdgeAttrs,
        source,
        _node,
        target
      ) => {
        graph.mergeEdge(source, target);
      };
  forEachTransitiveRelation(graph, node, connectThrough);
}

module.exports.forEachTransitiveRelation = forEachTransitiveRelation;
module.exports.bypassNode = bypassNode;
