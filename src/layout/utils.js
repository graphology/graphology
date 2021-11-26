/**
 * Graphology Layout Utilities
 * ============================
 *
 * Miscellaneous utility functions used by the library.
 */
var resolveDefaults = require('graphology-utils/defaults');

/**
 * Factory for a function converting from an arbitrary graph space to a
 * viewport one (like an HTML5 canvas, for instance).
 */
var DEFAULT_CAMERA = {
  x: 0.5,
  y: 0.5,
  angle: 0,
  ratio: 1
};

var CONVERSION_FUNCTION_DEFAULTS = {
  camera: DEFAULT_CAMERA,
  padding: 0
};

// TODO: test with null graph or 1-graph
// TODO: padding
// TODO: correction ratio
function createGraphToViewportConversionFunction(
  graphExtent,
  viewportDimensions,
  options
) {
  // Resolving options
  options = resolveDefaults(options, CONVERSION_FUNCTION_DEFAULTS);

  var camera = options.camera;

  // Computing graph dimensions
  var maxGX = graphExtent.x[0];
  var maxGY = graphExtent.y[0];
  var minGX = graphExtent.x[1];
  var minGY = graphExtent.y[1];

  var graphWidth = maxGX - minGX;
  var graphHeight = maxGY - minGY;

  var viewportWidth = viewportDimensions.width;
  var viewportHeight = viewportDimensions.height;

  // Precomputing values
  var graphRatio = Math.max(graphWidth, graphHeight) || 1;

  var gdx = (maxGX + minGX) / 2;
  var gdy = (maxGY + minGY) / 2;

  var smallest = Math.min(viewportWidth, viewportHeight);

  var vdx = smallest / viewportWidth;
  var vdy = smallest / viewportHeight;

  var cameraRatio = camera.ratio / smallest;
  var cos = Math.cos(camera.angle);
  var sin = Math.sin(camera.angle);

  // Assignation function
  var assign = function (pos) {
    // Normalize
    var x = 0.5 + (pos.x - gdx) / graphRatio;
    var y = 0.5 + (pos.y - gdy) / graphRatio;

    // Align
    x = (x - camera.x) / cameraRatio;
    y = (camera.y - y) / cameraRatio;

    // Rotate
    if (camera.angle) {
      x = x * cos - y * sin;
      y = y * cos + x * sin;
    }

    pos.x = x + smallest / 2 / vdx;
    pos.y = y + smallest / 2 / vdy;

    return pos;
  };

  // Immutable variant
  var graphToViewport = function (pos) {
    return assign({x: pos.x, y: pos.y});
  };

  return graphToViewport;
}

/**
 * Exports.
 */
exports.createGraphToViewportConversionFunction =
  createGraphToViewportConversionFunction;
