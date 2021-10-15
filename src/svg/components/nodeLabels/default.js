/**
 * Graphology SVG Node Label Component
 * ==================================
 *
 * Rendering node labels as simple text elements.
 */
var escape = require('../../helpers.js').escape;

module.exports = function drawLabel(settings, data) {
  return (
    '<text x="' +
    (data.x + data.size * 1.1) +
    '" ' +
    'y="' +
    (data.y + data.size / 4) +
    '" ' +
    'font-family="' +
    escape(settings.font || 'sans-serif') +
    '" ' +
    'font-size="' +
    data.size +
    '">' +
    escape(data.label) +
    '</text>'
  );
};
