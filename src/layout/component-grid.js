/**
 * Graphology Component Grid Layout
 * =================================
 *
 * Layout arranging the graph's components in a squarified treemap of sorts.
 */
var SortedComponentsIndex = require('graphology-indices/sorted-components');

/**
 * Helpers.
 */
function normalizeSizes(index, width, height) {
  var l = index.orders.length;
  var area = width * height;
  var i;

  var totalSize = 0;

  for (i = 0; i < l; i++) {
    totalSize += index.orders[i];
  }

  var sizes = new Float64Array(l);

  for (i = 0; i < l; i++) {
    sizes[i] = (index.orders[i] * area) / totalSize;
  }

  return sizes;
}

/* eslint-disable */
function componentGrid(assign, graph, options) {
  var index = new SortedComponentsIndex(graph);
  var sizes = normalizeSizes(index, 1, 1);
}
/* eslint-enable */

module.exports = componentGrid;
