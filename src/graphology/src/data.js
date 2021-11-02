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

DirectedNodeData.prototype.upgradeToMixed = function () {
  // Degrees
  this.undirectedDegree = 0;
  this.undirectedSelfLoops = 0;

  // Indices
  this.undirected = {};
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

UndirectedNodeData.prototype.upgradeToMixed = function () {
  // Degrees
  this.inDegree = 0;
  this.outDegree = 0;
  this.directedSelfLoops = 0;

  // Indices
  this.in = {};
  this.out = {};
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
