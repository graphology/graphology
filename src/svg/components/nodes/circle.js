/**
 * Graphology SVG Node Circle Component
 * ====================================
 *
 * Rendering nodes as plain SVG circles.
 */
module.exports = function drawNode(settings, data) {
  return (
    '<circle cx="' +
    data.x +
    '" ' +
    'cy="' +
    data.y +
    '" ' +
    'r="' +
    data.size +
    '" ' +
    'fill="' +
    data.color +
    '" />'
  );
};
