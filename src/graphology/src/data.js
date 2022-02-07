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
  this.directedSelfLoops = 0;
  this.undirectedSelfLoops = 0;

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
  this.directedSelfLoops = 0;

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
  this.undirectedSelfLoops = 0;

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

  // If selfLoop, we break here
  if (source === target && this.undirected) return;

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
  let container = adj[target];

  if (typeof container === 'undefined') {
    container = new Set();
    adj[target] = container;

    // Handling symmetrical target container
    if (source !== target || !this.undirected)
      this.target[inKey][source] = container;
  }

  container.add(this);
};

EdgeData.prototype.detach = function () {
  const source = this.source.key;
  const target = this.target.key;

  let outKey = 'out';
  let inKey = 'in';

  if (this.undirected) outKey = inKey = 'undirected';

  delete this.source[outKey][target];
  delete this.target[inKey][source];
};

EdgeData.prototype.detachMulti = function () {
  const source = this.source.key;
  const target = this.target.key;

  let outKey = 'out';
  let inKey = 'in';

  if (this.undirected) outKey = inKey = 'undirected';

  const adj = this.source[outKey][target];

  if (adj.size === 1) {
    delete this.source[outKey][target];
    delete this.target[inKey][source];
  } else {
    adj.delete(this);
  }
};
