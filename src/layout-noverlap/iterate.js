/**
 * Graphology Noverlap Iteration
 * ==============================
 *
 * Function used to perform a single iteration of the algorithm.
 */

/**
 * Matrices properties accessors.
 */
var NODE_X = 0,
  NODE_Y = 1,
  NODE_SIZE = 2;

/**
 * Constants.
 */
var PPN = 3;

/**
 * Helpers.
 */
function hashPair(a, b) {
  return a + '§' + b;
}

function jitter() {
  return 0.01 * (0.5 - Math.random());
}

/**
 * Function used to perform a single interation of the algorithm.
 *
 * @param  {object}       options    - Layout options.
 * @param  {Float32Array} NodeMatrix - Node data.
 * @return {object}                  - Some metadata.
 */
module.exports = function iterate(options, NodeMatrix) {
  // Caching options
  var margin = options.margin;
  var ratio = options.ratio;
  var expansion = options.expansion;
  var gridSize = options.gridSize; // TODO: decrease grid size when few nodes?
  var speed = options.speed;

  // Generic iteration variables
  var i, j, x, y, l, size;
  var converged = true;

  var length = NodeMatrix.length;
  var order = (length / PPN) | 0;

  var deltaX = new Float32Array(order);
  var deltaY = new Float32Array(order);

  // Finding the extents of our space
  var xMin = Infinity;
  var yMin = Infinity;
  var xMax = -Infinity;
  var yMax = -Infinity;

  for (i = 0; i < length; i += PPN) {
    x = NodeMatrix[i + NODE_X];
    y = NodeMatrix[i + NODE_Y];
    size = NodeMatrix[i + NODE_SIZE] * ratio + margin;

    xMin = Math.min(xMin, x - size);
    xMax = Math.max(xMax, x + size);
    yMin = Math.min(yMin, y - size);
    yMax = Math.max(yMax, y + size);
  }

  var width = xMax - xMin;
  var height = yMax - yMin;
  var xCenter = (xMin + xMax) / 2;
  var yCenter = (yMin + yMax) / 2;

  xMin = xCenter - (expansion * width) / 2;
  xMax = xCenter + (expansion * width) / 2;
  yMin = yCenter - (expansion * height) / 2;
  yMax = yCenter + (expansion * height) / 2;

  // Building grid
  var grid = new Array(gridSize * gridSize),
    gridLength = grid.length,
    c;

  for (c = 0; c < gridLength; c++) grid[c] = [];

  var nxMin, nxMax, nyMin, nyMax;
  var xMinBox, xMaxBox, yMinBox, yMaxBox;

  var col, row;

  for (i = 0; i < length; i += PPN) {
    x = NodeMatrix[i + NODE_X];
    y = NodeMatrix[i + NODE_Y];
    size = NodeMatrix[i + NODE_SIZE] * ratio + margin;

    nxMin = x - size;
    nxMax = x + size;
    nyMin = y - size;
    nyMax = y + size;

    xMinBox = Math.floor((gridSize * (nxMin - xMin)) / (xMax - xMin));
    xMaxBox = Math.floor((gridSize * (nxMax - xMin)) / (xMax - xMin));
    yMinBox = Math.floor((gridSize * (nyMin - yMin)) / (yMax - yMin));
    yMaxBox = Math.floor((gridSize * (nyMax - yMin)) / (yMax - yMin));

    for (col = xMinBox; col <= xMaxBox; col++) {
      for (row = yMinBox; row <= yMaxBox; row++) {
        grid[col * gridSize + row].push(i);
      }
    }
  }

  // Computing collisions
  var cell;

  var collisions = new Set();

  var n1, n2, x1, x2, y1, y2, s1, s2, h;

  var xDist, yDist, dist, collision;

  for (c = 0; c < gridLength; c++) {
    cell = grid[c];

    for (i = 0, l = cell.length; i < l; i++) {
      n1 = cell[i];

      x1 = NodeMatrix[n1 + NODE_X];
      y1 = NodeMatrix[n1 + NODE_Y];
      s1 = NodeMatrix[n1 + NODE_SIZE];

      for (j = i + 1; j < l; j++) {
        n2 = cell[j];
        h = hashPair(n1, n2);

        if (gridLength > 1 && collisions.has(h)) continue;

        if (gridLength > 1) collisions.add(h);

        x2 = NodeMatrix[n2 + NODE_X];
        y2 = NodeMatrix[n2 + NODE_Y];
        s2 = NodeMatrix[n2 + NODE_SIZE];

        xDist = x2 - x1;
        yDist = y2 - y1;
        dist = Math.sqrt(xDist * xDist + yDist * yDist);
        collision = dist < s1 * ratio + margin + (s2 * ratio + margin);

        if (collision) {
          converged = false;

          n2 = (n2 / PPN) | 0;

          if (dist > 0) {
            deltaX[n2] += (xDist / dist) * (1 + s1);
            deltaY[n2] += (yDist / dist) * (1 + s1);
          } else {
            // Nodes are on the exact same spot, we need to jitter a bit
            deltaX[n2] += width * jitter();
            deltaY[n2] += height * jitter();
          }
        }
      }
    }
  }

  for (i = 0, j = 0; i < length; i += PPN, j++) {
    NodeMatrix[i + NODE_X] += deltaX[j] * 0.1 * speed;
    NodeMatrix[i + NODE_Y] += deltaY[j] * 0.1 * speed;
  }

  return {converged: converged};
};
