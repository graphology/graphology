/**
 * Graphology SVG Edge Line Component
 * ==================================
 *
 * Rendering nodes as plain lines.
 */
module.exports = function drawEdge(settings, data, sourceData, targetData) {
  return (
    '<line x1="' +
    sourceData.x +
    '" y1="' +
    sourceData.y +
    '" ' +
    'x2="' +
    targetData.x +
    '" y2="' +
    targetData.y +
    '" ' +
    'stroke="' +
    data.color +
    '" ' +
    'stroke-width="' +
    data.size +
    '" />'
  );
};
