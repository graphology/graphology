/**
 * Graphology SVG Helpers
 * ======================
 *
 * Micellaneous helper functions used throughout the library.
 */
var defaults = require('./defaults.js');

// Taken from @jacomyma (graph-recipes)
function reduceNodes(graph, settings) {
  var width = settings.width,
    height = settings.height;

  var xBarycenter = 0,
    yBarycenter = 0,
    totalWeight = 0;

  var data = {};

  graph.forEachNode(function (node, attr) {
    // Applying user's reducing logic
    if (typeof settings.nodes.reducer === 'function')
      attr = settings.nodes.reducer(settings, node, attr);

    attr = defaults.DEFAULT_NODE_REDUCER(settings, node, attr);
    data[node] = attr;

    // Computing rescaling items
    xBarycenter += attr.size * attr.x;
    yBarycenter += attr.size * attr.y;
    totalWeight += attr.size;
  });

  xBarycenter /= totalWeight;
  yBarycenter /= totalWeight;

  var d, ratio, n;
  var dMax = -Infinity;

  var k;

  for (k in data) {
    n = data[k];
    d = Math.pow(n.x - xBarycenter, 2) + Math.pow(n.y - yBarycenter, 2);

    if (d > dMax) dMax = d;
  }

  ratio =
    (Math.min(width, height) - 2 * settings.margin) / (2 * Math.sqrt(dMax));

  for (k in data) {
    n = data[k];

    n.x = width / 2 + (n.x - xBarycenter) * ratio;
    n.y = height / 2 + (n.y - yBarycenter) * ratio;

    n.size *= ratio; // TODO: keep?
  }

  return data;
}

// Minimalist XML escaping function
var ESCAPE_PATTERN = /["'<>&]/g;

var ESCAPE_MAP = {
  '"': '&quot;',
  "'": '&apos;',
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;'
};

function escapeReplacer(char) {
  return ESCAPE_MAP[char];
}

function escape(string) {
  return string.replace(ESCAPE_PATTERN, escapeReplacer);
}

exports.reduceNodes = reduceNodes;
exports.escape = escape;
