/**
 * Graphology Sorted Component Index
 * ==================================
 *
 * An index storing the connected components of given graph sorted by order.
 */
var Heap = require('mnemonist/heap');

function SortedComponentsIndex(graph) {
  var orders = [];
  var offsets = [];
  var nodes = [];
  var count = 0;

  if (!graph.order)
    return;

  var seen = new Set();
  var stack = [];
  var componentOrder;

  function neighborCallback(neighbor) {
    if (seen.has(neighbor))
      return;

    seen.add(neighbor);
    stack.push(neighbor);
  }

  // Performing DFS
  graph.forEachNode(function(node) {
    if (seen.has(node))
      return;

    seen.add(node);
    componentOrder = 0;
    offsets.push(nodes.length);
    stack.push(node);

    var otherNode;

    while (stack.length !== 0) {
      otherNode = stack.pop();
      componentOrder += 1;
      nodes.push(otherNode);

      graph.forEachOutboundNeighbor(otherNode, neighborCallback);
    }

    orders.push(componentOrder);
    count++;
  });

  offsets.push(nodes.length);

  var i, idx = new Array(orders.length);

  for (i = 0; i < orders.length; i++)
    idx[i] = i;

  function comparator(a, b) {
    a = orders[a];
    b = orders[b];

    if (a < b)
      return 1;

    if (a > b)
      return -1;

    return 0;
  }

  var heap = Heap.from(idx, comparator);

  var argsort = heap.consume();

  var sortedOrders = new Uint32Array(orders.length);
  var sortedOffsets = new Uint32Array(orders.length + 1);
  var sortedNodes = new Array(nodes.length);

  var o, a, j, l;

  for (o = i = 0; i < orders.length; i++) {
    a = argsort[i];
    sortedOrders[i] = orders[a];
    sortedOffsets[i] = o;

    for (j = offsets[a], l = offsets[a + 1]; j < l; j++)
      sortedNodes[o++] = nodes[j];
  }

  sortedOffsets[sortedOffsets.length - 1] = nodes.length;

  // Exposed properties
  this.nodes = sortedNodes;
  this.orders = sortedOrders;
  this.offsets = sortedOffsets;
  this.count = count;
}

module.exports = SortedComponentsIndex;
