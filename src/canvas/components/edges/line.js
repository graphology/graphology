/**
 * Graphology Canvas Edge Line Component
 * ======================================
 *
 * Rendering nodes as plain lines.
 */
module.exports = function drawEdge(settings, context, data, sourceData, targetData) {
  context.strokeStyle = data.color;
  context.lineWidth = data.size;
  context.beginPath();
  context.moveTo(
    sourceData.x,
    sourceData.y
  );
  context.lineTo(
    targetData.x,
    targetData.y
  );
  context.stroke();
};
