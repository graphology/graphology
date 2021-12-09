/**
 * Graphology BFS Queue
 * =====================
 *
 * An experiment to speed up BFS in graphs and connected component detection.
 *
 * It should mostly save memory and not improve theoretical runtime.
 */
var FixedDeque = require('mnemonist/fixed-deque');

function BFSQueue(order) {
  this.queue = new FixedDeque(Array, order);
  this.seen = new Set();
  this.size = 0;
}

BFSQueue.prototype.has = function (node) {
  return this.seen.has(node);
};

BFSQueue.prototype.push = function (node) {
  var seenSizeBefore = this.seen.size;

  this.seen.add(node);

  // If node was already seen
  if (seenSizeBefore === this.seen.size) return false;

  this.queue.push(node);
  this.size++;

  return true;
};

BFSQueue.prototype.pushWith = function (node, item) {
  var seenSizeBefore = this.seen.size;

  this.seen.add(node);

  // If node was already seen
  if (seenSizeBefore === this.seen.size) return false;

  this.queue.push(item);
  this.size++;

  return true;
};

BFSQueue.prototype.shift = function () {
  var item = this.queue.shift();
  this.size = this.queue.size;

  return item;
};

module.exports = BFSQueue;
