/**
 * Graphology GRAPHML Defaults
 * ============================
 *
 * Sane defaults for the library.
 */
function byteToHex(b) {
  return ('0' + (b | 0).toString(16)).slice(-2);
}

function rgbToHex(r, g, b) {
  return '#' + byteToHex(r) + byteToHex(g) + byteToHex(b);
}

function omitRgb(o) {
  var t = {};

  for (var k in o) {
    if (k === 'r' || k === 'g' || k === 'b') continue;
    t[k] = o[k];
  }

  return t;
}

function DEFAULT_FORMATTER(attr) {
  var newAttr;

  // Converting color
  if (
    typeof attr.r === 'number' &&
    typeof attr.g === 'number' &&
    typeof attr.b === 'number'
  ) {
    newAttr = omitRgb(attr);
    newAttr.color = rgbToHex(attr.r, attr.g, attr.b);

    return newAttr;
  }

  return attr;
}

exports.DEFAULT_FORMATTER = DEFAULT_FORMATTER;
