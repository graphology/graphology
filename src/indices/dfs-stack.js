/**
 * Graphology DFS Stack
 * =====================
 *
 * An experiment to speed up DFS in graphs and connected component detection.
 *
 * It should mostly save memory and not improve theoretical runtime.
 */
function DFSStack(order) {
  this.stack = new Array(order);
  this.seen = new Set();
  this.size = 0;
}

DFSStack.prototype.has = function (node) {
  return this.seen.has(node);
};

DFSStack.prototype.push = function (node) {
  var seenSizeBefore = this.seen.size;

  this.seen.add(node);

  // If node was already seen
  if (seenSizeBefore === this.seen.size) return false;

  this.stack[this.size++] = node;

  return true;
};

DFSStack.prototype.pushWith = function (node, item) {
  var seenSizeBefore = this.seen.size;

  this.seen.add(node);

  // If node was already seen
  if (seenSizeBefore === this.seen.size) return false;

  this.stack[this.size++] = item;

  return true;
};

DFSStack.prototype.pop = function () {
  if (this.size === 0) return;

  return this.stack[--this.size];
};

module.exports = DFSStack;
