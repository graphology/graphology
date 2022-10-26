/**
 * Graphology Internal Data Classes
 * =================================
 *
 * Internal classes hopefully reduced to structs by engines & storing
 * necessary information for nodes & edges.
 *
 * Note that those classes don't rely on the `class` keyword to avoid some
 * cruft introduced by most of ES2015 transpilers.
 */

/**
 * MixedNodeData class.
 *
 * @constructor
 * @param {string} string     - The node's key.
 * @param {object} attributes - Node's attributes.
 */
export function MixedNodeData(key, attributes) {
  // Attributes
  this.key = key;
  this.attributes = attributes;

  this.clear();
}

MixedNodeData.prototype.clear = function () {
  // Degrees
  this.inDegree = 0;
  this.outDegree = 0;
  this.undirectedDegree = 0;
  this.undirectedLoops = 0;
  this.directedLoops = 0;

  // Indices
  this.in = {};
  this.out = {};
  this.undirected = {};
};

/**
 * DirectedNodeData class.
 *
 * @constructor
 * @param {string} string     - The node's key.
 * @param {object} attributes - Node's attributes.
 */
export function DirectedNodeData(key, attributes) {
  // Attributes
  this.key = key;
  this.attributes = attributes;

  this.clear();
}

DirectedNodeData.prototype.clear = function () {
  // Degrees
  this.inDegree = 0;
  this.outDegree = 0;
  this.directedLoops = 0;

  // Indices
  this.in = {};
  this.out = {};
};

/**
 * UndirectedNodeData class.
 *
 * @constructor
 * @param {string} string     - The node's key.
 * @param {object} attributes - Node's attributes.
 */
export function UndirectedNodeData(key, attributes) {
  // Attributes
  this.key = key;
  this.attributes = attributes;

  this.clear();
}

UndirectedNodeData.prototype.clear = function () {
  // Degrees
  this.undirectedDegree = 0;
  this.undirectedLoops = 0;

  // Indices
  this.undirected = {};
};

/**
 * EdgeData class.
 *
 * @constructor
 * @param {boolean} undirected   - Whether the edge is undirected.
 * @param {string}  string       - The edge's key.
 * @param {string}  source       - Source of the edge.
 * @param {string}  target       - Target of the edge.
 * @param {object}  attributes   - Edge's attributes.
 */
export function EdgeData(undirected, key, source, target, attributes) {
  // Attributes
  this.key = key;
  this.attributes = attributes;
  this.undirected = undirected;

  // Extremities
  this.source = source;
  this.target = target;
}

EdgeData.prototype.attach = function () {
  let outKey = 'out';
  let inKey = 'in';

  if (this.undirected) outKey = inKey = 'undirected';

  const source = this.source.key;
  const target = this.target.key;

  // Handling source
  this.source[outKey][target] = this;

  if (this.undirected && source === target) return;

  // Handling target
  this.target[inKey][source] = this;
};

EdgeData.prototype.attachMulti = function () {
  let outKey = 'out';
  let inKey = 'in';

  const source = this.source.key;
  const target = this.target.key;

  if (this.undirected) outKey = inKey = 'undirected';

  // Handling source
  const adj = this.source[outKey];
  const head = adj[target];

  if (typeof head === 'undefined') {
    adj[target] = this;

    // Self-loop optimization
    if (!(this.undirected && source === target)) {
      // Handling target
      this.target[inKey][source] = this;
    }

    return;
  }

  // Prepending to doubly-linked list
  head.previous = this;
  this.next = head;

  // Pointing to new head
  // NOTE: use mutating swap later to avoid lookup?
  adj[target] = this;
  this.target[inKey][source] = this;
};

EdgeData.prototype.detach = function () {
  const source = this.source.key;
  const target = this.target.key;

  let outKey = 'out';
  let inKey = 'in';

  if (this.undirected) outKey = inKey = 'undirected';

  delete this.source[outKey][target];

  // No-op delete in case of undirected self-loop
  delete this.target[inKey][source];
};

EdgeData.prototype.detachMulti = function () {
  const source = this.source.key;
  const target = this.target.key;

  let outKey = 'out';
  let inKey = 'in';

  if (this.undirected) outKey = inKey = 'undirected';

  // Deleting from doubly-linked list
  if (this.previous === undefined) {
    // We are dealing with the head

    // Should we delete the adjacency entry because it is now empty?
    if (this.next === undefined) {
      delete this.source[outKey][target];

      // No-op delete in case of undirected self-loop
      delete this.target[inKey][source];
    } else {
      // Detaching
      this.next.previous = undefined;

      // NOTE: could avoid the lookups by creating a #.become mutating method
      this.source[outKey][target] = this.next;

      // No-op delete in case of undirected self-loop
      this.target[inKey][source] = this.next;
    }
  } else {
    // We are dealing with another list node
    this.previous.next = this.next;

    // If not last
    if (this.next !== undefined) {
      this.next.previous = this.previous;
    }
  }
};
