/**
 * Graphology Canvas Background Component
 * =======================================
 *
 * Simple background filling component.
 */
module.exports = function fillBackground(context, color, width, height) {
  context.fillStyle = color;
  context.fillRect(0, 0, width, height);
};
