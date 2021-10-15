/* eslint no-nested-ternary: 0 */
/**
 * Graphology Reference Implementation
 * ====================================
 *
 * Reference implementation of the graphology specs.
 */
import {EventEmitter} from 'events';
import Iterator from 'obliterator/iterator';
import take from 'obliterator/take';

import {
  InvalidArgumentsGraphError,
  NotFoundGraphError,
  UsageGraphError
} from './errors';

import {
  MixedNodeData,
  DirectedNodeData,
  UndirectedNodeData,
  EdgeData
} from './data';

import {
  updateStructureIndex,
  clearEdgeFromStructureIndex,
  clearStructureIndex,
  upgradeStructureIndexToMulti
} from './indices';

import {attachAttributesMethods} from './attributes';
import {attachEdgeIterationMethods} from './iteration/edges';
import {attachNeighborIterationMethods} from './iteration/neighbors';
import {
  forEachAdjacencySimple,
  forEachAdjacencyMulti,
  createAdjacencyIteratorSimple,
  createAdjacencyIteratorMulti
} from './iteration/adjacency';

import {
  serializeNode,
  serializeEdge,
  validateSerializedNode,
  validateSerializedEdge
} from './serialization';

import {
  assign,
  getMatchingEdge,
  isGraph,
  isPlainObject,
  privateProperty,
  readOnlyProperty,
  incrementalId,
  validateHints
} from './utils';

/**
 * Enums.
 */
const TYPES = new Set(['directed', 'undirected', 'mixed']);

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
    name: verb => `${verb}EdgeWithKey`
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
  edgeKeyGenerator: null,
  multi: false,
  type: 'mixed'
};

/**
 * Abstract functions used by the Graph class for various methods.
 */

/**
 * Internal method used to add a node to the given graph
 *
 * @param  {Graph}   graph           - Target graph.
 * @param  {any}     node            - The node's key.
 * @param  {object}  [attributes]    - Optional attributes.
 * @return {NodeData}                - Created node data.
 */
function addNode(graph, node, attributes) {
  if (attributes && !isPlainObject(attributes))
    throw new InvalidArgumentsGraphError(
      `Graph.addNode: invalid attributes. Expecting an object but got "${attributes}"`
    );

  // String coercion
  node = '' + node;
  attributes = attributes || {};

  if (graph._nodes.has(node))
    throw new UsageGraphError(
      `Graph.addNode: the "${node}" node already exist in the graph.`
    );

  const data = new graph.NodeDataClass(node, attributes);

  // Adding the node to internal register
  graph._nodes.set(node, data);

  // Emitting
  graph.emit('nodeAdded', {
    key: node,
    attributes
  });

  return data;
}

/**
 * Same as the above but without sanity checks because we call this in contexts
 * where necessary checks were already done.
 */
function unsafeAddNode(graph, node, attributes) {
  const data = new graph.NodeDataClass(node, attributes);

  graph._nodes.set(node, data);

  graph.emit('nodeAdded', {
    key: node,
    attributes
  });

  return data;
}

/**
 * Internal method used to add an arbitrary edge to the given graph.
 *
 * @param  {Graph}   graph           - Target graph.
 * @param  {string}  name            - Name of the child method for errors.
 * @param  {boolean} mustGenerateKey - Should the graph generate an id?
 * @param  {boolean} undirected      - Whether the edge is undirected.
 * @param  {any}     edge            - The edge's key.
 * @param  {any}     source          - The source node.
 * @param  {any}     target          - The target node.
 * @param  {object}  [attributes]    - Optional attributes.
 * @return {any}                     - The edge.
 *
 * @throws {Error} - Will throw if the graph is of the wrong type.
 * @throws {Error} - Will throw if the given attributes are not an object.
 * @throws {Error} - Will throw if source or target doesn't exist.
 * @throws {Error} - Will throw if the edge already exist.
 */
function addEdge(
  graph,
  name,
  mustGenerateKey,
  undirected,
  edge,
  source,
  target,
  attributes
) {
  // Checking validity of operation
  if (!undirected && graph.type === 'undirected')
    throw new UsageGraphError(
      `Graph.${name}: you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.`
    );

  if (undirected && graph.type === 'directed')
    throw new UsageGraphError(
      `Graph.${name}: you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.`
    );

  if (attributes && !isPlainObject(attributes))
    throw new InvalidArgumentsGraphError(
      `Graph.${name}: invalid attributes. Expecting an object but got "${attributes}"`
    );

  // Coercion of source & target:
  source = '' + source;
  target = '' + target;
  attributes = attributes || {};

  if (!graph.allowSelfLoops && source === target)
    throw new UsageGraphError(
      `Graph.${name}: source & target are the same ("${source}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`
    );

  const sourceData = graph._nodes.get(source),
    targetData = graph._nodes.get(target);

  if (!sourceData)
    throw new NotFoundGraphError(
      `Graph.${name}: source node "${source}" not found.`
    );

  if (!targetData)
    throw new NotFoundGraphError(
      `Graph.${name}: target node "${target}" not found.`
    );

  // Must the graph generate an id for this edge?
  const eventData = {
    key: null,
    undirected,
    source,
    target,
    attributes
  };

  if (mustGenerateKey) edge = graph._edgeKeyGenerator(eventData);

  // Coercion of edge key
  edge = '' + edge;

  // Here, we have a key collision
  if (graph._edges.has(edge))
    throw new UsageGraphError(
      `Graph.${name}: the "${edge}" edge already exists in the graph.`
    );

  // Here, we might have a source / target collision
  if (
    !graph.multi &&
    (undirected
      ? typeof sourceData.undirected[target] !== 'undefined'
      : typeof sourceData.out[target] !== 'undefined')
  ) {
    throw new UsageGraphError(
      `Graph.${name}: an edge linking "${source}" to "${target}" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option.`
    );
  }

  // Storing some data
  const edgeData = new EdgeData(
    undirected,
    edge,
    mustGenerateKey,
    sourceData,
    targetData,
    attributes
  );

  // Adding the edge to the internal register
  graph._edges.set(edge, edgeData);

  // Incrementing node degree counters
  if (source === target) {
    if (undirected) {
      sourceData.undirectedSelfLoops++;
      graph._undirectedSelfLoopCount++;
    } else {
      sourceData.directedSelfLoops++;
      graph._directedSelfLoopCount++;
    }
  } else {
    if (undirected) {
      sourceData.undirectedDegree++;
      targetData.undirectedDegree++;
    } else {
      sourceData.outDegree++;
      targetData.inDegree++;
    }
  }

  // Updating relevant index
  updateStructureIndex(
    graph,
    undirected,
    edgeData,
    source,
    target,
    sourceData,
    targetData
  );

  if (undirected) graph._undirectedSize++;
  else graph._directedSize++;

  // Emitting
  eventData.key = edge;

  graph.emit('edgeAdded', eventData);

  return edge;
}

/**
 * Internal method used to add an arbitrary edge to the given graph.
 *
 * @param  {Graph}   graph           - Target graph.
 * @param  {string}  name            - Name of the child method for errors.
 * @param  {boolean} mustGenerateKey - Should the graph generate an id?
 * @param  {boolean} undirected      - Whether the edge is undirected.
 * @param  {any}     edge            - The edge's key.
 * @param  {any}     source          - The source node.
 * @param  {any}     target          - The target node.
 * @param  {object}  [attributes]    - Optional attributes.
 * @param  {boolean} [asUpdater]       - Are we updating or merging?
 * @return {any}                     - The edge.
 *
 * @throws {Error} - Will throw if the graph is of the wrong type.
 * @throws {Error} - Will throw if the given attributes are not an object.
 * @throws {Error} - Will throw if source or target doesn't exist.
 * @throws {Error} - Will throw if the edge already exist.
 */
function mergeEdge(
  graph,
  name,
  mustGenerateKey,
  undirected,
  edge,
  source,
  target,
  attributes,
  asUpdater
) {
  // Checking validity of operation
  if (!undirected && graph.type === 'undirected')
    throw new UsageGraphError(
      `Graph.${name}: you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.`
    );

  if (undirected && graph.type === 'directed')
    throw new UsageGraphError(
      `Graph.${name}: you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.`
    );

  if (attributes) {
    if (asUpdater) {
      if (typeof attributes !== 'function')
        throw new InvalidArgumentsGraphError(
          `Graph.${name}: invalid updater function. Expecting a function but got "${attributes}"`
        );
    } else {
      if (!isPlainObject(attributes))
        throw new InvalidArgumentsGraphError(
          `Graph.${name}: invalid attributes. Expecting an object but got "${attributes}"`
        );
    }
  }

  // Coercion of source & target:
  source = '' + source;
  target = '' + target;

  let updater;

  if (asUpdater) {
    updater = attributes;
    attributes = undefined;
  }

  if (!graph.allowSelfLoops && source === target)
    throw new UsageGraphError(
      `Graph.${name}: source & target are the same ("${source}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`
    );

  let sourceData = graph._nodes.get(source),
    targetData = graph._nodes.get(target),
    edgeData;

  // Do we need to handle duplicate?
  let alreadyExistingEdgeData;

  if (!mustGenerateKey) {
    edgeData = graph._edges.get(edge);

    if (edgeData) {
      // Here, we need to ensure, if the user gave a key, that source & target
      // are coherent
      if (
        edgeData.source.key !== source ||
        edgeData.target.key !== target ||
        (undirected &&
          (edgeData.source.key !== target || edgeData.target.key !== source))
      ) {
        throw new UsageGraphError(
          `Graph.${name}: inconsistency detected when attempting to merge the "${edge}" edge with "${source}" source & "${target}" target vs. ("${edgeData.source.key}", "${edgeData.target.key}").`
        );
      }

      alreadyExistingEdgeData = edgeData;
    }
  }

  // Here, we might have a source / target collision
  if (!alreadyExistingEdgeData && !graph.multi && sourceData) {
    alreadyExistingEdgeData = undirected
      ? sourceData.undirected[target]
      : sourceData.out[target];
  }

  // Handling duplicates
  if (alreadyExistingEdgeData) {
    // We can skip the attribute merging part if the user did not provide them
    if (asUpdater ? !updater : !attributes) return alreadyExistingEdgeData.key;

    // Updating the attributes
    if (asUpdater) {
      const oldAttributes = alreadyExistingEdgeData.attributes;
      alreadyExistingEdgeData.attributes = updater(oldAttributes);

      graph.emit('edgeAttributesUpdated', {
        type: 'replace',
        key: alreadyExistingEdgeData.key,
        attributes: alreadyExistingEdgeData.attributes
      });
    }

    // Merging the attributes
    else {
      assign(alreadyExistingEdgeData.attributes, attributes);

      graph.emit('edgeAttributesUpdated', {
        type: 'merge',
        key: alreadyExistingEdgeData.key,
        attributes: alreadyExistingEdgeData.attributes,
        data: attributes
      });
    }

    return alreadyExistingEdgeData.key;
  }

  attributes = attributes || {};

  if (asUpdater && updater) attributes = updater(attributes);

  // Must the graph generate an id for this edge?
  const eventData = {
    key: null,
    undirected,
    source,
    target,
    attributes
  };

  if (mustGenerateKey) edge = graph._edgeKeyGenerator(eventData);

  // Coercion of edge key
  edge = '' + edge;

  // Here, we have a key collision
  if (graph._edges.has(edge))
    throw new UsageGraphError(
      `Graph.${name}: the "${edge}" edge already exists in the graph.`
    );

  if (!sourceData) {
    sourceData = unsafeAddNode(graph, source, {});

    if (source === target) targetData = sourceData;
  }
  if (!targetData) {
    targetData = unsafeAddNode(graph, target, {});
  }

  // Storing some data
  edgeData = new EdgeData(
    undirected,
    edge,
    mustGenerateKey,
    sourceData,
    targetData,
    attributes
  );

  // Adding the edge to the internal register
  graph._edges.set(edge, edgeData);

  // Incrementing node degree counters
  if (source === target) {
    if (undirected) {
      sourceData.undirectedSelfLoops++;
      graph._undirectedSelfLoopCount++;
    } else {
      sourceData.directedSelfLoops++;
      graph._directedSelfLoopCount++;
    }
  } else {
    if (undirected) {
      sourceData.undirectedDegree++;
      targetData.undirectedDegree++;
    } else {
      sourceData.outDegree++;
      targetData.inDegree++;
    }
  }

  // Updating relevant index
  updateStructureIndex(
    graph,
    undirected,
    edgeData,
    source,
    target,
    sourceData,
    targetData
  );

  if (undirected) graph._undirectedSize++;
  else graph._directedSize++;

  // Emitting
  eventData.key = edge;

  graph.emit('edgeAdded', eventData);

  return edge;
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

    // Enforcing options validity
    if (
      options.edgeKeyGenerator &&
      typeof options.edgeKeyGenerator !== 'function'
    )
      throw new InvalidArgumentsGraphError(
        `Graph.constructor: invalid 'edgeKeyGenerator' option. Expecting a function but got "${options.edgeKeyGenerator}".`
      );

    if (typeof options.multi !== 'boolean')
      throw new InvalidArgumentsGraphError(
        `Graph.constructor: invalid 'multi' option. Expecting a boolean but got "${options.multi}".`
      );

    if (!TYPES.has(options.type))
      throw new InvalidArgumentsGraphError(
        `Graph.constructor: invalid 'type' option. Should be one of "mixed", "directed" or "undirected" but got "${options.type}".`
      );

    if (typeof options.allowSelfLoops !== 'boolean')
      throw new InvalidArgumentsGraphError(
        `Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got "${options.allowSelfLoops}".`
      );

    //-- Private properties

    // Utilities
    const NodeDataClass =
      options.type === 'mixed'
        ? MixedNodeData
        : options.type === 'directed'
        ? DirectedNodeData
        : UndirectedNodeData;

    privateProperty(this, 'NodeDataClass', NodeDataClass);

    // Indexes
    privateProperty(this, '_attributes', {});
    privateProperty(this, '_nodes', new Map());
    privateProperty(this, '_edges', new Map());
    privateProperty(this, '_directedSize', 0);
    privateProperty(this, '_undirectedSize', 0);
    privateProperty(this, '_directedSelfLoopCount', 0);
    privateProperty(this, '_undirectedSelfLoopCount', 0);
    privateProperty(
      this,
      '_edgeKeyGenerator',
      options.edgeKeyGenerator || incrementalId()
    );

    // Options
    privateProperty(this, '_options', options);

    // Emitter properties
    EMITTER_PROPS.forEach(prop => privateProperty(this, prop, this[prop]));

    //-- Properties readers
    readOnlyProperty(this, 'order', () => this._nodes.size);
    readOnlyProperty(this, 'size', () => this._edges.size);
    readOnlyProperty(this, 'directedSize', () => this._directedSize);
    readOnlyProperty(this, 'undirectedSize', () => this._undirectedSize);
    readOnlyProperty(
      this,
      'selfLoopCount',
      () => this._directedSelfLoopCount + this._undirectedSelfLoopCount
    );
    readOnlyProperty(
      this,
      'directedSelfLoopCount',
      () => this._directedSelfLoopCount
    );
    readOnlyProperty(
      this,
      'undirectedSelfLoopCount',
      () => this._undirectedSelfLoopCount
    );
    readOnlyProperty(this, 'multi', this._options.multi);
    readOnlyProperty(this, 'type', this._options.type);
    readOnlyProperty(this, 'allowSelfLoops', this._options.allowSelfLoops);
    readOnlyProperty(this, 'implementation', () => 'graphology');
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
    return this._nodes.has('' + node);
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
    if (this.type === 'undirected') return false;

    if (arguments.length === 1) {
      const edge = '' + source;

      const edgeData = this._edges.get(edge);

      return !!edgeData && !edgeData.undirected;
    } else if (arguments.length === 2) {
      source = '' + source;
      target = '' + target;

      // If the node source or the target is not in the graph we break
      const nodeData = this._nodes.get(source);

      if (!nodeData) return false;

      // Is there a directed edge pointing toward target?
      const edges = nodeData.out[target];

      if (!edges) return false;

      return this.multi ? !!edges.size : true;
    }

    throw new InvalidArgumentsGraphError(
      `Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`
    );
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
    if (this.type === 'directed') return false;

    if (arguments.length === 1) {
      const edge = '' + source;

      const edgeData = this._edges.get(edge);

      return !!edgeData && edgeData.undirected;
    } else if (arguments.length === 2) {
      source = '' + source;
      target = '' + target;

      // If the node source or the target is not in the graph we break
      const nodeData = this._nodes.get(source);

      if (!nodeData) return false;

      // Is there a directed edge pointing toward target?
      const edges = nodeData.undirected[target];

      if (!edges) return false;

      return this.multi ? !!edges.size : true;
    }

    throw new InvalidArgumentsGraphError(
      `Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`
    );
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
      const edge = '' + source;

      return this._edges.has(edge);
    } else if (arguments.length === 2) {
      source = '' + source;
      target = '' + target;

      // If the node source or the target is not in the graph we break
      const nodeData = this._nodes.get(source);

      if (!nodeData) return false;

      // Is there a directed edge pointing toward target?
      let edges = typeof nodeData.out !== 'undefined' && nodeData.out[target];

      if (!edges)
        edges =
          typeof nodeData.undirected !== 'undefined' &&
          nodeData.undirected[target];

      if (!edges) return false;

      return this.multi ? !!edges.size : true;
    }

    throw new InvalidArgumentsGraphError(
      `Graph.hasEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`
    );
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
    if (this.type === 'undirected') return;

    source = '' + source;
    target = '' + target;

    if (this.multi)
      throw new UsageGraphError(
        'Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.'
      );

    const sourceData = this._nodes.get(source);

    if (!sourceData)
      throw new NotFoundGraphError(
        `Graph.directedEdge: could not find the "${source}" source node in the graph.`
      );

    if (!this._nodes.has(target))
      throw new NotFoundGraphError(
        `Graph.directedEdge: could not find the "${target}" target node in the graph.`
      );

    const edgeData = (sourceData.out && sourceData.out[target]) || undefined;

    if (edgeData) return edgeData.key;
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
    if (this.type === 'directed') return;

    source = '' + source;
    target = '' + target;

    if (this.multi)
      throw new UsageGraphError(
        'Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.'
      );

    const sourceData = this._nodes.get(source);

    if (!sourceData)
      throw new NotFoundGraphError(
        `Graph.undirectedEdge: could not find the "${source}" source node in the graph.`
      );

    if (!this._nodes.has(target))
      throw new NotFoundGraphError(
        `Graph.undirectedEdge: could not find the "${target}" target node in the graph.`
      );

    const edgeData =
      (sourceData.undirected && sourceData.undirected[target]) || undefined;

    if (edgeData) return edgeData.key;
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
      throw new UsageGraphError(
        'Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.'
      );

    source = '' + source;
    target = '' + target;

    const sourceData = this._nodes.get(source);

    if (!sourceData)
      throw new NotFoundGraphError(
        `Graph.edge: could not find the "${source}" source node in the graph.`
      );

    if (!this._nodes.has(target))
      throw new NotFoundGraphError(
        `Graph.edge: could not find the "${target}" target node in the graph.`
      );

    const edgeData =
      (sourceData.out && sourceData.out[target]) ||
      (sourceData.undirected && sourceData.undirected[target]) ||
      undefined;

    if (edgeData) return edgeData.key;
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
      throw new InvalidArgumentsGraphError(
        `Graph.inDegree: Expecting a boolean but got "${selfLoops}" for the second parameter (allowing self-loops to be counted).`
      );

    node = '' + node;

    const nodeData = this._nodes.get(node);

    if (!nodeData)
      throw new NotFoundGraphError(
        `Graph.inDegree: could not find the "${node}" node in the graph.`
      );

    if (this.type === 'undirected') return 0;

    const loops = selfLoops ? nodeData.directedSelfLoops : 0;

    return nodeData.inDegree + loops;
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
      throw new InvalidArgumentsGraphError(
        `Graph.outDegree: Expecting a boolean but got "${selfLoops}" for the second parameter (allowing self-loops to be counted).`
      );

    node = '' + node;

    const nodeData = this._nodes.get(node);

    if (!nodeData)
      throw new NotFoundGraphError(
        `Graph.outDegree: could not find the "${node}" node in the graph.`
      );

    if (this.type === 'undirected') return 0;

    const loops = selfLoops ? nodeData.directedSelfLoops : 0;

    return nodeData.outDegree + loops;
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
      throw new InvalidArgumentsGraphError(
        `Graph.directedDegree: Expecting a boolean but got "${selfLoops}" for the second parameter (allowing self-loops to be counted).`
      );

    node = '' + node;

    const nodeData = this._nodes.get(node);

    if (!nodeData)
      throw new NotFoundGraphError(
        `Graph.directedDegree: could not find the "${node}" node in the graph.`
      );

    if (this.type === 'undirected') return 0;

    const loops = selfLoops ? nodeData.directedSelfLoops : 0;

    const inDegree = nodeData.inDegree + loops;
    const outDegree = nodeData.outDegree + loops;

    return inDegree + outDegree;
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
      throw new InvalidArgumentsGraphError(
        `Graph.undirectedDegree: Expecting a boolean but got "${selfLoops}" for the second parameter (allowing self-loops to be counted).`
      );

    node = '' + node;

    const nodeData = this._nodes.get(node);

    if (!nodeData)
      throw new NotFoundGraphError(
        `Graph.undirectedDegree: could not find the "${node}" node in the graph.`
      );

    if (this.type === 'directed') return 0;

    const loops = selfLoops ? nodeData.undirectedSelfLoops : 0;

    return nodeData.undirectedDegree + loops * 2;
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
      throw new InvalidArgumentsGraphError(
        `Graph.degree: Expecting a boolean but got "${selfLoops}" for the second parameter (allowing self-loops to be counted).`
      );

    node = '' + node;

    const nodeData = this._nodes.get(node);

    if (!nodeData)
      throw new NotFoundGraphError(
        `Graph.degree: could not find the "${node}" node in the graph.`
      );

    let degree = 0;
    let loops = 0;

    if (this.type !== 'directed') {
      if (selfLoops) loops = nodeData.undirectedSelfLoops;

      degree += nodeData.undirectedDegree + loops * 2;
    }

    if (this.type !== 'undirected') {
      if (selfLoops) loops = nodeData.directedSelfLoops;

      degree += nodeData.inDegree + nodeData.outDegree + loops * 2;
    }

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
    edge = '' + edge;

    const data = this._edges.get(edge);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.source: could not find the "${edge}" edge in the graph.`
      );

    return data.source.key;
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
    edge = '' + edge;

    const data = this._edges.get(edge);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.target: could not find the "${edge}" edge in the graph.`
      );

    return data.target.key;
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
    edge = '' + edge;

    const edgeData = this._edges.get(edge);

    if (!edgeData)
      throw new NotFoundGraphError(
        `Graph.extremities: could not find the "${edge}" edge in the graph.`
      );

    return [edgeData.source.key, edgeData.target.key];
  }

  /**
   * Given a node & an edge, returns the other extremity of the edge.
   *
   * @param  {any}   node - The node's key.
   * @param  {any}   edge - The edge's key.
   * @return {any}        - The related node.
   *
   * @throws {Error} - Will throw if the edge isn't in the graph or if the
   *                   edge & node are not related.
   */
  opposite(node, edge) {
    node = '' + node;
    edge = '' + edge;

    const data = this._edges.get(edge);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.opposite: could not find the "${edge}" edge in the graph.`
      );

    const source = data.source.key,
      target = data.target.key;

    if (node !== source && node !== target)
      throw new NotFoundGraphError(
        `Graph.opposite: the "${node}" node is not attached to the "${edge}" edge (${source}, ${target}).`
      );

    return node === source ? target : source;
  }

  /**
   * Returns whether the given edge has the given node as extremity.
   *
   * @param  {any}     edge - The edge's key.
   * @param  {any}     node - The node's key.
   * @return {boolean}      - The related node.
   *
   * @throws {Error} - Will throw if either the node or the edge isn't in the graph.
   */
  hasExtremity(edge, node) {
    edge = '' + edge;
    node = '' + node;

    const data = this._edges.get(edge);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.hasExtremity: could not find the "${edge}" edge in the graph.`
      );

    return data.source.key === node || data.target.key === node;
  }

  /**
   * Method returning whether the given edge is undirected.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  isUndirected(edge) {
    edge = '' + edge;

    const data = this._edges.get(edge);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.isUndirected: could not find the "${edge}" edge in the graph.`
      );

    return data.undirected;
  }

  /**
   * Method returning whether the given edge is directed.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  isDirected(edge) {
    edge = '' + edge;

    const data = this._edges.get(edge);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.isDirected: could not find the "${edge}" edge in the graph.`
      );

    return !data.undirected;
  }

  /**
   * Method returning whether the given edge is a self loop.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  isSelfLoop(edge) {
    edge = '' + edge;

    const data = this._edges.get(edge);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.isSelfLoop: could not find the "${edge}" edge in the graph.`
      );

    return data.source === data.target;
  }

  /**
   * Method returning whether the given edge has a generated key.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */
  hasGeneratedKey(edge) {
    edge = '' + edge;

    const data = this._edges.get(edge);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.hasGeneratedKey: could not find the "${edge}" edge in the graph.`
      );

    return data.generatedKey;
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
    const nodeData = addNode(this, node, attributes);

    return nodeData.key;
  }

  /**
   * Method used to merge a node into the graph.
   *
   * @param  {any}    node         - The node.
   * @param  {object} [attributes] - Optional attributes.
   * @return {any}                 - The node.
   */
  mergeNode(node, attributes) {
    if (attributes && !isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(
        `Graph.mergeNode: invalid attributes. Expecting an object but got "${attributes}"`
      );

    // String coercion
    node = '' + node;
    attributes = attributes || {};

    // If the node already exists, we merge the attributes
    let data = this._nodes.get(node);

    if (data) {
      if (attributes) {
        assign(data.attributes, attributes);

        this.emit('nodeAttributesUpdated', {
          type: 'merge',
          key: node,
          attributes: data.attributes,
          data: attributes
        });
      }
      return node;
    }

    data = new this.NodeDataClass(node, attributes);

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
   * Method used to add a node if it does not exist in the graph or else to
   * update its attributes using a function.
   *
   * @param  {any}      node      - The node.
   * @param  {function} [updater] - Optional updater function.
   * @return {any}                - The node.
   */
  updateNode(node, updater) {
    if (updater && typeof updater !== 'function')
      throw new InvalidArgumentsGraphError(
        `Graph.updateNode: invalid updater function. Expecting a function but got "${updater}"`
      );

    // String coercion
    node = '' + node;

    // If the node already exists, we update the attributes
    let data = this._nodes.get(node);

    if (data) {
      if (updater) {
        const oldAttributes = data.attributes;
        data.attributes = updater(oldAttributes);

        this.emit('nodeAttributesUpdated', {
          type: 'replace',
          key: node,
          attributes: data.attributes
        });
      }
      return node;
    }

    const attributes = updater ? updater({}) : {};

    data = new this.NodeDataClass(node, attributes);

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
   * Method used to drop a single node & all its attached edges from the graph.
   *
   * @param  {any}    node - The node.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the node doesn't exist.
   */
  dropNode(node) {
    node = '' + node;

    const nodeData = this._nodes.get(node);

    if (!nodeData)
      throw new NotFoundGraphError(
        `Graph.dropNode: could not find the "${node}" node in the graph.`
      );

    // Removing attached edges
    // TODO: we could do faster
    this.forEachEdge(node, edge => {
      this.dropEdge(edge);
    });

    // Dropping the node from the register
    this._nodes.delete(node);

    // Emitting
    this.emit('nodeDropped', {
      key: node,
      attributes: nodeData.attributes
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
    let edgeData;

    if (arguments.length > 1) {
      const source = '' + arguments[0],
        target = '' + arguments[1];

      edgeData = getMatchingEdge(this, source, target, this.type);

      if (!edgeData)
        throw new NotFoundGraphError(
          `Graph.dropEdge: could not find the "${source}" -> "${target}" edge in the graph.`
        );
    } else {
      edge = '' + edge;

      edgeData = this._edges.get(edge);

      if (!edgeData)
        throw new NotFoundGraphError(
          `Graph.dropEdge: could not find the "${edge}" edge in the graph.`
        );
    }

    // Dropping the edge from the register
    this._edges.delete(edgeData.key);

    // Updating related degrees
    const {source: sourceData, target: targetData, attributes} = edgeData;

    const undirected = edgeData.undirected;

    if (sourceData === targetData) {
      if (undirected) {
        sourceData.undirectedSelfLoops--;
        this._undirectedSelfLoopCount--;
      } else {
        sourceData.directedSelfLoops--;
        this._directedSelfLoopCount--;
      }
    } else {
      if (undirected) {
        sourceData.undirectedDegree--;
        targetData.undirectedDegree--;
      } else {
        sourceData.outDegree--;
        targetData.inDegree--;
      }
    }

    // Clearing index
    clearEdgeFromStructureIndex(this, undirected, edgeData);

    if (undirected) this._undirectedSize--;
    else this._directedSize--;

    // Emitting
    this.emit('edgeDropped', {
      key: edge,
      attributes,
      source: sourceData.key,
      target: targetData.key,
      undirected
    });

    return this;
  }

  /**
   * Method used to remove every edge & every node from the graph.
   *
   * @return {Graph}
   */
  clear() {
    // Clearing edges
    this._edges.clear();

    // Clearing nodes
    this._nodes.clear();

    // Emitting
    this.emit('cleared');
  }

  /**
   * Method used to remove every edge from the graph.
   *
   * @return {Graph}
   */
  clearEdges() {
    // Clearing edges
    this._edges.clear();

    // Clearing indices
    this.clearIndex();

    // Emitting
    this.emit('edgesCleared');
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
      attributes: this._attributes,
      name
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
      throw new InvalidArgumentsGraphError(
        'Graph.updateAttribute: updater should be a function.'
      );

    const value = this._attributes[name];

    this._attributes[name] = updater(value);

    // Emitting
    this.emit('attributesUpdated', {
      type: 'set',
      attributes: this._attributes,
      name
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
      attributes: this._attributes,
      name
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
      throw new InvalidArgumentsGraphError(
        'Graph.replaceAttributes: provided attributes are not a plain object.'
      );

    this._attributes = attributes;

    // Emitting
    this.emit('attributesUpdated', {
      type: 'replace',
      attributes: this._attributes
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
      throw new InvalidArgumentsGraphError(
        'Graph.mergeAttributes: provided attributes are not a plain object.'
      );

    assign(this._attributes, attributes);

    // Emitting
    this.emit('attributesUpdated', {
      type: 'merge',
      attributes: this._attributes,
      data: attributes
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
    node = '' + node;

    const data = this._nodes.get(node);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.getNodeAttribute: could not find the "${node}" node in the graph.`
      );

    return data.attributes[name];
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
    node = '' + node;

    const data = this._nodes.get(node);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.getNodeAttributes: could not find the "${node}" node in the graph.`
      );

    return data.attributes;
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
    node = '' + node;

    const data = this._nodes.get(node);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.hasNodeAttribute: could not find the "${node}" node in the graph.`
      );

    return data.attributes.hasOwnProperty(name);
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
    node = '' + node;

    const data = this._nodes.get(node);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.setNodeAttribute: could not find the "${node}" node in the graph.`
      );

    if (arguments.length < 3)
      throw new InvalidArgumentsGraphError(
        "Graph.setNodeAttribute: not enough arguments. Either you forgot to pass the attribute's name or value, or you meant to use #.replaceNodeAttributes / #.mergeNodeAttributes instead."
      );

    data.attributes[name] = value;

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'set',
      attributes: data.attributes,
      name
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
    node = '' + node;

    const data = this._nodes.get(node);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.updateNodeAttribute: could not find the "${node}" node in the graph.`
      );

    if (arguments.length < 3)
      throw new InvalidArgumentsGraphError(
        "Graph.updateNodeAttribute: not enough arguments. Either you forgot to pass the attribute's name or updater, or you meant to use #.replaceNodeAttributes / #.mergeNodeAttributes instead."
      );

    if (typeof updater !== 'function')
      throw new InvalidArgumentsGraphError(
        'Graph.updateAttribute: updater should be a function.'
      );

    const attributes = data.attributes;
    const value = updater(attributes[name]);

    attributes[name] = value;

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'set',
      attributes: data.attributes,
      name
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
    node = '' + node;

    const data = this._nodes.get(node);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.removeNodeAttribute: could not find the "${node}" node in the graph.`
      );

    delete data.attributes[name];

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'remove',
      attributes: data.attributes,
      name
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
    node = '' + node;

    const data = this._nodes.get(node);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.replaceNodeAttributes: could not find the "${node}" node in the graph.`
      );

    if (!isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(
        'Graph.replaceNodeAttributes: provided attributes are not a plain object.'
      );

    data.attributes = attributes;

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'replace',
      attributes: data.attributes
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
    node = '' + node;

    const data = this._nodes.get(node);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.mergeNodeAttributes: could not find the "${node}" node in the graph.`
      );

    if (!isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(
        'Graph.mergeNodeAttributes: provided attributes are not a plain object.'
      );

    assign(data.attributes, attributes);

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'merge',
      attributes: data.attributes,
      data: attributes
    });

    return this;
  }

  /**
   * Method used to update each node's attributes using the given function.
   *
   * @param {function}  updater - Updater function to use.
   * @param {object}    [hints] - Optional hints.
   */
  updateEachNodeAttributes(updater, hints) {
    if (typeof updater !== 'function')
      throw new InvalidArgumentsGraphError(
        'Graph.updateEachNodeAttributes: expecting an updater function.'
      );

    if (hints && !validateHints(hints))
      throw new InvalidArgumentsGraphError(
        'Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}'
      );

    const iterator = this._nodes.values();

    let step, nodeData;

    while (((step = iterator.next()), step.done !== true)) {
      nodeData = step.value;
      nodeData.attributes = updater(nodeData.key, nodeData.attributes);
    }

    this.emit('eachNodeAttributesUpdated', {
      hints: hints ? hints : null
    });
  }

  /**
   * Method used to update each edge's attributes using the given function.
   *
   * @param {function}  updater - Updater function to use.
   * @param {object}    [hints] - Optional hints.
   */
  updateEachEdgeAttributes(updater, hints) {
    if (typeof updater !== 'function')
      throw new InvalidArgumentsGraphError(
        'Graph.updateEachEdgeAttributes: expecting an updater function.'
      );

    if (hints && !validateHints(hints))
      throw new InvalidArgumentsGraphError(
        'Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}'
      );

    const iterator = this._edges.values();

    let step, edgeData;

    while (((step = iterator.next()), step.done !== true)) {
      edgeData = step.value;
      edgeData.attributes = updater(edgeData.key, edgeData.attributes);
    }

    this.emit('eachEdgeAttributesUpdated', {
      hints: hints ? hints : null
    });
  }

  /**---------------------------------------------------------------------------
   * Iteration-related methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method iterating over the graph's adjacency using the given callback.
   *
   * @param  {function}  callback - Callback to use.
   */
  forEach(callback) {
    if (typeof callback !== 'function')
      throw new InvalidArgumentsGraphError(
        'Graph.forEach: expecting a callback.'
      );

    if (this.multi) forEachAdjacencyMulti(false, this, callback);
    else forEachAdjacencySimple(false, this, callback);
  }

  /**
   * Method iterating over the graph's adjacency using the given callback until
   * it returns a truthy value to stop iteration.
   *
   * @param  {function}  callback - Callback to use.
   */
  forEachUntil(callback) {
    if (typeof callback !== 'function')
      throw new InvalidArgumentsGraphError(
        'Graph.forEach: expecting a callback.'
      );

    if (this.multi) return forEachAdjacencyMulti(true, this, callback);

    return forEachAdjacencySimple(true, this, callback);
  }

  /**
   * Method returning an iterator over the graph's adjacency.
   *
   * @return {Iterator}
   */
  adjacency() {
    if (this.multi) return createAdjacencyIteratorMulti(this);

    return createAdjacencyIteratorSimple(this);
  }

  /**
   * Method returning the list of the graph's nodes.
   *
   * @return {array} - The nodes.
   */
  nodes() {
    if (typeof Array.from === 'function') return Array.from(this._nodes.keys());

    return take(this._nodes.keys(), this._nodes.size);
  }

  /**
   * Method iterating over the graph's nodes using the given callback.
   *
   * @param  {function}  callback - Callback (key, attributes, index).
   */
  forEachNode(callback) {
    if (typeof callback !== 'function')
      throw new InvalidArgumentsGraphError(
        'Graph.forEachNode: expecting a callback.'
      );

    this._nodes.forEach((data, key) => {
      callback(key, data.attributes);
    });
  }

  /**
   * Method iterating over the graph's nodes using the given callback until
   * it returns a truthy value to stop iteration.
   *
   * @param  {function}  callback - Callback (key, attributes, index).
   */
  forEachNodeUntil(callback) {
    if (typeof callback !== 'function')
      throw new InvalidArgumentsGraphError(
        'Graph.forEachNode: expecting a callback.'
      );

    const iterator = this._nodes.values();

    let step, nodeData, shouldBreak;

    while (((step = iterator.next()), step.done !== true)) {
      nodeData = step.value;

      shouldBreak = callback(nodeData.key, nodeData.attributes);

      if (shouldBreak) return true;
    }

    return false;
  }

  /**
   * Method returning an iterator over the graph's node entries.
   *
   * @return {Iterator}
   */
  nodeEntries() {
    const iterator = this._nodes.values();

    return new Iterator(() => {
      const step = iterator.next();

      if (step.done) return step;

      const data = step.value;

      return {value: [data.key, data.attributes], done: false};
    });
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
    node = '' + node;

    const data = this._nodes.get(node);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.exportNode: could not find the "${node}" node in the graph.`
      );

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
    edge = '' + edge;

    const data = this._edges.get(edge);

    if (!data)
      throw new NotFoundGraphError(
        `Graph.exportEdge: could not find the "${edge}" edge in the graph.`
      );

    return serializeEdge(edge, data);
  }

  /**
   * Method used to export the whole graph.
   *
   * @return {object} - The serialized graph.
   */
  export() {
    const nodes = new Array(this._nodes.size);

    let i = 0;

    this._nodes.forEach((data, key) => {
      nodes[i++] = serializeNode(key, data);
    });

    const edges = new Array(this._edges.size);

    i = 0;

    this._edges.forEach((data, key) => {
      edges[i++] = serializeEdge(key, data);
    });

    return {
      attributes: this.getAttributes(),
      nodes,
      edges,
      options: {
        type: this.type,
        multi: this.multi,
        allowSelfLoops: this.allowSelfLoops
      }
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
        throw new InvalidArgumentsGraphError(
          'Graph.importNode: invalid serialized node. A serialized node should be a plain object with at least a "key" property.'
        );
      if (error === 'no-key')
        throw new InvalidArgumentsGraphError(
          'Graph.importNode: no key provided.'
        );
      if (error === 'invalid-attributes')
        throw new InvalidArgumentsGraphError(
          'Graph.importNode: invalid attributes. Attributes should be a plain object, null or omitted.'
        );
    }

    // Adding the node
    const {key, attributes = {}} = data;

    if (merge) this.mergeNode(key, attributes);
    else this.addNode(key, attributes);

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
        throw new InvalidArgumentsGraphError(
          'Graph.importEdge: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.'
        );
      if (error === 'no-source')
        throw new InvalidArgumentsGraphError(
          'Graph.importEdge: missing souce.'
        );
      if (error === 'no-target')
        throw new InvalidArgumentsGraphError(
          'Graph.importEdge: missing target.'
        );
      if (error === 'invalid-attributes')
        throw new InvalidArgumentsGraphError(
          'Graph.importEdge: invalid attributes. Attributes should be a plain object, null or omitted.'
        );
      if (error === 'invalid-undirected')
        throw new InvalidArgumentsGraphError(
          'Graph.importEdge: invalid undirected. Undirected should be boolean or omitted.'
        );
    }

    // Adding the edge
    const {source, target, attributes = {}, undirected = false} = data;

    let method;

    if ('key' in data) {
      method = merge
        ? undirected
          ? this.mergeUndirectedEdgeWithKey
          : this.mergeDirectedEdgeWithKey
        : undirected
        ? this.addUndirectedEdgeWithKey
        : this.addDirectedEdgeWithKey;

      method.call(this, data.key, source, target, attributes);
    } else {
      method = merge
        ? undirected
          ? this.mergeUndirectedEdge
          : this.mergeDirectedEdge
        : undirected
        ? this.addUndirectedEdge
        : this.addDirectedEdge;

      method.call(this, source, target, attributes);
    }

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
      throw new InvalidArgumentsGraphError(
        'Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.'
      );

    if (data.attributes) {
      if (!isPlainObject(data.attributes))
        throw new InvalidArgumentsGraphError(
          'Graph.import: invalid attributes. Expecting a plain object.'
        );

      if (merge) this.mergeAttributes(data.attributes);
      else this.replaceAttributes(data.attributes);
    }

    let i, l, list;

    if (data.nodes) {
      list = data.nodes;

      if (!Array.isArray(list))
        throw new InvalidArgumentsGraphError(
          'Graph.import: invalid nodes. Expecting an array.'
        );

      for (i = 0, l = list.length; i < l; i++) this.importNode(list[i], merge);
    }

    if (data.edges) {
      list = data.edges;

      if (!Array.isArray(list))
        throw new InvalidArgumentsGraphError(
          'Graph.import: invalid edges. Expecting an array.'
        );

      for (i = 0, l = list.length; i < l; i++) this.importEdge(list[i], merge);
    }

    return this;
  }

  /**---------------------------------------------------------------------------
   * Utils
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning a null copy of the graph, i.e. a graph without nodes
   * & edges but with the exact same options.
   *
   * @param  {object} options - Options to merge with the current ones.
   * @return {Graph}          - The null copy.
   */
  nullCopy(options) {
    return new Graph(assign({}, this._options, options));
  }

  /**
   * Method returning an empty copy of the graph, i.e. a graph without edges but
   * with the exact same options.
   *
   * @param  {object} options - Options to merge with the current ones.
   * @return {Graph}          - The empty copy.
   */
  emptyCopy(options) {
    const graph = this.nullCopy(options);

    this._nodes.forEach((nodeData, key) => {
      const attributes = assign({}, nodeData.attributes);

      // NOTE: no need to emit events since user cannot access the instance yet
      nodeData = new graph.NodeDataClass(key, attributes);
      graph._nodes.set(key, nodeData);
    });

    return graph;
  }

  /**
   * Method returning an exact copy of the graph.
   *
   * @return {Graph} - The copy.
   */
  copy() {
    const graph = this.emptyCopy();

    this.forEachEdge(
      (edge, attr, source, target, _sa, _ta, undirected, generatedKey) => {
        addEdge(
          graph,
          'copy',
          generatedKey,
          undirected,
          edge,
          source,
          target,
          attr
        );
      }
    );

    return graph;
  }

  /**
   * Method upgrading the graph to a mixed one.
   *
   * @return {Graph} - The copy.
   */
  upgradeToMixed() {
    if (this.type === 'mixed') return this;

    // Upgrading node data:
    // NOTE: maybe this could lead to some de-optimization by usual
    // JavaScript engines but I cannot be sure of it. Another solution
    // would be to reinstantiate the classes but this surely has a performance
    // and memory impact.
    this._nodes.forEach(data => data.upgradeToMixed());

    // Mutating the options & the instance
    this._options.type = 'mixed';
    readOnlyProperty(this, 'type', this._options.type);
    privateProperty(this, 'NodeDataClass', MixedNodeData);

    return this;
  }

  /**
   * Method upgrading the graph to a multi one.
   *
   * @return {Graph} - The copy.
   */
  upgradeToMulti() {
    if (this.multi) return this;

    // Mutating the options & the instance
    this._options.multi = true;
    readOnlyProperty(this, 'multi', true);

    // Upgrading indices
    upgradeStructureIndexToMulti(this);

    return this;
  }

  /**---------------------------------------------------------------------------
   * Indexes-related methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method used to clear the desired index to clear memory.
   *
   * @return {Graph}       - Returns itself for chaining.
   */
  clearIndex() {
    clearStructureIndex(this);
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
   * Method returning [object Graph].
   */
  toString() {
    return '[object Graph]';
  }

  /**
   * Method used internally by node's console to display a custom object.
   *
   * @return {object} - Formatted object representation of the graph.
   */
  inspect() {
    const nodes = {};
    this._nodes.forEach((data, key) => {
      nodes[key] = data.attributes;
    });

    const edges = {},
      multiIndex = {};

    this._edges.forEach((data, key) => {
      const direction = data.undirected ? '--' : '->';

      let label = '';

      const desc = `(${data.source.key})${direction}(${data.target.key})`;

      if (!data.generatedKey) {
        label += `[${key}]: `;
      } else if (this.multi) {
        if (typeof multiIndex[desc] === 'undefined') {
          multiIndex[desc] = 0;
        } else {
          multiIndex[desc]++;
        }

        label += `${multiIndex[desc]}. `;
      }

      label += desc;

      edges[label] = data.attributes;
    });

    const dummy = {};

    for (const k in this) {
      if (
        this.hasOwnProperty(k) &&
        !EMITTER_PROPS.has(k) &&
        typeof this[k] !== 'function'
      )
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
 * Attaching custom inspect method for node >= 10.
 */
if (typeof Symbol !== 'undefined')
  Graph.prototype[Symbol.for('nodejs.util.inspect.custom')] =
    Graph.prototype.inspect;

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
  ['add', 'merge', 'update'].forEach(verb => {
    const name = method.name(verb),
      fn = verb === 'add' ? addEdge : mergeEdge;

    if (method.generateKey) {
      Graph.prototype[name] = function (source, target, attributes) {
        return fn(
          this,
          name,
          true,
          (method.type || this.type) === 'undirected',
          null,
          source,
          target,
          attributes,
          verb === 'update'
        );
      };
    } else {
      Graph.prototype[name] = function (edge, source, target, attributes) {
        return fn(
          this,
          name,
          false,
          (method.type || this.type) === 'undirected',
          edge,
          source,
          target,
          attributes,
          verb === 'update'
        );
      };
    }
  });
});

/**
 * Self iterator.
 */
if (typeof Symbol !== 'undefined')
  Graph.prototype[Symbol.iterator] = Graph.prototype.adjacency;

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
