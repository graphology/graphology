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
  InvalidArgumentsGraphError,
  NotFoundGraphError,
  UsageGraphError
} from './errors';

import {attachAttributesMethods} from './attributes';
import {attachEdgeIterationMethods} from './iteration/edges';
import {attachNeighborIterationMethods} from './iteration/neighbors';

import {
  serializeNode,
  serializeEdge
} from './serialization';

import {
  BasicSet,
  isBunch,
  isPlainObject,
  overBunch,
  prettyPrint,
  privateProperty,
  readOnlyProperty,
  uuid
} from './utils';

// TODO: create template tag to properly display object references
// TODO: build partial index on get/has methods
// TODO: adjust degree docs
// TODO: adjust index docs
// TODO: add method to check if edge is self loop?
// TODO: mixed graph edge duplicate discussion?
// TODO: remettre le directed default en discussion?
// TODO: reinstate that keys have the same problem that JS objects
// TODO: indicate that iterator will only work on recent engines
// TODO: create test abstraction to test bunches & iterators
// TODO: drop createiterator from docs
// TODO: possibility to optimize edge iteration by stocking in separated indexes for directed etc.
// TODO: precise order of iteration in both edges & neighbors (in -> out -> undirected)
// TODO: document how to run the specs
// TODO: change property name selfLoops
// TODO: create own errors
// TODO: relations index should be only about existence or count of edges
// TODO: hasEdge has changed heuristics
// TODO: discuss Directed === s -> t plus t -> s possible?
// TODO: possible to optimize the index by flattening to matrices
// TODO: self iterator should be adjacency if we make it
// TODO: differentiate index structure for simple/multi for performance
// TODO: at the end, make an optimization run
// TODO: drop the reducers from implem, benefits are too small vs. implementation cost
// TODO: bug in edges(source, target)
// TODO: move iterations functions below in iteration
// TODO: finish JSDocs
// TODO: decide what to do with merger
// TODO: in the current index, neighbors need to be uniq'd. maybe a separated index for edges & neighbors would simplify this.
// TODO: better to have one index root or two?
// TODO: add arity to #.exportDirectedEdges etc.

/**
 * Enums.
 */
const TYPES = new BasicSet(['directed', 'undirected', 'mixed']),
      INDEXES = new BasicSet(['relations']),
      EMITTER_PROPS = new BasicSet(['domain', '_events', '_eventsCount', '_maxListeners']);

/**
 * Default options.
 */
const DEFAULTS = {
  allowSelfLoops: true,
  edgeKeyGenerator: uuid,
  map: false,
  multi: false,
  type: 'mixed'
};

/**
 * Helpers.
 */

/**
 * Function creating the minimal entry for storing node data.
 *
 * @param  {string}  type       - Type of the graph.
 * @param  {object}  attributes - Node's attributes.
 * @return {object}             - The entry.
 */
function createNodeEntry(type, attributes) {
  const entry = {attributes, selfLoops: 0};

  if (type === 'mixed' || type === 'directed') {
    entry.inDegree = 0;
    entry.outDegree = 0;
  }
  if (type === 'mixed' || type === 'undirected') {
    entry.undirectedDegree = 0;
  }

  return entry;
}

/**
 * Function creating the minimal entry for the related edges index.
 *
 * @param  {string}  type - Type of the graph.
 * @param  {boolean} map  - Whether the graph accepts references as keys.
 * @return {object}       - The entry.
 */
function createRelationEntry(type, map) {
  const entry = {};

  if (type === 'mixed' || type === 'directed') {
    entry.in = map ? new Map() : {};
    entry.out = map ? new Map() : {};
  }

  if (type === 'mixed' || type === 'undirected') {
    entry.undirectedIn = map ? new Map() : {};
    entry.undirectedOut = map ? new Map() : {};
  }

  return entry;
}

/**
 * Graph class
 *
 * @constructor
 * @param  {Graph|Array<Array>} [data]    - Hydratation data.
 * @param  {object}             [options] - Options:
 * @param  {boolean}              [allowSelfLoops] - Allow self loops?
 * @param  {string}               [type]           - Type of the graph.
 * @param  {boolean}              [map]            - Allow references as keys?
 * @param  {boolean}              [multi]          - Allow parallel edges?
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
          type = options.type || DEFAULTS.type,
          selfLoops = 'allowSelfLoops' in options ? options.allowSelfLoops : DEFAULTS.allowSelfLoops;

    // Enforcing options validity
    if (typeof edgeKeyGenerator !== 'function')
      throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'edgeKeyGenerator' option. Expecting a function but got "${map}".`);

    if (typeof map !== 'boolean')
      throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'map' option. Expecting a boolean but got "${map}".`);

    if (map && typeof Map !== 'function')
      throw new InvalidArgumentsGraphError('Graph.constructor: it seems you created a GraphMap instance while your current JavaScript engine does not support ES2015 Map objects.');

    if (typeof multi !== 'boolean')
      throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'multi' option. Expecting a boolean but got "${multi}".`);

    if (!TYPES.has(type))
      throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'type' option. Should be one of "mixed", "directed" or "undirected" but got "${type}".`);

    if (typeof selfLoops !== 'boolean')
      throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got "${selfLoops}".`);

    //-- Private properties

    // Counters
    privateProperty(this, '_order', 0);
    privateProperty(this, '_size', 0);

    // Indexes
    privateProperty(this, '_nodes', map ? new Map() : {});
    privateProperty(this, '_edges', map ? new Map() : {});
    privateProperty(this, '_indexes', {
      relations: {
        computed: false,
        synchronized: true,
        data: map ? new Map() : {}
      }
    });

    // Options
    privateProperty(this, '_options', {
      edgeKeyGenerator
    });

    // Methods
    privateProperty(this, '_addEdge', this._addEdge);
    privateProperty(this, 'updateIndex', this.updateIndex);
    privateProperty(this, 'clearNodeFromIndex', this.clearNodeFromIndex);
    privateProperty(this, 'clearEdgeFromIndex', this.clearEdgeFromIndex);

    //-- Properties readers
    readOnlyProperty(this, 'order', () => this._order);
    readOnlyProperty(this, 'size', () => this._size);
    readOnlyProperty(this, 'map', () => map);
    readOnlyProperty(this, 'multi', () => multi);
    readOnlyProperty(this, 'type', () => type);
    readOnlyProperty(this, 'selfLoops', () => selfLoops);
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
   * Internal method returning a matching directed edge or undefined if no
   * matching edge was found.
   *
   * @param  {any}     source - The edge's source.
   * @param  {any}     target - The edge's target.
   * @return {any|undefined}
   */
  getDirectedEdge(source, target) {

    // We need to compute the 'relations' index for this
    this.computeIndex('relations');

    // Retrieving relevant edges
    const index = this._indexes.relations.data;

    if (this.map ? !index.has(source) : !(source in index))
      return;

    // Is there a directed edge pointing towards target?
    const out = this.map ? index.get(source).out : index[source].out,
          edges = (this.map ? out.get(target) : out[target]) || [];

    return edges[0];
  }

  /**
   * Internal method returning a matching undirected edge or undefined if no
   * matching edge was found.
   *
   * @param  {any}     source - The edge's source.
   * @param  {any}     target - The edge's target.
   * @return {any|undefined}
   */
  getUndirectedEdge(source, target) {

    // We need to compute the 'relations' index for this
    this.computeIndex('relations');

    // Retrieving relevant edges
    const index = this._indexes.relations.data;

    if (this.map ? !index.has(source) : !(source in index))
      return;

    // Is there an undirected edge linking our source & target
    const undirectedIn = this.map ? index.get(source).undirectedIn : index[source].undirectedIn,
          undirectedOut = this.map ? index.get(source).undirectedOut : index[source].undirectedOut,
          edges = (
            (this.map ? undirectedIn.get(target) : undirectedIn[target]) ||
            (this.map ? undirectedOut.get(target) : undirectedOut[target])
          ) || [];

    return edges[0];
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
  getEdge(source, target) {
    let edge;

    // First we try to find a directed edge
    edge = this.getDirectedEdge(source, target);

    if (edge)
      return edge;

    edge = this.getDirectedEdge(target, source);

    if (edge)
      return edge;

    // Second we try to find an undirected edge
    edge = this.getUndirectedEdge(source, target);

    return edge;
  }

  /**
   * Method returning whether the given directed edge is found in the graph.
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
  hasDirectedEdge(source, target) {
    if (arguments.length === 1) {
      const edge = source;

      return (
        this.map ? this._edges.has(edge) : edge in this._edges &&
        this.directed(edge)
      );
    }
    else if (arguments.length === 2) {

      // We need to compute the 'relations' index for this
      this.computeIndex('relations');

      // Retrieving relevant edges
      const index = this._indexes.relations.data;

      if (this.map ? !index.has(source) : !(source in index))
        return false;

      // Is there a directed edge pointing towards target?
      const out = this.map ? index.get(source).out : index[source].out,
            edges = (this.map ? out.get(target) : out[target]) || [];

      return !!edges.length;
    }

    throw new InvalidArgumentsGraphError(`Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`);
  }

  /**
   * Method returning whether the given undirected edge is found in the graph.
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
  hasUndirectedEdge(source, target) {
    if (arguments.length === 1) {
      const edge = source;

      return (
        this.map ? this._edges.has(edge) : edge in this._edges &&
        this.undirected(edge)
      );
    }
    else if (arguments.length === 2) {

      // We need to compute the 'relations' index for this
      this.computeIndex('relations');

      // Retrieving relevant edges
      const index = this._indexes.relations.data;

      if (this.map ? !index.has(source) : !(source in index))
        return false;

      // Is there an undirected edge pointing towards target?
      const undirectedIn = this.map ? index.get(source).undirectedIn : index[source].undirectedIn,
            undirectedOut = this.map ? index.get(source).undirectedOut : index[source].undirectedOut,
            edges = (
              (this.map ? undirectedIn.get(target) : undirectedIn[target]) ||
              (this.map ? undirectedOut.get(target) : undirectedOut[target])
            ) || [];

      return !!edges.length;
    }

    throw new InvalidArgumentsGraphError(`Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`);
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
      return (
        this.hasDirectedEdge(source, target) ||
        this.hasDirectedEdge(target, source) ||
        this.hasUndirectedEdge(source, target)
      );
    }

    throw new InvalidArgumentsGraphError(`Graph.hasEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`);
  }

  /**
   * Method returning the given node's in degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} selfLoops - Count self-loops?
   * @return {number}            - The node's in degree.
   *
   * @throws {Error} - Will throw if the selfLoops arg is not boolean.
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  inDegree(node, selfLoops = true) {
    if (typeof selfLoops !== 'boolean')
      throw new InvalidArgumentsGraphError(`Graph.inDegree: Expecting a boolean but got "${selfLoops}" for the second parameter (allowing self-loops to be counted).`);

    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.inDegree: could not find the "${node}" node in the graph.`);

    const data = this.map ? this._nodes.get(node) : this._nodes[node];

    return data.inDegree + (selfLoops ? data.selfLoops : 0);
  }

  /**
   * Method returning the given node's out degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} selfLoops - Count self-loops?
   * @return {number}            - The node's out degree.
   *
   * @throws {Error} - Will throw if the selfLoops arg is not boolean.
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  outDegree(node, selfLoops = true) {
    if (typeof selfLoops !== 'boolean')
      throw new InvalidArgumentsGraphError(`Graph.outDegree: Expecting a boolean but got "${selfLoops}" for the second parameter (allowing self-loops to be counted).`);

    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.outDegree: could not find the "${node}" node in the graph.`);

    const data = this.map ? this._nodes.get(node) : this._nodes[node];

    return data.outDegree + (selfLoops ? data.selfLoops : 0);
  }

  /**
   * Method returning the given node's directed degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} selfLoops - Count self-loops?
   * @return {number}            - The node's directed degree.
   *
   * @throws {Error} - Will throw if the selfLoops arg is not boolean.
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  directedDegree(node, selfLoops = true) {
    if (typeof selfLoops !== 'boolean')
      throw new InvalidArgumentsGraphError(`Graph.directedDegree: Expecting a boolean but got "${selfLoops}" for the second parameter (allowing self-loops to be counted).`);

    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.directedDegree: could not find the "${node}" node in the graph.`);

    const data = this.map ? this._nodes.get(node) : this._nodes[node];

    return (
      data.outDegree + data.inDegree +
      (selfLoops ? data.selfLoops : 0)
    );
  }

  /**
   * Method returning the given node's undirected degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} selfLoops - Count self-loops?
   * @return {number}            - The node's undirected degree.
   *
   * @throws {Error} - Will throw if the selfLoops arg is not boolean.
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  undirectedDegree(node, selfLoops = true) {
    if (typeof selfLoops !== 'boolean')
      throw new InvalidArgumentsGraphError(`Graph.undirectedDegree: Expecting a boolean but got "${selfLoops}" for the second parameter (allowing self-loops to be counted).`);

    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.undirectedDegree: could not find the "${node}" node in the graph.`);

    const data = this.map ? this._nodes.get(node) : this._nodes[node];

    return (
      data.undirectedDegree +
      (selfLoops ? data.selfLoops : 0)
    );
  }

  /**
   * Method returning the given node's degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} selfLoops - Count self-loops?
   * @return {number}            - The node's degree.
   *
   * @throws {Error} - Will throw if the selfLoops arg is not boolean.
   * @throws {Error} - Will throw if the node isn't in the graph.
   */
  degree(node, selfLoops = true) {
    if (typeof selfLoops !== 'boolean')
      throw new InvalidArgumentsGraphError(`Graph.degree: Expecting a boolean but got "${selfLoops}" for the second parameter (allowing self-loops to be counted).`);

    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.degree: could not find the "${node}" node in the graph.`);

    const data = this.map ? this._nodes.get(node) : this._nodes[node];

    return (
      data.outDegree + data.inDegree + data.undirectedDegree +
      (selfLoops ? data.selfLoops : 0)
    );
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
      throw new NotFoundGraphError(`Graph.source: could not find the "${edge}" edge in the graph.`);

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
      throw new NotFoundGraphError(`Graph.target: could not find the "${edge}" edge in the graph.`);

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
      throw new NotFoundGraphError(`Graph.extremities: could not find the "${edge}" edge in the graph.`);

    return [this.source(edge), this.target(edge)];
  }

  /**
   * Given a node & an edge, returns the other extremity of the edge.
   *
   * @param  {any}   node - The node's key.
   * @param  {any}   edge - The edge's key.
   * @return {any}        - The related node.
   *
   * @throws {Error} - Will throw if either the node or the edge isn't in the graph.
   */
  relatedNode(node, edge) {
    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.relatedNode: could not find the "${node}" node in the graph.`);

    if (!this.hasEdge(edge))
      throw new NotFoundGraphError(`Graph.relatedNode: could not find the "${edge}" edge in the graph.`);

    const [node1, node2] = this.extremities(edge);

    return node === node1 ? node2 : node1;
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
      throw new NotFoundGraphError(`Graph.undirected: could not find the "${edge}" edge in the graph.`);

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
      throw new NotFoundGraphError(`Graph.directed: could not find the "${edge}" edge in the graph.`);

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
      throw new InvalidArgumentsGraphError(`Graph.addNode: invalid attributes. Expecting an object but got "${attributes}"`);

    if (this.hasNode(node))
      throw new UsageGraphError(`Graph.addNode: the "${node}" node already exist in the graph. You might want to check out the 'onDuplicateNode' option.`);

    attributes = attributes || {};

    const data = createNodeEntry(this.type, attributes);

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
   * Method used to add a nodes from a bunch.
   *
   * @param  {bunch}  bunch - The node.
   * @return {Graph}        - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if the given bunch is not valid.
   */
  addNodesFrom(bunch) {
    if (!isBunch(bunch))
      throw new InvalidArgumentsGraphError(`Graph.addNodesFrom: invalid bunch provided ("${bunch}").`);

    overBunch(bunch, (error, node, attributes) => {
      this.addNode(node, attributes);
    });

    return this;
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
    attributes = attributes || {};

    if (!undirected && this.type === 'undirected')
      throw new UsageGraphError(`Graph.${name}: you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.`);

    if (undirected && this.type === 'directed')
      throw new UsageGraphError(`Graph.${name}: you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.`);

    if (arguments.length > 5 && !isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(`Graph.${name}: invalid attributes. Expecting an object but got "${attributes}"`);

    if (!this.hasNode(source))
      throw new NotFoundGraphError(`Graph.${name}: source node "${source}" not found.`);

    if (!this.hasNode(target))
      throw new NotFoundGraphError(`Graph.${name}: target node "${target}" not found.`);

    if (this.hasEdge(edge))
      throw new UsageGraphError(`Graph.${name}: the "${edge}" edge already exists in the graph.`);

    if (!this.selfLoops && source === target)
      throw new UsageGraphError(`Graph.${name}: source & target are the same, thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`);

    if (!this.multi && this.hasEdge(source, target))
      throw new UsageGraphError(`Graph.${name}: an edge linking "${source}" to "${target}" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option. The 'onDuplicateEdge' option might also interest you.`);

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

    // Incrementing node counters
    const sourceData = this.map ? this._nodes.get(source) : this._nodes[source],
          targetData = this.map ? this._nodes.get(target) : this._nodes[target];

    if (source === target) {
      sourceData.selfLoops++;
    }
    else {
      if (undirected) {
        sourceData.undirectedDegree++;
        targetData.undirectedDegree++;
      }
      else {
        sourceData.outDegree++;
        targetData.inDegree++;
      }
    }

    // Updating relevant indexes
    this.updateIndex('relations', edge);

    return edge;
  }

  /**
   * Method used to add an edge of the type of the graph or directed if the
   * graph is mixed using the given key.
   *
   * @param  {any}    edge         - The edge's key.
   * @param  {any}    source       - The source node.
   * @param  {any}    target       - The target node.
   * @param  {object} [attributes] - Optional attributes.
   * @return {any}                 - The edge.
   */
  addEdgeWithKey(edge, source, target, attributes) {
    return this._addEdge(
      'addEdgeWithKey',
      this.type === 'undirected',
      edge,
      source,
      target,
      attributes
    );
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
   * Method used to add an edge of the type of the graph or directed if the
   * graph is mixed. An id will automatically be created for it using the
   * 'edgeKeyGenerator' option.
   *
   * @param  {any}    source       - The source node.
   * @param  {any}    target       - The target node.
   * @param  {object} [attributes] - Optional attributes.
   * @return {any}                 - The edge.
   */
  addEdge(source, target, attributes) {
    const edge = this._options.edgeKeyGenerator(
      this.type === 'undirected',
      source,
      target,
      attributes
    );

    return this._addEdge(
      'addEdge',
      this.type === 'undirected',
      edge,
      source,
      target,
      attributes
    );
  }

  /**
   * Method used to add a directed edge to the graph. An id will automatically
   * be created for it using the 'edgeKeyGenerator' option.
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
   * Method used to add an undirected edge to the graph. An id will automatically
   * be created for it using the 'edgeKeyGenerator' option.
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

  /**
   * Method used to drop a single node & all its attached edges from the graph.
   *
   * @param  {any}    node - The node.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the node doesn't exist.
   */
  dropNode(node) {
    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.dropNode: could not find the "${node}" node in the graph.`);

    // Removing attached edges
    const edges = this.edges(node);

    // NOTE: we could go faster here
    for (let i = 0, l = edges.length; i < l; i++)
      this.dropEdge(edges[i]);

    // Dropping the node from the register
    if (this.map)
      this._nodes.delete(node);
    else
      delete this._nodes[node];

    // Decrementing order
    this._order--;

    // Clearing index
    this.clearNodeFromIndex('relations', node);
  }

  /**
   * Method used to drop a single edge from the graph.
   *
   * @param  {any}    edge - The edge.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the edge doesn't exist.
   */
  dropEdge(edge) {
    if (!this.hasEdge(edge))
      throw new NotFoundGraphError(`Graph.dropEdge: could not find the "${edge}" edge in the graph.`);

    const data = this.map ? this._edges.get(edge) : this._edges[edge];

    // Dropping the edge from the register
    if (this.map)
      this._edges.delete(edge);
    else
      delete this._edges[edge];

    // Decrementing size
    this._size--;

    // Updating related degrees
    const {source, target, undirected} = data;

    const sourceData = this.map ? this._nodes.get(source) : this._nodes[source],
          targetData = this.map ? this._nodes.get(target) : this._nodes[target];

    if (undirected) {
      sourceData.undirectedDegree--;
      targetData.undirectedDegree--;
    }
    else {
      sourceData.outDegree--;
      targetData.inDegree--;
    }

    // Clearing index
    this.clearEdgeFromIndex('relations', edge, data);

    return this;
  }

  /**
   * Method used to remove every edge & every node from the graph.
   *
   * @return {Graph}
   */
  clear() {

    // Dropping edges
    this._edges = this.map ? new Map() : {};

    // Dropping nodes
    this._nodes = this.map ? new Map() : {};

    // Clearing index
    this.clearIndex('relations');

    // Resetting counters
    this._order = 0;
    this._size = 0;

    // TODO: if index precomputed, activate it
  }

  /**---------------------------------------------------------------------------
   * Iteration-related methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning the list of the graph's nodes.
   *
   * @return {array} - The nodes.
   */
  nodes() {

    if (this.map)
      return [...this._nodes.keys()];

    return Object.keys(this._nodes);
  }

  /**---------------------------------------------------------------------------
   * Import / Export
   **---------------------------------------------------------------------------
   */

  /**
   * Method exporting the target node.
   *
   * @param  {any}   node - Target node.
   * @return {array}      - The serialized node.
   *
   * @throws {Error} - Will throw if the node is not found.
   */
  exportNode(node) {
    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.exportNode: could not find the "${node}" node in the graph.`);

    const data = this.map ? this._nodes.get(node) : this._nodes[node];

    return serializeNode(node, data);
  }

  /**
   * Method exporting the target edge.
   *
   * @param  {any}   edge - Target edge.
   * @return {array}      - The serialized edge.
   *
   * @throws {Error} - Will throw if the edge is not found.
   */
  exportEdge(edge) {
    if (!this.hasEdge(edge))
      throw new NotFoundGraphError(`Graph.exportEdge: could not find the "${edge}" edge in the graph.`);

    const data = this.map ? this._edges.get(edge) : this._edges[edge];

    return serializeEdge(edge, data);
  }

  /**
   * Method exporting every nodes or the bunch ones.
   *
   * @param  {mixed}   [bunch] - Target nodes.
   * @return {array[]}         - The serialized nodes.
   *
   ** @throws {Error} - Will throw if any of the nodes is not found.
   */
  exportNodes(bunch) {
    let nodes = [];

    if (!arguments.length) {

      // Exporting every node
      nodes = this.nodes();
    }
    else {

      // Exporting the bunch
      if (!isBunch(bunch))
        throw new InvalidArgumentsGraphError('Graph.exportNodes: invalid bunch.');

      overBunch(bunch, (error, node) => {
        if (!this.hasNode(node))
          throw new NotFoundGraphError(`Graph.exportNodes: could not find the "${node}" node from the bunch in the graph.`);
        nodes.push(node);
      });
    }

    const serializedNodes = new Array(nodes.length);

    for (let i = 0, l = nodes.length; i < l; i++)
      serializedNodes[i] = this.exportNode(nodes[i]);

    return serializedNodes;
  }

  /**
   * Method exporting every edges or the bunch ones.
   *
   * @param  {mixed}   [bunch] - Target edges.
   * @return {array[]}         - The serialized edges.
   *
   ** @throws {Error} - Will throw if any of the edges is not found.
   */
  exportEdges(bunch) {
    let edges = [];

    if (!arguments.length) {

      // Exporting every edge
      edges = this.edges();
    }
    else {

      // Exporting the bunch
      if (!isBunch(bunch))
        throw new InvalidArgumentsGraphError('Graph.exportEdges: invalid bunch.');

      overBunch(bunch, (error, edge) => {
        if (!this.hasEdge(edge))
          throw new NotFoundGraphError(`Graph.exportEdges: could not find the "${edge}" edge from the bunch in the graph.`);
        edges.push(edge);
      });
    }

    const serializedNodes = new Array(edges.length);

    for (let i = 0, l = edges.length; i < l; i++)
      serializedNodes[i] = this.exportEdge(edges[i]);

    return serializedNodes;
  }

  /**---------------------------------------------------------------------------
   * Indexes-related methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method computing the desired index.
   *
   * @param  {string} name - Name of the index to compute.
   * @return {Graph}       - Returns itself for chaining.
   *
   * @throw  {Error} - Will throw if the index doesn't exist.
   *
   * Note: the 'relations' index works thusly:
   *   A key for each node with an object storing every edge category:
   *   'in', 'out', 'undirectedIn', 'undirectedOut', each being an object
   *   with keys being the related node and each value being an array of the
   *   relevant edges.
   */
  computeIndex(name) {

    if (!INDEXES.has(name))
      throw new InvalidArgumentsGraphError(`Graph.computeIndex: unknown "${name}" index.`);

    if (name === 'relations') {
      const index = this._indexes.relations;

      if (index.computed)
        return this;

      index.computed = true;

      if (this.map) {
        this._edges.forEach((_, edge) => this.updateIndex(name, edge));
      }
      else {
        for (const edge in this._edges)
          this.updateIndex(name, edge);
      }
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
  updateIndex(name, edge) {
    if (!INDEXES.has(name))
      throw new InvalidArgumentsGraphError(`Graph.updateIndex: unknown "${name}" index.`);

    const index = this._indexes.relations;

    if (!index.computed)
      return this;

    if (this.map) {
      const {
        undirected,
        source,
        target
      } = this._edges.get(edge);

      if (!index.data.has(source))
        index.data.set(source, createRelationEntry(this.type, this.map));
      if (!index.data.has(target))
        index.data.set(target, createRelationEntry(this.type, this.map));

      const sourceData = index.data.get(source),
            targetData = index.data.get(target);

      // Building indexes for source
      const sourceRegister = undirected ?
        sourceData.undirectedOut :
        sourceData.out;

      if (!sourceRegister.has(target))
        sourceRegister.set(target, []);
      sourceRegister.get(target).push(edge);

      // Building indexes for target
      const targetRegister = undirected ?
        targetData.undirectedIn :
        targetData.in;

      if (!targetRegister.has(source))
        targetRegister.set(source, []);
      targetRegister.get(source).push(edge);
    }
    else {
      const {
        undirected,
        source,
        target
      } = this._edges[edge];

      if (!(source in index.data))
        index.data[source] = createRelationEntry(this.type, this.map);
      if (!(target in index.data))
        index.data[target] = createRelationEntry(this.type, this.map);

      const sourceData = index.data[source],
            targetData = index.data[target];

      // Building indexes for source
      const sourceRegister = undirected ?
        sourceData.undirectedOut :
        sourceData.out;

      if (!(target in sourceRegister))
        sourceRegister[target] = [];
      sourceRegister[target].push(edge);

      // Building indexes for target
      const targetRegister = undirected ?
        targetData.undirectedIn :
        targetData.in;

      if (!(source in targetRegister))
        targetRegister[source] = [];
      targetRegister[source].push(edge);
    }
  }

  clearNodeFromIndex(name, node) {
    if (!INDEXES.has(name))
      throw new InvalidArgumentsGraphError(`Graph.updateIndex: unknown "${name}" index.`);

    const index = this._indexes.relations,
          indexData = index.data;

    if (!index.computed)
      return this;

    // NOTE: when arriving here, all attached edges should have been dropped
    if (this.map)
      indexData.delete(node);
    else
      delete indexData[node];

    return this;
  }

  /**
   * Method clearing data related to a single edge.
   *
   * @param  {string} name     - Name of the index to compute.
   * @param  {any}    edge     - The edge to remove.
   * @param  {object} edgeData - Data of the removed edge.
   * @return {Graph}           - Returns itself for chaining.
   *
   * @throw  {Error} - Will throw if the index doesn't exist.
   */
  clearEdgeFromIndex(name, edge, edgeData) {
    if (!INDEXES.has(name))
      throw new InvalidArgumentsGraphError(`Graph.updateIndex: unknown "${name}" index.`);

    const index = this._indexes.relations,
          indexData = index.data;

    if (!index.computed)
      return this;

    const {source, target, undirected} = edgeData;

    const sourceData = this.map ? indexData.get(source) : indexData[source],
          targetData = this.map ? indexData.get(target) : indexData[target];

    let sourceRegister,
        targetRegister;

    if (undirected) {
      sourceRegister = sourceData.undirectedOut;
      targetRegister = targetData.undirectedIn;
    }
    else {
      sourceRegister = sourceData.out;
      targetRegister = targetData.in;
    }

    sourceRegister = this.map ?
      sourceRegister.get(target) :
      sourceRegister[target];

    targetRegister = this.map ?
      targetRegister.get(source) :
      targetRegister[source];

    // NOTE: This method could prove out-of-line performance-wise for large
    // multi-graphs. This solution is to store the edges in sets or linked lists
    const sourceIndex = sourceRegister.indexOf(edge),
          targetIndex = targetRegister.indexOf(edge);

    sourceRegister.splice(sourceIndex, 1);
    targetRegister.splice(targetIndex, 1);

    return this;
  }

  /**
   * Method used to clear the desired index to clear memory.
   *
   * @param  {string} name - Name of the index to compute.
   * @return {Graph}       - Returns itself for chaining.
   *
   * @throw  {Error} - Will throw if the index doesn't exist.
   */
  clearIndex(name) {
    if (!INDEXES.has(name))
      throw new InvalidArgumentsGraphError(`Graph.clearIndex: unknown "${name}" index.`);

    const index = this._indexes.relations;

    index.data = this.map ? new Map() : {};
    index.computed = false;

    return this;
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
  inspect() {
    let nodes,
        edges;

    if (this.map) {
      nodes = new Map();
      this._nodes.forEach(function(value, key) {
        const attributes = value.attributes;

        nodes.set(key, Object.keys(attributes).length ? attributes : '<empty>');
      });

      edges = [];
      this._edges.forEach(function(value, key) {

        const formatted = [
          key,
          value.source,
          value.undirected ? '<->' : '->',
          value.target
        ];

        if (Object.keys(value.attributes).length)
          formatted.push(value.attributes);

        edges.push(formatted);
      });
    }
    else {
      nodes = {};
      edges = [];

      for (const k in this._nodes) {
        const attributes = this._nodes[k].attributes;
        nodes[k] = Object.keys(attributes).length ? attributes : '<empty>';
      }

      for (const k in this._edges) {
        const value = this._edges[k];

        const formatted = [
          k,
          value.source,
          value.undirected ? '<->' : '->',
          value.target
        ];

        if (Object.keys(value.attributes).length)
          formatted.push(value.attributes);

        edges.push(formatted);
      }
    }

    const dummy = {};

    for (const k in this) {
      if (this.hasOwnProperty(k) && !EMITTER_PROPS.has(k))
        dummy[k] = this[k];
    }

    dummy.nodes = nodes;
    dummy.edges = edges;

    privateProperty(dummy, 'constructor', this.constructor);

    return dummy;
  }
}

/**
 * Attaching iteration methods to the prototype.
 *
 * Here, we create iteration methods for every kind of iteration by attaching
 * them to the Graph class prototype rather than writing a lot of custom methods
 * one by one.
 */

/**
 * Attributes-related.
 */
attachAttributesMethods(Graph);

/**
 * Edge iteration-related.
 */
attachEdgeIterationMethods(Graph);

/**
 * Neighbor iteration-related.
 */
attachNeighborIterationMethods(Graph);
