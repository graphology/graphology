/**
 * Graphology Operators Induce
 * ===========================
 *
 * Function used to induce a graph by community.
 */
var isGraph = require('graphology-utils/is-graph');
var copyNode = require('graphology-utils/add-node').copyNode;
var copyEdge = require('graphology-utils/add-edge').copyEdge;
var createNodeValueGetter =
  require('graphology-utils/getters').createNodeValueGetter;

module.exports = function induce(graph, getNodePartition, options) {
  if (!isGraph(graph)) {
    throw new Error(
      'graphology-operators/induce: expecting a valid graphology instance.'
    );
  }

  options = options || {};

  var mergeEdge =
    typeof options.mergeEdge === 'function' ? options.mergeEdge : null;

  var mergeNode =
    typeof options.mergeNode === 'function' ? options.mergeNode : null;

  var createSelfLoops =
    typeof options.createSelfLoops === 'boolean'
      ? options.createSelfLoops
      : true;

  getNodePartition = createNodeValueGetter(getNodePartition).fromEntry;

  var resultGraph = graph.nullCopy({multi: false});

  graph.forEachNode(function (key, nodeAttr) {
    var partition = getNodePartition(key, nodeAttr);

    if (!resultGraph.hasNode(partition)) {
      copyNode(resultGraph, partition, mergeNode ? nodeAttr : null);
    } else if (mergeNode) {
      resultGraph.updateNodeAttributes(partition, function (attr) {
        return mergeNode(attr, nodeAttr);
      });
    }
  });

  graph.forEachEdge(function (
    edge,
    attr,
    source,
    target,
    sourceAttributes,
    targetAttributes,
    undirected
  ) {
    var sourcePartition = getNodePartition(source, sourceAttributes);
    var targetPartition = getNodePartition(target, targetAttributes);

    if (
      undirected
        ? !resultGraph.hasUndirectedEdge(sourcePartition, targetPartition)
        : !resultGraph.hasDirectedEdge(sourcePartition, targetPartition)
    ) {
      if (createSelfLoops && sourcePartition === targetPartition)
        copyEdge(
          resultGraph,
          undirected,
          null,
          sourcePartition,
          sourcePartition,
          mergeEdge ? attr : null
        );
      else if (sourcePartition !== targetPartition)
        copyEdge(
          resultGraph,
          undirected,
          null,
          sourcePartition,
          targetPartition,
          mergeEdge ? attr : null
        );
    } else {
      if (undirected) {
        if (mergeEdge) {
          resultGraph.updateUndirectedEdgeAttributes(
            sourcePartition,
            targetPartition,
            function (attributes) {
              return mergeEdge(attributes, attr);
            }
          );
        }
      } else {
        if (mergeEdge) {
          resultGraph.updateDirectedEdgeAttributes(
            sourcePartition,
            targetPartition,
            function (attributes) {
              return mergeEdge(attributes, attr);
            }
          );
        }
      }
    }
  });
  return resultGraph;
};
