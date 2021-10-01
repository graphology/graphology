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

exports.TraversalRecord = TraversalRecord;
