/**
 * Graphology Reference Implementation
 * ====================================
 *
 * Reference implementation of the graphology specs.
 *
 * Note: Even if the implementation could beneficiate from an abstraction
 * over the object/map manipulation, it does not for performance reasons.
 */
import {EventEmitter} from 'events';
import {
  assign,
  BasicSet,
  isPlainObject,
  prettyPrint,
  privateProperty,
  readOnlyProperty,
  uuid
} from './utils';

/**
 * Helpers.
 */

/**
 * Function creating the minimal entry for the related edges index.
 *
 * @param  {string} type - Type of the graph.
 * @return {object}      - The entry.
 */
function createRelatedEdgesEntry(type) {
  if (type === 'mixed')
    return {in: [], out: [], undirected: []};
  else if (type === 'directed')
    return {in: [], out: []};
  return {undirected: []};
}

/**
 * Enums.
 */
const TYPES = new BasicSet(['directed', 'undirected', 'mixed']),
      INDEXES = new BasicSet(['relatedEdges']);

/**
 * Default options.
 */
const DEFAULTS = {
  edgeKeyGenerator: uuid,
  map: false,
  multi: false,
  type: 'mixed'
};

/**
 * Graph class
 *
 * @constructor
 * @param  {Graph|Array<Array>} [data]    - Hydratation data.
 * @param  {object}             [options] - Options:
 * @param  {string}               [type]  - Type of the graph.
 * @param  {boolean}              [map]   - Allow references as keys?
 * @param  {boolean}              [multi] - Allow parallel edges?
 *
 * @throws {Error} - Will throw if the arguments are not valid.
 */
export default class Graph extends EventEmitter {
  constructor(data, options) {
    super();

    options = options || {};

    //-- Solving options
    const edgeKeyGenerator = options.edgeKeyGenerator || DEFAULTS.edgeKeyGenerator,
          map = options.map || DEFAULTS.map,
          multi = options.multi || DEFAULTS.multi,
          type = options.type || DEFAULTS.type;

    // Enforcing options validity
    if (typeof edgeKeyGenerator !== 'function')
      throw Error(`Graph.constructor: invalid 'edgeKeyGenerator' option. Expecting a function but got "${map}".`);

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
    privateProperty(this, '_indexes', {
      relatedEdges: {
        computed: false,
        synchronized: true,
        full: true,
        data: map ? new Map() : {}
      }
    });

    // Options
    privateProperty(this, '_options', {
      edgeKeyGenerator
    });

    // Methods
    privateProperty(this, '_getEdge', this._getEdge);
    privateProperty(this, '_hasEdge', this._hasEdge);
    privateProperty(this, '_addEdge', this._addEdge);

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
   * @param  {any}     node - The node.
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

  /**
   * Method returning a matching edge (note that it will return the first
   * matching edge, starting with directed one then undirected), or undefined
   * if no matching edge was found.
   *
   * @param  {any}     source - The edge's source.
   * @param  {any}     target - The edge's target.
   * @return {any|undefined}
   */

  // TODO: decompose this into two methods
  getEdge(source, target) {

    // We need to compute the 'relatedEdges' index for this
    this.computeIndex('relatedEdges');

    // Retrieving relevant edges
    const index = this._indexes.relatedEdges.data;

    const data = this.map ? index.get(source) : index[source];

    if (!data)
      return;

    // Trying directed edges
    for (let i = 0, l = data.out.length; i < l; i++) {
      const edge = data.out[i],
            edgeTarget = this.target(edge);

      if (edgeTarget === target)
        return edge;
    }

    // Trying undirected edges
    for (let i = 0, l = data.undirected.length; i < l; i++) {
      const edge = data.undirected[i],
            [edgeSource, edgeTarget] = this.extremities(edge);

      if (edgeSource === target || edgeTarget === target)
        return edge;
    }

    return;
  }

  /**
   * Method returning whether the given edge is found in the graph.
   *
   * Arity 1:
   * @param  {any}     edge - The edge's key.
   *
   * Arity 2:
   * @param  {any}     source - The edge's source.
   * @param  {any}     target - The edge's target.
   *
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the arguments are invalid.
   */
  hasEdge(source, target) {

    if (arguments.length === 1) {
      const edge = source;

      return this.map ? this._edges.has(edge) : edge in this._edges;
    }
    else if (arguments.length === 2) {

      // Attempting to get a relevant edge
      // TODO: change that, what if the edge key is undefined?
      const edge = this.getEdge(source, target);

      return !!edge;
    }

    throw Error(`Graph.hasEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`);
  }

  /**
   * Method returning the given edge's source.
   *
   * @param  {any} edge - The edge's key.
   * @return {any}      - The edge's source.
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  source(edge) {
    if (!this.hasEdge(edge))
      throw Error(`Graph.source: could not find the "${edge}" edge in the graph.`);

    const source = this.map ?
      this._edges.get(edge).source :
      this._edges[edge].source;

    return source;
  }

  /**
   * Method returning the given edge's target.
   *
   * @param  {any} edge - The edge's key.
   * @return {any}      - The edge's target.
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  target(edge) {
    if (!this.hasEdge(edge))
      throw Error(`Graph.target: could not find the "${edge}" edge in the graph.`);

    const target = this.map ?
      this._edges.get(edge).target :
      this._edges[edge].target;

    return target;
  }

  /**
   * Method returning the given edge's extremities.
   *
   * @param  {any}   edge - The edge's key.
   * @return {array}      - The edge's extremities.
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  extremities(edge) {
    if (!this.hasEdge(edge))
      throw Error(`Graph.extremities: could not find the "${edge}" edge in the graph.`);

    return [this.source(edge), this.target(edge)];
  }

  /**
   * Method returning whether the given edge is undirected.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  undirected(edge) {
    if (!this.hasEdge(edge))
      throw Error(`Graph.undirected: could not find the "${edge}" edge in the graph.`);

    const undirected = this.map ?
      this._edges.get(edge).undirected :
      this._edges[edge].undirected;

    return undirected;
  }

  /**
   * Method returning whether the given edge is directed.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  directed(edge) {
    if (!this.hasEdge(edge))
      throw Error(`Graph.directed: could not find the "${edge}" edge in the graph.`);

    return !this.undirected(edge);
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
   * @throws {Error} - Will throw if the given node already exist.
   * @throws {Error} - Will throw if the given attributes are not an object.
   */
  addNode(node, attributes) {
    if (arguments.length > 1 && !isPlainObject(attributes))
      throw Error(`Graph.addNode: invalid attributes. Expecting an object but got "${attributes}"`);

    if (this.hasNode(node))
      throw Error(`Graph.addNode: the "${node}" node already exist in the graph.`);

    attributes = attributes || {};

    const data = {
      degree: 0,
      attributes
    };

    // Adding the node to internal register
    if (this.map)
      this._nodes.set(node, data);
    else
      this._nodes[node] = data;

    // Incrementing order
    this._order++;

    return node;
  }

  /**
   * Internal method used to add an arbitrary edge to the graph.
   *
   * @param  {string}  name         - Name of the child method for errors.
   * @param  {boolean} undirected   - Whether the edge is undirected.
   * @param  {any}     edge         - The edge's key.
   * @param  {any}     source       - The source node.
   * @param  {any}     target       - The target node.
   * @param  {object}  [attributes] - Optional attributes.
   * @return {any}                  - The edge.
   *
   * @throws {Error} - Will throw if the graph is undirected.
   * @throws {Error} - Will throw if the given attributes are not an object.
   * @throws {Error} - Will throw if source or target doesn't exist.
   * @throws {Error} - Will throw if the edge already exist.
   */
  _addEdge(name, undirected, edge, source, target, attributes) {
    attributes = attributes || {};

    if (!undirected && this.type === 'undirected')
      throw Error(`Graph.${name}: you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.`);

    if (undirected && this.type === 'directed')
      throw Error(`Graph.${name}: you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.`);

    if (arguments.length > 3 && !isPlainObject(attributes))
      throw Error(`Graph.${name}: invalid attributes. Expecting an object but got "${attributes}"`);

    if (!this.hasNode(source))
      throw Error(`Graph.${name}: source node "${source}" not found.`);

    if (!this.hasNode(target))
      throw Error(`Graph.${name}: target node "${target}" not found.`);

    if (this.hasEdge(edge))
      throw Error(`Graph.${name}: the "${edge}" edge already exists in the graph.`);

    // Storing some data
    const data = {
      undirected,
      attributes,
      source,
      target
    };

    if (this.map)
      this._edges.set(edge, data);
    else
      this._edges[edge] = data;

    // Incrementing size
    this._size++;

    return edge;
  }

  /**
   * Method used to add a directed edge to the graph using the given key.
   *
   * @param  {any}    edge         - The edge's key.
   * @param  {any}    source       - The source node.
   * @param  {any}    target       - The target node.
   * @param  {object} [attributes] - Optional attributes.
   * @return {any}                 - The edge.
   */
  addDirectedEdgeWithKey(edge, source, target, attributes) {
    return this._addEdge(
      'addDirectedEdgeWithKey',
      false,
      edge,
      source,
      target,
      attributes
    );
  }

  /**
   * Method used to add an undirected edge to the graph using the given key.
   *
   * @param  {any}    edge         - The edge's key.
   * @param  {any}    source       - The source node.
   * @param  {any}    target       - The target node.
   * @param  {object} [attributes] - Optional attributes.
   * @return {any}                 - The edge.
   */
  addUndirectedEdgeWithKey(edge, source, target, attributes) {
    return this._addEdge(
      'addUndirectedEdgeWithKey',
      true,
      edge,
      source,
      target,
      attributes
    );
  }

  /**
   * Method used to add a directed edge to the graph.
   *
   * @param  {any}    source       - The source node.
   * @param  {any}    target       - The target node.
   * @param  {object} [attributes] - Optional attributes.
   * @return {any}                 - The edge.
   */
  addDirectedEdge(source, target, attributes) {

    // Generating an id
    const edge = this._options.edgeKeyGenerator(
      false,
      source,
      target,
      attributes
    );

    return this._addEdge(
      'addDirectedEdge',
      false,
      edge,
      source,
      target,
      attributes
    );
  }

  /**
   * Method used to add an undirected edge to the graph.
   *
   * @param  {any}    source       - The source node.
   * @param  {any}    target       - The target node.
   * @param  {object} [attributes] - Optional attributes.
   * @return {any}                 - The edge.
   */
  addUndirectedEdge(source, target, attributes) {

    // Generating an id
    const edge = this._options.edgeKeyGenerator(
      false,
      source,
      target,
      attributes
    );

    return this._addEdge(
      'addUndirectedEdge',
      true,
      edge,
      source,
      target,
      attributes
    );
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
    let data;

    if (this.map)
      data = this._nodes.get(node);
    else
      data = this._nodes[node];

    if (!data)
      throw Error(`Graph.getNodeAttribute: the "${node}" wasn't found in the graph.`);

    const value = data.attributes[name];

    return value;
  }

  /**---------------------------------------------------------------------------
   * Indexes-related methods.
   **---------------------------------------------------------------------------
   */

  /**
   * Method computing the desired index.
   *
   * @param  {string} name - Name of the index to compute.
   * @return {Graph}       - Returns itself for chaining.
   *
   * @throw  {Error} - Will throw if the index doesn't exist.
   */
  computeIndex(name) {

    if (!INDEXES.has(name))
      throw Error(`Graph.computeIndex: unknown "${name}" index.`);

    if (name === 'relatedEdges') {
      const index = this._indexes.relatedEdges;

      if (index.computed)
        return this;

      if (this.map) {
        this._edges.forEach(function(value, edge) {
          const {
            undirected,
            source,
            target
          } = value;

          // Initializing
          if (!index.data.has(source))
            index.data.set(source, createRelatedEdgesEntry(this.type));
          if (!index.data.has(target))
            index.data.set(target, createRelatedEdgesEntry(this.type));

          const sourceEdges = index.data.get(source),
                targetEdges = index.data.get(target);

          if (undirected) {
            sourceEdges.undirected.push(edge);
            targetEdges.undirected.push(edge);
          }
          else {
            sourceEdges.out.push(edge);
            targetEdges.in.push(edge);
          }
        });
      }
      else {
        for (const edge in this._edges) {
          const {
            undirected,
            source,
            target
          } = this._edges[edge];

          if (!(source in index.data))
            index.data[source] = createRelatedEdgesEntry(this.type);
          if (!(target in index.data))
            index.data[target] = createRelatedEdgesEntry(this.type);

          const sourceEdges = index.data[source],
                targetEdges = index.data[target];

          if (undirected) {
            sourceEdges.undirected.push(edge);
            targetEdges.undirected.push(edge);
          }
          else {
            sourceEdges.out.push(edge);
            targetEdges.in.push(edge);
          }
        }
      }

      index.computed = true;
    }

    return this;
  }

  /**
   * Method updating the desired index.
   *
   * @param  {string} name      - Name of the index to compute.
   * @param  {mixed}  [...args] - Additional arguments.
   * @return {Graph}            - Returns itself for chaining.
   *
   * @throw  {Error} - Will throw if the index doesn't exist.
   */
  updateIndex(name) {
    if (!INDEXES.has(name))
      throw Error(`Graph.computeIndex: unknown "${name}" index.`);
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
    const pluralOrder = this.order > 1 || this.order === 0,
          pluralSize = this.size > 1 || this.size === 0;

    return `Graph<${prettyPrint(this.order)} node${pluralOrder ? 's' : ''}, ${prettyPrint(this.size)} edge${pluralSize ? 's' : ''}>`;
  }

  /**
   * Method used internally by node's console to display a custom object.
   *
   * @return {string} - String reprensation of the graph.
   */

  // TODO: finish this when possible
  inspect() {
    let nodes;

    if (this.map) {
      nodes = new Map();
      this._nodes.forEach(function(value, key) {
        nodes.set(key, value.attributes);
      });
    }
    else {
      nodes = {};

      for (const k in this._nodes)
        nodes[k] = this._nodes[k].attributes;
    }

    const dummy = {
      order: this.order,
      size: this.size,
      nodes
    };

    privateProperty(dummy, 'constructor', this.constructor);

    return dummy;
  }
}

/**
 * Alternative constructors.
 */
class DirectedGraph extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({}, {type: 'directed'}, options)
    );
  }
}
class UndirectedGraph extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({}, {type: 'undirected'}, options)
    );
  }
}
class MultiDirectedGraph extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({}, {multi: true, type: 'directed'}, options)
    );
  }
}
class MultiUndirectedGraph extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({}, {multi: true, type: 'undirected'}, options)
    );
  }
}
class DirectedGraphMap extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({}, {map: true, type: 'directed'}, options)
    );
  }
}
class UndirectedGraphMap extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({}, {map: true, type: 'undirected'}, options)
    );
  }
}
class MultiDirectedGraphMap extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({}, {map: true, multi: true, type: 'directed'}, options)
    );
  }
}
class MultiUndirectedGraphMap extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({}, {map: true, multi: true, type: 'undirected'}, options)
    );
  }
}

export {
  DirectedGraph,
  UndirectedGraph,
  MultiDirectedGraph,
  MultiUndirectedGraph,
  DirectedGraphMap,
  UndirectedGraphMap,
  MultiDirectedGraphMap,
  MultiUndirectedGraphMap
};
