/**
 * Graphology Layout Utilities
 * ============================
 *
 * Miscellaneous utility functions used by the library.
 */
var resolveDefaults = require('graphology-utils/defaults');
var matrices = require('./matrices.js');

var identity = matrices.identity;
var multiply = matrices.multiply;
var translate = matrices.translate;
var scale = matrices.scale;
var rotate = matrices.rotate;
var multiplyVec2 = matrices.multiplyVec2;

/**
 * Function taken from sigma and returning a correction factor to suit the
 * difference between the graph and the viewport's aspect ratio.
 */
function getAspectRatioCorrection(
  graphWidth,
  graphHeight,
  viewportWidth,
  viewportHeight
) {
  var viewportRatio = viewportHeight / viewportWidth;
  var graphRatio = graphHeight / graphWidth;

  // If the stage and the graphs are in different directions (such as the graph being wider that tall while the stage
  // is taller than wide), we can stop here to have indeed nodes touching opposite sides:
  if (
    (viewportRatio < 1 && graphRatio > 1) ||
    (viewportRatio > 1 && graphRatio < 1)
  ) {
    return 1;
  }

  // Else, we need to fit the graph inside the stage:
  // 1. If the graph is "squarer" (ie. with a ratio closer to 1), we need to make the largest sides touch;
  // 2. If the stage is "squarer", we need to make the smallest sides touch.
  return Math.min(
    Math.max(graphRatio, 1 / graphRatio),
    Math.max(1 / viewportRatio, viewportRatio)
  );
}

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

function createGraphToViewportConversionFunction(
  graphExtent,
  viewportDimensions,
  options
) {
  // Resolving options
  options = resolveDefaults(options, CONVERSION_FUNCTION_DEFAULTS);

  var camera = options.camera;

  // Computing graph dimensions
  var maxGX = graphExtent.x[1];
  var maxGY = graphExtent.y[1];
  var minGX = graphExtent.x[0];
  var minGY = graphExtent.y[0];

  var graphWidth = maxGX - minGX;
  var graphHeight = maxGY - minGY;

  var viewportWidth = viewportDimensions.width;
  var viewportHeight = viewportDimensions.height;

  // Precomputing values
  var graphRatio = Math.max(graphWidth, graphHeight) || 1;

  var gdx = (maxGX + minGX) / 2;
  var gdy = (maxGY + minGY) / 2;

  var smallest = Math.min(viewportWidth, viewportHeight);
  smallest -= 2 * options.padding;

  var correction = getAspectRatioCorrection(
    graphWidth,
    graphHeight,
    viewportWidth,
    viewportHeight
  );

  var matrix = identity();

  multiply(
    matrix,
    scale(
      identity(),
      2 * (smallest / viewportWidth) * correction,
      2 * (smallest / viewportHeight) * correction
    )
  );
  multiply(matrix, rotate(identity(), -camera.angle));
  multiply(matrix, scale(identity(), 1 / camera.ratio));
  multiply(matrix, translate(identity(), -camera.x, -camera.y));

  // Assignation function
  var assign = function (pos) {
    // Normalize
    pos.x = 0.5 + (pos.x - gdx) / graphRatio;
    pos.y = 0.5 + (pos.y - gdy) / graphRatio;

    // Applying matrix transformation
    multiplyVec2(matrix, pos);

    // Realigning with canvas coordinates
    pos.x = ((1 + pos.x) * viewportWidth) / 2;
    pos.y = ((1 - pos.y) * viewportHeight) / 2;

    return pos;
  };

  // Immutable variant
  var graphToViewport = function (pos) {
    return assign({x: pos.x, y: pos.y});
  };

  graphToViewport.assign = assign;

  return graphToViewport;
}

/**
 * Exports.
 */
exports.createGraphToViewportConversionFunction =
  createGraphToViewportConversionFunction;
