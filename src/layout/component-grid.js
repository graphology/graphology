/**
 * Graphology Component Grid Layout
 * =================================
 *
 * Layout arranging the graph's components in a squarified treemap of sorts.
 */
var resolveDefaults = require('graphology-utils/defaults');
var SortedComponentsIndex = require('graphology-indices/sorted-components');

/**
 * Default options.
 */
var DEFAULTS = {
  width: 1,
  height: 1
};

/**
 * Helpers.
 */
function sum(sizes) {
  var s = 0;

  for (var i = 0, l = sizes.length; i < l; i++) {
    s += sizes[i];
  }

  return s;
}

function normalizeSizes(index, dx, dy) {
  var l = index.orders.length;
  var area = dx * dy;
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

function layoutRow(sizes, x, y, dy) {
  var area = 0;

  var i = 0;
  var l = sizes.length;

  var rectangles = new Array(l);

  for (i = 0; i < l; i++) {
    area += sizes[i];
  }

  var width = area / dy;
  var h;

  for (i = 0; i < l; i++) {
    h = sizes[i] / width;

    rectangles[i] = {
      x: x,
      y: y,
      dx: width,
      dy: h
    };

    y += h;
  }

  return rectangles;
}

function layoutColumn(sizes, x, y, dx) {
  var area = 0;

  var i = 0;
  var l = sizes.length;

  var rectangles = new Array(l);

  for (i = 0; i < l; i++) {
    area += sizes[i];
  }

  var height = area / dx;
  var w;

  for (i = 0; i < l; i++) {
    w = sizes[i] / height;

    rectangles[i] = {
      x: x,
      y: y,
      dx: w,
      dy: height
    };
    x += w;
  }

  return rectangles;
}

function layout(sizes, x, y, dx, dy) {
  if (dx >= dy) return layoutRow(sizes, x, y, dy);

  return layoutColumn(sizes, x, y, dx);
}

function leftoverRow(sizes, x, y, dx, dy) {
  var area = sum(sizes);
  var width = area / dy;
  var leftoverX = x + width;
  var leftoverY = y;
  var leftoverDx = dx - width;
  var leftoverDy = dy;

  return [leftoverX, leftoverY, leftoverDx, leftoverDy];
}

function leftoverCol(sizes, x, y, dx, dy) {
  var area = sum(sizes);
  var height = area / dx;
  var leftoverX = x;
  var leftoverY = y + height;
  var leftoverDx = dx;
  var leftoverDy = dy - height;

  return [leftoverX, leftoverY, leftoverDx, leftoverDy];
}

function leftover(sizes, x, y, dx, dy) {
  if (dx >= dy) return leftoverRow(sizes, x, y, dx, dy);

  return leftoverCol(sizes, x, y, dx, dy);
}

function worstRatio(sizes, x, y, dx, dy) {
  var max = -Infinity;

  var rectangles = layout(sizes, x, y, dx, dy);

  var l = sizes.length;
  var rectangle;
  var ratio;

  for (var i = 0; i < l; i++) {
    rectangle = rectangles[i];

    ratio = Math.max(
      rectangle.dx / rectangles.dy,
      rectangles.dy / rectangles.dx
    );

    if (ratio > max) max = ratio;
  }

  return ratio;
}

function squarify(acc, sizes, x, y, dx, dy) {
  // Tail calls
  if (sizes.length === 0) {
    return;
  }

  if (sizes.length === 1) {
    acc.push(layout(sizes, x, y, dx, dy)[0]);
    return;
  }

  // Finding the split
  var i = 1;

  while (
    i < sizes.length &&
    worstRatio(sizes.slice(0, i), x, y, dx, dy) >=
      worstRatio(sizes.slice(0, i + 1), x, y, dx, dy)
  ) {
    i++;
  }

  var current = sizes.slice(0, i);
  var remaining = sizes.slice(i);

  var left = leftover(current, x, y, dx, dy);

  var add = layout(current, x, y, dx, dy);
  var l = add.length;

  for (i = 0; i < l; i++) {
    acc.push(add[i]);
  }

  squarify(acc, remaining, left[0], left[1], left[2], left[3]);
}

/* eslint-disable */
function componentGrid(assign, graph, options) {
  options = resolveDefaults(options, DEFAULTS);

  var index = new SortedComponentsIndex(graph);
  var sizes = normalizeSizes(index, options.width, options.height);

  var acc = [];

  squarify(acc, sizes, 0, 0, options.width, options.height);

  return acc;
}
/* eslint-enable */

module.exports = componentGrid;
