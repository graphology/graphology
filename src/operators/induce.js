/**
 * Graphology Operators Induce
 * ===========================
 *
 * Function used to induce a graph by community.
 */
var isGraph = require('graphology-utils/is-graph');
var Graph = require('graphology');
var createNodeValueGetter =
  require('graphology-utils/getters').createNodeValueGetter;

module.exports = function induce(
  graph,
  getNodePartition,
  keepSelfLoops,
  options
) {
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

  getNodePartition = createNodeValueGetter(getNodePartition).fromEntry;

  var resultGraph = new Graph();

  graph.forEachNode(function (key, nodeAttr) {
    var partition = getNodePartition(key, nodeAttr);

    if (!resultGraph.hasNode(partition)) {
      if (mergeNode) {
        resultGraph.mergeNode(partition, nodeAttr);
      } else {
        resultGraph.mergeNode(partition);
      }
    } else if (mergeNode) {
      resultGraph.mergeNodeAttributes(
        partition,
        mergeNode(resultGraph.getNodeAttributes(partition), nodeAttr)
      );
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

    if (!resultGraph.hasEdge(sourcePartition, targetPartition)) {
      if (keepSelfLoops && sourcePartition === targetPartition) {
        if (undirected) {
          if (mergeEdge) {
            resultGraph.addUndirectedEdge(
              sourcePartition,
              sourcePartition,
              attr
            );
          } else {
            resultGraph.addUndirectedEdge(sourcePartition, sourcePartition);
          }
        } else {
          if (mergeEdge) {
            resultGraph.addDirectedEdge(sourcePartition, sourcePartition, attr);
          } else {
            resultGraph.addDirectedEdge(sourcePartition, sourcePartition);
          }
        }
      } else if (sourcePartition !== targetPartition) {
        if (undirected) {
          if (mergeEdge) {
            resultGraph.addUndirectedEdge(
              sourcePartition,
              targetPartition,
              attr
            );
          } else {
            resultGraph.addUndirectedEdge(sourcePartition, targetPartition);
          }
        } else {
          if (mergeEdge) {
            resultGraph.addDirectedEdge(sourcePartition, targetPartition, attr);
          } else {
            resultGraph.addDirectedEdge(sourcePartition, targetPartition);
          }
        }
      }
    } else {
      var edgeAttr = resultGraph.getEdgeAttributes(
        sourcePartition,
        targetPartition
      );
      if (Object.keys(edgeAttr).length === 0 && mergeEdge) {
        resultGraph.mergeEdgeAttributes(sourcePartition, targetPartition, attr);
      }

      if (mergeEdge) {
        resultGraph.mergeEdgeAttributes(
          sourcePartition,
          targetPartition,
          mergeEdge(
            resultGraph.getEdgeAttributes(sourcePartition, targetPartition),
            attr
          )
        );
      }
    }
  });
  return resultGraph;
};
