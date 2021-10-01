/**
 * Graphology Canvas Node Circle Component
 * ========================================
 *
 * Rendering nodes as plain circles.
 */
var TAU = Math.PI * 2;

module.exports = function drawNode(settings, context, data) {
  context.fillStyle = data.color;
  context.beginPath();
  context.arc(
    data.x,
    data.y,
    data.size,
    0,
    TAU,
    true
  );

  context.closePath();
  context.fill();
};
