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
 * @param {object} attributes - Node's attributes.
 */
export function MixedNodeData(attributes) {

  // Attributes
  this.attributes = attributes;

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
}

/**
 * DirectedNodeData class.
 *
 * @constructor
 * @param {object} attributes - Node's attributes.
 */
export function DirectedNodeData(attributes) {

  // Attributes
  this.attributes = attributes || {};

  // Degrees
  this.inDegree = 0;
  this.outDegree = 0;
  this.directedSelfLoops = 0;

  // Indices
  this.in = {};
  this.out = {};
}

DirectedNodeData.prototype.upgradeToMixed = function() {

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
 * @param {object} attributes - Node's attributes.
 */
export function UndirectedNodeData(attributes) {

  // Attributes
  this.attributes = attributes || {};

  // Degrees
  this.undirectedDegree = 0;
  this.undirectedSelfLoops = 0;

  // Indices
  this.undirected = {};
}

UndirectedNodeData.prototype.upgradeToMixed = function() {

  // Degrees
  this.inDegree = 0;
  this.outDegree = 0;
  this.directedSelfLoops = 0;

  // Indices
  this.in = {};
  this.out = {};
};

/**
 * DirectedEdgeData class.
 *
 * @constructor
 * @param {boolean} generatedKey - Was its key generated?
 * @param {string}  source       - Source of the edge.
 * @param {string}  target       - Target of the edge.
 * @param {object}  attributes   - Edge's attributes.
 */
export function DirectedEdgeData(generatedKey, source, target, attributes) {

  // Attributes
  this.attributes = attributes;

  // Extremities
  this.source = source;
  this.target = target;

  // Was its key generated?
  this.generatedKey = generatedKey;
}

/**
 * UndirectedEdgeData class.
 *
 * @constructor
 * @param {boolean} generatedKey - Was its key generated?
 * @param {string}  source       - Source of the edge.
 * @param {string}  target       - Target of the edge.
 * @param {object}  attributes   - Edge's attributes.
 */
export function UndirectedEdgeData(generatedKey, source, target, attributes) {

  // Attributes
  this.attributes = attributes;

  // Extremities
  this.source = source;
  this.target = target;

  // Was its key generated?
  this.generatedKey = generatedKey;
}
