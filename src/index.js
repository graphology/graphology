/**
 * Graphology Reference Implementation
 * ====================================
 *
 * Reference implementation of the graphology specs.
 */
import {privateProperty, readOnlyProperty} from './utils';

/**
 * Enums.
 */
const TYPES = new Set(['directed', 'undirected', 'mixed']);

/**
 * Default options.
 */
const DEFAULTS = {
  map: false,
  multi: false,
  type: 'mixed'
};

/**
 * Graph class
 *
 * @constructor
 * @param {Graph|Array<Array>} [data]    - Hydratation data.
 * @param {object}             [options] - Options:
 * @param {string}               [type]  - Type of the graph.
 * @param {boolean}              [map]   - Allow references as keys?
 * @param {boolean}              [multi] - Allow parallel edges?
 */
export default class Graph {
  constructor(data, options) {

    options = options || {};

    //-- Solving options
    const map = options.map || DEFAULTS.map,
          multi = options.multi || DEFAULTS.multi,
          type = options.type || DEFAULTS.type;

    // Enforcing options validity
    if (typeof map !== 'boolean')
      throw Error(`Graph.constructor: invalid 'map' option. Expecting a boolean but got "${map}".`);

    if (typeof multi !== 'boolean')
      throw Error(`Graph.constructor: invalid 'multi' option. Expecting a boolean but got "${multi}".`);

    if (!TYPES.has(type))
      throw Error(`Graph.constructor: invalid 'type' option. Should be one of "mixed", "directed" or "undirected" but got "${type}".`);

    //-- Private properties

    // Counters
    privateProperty(this, '_order', 0);
    privateProperty(this, '_size', 0);

    // Indexes
    privateProperty(this, '_nodes', map ? new Map() : {});
    privateProperty(this, '_edges', map ? new Map() : {});

    //-- Properties readers
    readOnlyProperty(this, 'order', () => this._order);
    readOnlyProperty(this, 'size', () => this._size);
    readOnlyProperty(this, 'map', () => map);
    readOnlyProperty(this, 'multi', () => multi);
    readOnlyProperty(this, 'type', () => type);
  }

  /**---------------------------------------------------------------------------
   * Read
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning whether the given node is found in the graph.
   *
   * @param  {any}     node         - The node.
   * @return {boolean}
   */
  hasNode(node) {
    let nodeInGraph = false;

    if (this.map)
      nodeInGraph = this._nodes.has(node);
    else
      nodeInGraph = node in this._nodes;

    return nodeInGraph;
  }

  /**---------------------------------------------------------------------------
   * Mutation
   **---------------------------------------------------------------------------
   */

  /**
   * Method used to add a node to the graph.
   *
   * @param  {any}    node         - The node.
   * @param  {object} [attributes] - Optional attributes.
   * @return {any}                 - The node.
   *
   * @throws {Error} - Will throw if the given attributes are not an object.
   */
  addNode(node, attributes = {}) {
    if (arguments.length > 1 && typeof attributes !== 'object')
      throw Error(`Graph.addNode: invalid attributes. Expecting an object but got "${attributes}"`);

    attributes = attributes || {};

    // Adding the node to internal register
    if (this.map)
      this._nodes.set(node, attributes);
    else
      this._nodes[node] = attributes;

    // Incrementing order
    this._order++;

    return node;
  }

  /**---------------------------------------------------------------------------
   * Attributes
   **---------------------------------------------------------------------------
   */

  /**
   * Method used to retrieve a node attribute's value.
   *
   * @param  {any}    node - The node.
   * @param  {string} name - The attribute's name.
   * @return {any}         - The attribute's value or undefined if not found.
   *
   * @throws {Error} - Will throw if the given node doesn't exist.
   */
  getNodeAttribute(node, name) {
    let attributes;

    if (this.map)
      attributes = this._nodes.get(node);
    else
      attributes = this._nodes[node];

    if (!attributes)
      throw Error(`Graph.getNodeAttribute: the "${node}" wasn't found in the graph.`);

    const value = attributes[name];

    return value;
  }

  /**---------------------------------------------------------------------------
   * Known methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method used to perform string coercion and returning useful information
   * about the Graph instance.
   *
   * @return {string} - String representation of the graph.
   */
  toString() {
    const order = this.order,
          size = this.size;

    // TODO: check grammar
    return `Graph<${order} node${order > 1 ? 's' : ''}, ${size} edge${size > 1 ? 's' : ''}>`;
  }

  /**
   * Method used internally by node's console to display a custom object.
   *
   * @return {string} - String reprensation of the graph.
   */
  inspect() {

    // TODO: this is temporary
    return {nodes: this._nodes};
  }
}
