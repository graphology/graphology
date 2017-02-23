/* eslint no-nested-ternary: 0 */
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
  consumeIterator,
  getMatchingEdge,
  isBunch,
  isGraph,
  isPlainObject,
  overBunch,
  prettyPrint,
  privateProperty,
  readOnlyProperty,
  uuid
} from './utils';

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

const EDGE_ADD_METHODS = [
  {
    name: verb => `${verb}Edge`,
    generateKey: true
  },
  {
    name: verb => `${verb}DirectedEdge`,
    generateKey: true,
    type: 'directed'
  },
  {
    name: verb => `${verb}UndirectedEdge`,
    generateKey: true,
    type: 'undirected'
  },
  {
    name: verb => `${verb}EdgeWithKey`,
  },
  {
    name: verb => `${verb}DirectedEdgeWithKey`,
    type: 'directed'
  },
  {
    name: verb => `${verb}UndirectedEdgeWithKey`,
    type: 'undirected'
  }
];

/**
 * Default options.
 */
const DEFAULTS = {
  allowSelfLoops: true,
  defaultEdgeAttributes: {},
  defaultNodeAttributes: {},
  edgeKeyGenerator: uuid,
  multi: false,
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
 * @param  {Graph}   graph          - Target graph.
 * @param  {string}  name           - Name of the child method for errors.
 * @param  {boolean} merge          - Are we merging?
 * @param  {boolean} mustGenerateId - Should the graph generate an id?
 * @param  {boolean} undirected     - Whether the edge is undirected.
 * @param  {any}     edge           - The edge's key.
 * @param  {any}     source         - The source node.
 * @param  {any}     target         - The target node.
 * @param  {object}  [attributes]   - Optional attributes.
 * @return {any}                    - The edge.
 *
 * @throws {Error} - Will throw if the graph is of the wrong type.
 * @throws {Error} - Will throw if the given attributes are not an object.
 * @throws {Error} - Will throw if source or target doesn't exist.
 * @throws {Error} - Will throw if the edge already exist.
 */
function addEdge(
  graph,
  name,
  merge,
  mustGenerateId,
  undirected,
  edge,
  source,
  target,
  attributes
) {

  // Checking validity of operation
  if (!undirected && graph.type === 'undirected')
    throw new UsageGraphError(`Graph.${name}: you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.`);

  if (undirected && graph.type === 'directed')
    throw new UsageGraphError(`Graph.${name}: you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.`);

  if (attributes && !isPlainObject(attributes))
    throw new InvalidArgumentsGraphError(`Graph.${name}: invalid attributes. Expecting an object but got "${attributes}"`);

  // Coercion of source & target:
  source = '' + source;
  target = '' + target;

  let mustAddSource = false,
      mustAddTarget = false;

  if (!graph.hasNode(source)) {
    if (!merge)
      throw new NotFoundGraphError(`Graph.${name}: source node "${source}" not found.`);
    else
      mustAddSource = true;
  }

  if (!graph.hasNode(target)) {
    if (!merge)
      throw new NotFoundGraphError(`Graph.${name}: target node "${target}" not found.`);
    else
      mustAddTarget = true;
  }

  if (!graph.allowSelfLoops && source === target)
    throw new UsageGraphError(`Graph.${name}: source & target are the same ("${source}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`);

  // Must the graph generate an id for this edge?
  if (mustGenerateId) {
    edge = graph._options.edgeKeyGenerator({
      undirected,
      source,
      target,
      attributes: attributes || {}
    });
  }

  // Do we need to handle duplicate?
  let alreadyExistingEdge = null;

  // Here, we have a key collision
  if (graph.hasEdge(edge)) {
    if (!merge) {
      throw new UsageGraphError(`Graph.${name}: the "${edge}" edge already exists in the graph.`);
    }
    else {
      alreadyExistingEdge = edge;
    }
  }

  // Here, we might have a source / target collision
  if (
    !graph.multi &&
    (
      undirected ?
        graph.hasUndirectedEdge(source, target) :
        graph.hasDirectedEdge(source, target)
    )
  ) {
    if (!merge)
      throw new UsageGraphError(`Graph.${name}: an edge linking "${source}" to "${target}" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option.`);
    else {
      alreadyExistingEdge = getMatchingEdge(graph, source, target, undirected ? 'undirected' : 'directed');
    }
  }

  // Protecting the attributes
  attributes = assign({}, graph._options.defaultEdgeAttributes, attributes);

  // Handling duplicates
  if (alreadyExistingEdge) {

    // If the key collides but the source & target are inconsistent, we throw
    if (graph.source(alreadyExistingEdge) !== source ||
        graph.target(alreadyExistingEdge) !== target) {
      throw new UsageGraphError(`Graph.${name}: inconsitency detected when attempting to merge the "${edge}" edge with "${source}" source & "${target}" target vs. (${graph.source(alreadyExistingEdge)}, ${graph.target(alreadyExistingEdge)}).`);
    }

    // Simply merging the attributes of the already existing edge
    graph.mergeEdgeAttributes(alreadyExistingEdge, attributes);
    return alreadyExistingEdge;
  }

  if (mustAddSource)
    graph.addNode(source);
  if (mustAddTarget)
    graph.addNode(target);

  // Storing some data
  const data = {
    attributes,
    source,
    target
  };

  // Only adding the 'undirected' key if needed
  if (undirected)
    data.undirected = true;

  // Storing whether the id was generated
  if (mustGenerateId)
    data.generatedId = true;

  // Adding the edge to the internal register
  graph._edges.set(edge, data);

  // Incrementing node degree counters
  const sourceData = graph._nodes.get(source),
        targetData = graph._nodes.get(target);

  if (source === target) {
    if (undirected)
      sourceData.undirectedSelfLoops++;
    else
      sourceData.directedSelfLoops++;
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
 * @param  {object}  [options] - Options:
 * @param  {boolean}   [allowSelfLoops] - Allow self loops?
 * @param  {string}    [type]           - Type of the graph.
 * @param  {boolean}   [map]            - Allow references as keys?
 * @param  {boolean}   [multi]          - Allow parallel edges?
 *
 * @throws {Error} - Will throw if the arguments are not valid.
 */
export default class Graph extends EventEmitter {
  constructor(options) {
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

    //-- Private properties

    // Indexes
    privateProperty(this, '_attributes', {});
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

    // Emitter properties
    EMITTER_PROPS.forEach(prop => privateProperty(this, prop, this[prop]));

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

    // Early termination
    if (this.type === 'undirected')
      return false;

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

      return this.multi ? !!edges.size : !!edges;
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

    // Early termination
    if (this.type === 'directed')
      return false;

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

      const register = nodeData.undirected;

      let edges;

      if (register)
        edges = register[target];

      if (!edges)
        return false;

      return this.multi ? !!edges.size : !!edges;
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
   * Method returning the edge matching source & target in a directed fashion.
   *
   * @param  {any} source - The edge's source.
   * @param  {any} target - The edge's target.
   *
   * @return {any|undefined}
   *
   * @throws {Error} - Will throw if the graph is multi.
   * @throws {Error} - Will throw if source or target doesn't exist.
   */
  directedEdge(source, target) {
    if (this.multi)
      throw new UsageGraphError('Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.');

    if (!this.hasNode(source))
      throw new NotFoundGraphError(`Graph.directedEdge: could not find the "${source}" source node in the graph.`);

    if (!this.hasNode(target))
      throw new NotFoundGraphError(`Graph.directedEdge: could not find the "${target}" target node in the graph.`);

    if (this.type === 'undirected')
      return;

    this.computeIndex('structure');

    const sourceData = this._nodes.get(source);

    return (sourceData.out && sourceData.out[target]) || undefined;
  }

  /**
   * Method returning the edge matching source & target in a undirected fashion.
   *
   * @param  {any} source - The edge's source.
   * @param  {any} target - The edge's target.
   *
   * @return {any|undefined}
   *
   * @throws {Error} - Will throw if the graph is multi.
   * @throws {Error} - Will throw if source or target doesn't exist.
   */
  undirectedEdge(source, target) {
    if (this.multi)
      throw new UsageGraphError('Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.');

    if (!this.hasNode(source))
      throw new NotFoundGraphError(`Graph.undirectedEdge: could not find the "${source}" source node in the graph.`);

    if (!this.hasNode(target))
      throw new NotFoundGraphError(`Graph.undirectedEdge: could not find the "${target}" target node in the graph.`);

    if (this.type === 'directed')
      return;

    this.computeIndex('structure');

    const sourceData = this._nodes.get(source);

    return (sourceData.undirected && sourceData.undirected[target]) || undefined;
  }

  /**
   * Method returning the edge matching source & target in a mixed fashion.
   *
   * @param  {any} source - The edge's source.
   * @param  {any} target - The edge's target.
   *
   * @return {any|undefined}
   *
   * @throws {Error} - Will throw if the graph is multi.
   * @throws {Error} - Will throw if source or target doesn't exist.
   */
  edge(source, target) {
    if (this.multi)
      throw new UsageGraphError('Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.');

    if (!this.hasNode(source))
      throw new NotFoundGraphError(`Graph.edge: could not find the "${source}" source node in the graph.`);

    if (!this.hasNode(target))
      throw new NotFoundGraphError(`Graph.edge: could not find the "${target}" target node in the graph.`);

    this.computeIndex('structure');

    const sourceData = this._nodes.get(source);

    return (
      (sourceData.out && sourceData.out[target]) ||
      (sourceData.undirected && sourceData.undirected[target]) ||
      undefined
    );
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

    if (this.type === 'undirected')
      return 0;

    const data = this._nodes.get(node),
          loops = selfLoops ? data.directedSelfLoops : 0;

    return data.inDegree + loops;
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

    if (this.type === 'undirected')
      return 0;

    const data = this._nodes.get(node),
          loops = selfLoops ? data.directedSelfLoops : 0;

    return data.outDegree + loops;
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

    if (this.type === 'undirected')
      return 0;

    return this.inDegree(node, selfLoops) + this.outDegree(node, selfLoops);
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

    if (this.type === 'directed')
      return 0;

    const data = this._nodes.get(node),
          loops = selfLoops ? (data.undirectedSelfLoops * 2) : 0;

    return data.undirectedDegree + loops;
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

    let degree = 0;

    if (this.type !== 'undirected')
      degree += this.directedDegree(node, selfLoops);

    if (this.type !== 'directed')
      degree += this.undirectedDegree(node, selfLoops);

    return degree;
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
    const edgeData = this._edges.get(edge);

    if (!edgeData)
      throw new NotFoundGraphError(`Graph.extremities: could not find the "${edge}" edge in the graph.`);

    return [
      edgeData.source,
      edgeData.target
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
  opposite(node, edge) {
    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.opposite: could not find the "${node}" node in the graph.`);

    if (!this.hasEdge(edge))
      throw new NotFoundGraphError(`Graph.opposite: could not find the "${edge}" edge in the graph.`);

    const [node1, node2] = this.extremities(edge);

    if (node !== node1 && node !== node2)
      throw new NotFoundGraphError(`Graph.opposite: the "${node}" node is not attached to the "${edge}" edge (${node1}, ${node2}).`);

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

    if (this.hasNode(node))
      throw new UsageGraphError(`Graph.addNode: the "${node}" node already exist in the graph.`);

    const data = {
      attributes
    };

    if (this.allowSelfLoops) {
      if (this.type !== 'undirected') {
        data.directedSelfLoops = 0;
      }
      if (this.type !== 'directed') {
        data.undirectedSelfLoops = 0;
      }
    }

    if (this.type !== 'undirected') {
      data.inDegree = 0;
      data.outDegree = 0;
    }

    if (this.type !== 'directed') {
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
   * Method used to merge a node into the graph.
   *
   * @param  {any}    node         - The node.
   * @param  {object} [attributes] - Optional attributes.
   * @return {any}                 - The node.
   */
  mergeNode(node, attributes) {

    // If the node already exists, we merge the attributes
    if (this.hasNode(node)) {
      if (attributes)
        this.mergeNodeAttributes(node, attributes);
      return node;
    }

    // Else, we create it
    return this.addNode(node, attributes);
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

      edge = getMatchingEdge(this, source, target, this.type);
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
   * Attributes-related methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning the desired graph's attribute.
   *
   * @param  {string} name - Name of the attribute.
   * @return {any}
   */
  getAttribute(name) {
    return this._attributes[name];
  }

  /**
   * Method returning the graph's attributes.
   *
   * @return {object}
   */
  getAttributes() {
    return this._attributes;
  }

  /**
   * Method returning whether the graph has the desired attribute.
   *
   * @param  {string}  name - Name of the attribute.
   * @return {boolean}
   */
  hasAttribute(name) {
    return this._attributes.hasOwnProperty(name);
  }

  /**
   * Method setting a value for the desired graph's attribute.
   *
   * @param  {string}  name  - Name of the attribute.
   * @param  {any}     value - Value for the attribute.
   * @return {Graph}
   */
  setAttribute(name, value) {
    this._attributes[name] = value;

    // Emitting
    this.emit('attributesUpdated', {
      type: 'set',
      meta: {
        name,
        value
      }
    });

    return this;
  }

  /**
   * Method using a function to update the desired graph's attribute's value.
   *
   * @param  {string}   name    - Name of the attribute.
   * @param  {function} updater - Function use to update the attribute's value.
   * @return {Graph}
   */
  updateAttribute(name, updater) {
    if (typeof updater !== 'function')
      throw new InvalidArgumentsGraphError('Graph.updateAttribute: updater should be a function.');

    this._attributes[name] = updater(this._attributes[name]);

    // Emitting
    this.emit('attributesUpdated', {
      type: 'set',
      meta: {
        name,
        value: this._attributes[name]
      }
    });

    return this;
  }

  /**
   * Method removing the desired graph's attribute.
   *
   * @param  {string} name  - Name of the attribute.
   * @return {Graph}
   */
  removeAttribute(name) {
    delete this._attributes[name];

    // Emitting
    this.emit('attributesUpdated', {
      type: 'remove',
      meta: {
        name
      }
    });

    return this;
  }

  /**
   * Method replacing the graph's attributes.
   *
   * @param  {object} attributes - New attributes.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if given attributes are not a plain object.
   */
  replaceAttributes(attributes) {
    if (!isPlainObject(attributes))
      throw new InvalidArgumentsGraphError('Graph.replaceAttributes: provided attributes are not a plain object.');

    const before = this._attributes;

    this._attributes = attributes;

    // Emitting
    this.emit('attributesUpdated', {
      type: 'replace',
      meta: {
        before,
        after: attributes
      }
    });

    return this;
  }

  /**
   * Method merging the graph's attributes.
   *
   * @param  {object} attributes - Attributes to merge.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if given attributes are not a plain object.
   */
  mergeAttributes(attributes) {
    if (!isPlainObject(attributes))
      throw new InvalidArgumentsGraphError('Graph.mergeAttributes: provided attributes are not a plain object.');

    this._attributes = assign(this._attributes, attributes);

    // Emitting
    this.emit('attributesUpdated', {
      type: 'merge',
      meta: {
        data: this._attributes
      }
    });

    return this;
  }

  /**
   * Method returning the desired attribute for the given node.
   *
   * @param  {any}    node - Target node.
   * @param  {string} name - Name of the attribute to get.
   * @return {any}
   *
   * @throws {Error} - Will throw if the node is not found.
   */
  getNodeAttribute(node, name) {
    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.getNodeAttribute: could not find the "${node}" node in the graph.`);

    return this._nodes.get(node).attributes[name];
  }

  /**
   * Method returning the attributes for the given node.
   *
   * @param  {any}    node - Target node.
   * @return {object}
   *
   * @throws {Error} - Will throw if the node is not found.
   */
  getNodeAttributes(node) {
    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.getNodeAttributes: could not find the "${node}" node in the graph.`);

    return this._nodes.get(node).attributes;
  }

  /**
   * Method checking whether the given attribute exists for the given node.
   *
   * @param  {any}    node - Target node.
   * @param  {string} name - Name of the attribute to check.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the node is not found.
   */
  hasNodeAttribute(node, name) {
    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.hasNodeAttribute: could not find the "${node}" node in the graph.`);

    return this._nodes.get(node).attributes.hasOwnProperty(name);
  }

  /**
   * Method checking setting the desired attribute for the given node.
   *
   * @param  {any}    node  - Target node.
   * @param  {string} name  - Name of the attribute to set.
   * @param  {any}    value - Value for the attribute.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if less than 3 arguments are passed.
   * @throws {Error} - Will throw if the node is not found.
   */
  setNodeAttribute(node, name, value) {
    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.setNodeAttribute: could not find the "${node}" node in the graph.`);

    if (arguments.length < 3)
      throw new InvalidArgumentsGraphError('Graph.setNodeAttribute: not enough arguments. Either you forgot to pass the attribute\'s name or value, or you meant to use #.replaceNodeAttributes / #.mergeNodeAttributes instead.');

    this._nodes.get(node).attributes[name] = value;

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'set',
      meta: {
        name,
        value
      }
    });

    return this;
  }

  /**
   * Method checking setting the desired attribute for the given node.
   *
   * @param  {any}      node    - Target node.
   * @param  {string}   name    - Name of the attribute to set.
   * @param  {function} updater - Function that will update the attribute.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if less than 3 arguments are passed.
   * @throws {Error} - Will throw if updater is not a function.
   * @throws {Error} - Will throw if the node is not found.
   */
  updateNodeAttribute(node, name, updater) {
    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.updateNodeAttribute: could not find the "${node}" node in the graph.`);

    if (arguments.length < 3)
      throw new InvalidArgumentsGraphError('Graph.updateNodeAttribute: not enough arguments. Either you forgot to pass the attribute\'s name or updater, or you meant to use #.replaceNodeAttributes / #.mergeNodeAttributes instead.');

    if (typeof updater !== 'function')
      throw new InvalidArgumentsGraphError('Graph.updateAttribute: updater should be a function.');

    const attributes = this._nodes.get(node).attributes;

    attributes[name] = updater(attributes[name]);

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'set',
      meta: {
        name,
        value: attributes[name]
      }
    });

    return this;
  }

  /**
   * Method removing the desired attribute for the given node.
   *
   * @param  {any}    node  - Target node.
   * @param  {string} name  - Name of the attribute to remove.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the node is not found.
   */
  removeNodeAttribute(node, name) {
    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.hasNodeAttribute: could not find the "${node}" node in the graph.`);

    delete this._nodes.get(node).attributes[name];

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'remove',
      meta: {
        name
      }
    });

    return this;
  }

  /**
   * Method completely replacing the attributes of the given node.
   *
   * @param  {any}    node       - Target node.
   * @param  {object} attributes - New attributes.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the node is not found.
   * @throws {Error} - Will throw if the given attributes is not a plain object.
   */
  replaceNodeAttributes(node, attributes) {
    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.replaceNodeAttributes: could not find the "${node}" node in the graph.`);

    if (!isPlainObject(attributes))
      throw new InvalidArgumentsGraphError('Graph.replaceNodeAttributes: provided attributes are not a plain object.');

    const data = this._nodes.get(node);

    const oldAttributes = data.attributes;

    data.attributes = attributes;

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'replace',
      meta: {
        before: oldAttributes,
        after: attributes
      }
    });

    return this;
  }

  /**
   * Method merging the attributes of the given node with the provided ones.
   *
   * @param  {any}    node       - Target node.
   * @param  {object} attributes - Attributes to merge.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the node is not found.
   * @throws {Error} - Will throw if the given attributes is not a plain object.
   */
  mergeNodeAttributes(node, attributes) {
    if (!this.hasNode(node))
      throw new NotFoundGraphError(`Graph.mergeNodeAttributes: could not find the "${node}" node in the graph.`);

    if (!isPlainObject(attributes))
      throw new InvalidArgumentsGraphError('Graph.mergeNodeAttributes: provided attributes are not a plain object.');

    const data = this._nodes.get(node);

    assign(data.attributes, attributes);

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'merge',
      meta: {
        data: attributes
      }
    });

    return this;
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
    return consumeIterator(this._nodes.size, this._nodes.keys());
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
      attributes: this.getAttributes(),
      nodes: this.exportNodes(),
      edges: this.exportEdges()
    };
  }

  /**
   * Method used to import a serialized node.
   *
   * @param  {object} data   - The serialized node.
   * @param  {boolean} merge - Whether to merge the given node.
   * @return {Graph}         - Returns itself for chaining.
   */
  importNode(data, merge = false) {

    // Validating
    const error = validateSerializedNode(data);

    if (error) {

      if (error === 'not-object')
        throw new InvalidArgumentsGraphError('Graph.importNode: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');
      if (error === 'no-key')
        throw new InvalidArgumentsGraphError('Graph.importNode: no key provided.');
      if (error === 'invalid-attributes')
        throw new InvalidArgumentsGraphError('Graph.importNode: invalid attributes. Attributes should be a plain object, null or omitted.');
    }

    // Adding the node
    const {key, attributes = {}} = data;

    if (merge)
      this.mergeNode(key, attributes);
    else
      this.addNode(key, attributes);

    return this;
  }

  /**
   * Method used to import a serialized edge.
   *
   * @param  {object}  data  - The serialized edge.
   * @param  {boolean} merge - Whether to merge the given edge.
   * @return {Graph}         - Returns itself for chaining.
   */
  importEdge(data, merge = false) {

    // Validating
    const error = validateSerializedEdge(data);

    if (error) {

      if (error === 'not-object')
        throw new InvalidArgumentsGraphError('Graph.importEdge: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');
      if (error === 'no-source')
        throw new InvalidArgumentsGraphError('Graph.importEdge: missing souce.');
      if (error === 'no-target')
        throw new InvalidArgumentsGraphError('Graph.importEdge: missing target');
      if (error === 'invalid-attributes')
        throw new InvalidArgumentsGraphError('Graph.importEdge: invalid attributes. Attributes should be a plain object, null or omitted.');
      if (error === 'invalid-undirected')
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
      method = merge ?
        (undirected ? this.mergeUndirectedEdgeWithKey : this.mergeDirectedEdgeWithKey) :
        (undirected ? this.addUndirectedEdgeWithKey : this.addDirectedEdgeWithKey);

      method.call(
        this,
        data.key,
        source,
        target,
        attributes
      );
    }
    else {
      method = merge ?
        (undirected ? this.mergeUndirectedEdge : this.mergeDirectedEdge) :
        (undirected ? this.addUndirectedEdge : this.addDirectedEdge);

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
   * @param  {array}   nodes - The serialized nodes.
   * @param  {boolean} merge - Whether to merge the given nodes.
   * @return {Graph}         - Returns itself for chaining.
   */
  importNodes(nodes, merge = false) {
    if (!Array.isArray(nodes))
      throw new InvalidArgumentsGraphError('Graph.importNodes: invalid argument. Expecting an array.');

    for (let i = 0, l = nodes.length; i < l; i++)
      this.importNode(nodes[i], merge);

    return this;
  }

  /**
   * Method used to import serialized edges.
   *
   * @param  {array}   edges - The serialized edges.
   * @param  {boolean} merge - Whether to merge the given edges.
   * @return {Graph}         - Returns itself for chaining.
   */
  importEdges(edges, merge = false) {
    if (!Array.isArray(edges))
      throw new InvalidArgumentsGraphError('Graph.importEdges: invalid argument. Expecting an array.');

    for (let i = 0, l = edges.length; i < l; i++)
      this.importEdge(edges[i], merge);

    return this;
  }

  /**
   * Method used to import a serialized graph.
   *
   * @param  {object|Graph} data  - The serialized graph.
   * @param  {boolean}      merge - Whether to merge data.
   * @return {Graph}              - Returns itself for chaining.
   */
  import(data, merge = false) {

    // Importing a Graph instance
    if (isGraph(data)) {

      this.import(data.export(), merge);
      return this;
    }

    // Importing a serialized graph
    if (!isPlainObject(data))
      throw new InvalidArgumentsGraphError('Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.');

    if (data.attributes) {
      if (!isPlainObject(data.attributes))
        throw new InvalidArgumentsGraphError('Graph.import: invalid attributes. Expecting a plain object.');

      if (merge)
        this.mergeAttributes(data.attributes);
      else
        this.replaceAttributes(data.attributes);
    }

    if (data.nodes)
      this.importNodes(data.nodes, merge);

    if (data.edges)
      this.importEdges(data.edges, merge);

    return this;
  }

  /**
   * Method returning an empty copy of the graph, i.e. a graph without nodes
   * & edges but with the exact same options.
   *
   * @return {Graph} - The empty copy.
   */
  emptyCopy() {
    return new Graph(this._options);
  }

  /**
   * Method returning an exact copy of the graph.
   *
   * @return {Graph} - The copy.
   */
  copy() {
    const graph = new Graph(this._options);
    graph.import(this);

    return graph;
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
    const nodes = {};
    this._nodes.forEach(function(data, key) {
      nodes[key] = data.attributes;
    });

    const edges = {};
    this._edges.forEach(function(data, key) {
      const direction = data.undirected ? '<->' : '->';

      let label = '';

      if (!data.generatedId)
        label += `[${key}]: `;

      label += `(${data.source})${direction}(${data.target})`;

      edges[label] = data.attributes;
    });

    const dummy = {};

    for (const k in this) {
      if (this.hasOwnProperty(k) &&
          !EMITTER_PROPS.has(k) &&
          typeof this[k] !== 'function')
        dummy[k] = this[k];
    }

    dummy.attributes = this._attributes;
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
 * Related to edge addition.
 */
EDGE_ADD_METHODS.forEach(method => {
  ['add', 'merge'].forEach(verb => {
    const name = method.name(verb);

    if (method.generateKey) {
      Graph.prototype[name] = function(source, target, attributes) {
        return addEdge(
          this,
          name,
          verb === 'merge',
          method.generateKey,
          (method.type || this.type) === 'undirected',
          null,
          source,
          target,
          attributes
        );
      };
    }
    else {
      Graph.prototype[name] = function(edge, source, target, attributes) {
        return addEdge(
          this,
          name,
          verb === 'merge',
          method.generateKey,
          (method.type || this.type) === 'undirected',
          edge,
          source,
          target,
          attributes
        );
      };
    }
  });
});

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
