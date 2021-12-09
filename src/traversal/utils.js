/**
 * Graphology Traversal Utils
 * ===========================
 *
 * Miscellaneous utils used throughout the library.
 */

function TraversalRecord(node, attr, depth) {
  this.node = node;
  this.attributes = attr;
  this.depth = depth;
}

function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}

exports.TraversalRecord = TraversalRecord;
exports.capitalize = capitalize;
