/**
 * Graphology Sorted Component Index
 * ==================================
 *
 * An index storing the connected components of given graph sorted by order.
 */
function SortedComponentsIndex(graph) {
  var orders = [];
  var offsets = [];
  var nodes = new Array(graph.order);
  var count = 0;
  var n = 0;

  if (!graph.order) return;

  var seen = new Set();
  var stack = [];
  var componentOrder;

  function neighborCallback(neighbor) {
    stack.push(neighbor);
  }

  // Performing DFS
  graph.forEachNode(function (node) {
    if (seen.has(node)) return;

    componentOrder = 0;
    offsets.push(n);
    stack.push(node);

    var source;

    while (stack.length !== 0) {
      source = stack.pop();

      if (seen.has(source)) continue;

      componentOrder += 1;
      nodes[n++] = source;
      seen.add(source);

      graph.forEachNeighbor(source, neighborCallback);
    }

    orders.push(componentOrder);
    count++;
  });

  // Sorting by decreasing component order
  var argsort = new Array(orders.length);
  var i;

  for (i = 0; i < orders.length; i++) argsort[i] = i;

  function comparator(a, b) {
    a = orders[a];
    b = orders[b];

    if (a < b) return 1;

    if (a > b) return -1;

    return 0;
  }

  argsort.sort(comparator);

  var sortedOrders = new Uint32Array(orders.length);
  var sortedOffsets = new Uint32Array(orders.length);

  var j;

  for (i = 0; i < argsort.length; i++) {
    j = argsort[i];
    sortedOrders[i] = orders[j];
    sortedOffsets[i] = offsets[j];
  }

  // Exposed properties
  this.nodes = nodes;
  this.orders = sortedOrders;
  this.offsets = sortedOffsets;
  this.count = count;
}

module.exports = SortedComponentsIndex;
