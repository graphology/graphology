/**
 * Graphology Reference Implementation
 * ====================================
 *
 * Reference implementation of the graphology specs.
 */
import {EventEmitter} from 'events';

import {
  InvalidArgumentsGraphError,
  NotFoundGraphError,
  UsageGraphError
} from './errors';

import {
  INDICES,
  updateStructureIndex,
  clearEdgeFromStructureIndex,
  clearStructureIndex
} from './indices';

import {attachAttributesMethods} from './attributes';
import {attachEdgeIterationMethods} from './iteration/edges';
import {attachNeighborIterationMethods} from './iteration/neighbors';

import {
  serializeNode,
  serializeEdge,
  validateSerializedNode,
  validateSerializedEdge
} from './serialization';

import {
  assign,
  createInternalMap,
  firstItemOfSet,
  isBunch,
  isGraph,
  isPlainObject,
  overBunch,
  prettyPrint,
  privateProperty,
  readOnlyProperty,
  uuid
} from './utils';

// TODO: finish #.selfLoops (bunch iteration only)
// TODO: check that the degree calculation is legit related to self-loops
// TODO: lazily create attributes object
// TODO: solve the #.merge conundrum
// TODO: add the option adding nodes when creating edges if non-existent
// TODO: neighbor counting method are basically degree
// TODO: abstract set storing first element (override add)
// TODO: refactor edge adding methods using a descriptor?

/**
 * Enums.
 */
const TYPES = new Set([
  'directed',
  'undirected',
  'mixed'
]);

const EMITTER_PROPS = new Set([
  'domain',
  '_events',
  '_eventsCount',
  '_maxListeners'
]);

/**
 * Default options.
 */
const DEFAULTS = {
  allowSelfLoops: true,
  defaultEdgeAttributes: {},
  defaultNodeAttributes: {},
  edgeKeyGenerator: uuid,
  multi: false,
  onDuplicateEdge: null,
  onDuplicateNode: null,
  type: 'mixed'
};

/**
 * Abstract functions used by the Graph class for various methods.
 */

/**
 * Method updating the desired index.
 *
 * @param  {Graph}  graph     - Target graph.
 * @param  {string} name      - Name of the index to compute.
 * @param  {mixed}  [...args] - Additional arguments.
 * @return {Graph}            - Returns itself for chaining.
 *
 * @throw  {Error} - Will throw if the index doesn't exist.
 */
function updateIndex(graph, name, ...args) {
  if (name === 'structure') {
    const index = graph._indices.structure;

    if (!index.computed)
      return graph;

    const [edge, data] = args;

    updateStructureIndex(graph, edge, data);
  }

  return graph;
}

/**
 * Method used to clear an edge from the desired index to clear memory.
 *
 * @param  {Graph}  graph - Target graph.
 * @param  {string} name  - Name of the index to update.
 * @param  {any}    edge  - Target edge.
 * @param  {object} data  - Former attached data.
 * @return {Graph}        - Returns itself for chaining.
 *
 * @throw  {Error} - Will throw if the index doesn't exist.
 */
function clearEdgeFromIndex(graph, name, edge, data) {
  if (name === 'structure') {
    const index = graph._indices.structure;

    if (!index.computed)
      return graph;

    clearEdgeFromStructureIndex(graph, edge, data);
  }

  return graph;
}

/**
 * Internal method used to add an arbitrary edge to the given graph.
 *
 * @param  {Graph}   graph        - Target graph.
 * @param  {string}  name         - Name of the child method for errors.
 * @param  {boolean} undirected   - Whether the edge is undirected.
 * @param  {any}     edge         - The edge's key.
 * @param  {any}     source       - The source node.
 * @param  {any}     target       - The target node.
 * @param  {object}  [attributes] - Optional attributes.
 * @return {any}                  - The edge.
 *
 * @throws {Error} - Will throw if the graph is of the wrong type.
 * @throws {Error} - Will throw if the given attributes are not an object.
 * @throws {Error} - Will throw if source or target doesn't exist.
 * @throws {Error} - Will throw if the edge already exist.
 */
function addEdge(graph, name, undirected, edge, source, target, attributes) {

  if (!undirected && graph.type === 'undirected')
    throw new UsageGraphError(`Graph.${name}: you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.`);

  if (undirected && graph.type === 'directed')
    throw new UsageGraphError(`Graph.${name}: you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.`);

  if (attributes && !isPlainObject(attributes))
    throw new InvalidArgumentsGraphError(`Graph.${name}: invalid attributes. Expecting an object but got "${attributes}"`);

  if (!graph.hasNode(source))
    throw new NotFoundGraphError(`Graph.${name}: source node "${source}" not found.`);

  if (!graph.hasNode(target))
    throw new NotFoundGraphError(`Graph.${name}: target node "${target}" not found.`);

  if (!graph.allowSelfLoops && source === target)
    throw new UsageGraphError(`Graph.${name}: source & target are the same, thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`);

  const canHandleDuplicate = typeof graph._options.onDuplicateEdge === 'function';
  let mustHandleDuplicate = false;

  if (graph.hasEdge(edge)) {
    if (!canHandleDuplicate)
      throw new UsageGraphError(`Graph.${name}: the "${edge}" edge already exists in the graph.`);
    else
      mustHandleDuplicate = true;
  }

  if (
    !graph.multi &&
    (
      undirected ?
        graph.hasUndirectedEdge(source, target) :
        graph.hasDirectedEdge(source, target)
    )
  ) {
    if (!canHandleDuplicate)
      throw new UsageGraphError(`Graph.${name}: an edge linking "${source}" to "${target}" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option. The 'onDuplicateEdge' option might also interest you.`);
    else
      mustHandleDuplicate = true;
  }

  // Protecting the attributes
  attributes = assign({}, graph._options.defaultEdgeAttributes, attributes);

  // Handling duplicates
  if (mustHandleDuplicate) {

    // TODO: decide whether to stock that id was generated and what to pass
    // here
    graph._options.onDuplicateEdge(
      graph,
      {
        key: edge,
        attributes,
        source,
        target,
        undirected
      }
    );

    return edge;
  }

  // Storing some data
  const data = {
    attributes,
    source,
    target
  };

  // NOTE: only adding the 'undirected' key if needed
  if (undirected)
    data.undirected = true;

  // Adding the edge to the internal register
  graph._edges.set(edge, data);

  // Incrementing node counters
  const sourceData = graph._nodes.get(source),
        targetData = graph._nodes.get(target);

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
  updateIndex(graph, 'structure', edge, data);

  // Emitting
  graph.emit('edgeAdded', {
    key: edge,
    source,
    target,
    attributes,
    undirected
  });

  return edge;
}

/**
 * Internal method abstracting edges export.
 *
 * @param  {Graph}    graph     - Target graph.
 * @param  {string}   name      - Child method name.
 * @param  {function} predicate - Predicate to filter the bunch's edges.
 * @param  {mixed}    [bunch]   - Target edges.
 * @return {array[]}            - The serialized edges.
 *
 * @throws {Error} - Will throw if any of the edges is not found.
 */
function exportEdges(graph, name, predicate, bunch) {
  let edges = [];

  if (!bunch) {

    // Exporting every edges of the given type
    if (name === 'exportEdges')
      edges = graph.edges();
    else if (name === 'exportDirectedEdges')
      edges = graph.directedEdges();
    else
      edges = graph.undirectedEdges();
  }
  else {

    // Exporting the bunch
    if (!isBunch(bunch))
      throw new InvalidArgumentsGraphError(`Graph.${name}: invalid bunch.`);

    overBunch(bunch, edge => {
      if (!graph.hasEdge(edge))
        throw new NotFoundGraphError(`Graph.${name}: could not find the "${edge}" edge from the bunch in the graph.`);

      if (!predicate || predicate(edge))
        edges.push(edge);
    });
  }

  const serializedEdges = new Array(edges.length);

  for (let i = 0, l = edges.length; i < l; i++)
    serializedEdges[i] = graph.exportEdge(edges[i]);

  return serializedEdges;
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

    //-- Solving options
    options = assign({}, DEFAULTS, options);

    // Freezing options
    Object.freeze(options);

    // Enforcing options validity
    if (typeof options.edgeKeyGenerator !== 'function')
      throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'edgeKeyGenerator' option. Expecting a function but got "${options.edgeKeyGenerator}".`);

    if (typeof options.multi !== 'boolean')
      throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'multi' option. Expecting a boolean but got "${options.multi}".`);

    if (!TYPES.has(options.type))
      throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'type' option. Should be one of "mixed", "directed" or "undirected" but got "${options.type}".`);

    if (typeof options.allowSelfLoops !== 'boolean')
      throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got "${options.allowSelfLoops}".`);

    if (!isPlainObject(options.defaultEdgeAttributes))
      throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'defaultEdgeAttributes' option. Expecting a plain object but got "${options.defaultEdgeAttributes}".`);

    if (!isPlainObject(options.defaultNodeAttributes))
      throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'defaultNodeAttributes' option. Expecting a plain object but got "${options.defaultNodeAttributes}".`);

    if (options.onDuplicateEdge && typeof options.onDuplicateEdge !== 'function')
      throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'onDuplicateEdge' option. Expecting a function but got "${options.onDuplicateEdge}".`);

    if (options.onDuplicateNode && typeof options.onDuplicateNode !== 'function')
      throw new InvalidArgumentsGraphError(`Graph.constructor: invalid 'onDuplicateNode' option. Expecting a function but got "${options.onDuplicateNode}".`);

    //-- Private properties

    // Indexes
    privateProperty(this, '_nodes', createInternalMap());
    privateProperty(this, '_edges', createInternalMap());
    privateProperty(this, '_indices', {
      structure: {
        lazy: (
          options.indices &&
          options.indices.structure &&
          options.indices.structure.lazy ||
          false
        ),
        computed: false
      }
    });

    // Options
    privateProperty(this, '_options', options);

    //-- Properties readers
    readOnlyProperty(this, 'order', () => this._nodes.size);
    readOnlyProperty(this, 'size', () => this._edges.size);
    readOnlyProperty(this, 'multi', this._options.multi);
    readOnlyProperty(this, 'type', this._options.type);
    readOnlyProperty(this, 'allowSelfLoops', this._options.allowSelfLoops);

    //-- Precomputing indexes?
    for (const name in this._indices) {
      const index = this._indices[name];

      if (!index.lazy)
        index.computed = true;
    }

    //-- Hydratation
    if (data)
      this.import(data);
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
    return this._nodes.has(node);
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

    // We need to compute the 'structure' index for this
    this.computeIndex('structure');

    // If the node source or the target is not in the graph we break
    if (!this.hasNode(source) || !this.hasNode(target))
      return;

    // Is there a directed edge pointing towards target?
    const nodeData = this._nodes.get(source),
          register = nodeData.out;

    if (!register)
      return;

    const edges = register[target];

    if (!edges)
      return;

    if (!edges.size)
      return;

    return firstItemOfSet(edges);
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

    // We need to compute the 'structure' index for this
    this.computeIndex('structure');

    // If the node source or the target is not in the graph we break
    if (!this.hasNode(source) || !this.hasNode(target))
      return;

    // Is there a directed edge pointing towards target?
    const nodeData = this._nodes.get(source);

    let register = nodeData.undirectedOut,
        edges;

    if (register)
      edges = register[target];

    register = nodeData.undirectedIn;

    if (!edges && register)
      edges = register[target];

    if (!edges || !edges.size)
      return;

    return firstItemOfSet(edges);
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
    if (this.type === 'mixed' || this.type === 'directed')
      edge = this.getDirectedEdge(source, target);

    if (edge)
      return edge;

    // Then we try to find an undirected edge
    if (this.type === 'mixed' || this.type === 'undirected')
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
        this._edges.has(edge) &&
        this.directed(edge)
      );
    }
    else if (arguments.length === 2) {

      // We need to compute the 'structure' index for this
      this.computeIndex('structure');

      // If the node source or the target is not in the graph we break
      if (!this.hasNode(source) || !this.hasNode(target))
        return false;

      // Is there a directed edge pointing towards target?
      const nodeData = this._nodes.get(source),
            register = nodeData.out;

      if (!register)
        return false;

      const edges = register[target];

      if (!edges)
        return false;

      return !!edges.size;
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
        this._edges.has(edge) &&
        this.undirected(edge)
      );
    }
    else if (arguments.length === 2) {

      // We need to compute the 'structure' index for this
      this.computeIndex('structure');

      // If the node source or the target is not in the graph we break
      if (!this.hasNode(source) || !this.hasNode(target))
        return false;

      // Is there a directed edge pointing towards target?
      const nodeData = this._nodes.get(source);

      let register = nodeData.undirectedOut,
          edges;

      if (register)
        edges = register[target];

      register = nodeData.undirectedIn;

      if (!edges && register)
        edges = register[target];

      if (!edges)
        return false;

      return !!edges.size;
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

      return this._edges.has(edge);
    }
    else if (arguments.length === 2) {
      return (
        this.hasDirectedEdge(source, target) ||
        this.hasUndirectedEdge(source, target)
      );
    }

    throw new InvalidArgumentsGraphError(`Graph.hasEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`);
  }

  /**
   * Method returning the given node's in degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} allowSelfLoops - Count self-loops?
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

    const data = this._nodes.get(node);

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

    const data = this._nodes.get(node);

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

    const data = this._nodes.get(node);

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

    const data = this._nodes.get(node);

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

    const data = this._nodes.get(node);

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

    return this._edges.get(edge).source;
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

    return this._edges.get(edge).target;
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

    return [
      this._edges.get(edge).source,
      this._edges.get(edge).target
    ];
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

    if (node !== node1 && node !== node2)
      throw new NotFoundGraphError(`Graph.relatedNode: the "${node}" node is not attached to the "${edge}" edge (${node1}, ${node2}).`);

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

    return !!this._edges.get(edge).undirected;
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

    return !this._edges.get(edge).undirected;
  }

  /**
   * Method returning whether the given edge is a self loop.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  selfLoop(edge) {
    if (!this.hasEdge(edge))
      throw new NotFoundGraphError(`Graph.selfLoop: could not find the "${edge}" edge in the graph.`);

    const data = this._edges.get(edge);

    return data.source === data.target;
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
    if (attributes && !isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(`Graph.addNode: invalid attributes. Expecting an object but got "${attributes}"`);

    // Protecting the attributes
    attributes = assign({}, this._options.defaultNodeAttributes, attributes);

    if (this.hasNode(node)) {

      // Triggering duplicate callback
      if (typeof this._options.onDuplicateNode === 'function') {
        this._options.onDuplicateNode(
          this,
          {key: node, attributes}
        );

        return node;
      }
      else {
        throw new UsageGraphError(`Graph.addNode: the "${node}" node already exist in the graph. You might want to check out the 'onDuplicateNode' option.`);
      }
    }

    const data = {
      attributes
    };

    if (this.allowSelfLoops)
      data.selfLoops = 0;

    if (this.type === 'mixed' || this.type === 'directed') {
      data.inDegree = 0;
      data.outDegree = 0;
    }

    if (this.type === 'mixed' || this.type === 'undirected') {
      data.undirectedDegree = 0;
    }

    // Adding the node to internal register
    this._nodes.set(node, data);

    // Emitting
    this.emit('nodeAdded', {
      key: node,
      attributes
    });

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

    overBunch(bunch, (node, attributes) => {
      this.addNode(node, attributes);
    });

    return this;
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
    return addEdge(
      this,
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
    return addEdge(
      this,
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
    return addEdge(
      this,
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

    return addEdge(
      this,
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

    return addEdge(
      this,
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

    return addEdge(
      this,
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

    const data = this._nodes.get(node);

    // Dropping the node from the register
    this._nodes.delete(node);

    // Emitting
    this.emit('nodeDropped', {
      key: node,
      attributes: data.attributes
    });
  }

  /**
   * Method used to drop a single edge from the graph.
   *
   * Arity 1:
   * @param  {any}    edge - The edge.
   *
   * Arity 2:
   * @param  {any}    source - Source node.
   * @param  {any}    target - Target node.
   *
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the edge doesn't exist.
   */
  dropEdge(edge) {
    if (arguments.length > 1) {
      const source = arguments[0],
            target = arguments[1];

      if (!this.hasNode(source))
        throw new NotFoundGraphError(`Graph.dropEdge: could not find the "${source}" source node in the graph.`);

      if (!this.hasNode(target))
        throw new NotFoundGraphError(`Graph.dropEdge: could not find the "${target}" target node in the graph.`);

      if (!this.hasEdge(source, target))
        throw new NotFoundGraphError(`Graph.dropEdge: could not find the "${source}" -> "${target}" edge in the graph.`);

      edge = this.getEdge(source, target);
    }
    else {
      if (!this.hasEdge(edge))
        throw new NotFoundGraphError(`Graph.dropEdge: could not find the "${edge}" edge in the graph.`);
    }

    const data = this._edges.get(edge);

    // Dropping the edge from the register
    this._edges.delete(edge);

    // Updating related degrees
    const {source, target, attributes, undirected = false} = data;

    const sourceData = this._nodes.get(source),
          targetData = this._nodes.get(target);

    if (source === target) {
      sourceData.selfLoops--;
    }
    else {
      if (undirected) {
        sourceData.undirectedDegree--;
        targetData.undirectedDegree--;
      }
      else {
        sourceData.outDegree--;
        targetData.inDegree--;
      }
    }

    // Clearing index
    clearEdgeFromIndex(this, 'structure', edge, data);

    // Emitting
    this.emit('edgeDropped', {
      key: edge,
      attributes,
      source,
      target,
      undirected
    });

    return this;
  }

  /**
   * Method used to drop a bunch of nodes or every node from the graph.
   *
   * @param  {bunch} nodes - Bunch of nodes.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if an invalid bunch is provided.
   * @throws {Error} - Will throw if any of the nodes doesn't exist.
   */
  dropNodes(nodes) {
    if (!arguments.length)
      return this.clear();

    if (!isBunch(nodes))
      throw new InvalidArgumentsGraphError('Graph.dropNodes: invalid bunch.');

    overBunch(nodes, node => {
      this.dropNode(node);
    });

    return this;
  }

  /**
   * Method used to drop a bunch of edges or every edges from the graph.
   *
   * Arity 1:
   * @param  {bunch} edges - Bunch of edges.
   *
   * Arity 2:
   * @param  {any}    source - Source node.
   * @param  {any}    target - Target node.
   *
   * @return {Graph}
   *
   * @throws {Error} - Will throw if an invalid bunch is provided.
   * @throws {Error} - Will throw if any of the edges doesn't exist.
   */
  dropEdges(edges) {
    if (!arguments.length) {

      // Dropping every edge from the graph
      this._edges = createInternalMap();

      // Without edges, we've got no 'structure'
      this.clearIndex('structure');

      const index = this._indices.structure;

      if (!index.lazy)
        index.computed = true;

      return this;
    }

    if (arguments.length === 2) {
      const source = arguments[0],
            target = arguments[1];

      edges = this.edges(source, target);
    }

    if (!isBunch(edges))
      throw new InvalidArgumentsGraphError('Graph.dropEdges: invalid bunch.');

    overBunch(edges, edge => {
      this.dropEdge(edge);
    });

    return this;
  }

  /**
   * Method used to remove every edge & every node from the graph.
   *
   * @return {Graph}
   */
  clear() {

    // Dropping edges
    this._edges = createInternalMap();

    // Dropping nodes
    this._nodes = createInternalMap();

    // Handling indices
    for (const name in this._indices) {
      const index = this._indices[name];

      if (index.lazy)
        index.computed = false;
    }

    // Emitting
    this.emit('cleared');
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
    return [...this._nodes.keys()];
  }

  /**---------------------------------------------------------------------------
   * Serialization
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

    const data = this._nodes.get(node);

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

    const data = this._edges.get(edge);

    return serializeEdge(edge, data);
  }

  /**
   * Method exporting every nodes or the bunch ones.
   *
   * @param  {mixed}   [bunch] - Target nodes.
   * @return {array[]}         - The serialized nodes.
   *
   * @throws {Error} - Will throw if any of the nodes is not found.
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

      overBunch(bunch, node => {
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
   * @throws {Error} - Will throw if any of the edges is not found.
   */
  exportEdges(bunch) {
    return exportEdges(
      this,
      'exportEdges',
      null,
      bunch
    );
  }

  /**
   * Method exporting every directed edges or the bunch ones which are directed.
   *
   * @param  {mixed}   [bunch] - Target edges.
   * @return {array[]}         - The serialized edges.
   *
   * @throws {Error} - Will throw if any of the edges is not found.
   */
  exportDirectedEdges(bunch) {
    return exportEdges(
      this,
      'exportDirectedEdges',
      edge => this.directed(edge),
      bunch
    );
  }

  /**
   * Method exporting every unddirected edges or the bunch ones which are
   * undirected
   *
   * @param  {mixed}   [bunch] - Target edges.
   * @return {array[]}         - The serialized edges.
   *
   * @throws {Error} - Will throw if any of the edges is not found.
   */
  exportUndirectedEdges(bunch) {
    return exportEdges(
      this,
      'exportUndirectedEdges',
      edge => this.undirected(edge),
      bunch
    );
  }

  /**
   * Method used to export the whole graph.
   *
   * @return {object} - The serialized graph.
   */
  export() {
    return {
      nodes: this.exportNodes(),
      edges: this.exportEdges()
    };
  }

  /**
   * Method used to import a serialized node.
   *
   * @param  {object} data - The serialized node.
   * @return {Graph}       - Returns itself for chaining.
   */
  importNode(data) {

    // Validating
    const {valid, reason} = validateSerializedNode(data);

    if (!valid) {
      if (reason === 'not-object')
        throw new InvalidArgumentsGraphError('Graph.importNode: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');
      if (reason === 'no-key')
        throw new InvalidArgumentsGraphError('Graph.importNode: no key provided.');
      if (reason === 'invalid-attributes')
        throw new InvalidArgumentsGraphError('Graph.importNode: invalid attributes. Attributes should be a plain object, null or omitted.');
    }

    // Adding the node
    const {key, attributes = {}} = data;

    this.addNode(key, attributes);

    return this;
  }

  /**
   * Method used to import a serialized edge.
   *
   * @param  {object} data - The serialized edge.
   * @return {Graph}       - Returns itself for chaining.
   */
  importEdge(data) {

    // Validating
    const {valid, reason} = validateSerializedEdge(data);

    if (!valid) {

      // TODO: use a function map to boost.
      if (reason === 'not-object')
        throw new InvalidArgumentsGraphError('Graph.importEdge: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');
      if (reason === 'no-source')
        throw new InvalidArgumentsGraphError('Graph.importEdge: missing souce.');
      if (reason === 'no-target')
        throw new InvalidArgumentsGraphError('Graph.importEdge: missing target');
      if (reason === 'invalid-attributes')
        throw new InvalidArgumentsGraphError('Graph.importEdge: invalid attributes. Attributes should be a plain object, null or omitted.');
      if (reason === 'invalid-undirected')
        throw new InvalidArgumentsGraphError('Graph.importEdge: invalid undirected. Undirected should be boolean or omitted.');
    }

    // Adding the edge
    const {
      source,
      target,
      attributes = {},
      undirected = false
    } = data;

    let method;

    if ('key' in data) {
      method = undirected ? this.addUndirectedEdgeWithKey : this.addEdgeWithKey;

      method.call(
        this,
        data.key,
        source,
        target,
        attributes
      );
    }
    else {
      method = undirected ? this.addUndirectedEdge : this.addDirectedEdge;

      method.call(
        this,
        source,
        target,
        attributes
      );
    }

    return this;
  }

  /**
   * Method used to import serialized nodes.
   *
   * @param  {array} nodes - The serialized nodes.
   * @return {Graph}       - Returns itself for chaining.
   */
  importNodes(nodes) {
    if (!Array.isArray(nodes))
      throw new InvalidArgumentsGraphError('Graph.importNodes: invalid argument. Expecting an array.');

    for (let i = 0, l = nodes.length; i < l; i++)
      this.importNode(nodes[i]);

    return this;
  }

  /**
   * Method used to import serialized edges.
   *
   * @param  {array} edges - The serialized edges.
   * @return {Graph}       - Returns itself for chaining.
   */
  importEdges(edges) {
    if (!Array.isArray(edges))
      throw new InvalidArgumentsGraphError('Graph.importEdges: invalid argument. Expecting an array.');

    for (let i = 0, l = edges.length; i < l; i++)
      this.importEdge(edges[i]);

    return this;
  }

  /**
   * Method used to import a serialized graph.
   *
   * @param  {object|Graph} data - The serialized graph.
   * @return {Graph}             - Returns itself for chaining.
   */
  import(data) {

    // Importing a Graph instance
    if (isGraph(data)) {

      this.import(data.export());
      return this;
    }

    // Importing a serialized graph
    if (!isPlainObject(data) || !data.nodes)
      throw new InvalidArgumentsGraphError('Graph.import: invalid argument. Expecting an object with at least a "nodes" property or, alternatively, a Graph instance.');

    this.importNodes(data.nodes);

    if (data.edges)
      this.importEdges(data.edges);

    return this;
  }

  /**
   * Method returning an empty copy of the graph, i.e. a graph without nodes
   * & edges but with the exact same options.
   *
   * @return {Graph} - The empty copy.
   */
  emptyCopy() {
    return new Graph(null, this._options);
  }

  /**
   * Method returning an exact copy of the graph.
   *
   * @return {Graph} - The copy.
   */
  copy() {
    return new Graph(this, this._options);
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
   */
  computeIndex(name) {

    if (!INDICES.has(name))
      throw new InvalidArgumentsGraphError(`Graph.computeIndex: unknown "${name}" index.`);

    if (name === 'structure') {
      const index = this._indices.structure;

      if (index.computed)
        return this;

      index.computed = true;

      this._edges.forEach((data, edge) => updateIndex(this, name, edge, data));
    }

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
    if (!INDICES.has(name))
      throw new InvalidArgumentsGraphError(`Graph.clearIndex: unknown "${name}" index.`);

    if (name === 'structure') {
      const index = this._indices.structure;

      if (!index.computed)
        return this;

      clearStructureIndex(this);
      index.computed = false;
    }

    return this;
  }

  /**---------------------------------------------------------------------------
   * Known methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method used by JavaScript to perform JSON serialization.
   *
   * @return {object} - The serialized graph.
   */
  toJSON() {
    return this.export();
  }

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
   * @return {object} - Formatted object representation of the graph.
   */
  inspect() {
    const nodes = Object.create(null);

    this._nodes.forEach(function(value, key) {
      const attributes = value.attributes;

      nodes[key] = Object.keys(attributes).length ? attributes : '<empty>';
    });

    const edges = [];
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

    const dummy = {};

    for (const k in this) {
      if (this.hasOwnProperty(k) &&
          !EMITTER_PROPS.has(k) &&
          typeof this[k] !== 'function')
        dummy[k] = this[k];
    }

    dummy.nodes = nodes;
    dummy.edges = edges;

    privateProperty(dummy, 'constructor', this.constructor);

    return dummy;
  }
}

/**
 * Attaching methods to the prototype.
 *
 * Here, we are attaching a wide variety of methods to the Graph class'
 * prototype when those are very numerous and when their creation is
 * abstracted.
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
