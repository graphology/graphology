// Memo per node, for out + undirected (x2, then), don't emit edgeless nodes
exports.nodeMemoizedOutboundNeighborhood = function (graph, memo, callback) {
  // TODO: multi, different implementation
  var iterator = graph._nodes.values();

  var step, nodeData;

  var cache;
  // var edgeCount;
  var neighbor, edgeData, targetData;

  while (((step = iterator.next()), step.done !== true)) {
    nodeData = step.value;

    cache = memo(nodeData.key, nodeData.attributes);

    if (graph.type !== 'undirected') {
      for (neighbor in nodeData.out) {
        // edgeCount++;
        edgeData = nodeData.out[neighbor];

        callback(
          cache,
          nodeData.key,
          edgeData.target.key,
          nodeData.attributes,
          edgeData.target.attributes,
          edgeData.key,
          edgeData.attributes,
          false
        );
      }
    }

    if (graph.type !== 'directed') {
      for (neighbor in nodeData.undirected) {
        // edgeCount++;
        edgeData = nodeData.undirected[neighbor];

        targetData = edgeData.target;

        if (targetData.key === nodeData.key) targetData = edgeData.source;

        callback(
          cache,
          nodeData.key,
          targetData.key,
          nodeData.attributes,
          targetData.attributes,
          edgeData.key,
          edgeData.attributes,
          true
        );
      }
    }

    // if (edgeCount === 0) {
    //   callback(
    //     cache,
    //     nodeData.key,
    //     null
    //     nodeData.attributes,
    //     null,
    //     null,
    //     null,
    //     null
    //   );
    // }
  }
};
