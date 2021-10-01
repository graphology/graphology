/**
 * Graphology Component Grid Layout
 * =================================
 *
 * Layout arranging the graph's components in squares having a size proportional
 * to the number of nodes they contain.
 */
var SortedComponentsIndex = require('graphology-indices/sorted-components');

function squareCeil(n) {
  return Math.ceil(Math.sqrt(n));
}

function componentGrid(assign, graph, options) {
  var index = new SortedComponentsIndex(graph);

  var containerSize = squareCeil(graph.order);

  var cols = new Array(containerSize);
  var coordinates = new Array(index.count);

  var i, order, squareSize;

  var ci, col, ri;

  for (ci = 0; ci < containerSize; ci++)
    cols[ci] = 0;

  // Iterating over components
  components:
  for (i = 0; i < index.count;) {
    order = index.orders[i];
    squareSize = squareCeil(order);

    for (ci = 0; ci < cols.length;) {
      col = cols[ci];

      if (
        (col + squareSize <= containerSize) &&
        (ci + squareSize <= containerSize)
      ) {

        // We found a suitable horizontal spot
        for (ri = ci; ri < (ci + squareSize); ri++)
          cols[ri] += squareSize;

        coordinates[i++] = [col, ci];

        continue components;
      }

      // Else we jump to next available spot in height
      ci += 1;
    }

    // We could not find a suitable spot, let's increase square size
    containerSize++;
    cols.push(0);
  }

  var coord, j, l, node, attr, coordX, coordY;

  var xRatio = (options.width / containerSize);
  var yRatio = (options.height / containerSize);

  for (i = 0; i < index.count; i++) {
    coord = coordinates[i];
    coordX = coord[0];
    coordY = containerSize - coord[1];

    for (j = index.offsets[i], l = index.offsets[i + 1]; j < l; j++) {
      node = index.nodes[j];
      attr = graph.getNodeAttributes(node);

      // TODO: scale & update correctly
      attr.x = attr.x * xRatio + options.width * coordX;
      attr.y = attr.y * yRatio + options.height * coordY;
    }
  }

  // console.log(coordinates, index.orders)
}

module.exports = componentGrid;
