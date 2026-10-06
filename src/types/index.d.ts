/**
 * Graphology Typings
 * ===================
 *
 * Graphology TypeScript declaration.
 */

/**
 * Miscellaneous types.
 */
type Attributes = {[name: string]: any};

type GraphType = 'mixed' | 'directed' | 'undirected';

type UpdateHints<ItemAttributes extends Attributes = Attributes> = {
  attributes?: Array<keyof ItemAttributes>;
};

type GraphOptions = {
  allowSelfLoops?: boolean;
  multi?: boolean;
  type?: GraphType;
};

type AdjacencyEntry<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = {
  source: string;
  target: string;
  sourceAttributes: NodeAttributes;
  targetAttributes: NodeAttributes;
  edge: string;
  edgeAttributes: EdgeAttributes;
  undirected: boolean;
};

type NodeEntry<NodeAttributes extends Attributes = Attributes> = {
  node: string;
  attributes: NodeAttributes;
};

type NodeMergeResult = [key: string, nodeWasAdded: boolean];

type NeighborEntry<NodeAttributes extends Attributes = Attributes> = {
  neighbor: string;
  attributes: NodeAttributes;
};

type EdgeEntry<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = {
  edge: string;
  attributes: EdgeAttributes;
  source: string;
  target: string;
  sourceAttributes: NodeAttributes;
  targetAttributes: NodeAttributes;
  undirected: boolean;
};

type EdgeMergeResult = [
  key: string,
  edgeWasAdded: boolean,
  sourceWasAdded: boolean,
  targetWasAdded: boolean
];

type AdjacencyIterationCallback<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = (
  node: string,
  neighbor: string,
  nodeAttributes: NodeAttributes,
  neighborAttributes: NodeAttributes,
  edge: string,
  edgeAttributes: EdgeAttributes,
  undirected: boolean
) => void;

type AdjacencyIterationCallbackWithOrphans<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = (
  node: string,
  neighbor: string | null,
  nodeAttributes: NodeAttributes,
  neighborAttributes: NodeAttributes | null,
  edge: string | null,
  edgeAttributes: EdgeAttributes | null,
  undirected: boolean | null
) => void;

type NodeIterationCallback<NodeAttributes extends Attributes = Attributes> = (
  node: string,
  attributes: NodeAttributes
) => void;

type NodePredicate<NodeAttributes extends Attributes = Attributes> = (
  node: string,
  attributes: NodeAttributes
) => boolean | void;

type NodeMapper<T, NodeAttributes extends Attributes = Attributes> = (
  node: string,
  attributes: NodeAttributes
) => T;

type NodeReducer<T, NodeAttributes extends Attributes = Attributes> = (
  accumulator: T,
  node: string,
  attributes: NodeAttributes
) => T;

type NeighborIterationCallback<NodeAttributes extends Attributes = Attributes> =
  (neighbor: string, attributes: NodeAttributes) => void;

type NeighborPredicate<NodeAttributes extends Attributes = Attributes> = (
  neighbor: string,
  attributes: NodeAttributes
) => boolean | void;

type NeighborMapper<T, NodeAttributes extends Attributes = Attributes> = (
  neighbor: string,
  attributes: NodeAttributes
) => T;

type NeighborReducer<T, NodeAttributes extends Attributes = Attributes> = (
  accumulator: T,
  neighbor: string,
  attributes: NodeAttributes
) => T;

type EdgeIterationCallback<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = (
  edge: string,
  attributes: EdgeAttributes,
  source: string,
  target: string,
  sourceAttributes: NodeAttributes,
  targetAttributes: NodeAttributes,
  undirected: boolean
) => void;

type EdgePredicate<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = (
  edge: string,
  attributes: EdgeAttributes,
  source: string,
  target: string,
  sourceAttributes: NodeAttributes,
  targetAttributes: NodeAttributes,
  undirected: boolean
) => boolean | void;

type EdgeMapper<
  T,
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = (
  edge: string,
  attributes: EdgeAttributes,
  source: string,
  target: string,
  sourceAttributes: NodeAttributes,
  targetAttributes: NodeAttributes,
  undirected: boolean
) => T;

type EdgeReducer<
  T,
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = (
  accumulator: T,
  edge: string,
  attributes: EdgeAttributes,
  source: string,
  target: string,
  sourceAttributes: NodeAttributes,
  targetAttributes: NodeAttributes,
  undirected: boolean
) => T;

type SerializedNode<NodeAttributes extends Attributes = Attributes> = {
  key: string;
  attributes?: NodeAttributes;
};

type SerializedEdge<EdgeAttributes extends Attributes = Attributes> = {
  key?: string;
  source: string;
  target: string;
  attributes?: EdgeAttributes;
  undirected?: boolean;
};

type SerializedGraph<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
> = {
  attributes: GraphAttributes;
  options: GraphOptions;
  nodes: Array<SerializedNode<NodeAttributes>>;
  edges: Array<SerializedEdge<EdgeAttributes>>;
};

/**
 * Event Emitter typings for convience.
 * @note Taken from here: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/events/index.d.ts
 */
type Listener = (...args: any[]) => void;
type EventsMapping = Record<string, Listener>;

type AttributeUpdateType = 'set' | 'remove' | 'replace' | 'merge' | 'update';

type AttributeUpdatePayload<ItemAttributes extends Attributes = Attributes> =
  | {
      type: 'set';
      key: string;
      attributes: ItemAttributes;
      name: keyof ItemAttributes;
    }
  | {
      type: 'remove';
      key: string;
      attributes: ItemAttributes;
      name: keyof ItemAttributes;
    }
  | {
      type: 'replace';
      key: string;
      attributes: ItemAttributes;
    }
  | {
      type: 'merge';
      key: string;
      attributes: ItemAttributes;
      data: ItemAttributes;
    }
  | {
      type: 'update';
      key: string;
      attributes: ItemAttributes;
    };

type GraphEvents<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
> = {
  nodeAdded(payload: {key: string; attributes: NodeAttributes}): void;
  edgeAdded(payload: {
    key: string;
    source: string;
    target: string;
    attributes: EdgeAttributes;
    undirected: boolean;
  }): void;
  nodeDropped(payload: {key: string; attributes: NodeAttributes}): void;
  edgeDropped(payload: {
    key: string;
    source: string;
    target: string;
    attributes: EdgeAttributes;
    undirected: boolean;
  }): void;
  cleared(): void;
  edgesCleared(): void;
  attributesUpdated(
    payload: Omit<AttributeUpdatePayload<GraphAttributes>, 'key'>
  ): void;
  nodeAttributesUpdated(payload: AttributeUpdatePayload<NodeAttributes>): void;
  edgeAttributesUpdated(payload: AttributeUpdatePayload<EdgeAttributes>): void;
  eachNodeAttributesUpdated(payload: {
    hints: UpdateHints<NodeAttributes>;
  }): void;
  eachEdgeAttributesUpdated(payload: {
    hints: UpdateHints<EdgeAttributes>;
  }): void;
};

declare class GraphEventEmitter<Events extends EventsMapping> {
  static listenerCount<Events extends EventsMapping>(
    emitter: GraphEventEmitter<Events>,
    type: string | number
  ): number;
  static defaultMaxListeners: number;

  eventNames<Event extends keyof Events>(): Array<Event>;
  setMaxListeners(n: number): this;
  getMaxListeners(): number;
  emit<Event extends keyof Events>(
    type: Event,
    ...args: Parameters<Events[Event]>
  ): boolean;
  addListener<Event extends keyof Events>(
    type: Event,
    listener: Events[Event]
  ): this;
  on<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  once<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  prependListener<Event extends keyof Events>(
    type: Event,
    listener: Events[Event]
  ): this;
  prependOnceListener<Event extends keyof Events>(
    type: Event,
    listener: Events[Event]
  ): this;
  removeListener<Event extends keyof Events>(
    type: Event,
    listener: Events[Event]
  ): this;
  off<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  removeAllListeners<Event extends keyof Events>(type?: Event): this;
  listeners<Event extends keyof Events>(type: Event): Events[Event][];
  listenerCount<Event extends keyof Events>(type: Event): number;
  rawListeners<Event extends keyof Events>(type: Event): Events[Event][];
}

/**
 * Main interface.
 */
declare abstract class AbstractGraph<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
> extends GraphEventEmitter<
  GraphEvents<NodeAttributes, EdgeAttributes, GraphAttributes>
> {
  // Constructor
  constructor(options?: GraphOptions);

  // Members
  order: number;
  size: number;
  directedSize: number;
  undirectedSize: number;
  type: GraphType;
  multi: boolean;
  allowSelfLoops: boolean;
  implementation: string;
  selfLoopCount: number;
  directedSelfLoopCount: number;
  undirectedSelfLoopCount: number;

  // Read methods
  hasNode(node: string | number): boolean;
  hasDirectedEdge(edge: string | number): boolean;
  hasDirectedEdge(source: string | number, target: string | number): boolean;
  hasUndirectedEdge(edge: string | number): boolean;
  hasUndirectedEdge(source: string | number, target: string | number): boolean;
  hasEdge(edge: string | number): boolean;
  hasEdge(source: string | number, target: string | number): boolean;
  directedEdge(source: string | number, target: string | number): string | undefined;
  undirectedEdge(source: string | number, target: string | number): string | undefined;
  edge(source: string | number, target: string | number): string | undefined;
  inDegree(node: string | number): number;
  outDegree(node: string | number): number;
  inboundDegree(node: string | number): number;
  outboundDegree(node: string | number): number;
  directedDegree(node: string | number): number;
  undirectedDegree(node: string | number): number;
  degree(node: string | number): number;
  inDegreeWithoutSelfLoops(node: string | number): number;
  outDegreeWithoutSelfLoops(node: string | number): number;
  inboundDegreeWithoutSelfLoops(node: string | number): number;
  outboundDegreeWithoutSelfLoops(node: string | number): number;
  directedDegreeWithoutSelfLoops(node: string | number): number;
  undirectedDegreeWithoutSelfLoops(node: string | number): number;
  degreeWithoutSelfLoops(node: string | number): number;
  source(edge: string | number): string;
  target(edge: string | number): string;
  extremities(edge: string | number): [string, string];
  opposite(node: string | number, edge: string | number): string;
  isUndirected(edge: string | number): boolean;
  isDirected(edge: string | number): boolean;
  isSelfLoop(edge: string | number): boolean;
  hasExtremity(edge: string | number, node: string | number): boolean;
  areNeighbors(source: string | number, target: string | number): boolean;
  areUndirectedNeighbors(source: string | number, target: string | number): boolean;
  areDirectedNeighbors(source: string | number, target: string | number): boolean;
  areInNeighbors(source: string | number, target: string | number): boolean;
  areOutNeighbors(source: string | number, target: string | number): boolean;
  areInboundNeighbors(source: string | number, target: string | number): boolean;
  areOutboundNeighbors(source: string | number, target: string | number): boolean;

  // Mutation methods
  addNode(node: string | number, attributes?: NodeAttributes): string;
  mergeNode(
    node: string | number,
    attributes?: Partial<NodeAttributes>
  ): NodeMergeResult;
  updateNode(
    node: string | number,
    updater?: (attributes: Partial<NodeAttributes>) => NodeAttributes
  ): NodeMergeResult;
  addEdge(
    source: string | number,
    target: string | number,
    attributes?: EdgeAttributes
  ): string;
  mergeEdge(
    source: string | number,
    target: string | number,
    attributes?: Partial<EdgeAttributes>
  ): EdgeMergeResult;
  updateEdge(
    source: string | number,
    target: string | number,
    updater?: (attributes: Partial<EdgeAttributes>) => EdgeAttributes
  ): EdgeMergeResult;
  addDirectedEdge(
    source: string | number,
    target: string | number,
    attributes?: EdgeAttributes
  ): string;
  mergeDirectedEdge(
    source: string | number,
    target: string | number,
    attributes?: Partial<EdgeAttributes>
  ): EdgeMergeResult;
  updateDirectedEdge(
    source: string | number,
    target: string | number,
    updater?: (attributes: Partial<EdgeAttributes>) => EdgeAttributes
  ): EdgeMergeResult;
  addUndirectedEdge(
    source: string | number,
    target: string | number,
    attributes?: EdgeAttributes
  ): string;
  mergeUndirectedEdge(
    source: string | number,
    target: string | number,
    attributes?: Partial<EdgeAttributes>
  ): EdgeMergeResult;
  updateUndirectedEdge(
    source: string | number,
    target: string | number,
    updater?: (attributes: Partial<EdgeAttributes>) => EdgeAttributes
  ): EdgeMergeResult;
  addEdgeWithKey(
    edge: string | number,
    source: string | number,
    target: string | number,
    attributes?: EdgeAttributes
  ): string;
  mergeEdgeWithKey(
    edge: string | number,
    source: string | number,
    target: string | number,
    attributes?: Partial<EdgeAttributes>
  ): EdgeMergeResult;
  updateEdgeWithKey(
    edge: string | number,
    source: string | number,
    target: string | number,
    updater?: (attributes: Partial<EdgeAttributes>) => EdgeAttributes
  ): EdgeMergeResult;
  addDirectedEdgeWithKey(
    edge: string | number,
    source: string | number,
    target: string | number,
    attributes?: EdgeAttributes
  ): string;
  mergeDirectedEdgeWithKey(
    edge: string | number,
    source: string | number,
    target: string | number,
    attributes?: Partial<EdgeAttributes>
  ): EdgeMergeResult;
  updateDirectedEdgeWithKey(
    edge: string | number,
    source: string | number,
    target: string | number,
    updater?: (attributes: Partial<EdgeAttributes>) => EdgeAttributes
  ): EdgeMergeResult;
  addUndirectedEdgeWithKey(
    edge: string | number,
    source: string | number,
    target: string | number,
    attributes?: EdgeAttributes
  ): string;
  mergeUndirectedEdgeWithKey(
    edge: string | number,
    source: string | number,
    target: string | number,
    attributes?: Partial<EdgeAttributes>
  ): EdgeMergeResult;
  updateUndirectedEdgeWithKey(
    edge: string | number,
    source: string | number,
    target: string | number,
    updater?: (attributes: Partial<EdgeAttributes>) => EdgeAttributes
  ): EdgeMergeResult;
  dropNode(node: string | number): void;
  dropEdge(edge: string | number): void;
  dropEdge(source: string | number, target: string | number): void;
  dropDirectedEdge(source: string | number, target: string | number): void;
  dropUndirectedEdge(source: string | number, target: string | number): void;
  clear(): void;
  clearEdges(): void;

  // Graph attribute methods
  getAttribute<AttributeName extends keyof GraphAttributes>(
    name: AttributeName
  ): GraphAttributes[AttributeName];
  getAttributes(): GraphAttributes;
  hasAttribute<AttributeName extends keyof GraphAttributes>(
    name: AttributeName
  ): boolean;
  setAttribute<AttributeName extends keyof GraphAttributes>(
    name: AttributeName,
    value: GraphAttributes[AttributeName]
  ): this;
  updateAttribute<AttributeName extends keyof GraphAttributes>(
    name: AttributeName,
    updater: (
      value: GraphAttributes[AttributeName] | undefined
    ) => GraphAttributes[AttributeName]
  ): this;
  removeAttribute<AttributeName extends keyof GraphAttributes>(
    name: AttributeName
  ): this;
  replaceAttributes(attributes: GraphAttributes): this;
  mergeAttributes(attributes: Partial<GraphAttributes>): this;
  updateAttributes(
    updater: (attributes: GraphAttributes) => GraphAttributes
  ): this;

  // Node attribute methods
  getNodeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string | number,
    name: AttributeName
  ): NodeAttributes[AttributeName];
  getNodeAttributes(node: string | number): NodeAttributes;
  hasNodeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string | number,
    name: AttributeName
  ): boolean;
  setNodeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string | number,
    name: AttributeName,
    value: NodeAttributes[AttributeName]
  ): this;
  updateNodeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string | number,
    name: AttributeName,
    updater: (
      value: NodeAttributes[AttributeName] | undefined
    ) => NodeAttributes[AttributeName]
  ): this;
  removeNodeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string | number,
    name: AttributeName
  ): this;
  replaceNodeAttributes(node: string | number, attributes: NodeAttributes): this;
  mergeNodeAttributes(node: string | number, attributes: Partial<NodeAttributes>): this;
  updateNodeAttributes(
    node: string | number,
    updater: (attributes: NodeAttributes) => NodeAttributes
  ): this;

  getSourceAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string | number,
    name: AttributeName
  ): NodeAttributes[AttributeName];
  getSourceAttributes(edge: string | number): NodeAttributes;
  hasSourceAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string | number,
    name: AttributeName
  ): boolean;
  setSourceAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string | number,
    name: AttributeName,
    value: NodeAttributes[AttributeName]
  ): this;
  updateSourceAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string | number,
    name: AttributeName,
    updater: (
      value: NodeAttributes[AttributeName] | undefined
    ) => NodeAttributes[AttributeName]
  ): this;
  removeSourceAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string | number,
    name: AttributeName
  ): this;
  replaceSourceAttributes(edge: string | number, attributes: NodeAttributes): this;
  mergeSourceAttributes(
    edge: string | number,
    attributes: Partial<NodeAttributes>
  ): this;
  updateSourceAttributes(
    edge: string | number,
    updater: (attributes: NodeAttributes) => NodeAttributes
  ): this;

  getTargetAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string | number,
    name: AttributeName
  ): NodeAttributes[AttributeName];
  getTargetAttributes(edge: string | number): NodeAttributes;
  hasTargetAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string | number,
    name: AttributeName
  ): boolean;
  setTargetAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string | number,
    name: AttributeName,
    value: NodeAttributes[AttributeName]
  ): this;
  updateTargetAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string | number,
    name: AttributeName,
    updater: (
      value: NodeAttributes[AttributeName] | undefined
    ) => NodeAttributes[AttributeName]
  ): this;
  removeTargetAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string | number,
    name: AttributeName
  ): this;
  replaceTargetAttributes(edge: string | number, attributes: NodeAttributes): this;
  mergeTargetAttributes(
    edge: string | number,
    attributes: Partial<NodeAttributes>
  ): this;
  updateTargetAttributes(
    edge: string | number,
    updater: (attributes: NodeAttributes) => NodeAttributes
  ): this;

  getOppositeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string | number,
    edge: string | number,
    name: AttributeName
  ): NodeAttributes[AttributeName];
  getOppositeAttributes(node: string | number): NodeAttributes;
  hasOppositeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string | number,
    edge: string | number,
    name: AttributeName
  ): boolean;
  setOppositeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string | number,
    edge: string | number,
    name: AttributeName,
    value: NodeAttributes[AttributeName]
  ): this;
  updateOppositeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string | number,
    edge: string | number,
    name: AttributeName,
    updater: (
      value: NodeAttributes[AttributeName] | undefined
    ) => NodeAttributes[AttributeName]
  ): this;
  removeOppositeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string | number,
    edge: string | number,
    name: AttributeName
  ): this;
  replaceOppositeAttributes(
    node: string | number,
    edge: string | number,
    attributes: NodeAttributes
  ): this;
  mergeOppositeAttributes(
    node: string | number,
    edge: string | number,
    attributes: Partial<NodeAttributes>
  ): this;
  updateOppositeAttributes(
    node: string | number,
    edge: string | number,
    updater: (attributes: NodeAttributes) => NodeAttributes
  ): this;

  updateEachNodeAttributes(
    updater: NodeMapper<NodeAttributes, NodeAttributes>,
    hints?: UpdateHints<NodeAttributes>
  ): void;

  // Edge attribute methods
  getEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: string | number,
    name: AttributeName
  ): EdgeAttributes[AttributeName];
  getEdgeAttributes(edge: string | number): EdgeAttributes;
  hasEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: string | number,
    name: AttributeName
  ): boolean;
  setEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: string | number,
    name: AttributeName,
    value: EdgeAttributes[AttributeName]
  ): this;
  updateEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: string | number,
    name: AttributeName,
    updater: (
      value: EdgeAttributes[AttributeName] | undefined
    ) => EdgeAttributes[AttributeName]
  ): this;
  removeEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: string | number,
    name: AttributeName
  ): this;
  replaceEdgeAttributes(edge: string | number, attributes: EdgeAttributes): this;
  mergeEdgeAttributes(edge: string | number, attributes: Partial<EdgeAttributes>): this;
  updateEdgeAttributes(
    edge: string | number,
    updater: (attributes: EdgeAttributes) => EdgeAttributes
  ): this;

  updateEachEdgeAttributes(
    updater: EdgeMapper<EdgeAttributes, NodeAttributes, EdgeAttributes>,
    hints?: UpdateHints<EdgeAttributes>
  ): void;

  // Edge attribute methods (source, target)
  getEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string | number,
    target: string | number,
    name: AttributeName
  ): EdgeAttributes[AttributeName];
  getEdgeAttributes(source: string | number, target: string | number): EdgeAttributes;
  hasEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string | number,
    target: string | number,
    name: AttributeName
  ): boolean;
  setEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string | number,
    target: string | number,
    name: AttributeName,
    value: EdgeAttributes[AttributeName]
  ): this;
  updateEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string | number,
    target: string | number,
    name: AttributeName,
    updater: (
      value: EdgeAttributes[AttributeName] | undefined
    ) => EdgeAttributes[AttributeName]
  ): this;
  removeEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string | number,
    target: string | number,
    name: AttributeName
  ): this;
  replaceEdgeAttributes(
    source: string | number,
    target: string | number,
    attributes: EdgeAttributes
  ): this;
  mergeEdgeAttributes(
    source: string | number,
    target: string | number,
    attributes: Partial<EdgeAttributes>
  ): this;
  updateEdgeAttributes(
    source: string | number,
    target: string | number,
    updater: (attributes: EdgeAttributes) => EdgeAttributes
  ): this;

  getDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string | number,
    target: string | number,
    name: AttributeName
  ): EdgeAttributes[AttributeName];
  getDirectedEdgeAttributes(source: string | number, target: string | number): EdgeAttributes;
  hasDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string | number,
    target: string | number,
    name: AttributeName
  ): boolean;
  setDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string | number,
    target: string | number,
    name: AttributeName,
    value: EdgeAttributes[AttributeName]
  ): this;
  updateDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string | number,
    target: string | number,
    name: AttributeName,
    updater: (
      value: EdgeAttributes[AttributeName] | undefined
    ) => EdgeAttributes[AttributeName]
  ): this;
  removeDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string | number,
    target: string | number,
    name: AttributeName
  ): this;
  replaceDirectedEdgeAttributes(
    source: string | number,
    target: string | number,
    attributes: EdgeAttributes
  ): this;
  mergeDirectedEdgeAttributes(
    source: string | number,
    target: string | number,
    attributes: Partial<EdgeAttributes>
  ): this;
  updateDirectedEdgeAttributes(
    source: string | number,
    target: string | number,
    updater: (attributes: EdgeAttributes) => EdgeAttributes
  ): this;

  getUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string | number,
    target: string | number,
    name: AttributeName
  ): EdgeAttributes[AttributeName];
  getUndirectedEdgeAttributes(source: string | number, target: string | number): EdgeAttributes;
  hasUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string | number,
    target: string | number,
    name: AttributeName
  ): boolean;
  setUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string | number,
    target: string | number,
    name: AttributeName,
    value: EdgeAttributes[AttributeName]
  ): this;
  updateUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string | number,
    target: string | number,
    name: AttributeName,
    updater: (
      value: EdgeAttributes[AttributeName] | undefined
    ) => EdgeAttributes[AttributeName]
  ): this;
  removeUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string | number,
    target: string | number,
    name: AttributeName
  ): this;
  replaceUndirectedEdgeAttributes(
    source: string | number,
    target: string | number,
    attributes: EdgeAttributes
  ): this;
  mergeUndirectedEdgeAttributes(
    source: string | number,
    target: string | number,
    attributes: Partial<EdgeAttributes>
  ): this;
  updateUndirectedEdgeAttributes(
    source: string | number,
    target: string | number,
    updater: (attributes: EdgeAttributes) => EdgeAttributes
  ): this;

  // Iteration methods
  forEachAdjacencyEntry(
    callback: AdjacencyIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachAssymetricAdjacencyEntry(
    callback: AdjacencyIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachAdjacencyEntryWithOrphans(
    callback: AdjacencyIterationCallbackWithOrphans<
      NodeAttributes,
      EdgeAttributes
    >
  ): void;
  forEachAssymetricAdjacencyEntryWithOrphans(
    callback: AdjacencyIterationCallbackWithOrphans<
      NodeAttributes,
      EdgeAttributes
    >
  ): void;

  nodes(): Array<string>;
  forEachNode(callback: NodeIterationCallback<NodeAttributes>): void;
  mapNodes<T>(callback: NodeMapper<T, NodeAttributes>): Array<T>;
  filterNodes(callback: NodePredicate<NodeAttributes>): Array<string>;
  reduceNodes<T>(callback: NodeReducer<T, NodeAttributes>, initialValue: T): T;
  findNode(callback: NodePredicate<NodeAttributes>): string | undefined;
  someNode(callback: NodePredicate<NodeAttributes>): boolean;
  everyNode(callback: NodePredicate<NodeAttributes>): boolean;
  nodeEntries(): IterableIterator<NodeEntry<NodeAttributes>>;

  edges(): Array<string>;
  edges(node: string | number): Array<string>;
  edges(source: string | number, target: string | number): Array<string>;
  undirectedEdges(): Array<string>;
  undirectedEdges(node: string | number): Array<string>;
  undirectedEdges(source: string | number, target: string | number): Array<string>;
  directedEdges(): Array<string>;
  directedEdges(node: string | number): Array<string>;
  directedEdges(source: string | number, target: string | number): Array<string>;
  inEdges(): Array<string>;
  inEdges(node: string | number): Array<string>;
  inEdges(source: string | number, target: string | number): Array<string>;
  outEdges(): Array<string>;
  outEdges(node: string | number): Array<string>;
  outEdges(source: string | number, target: string | number): Array<string>;
  inboundEdges(): Array<string>;
  inboundEdges(node: string | number): Array<string>;
  inboundEdges(source: string | number, target: string | number): Array<string>;
  outboundEdges(): Array<string>;
  outboundEdges(node: string | number): Array<string>;
  outboundEdges(source: string | number, target: string | number): Array<string>;

  forEachEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachEdge(
    node: string | number,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachEdge(
    source: string | number,
    target: string | number,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachUndirectedEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachUndirectedEdge(
    node: string | number,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachUndirectedEdge(
    source: string | number,
    target: string | number,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachDirectedEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachDirectedEdge(
    node: string | number,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachDirectedEdge(
    source: string | number,
    target: string | number,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInEdge(
    node: string | number,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInEdge(
    source: string | number,
    target: string | number,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutEdge(
    node: string | number,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutEdge(
    source: string | number,
    target: string | number,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInboundEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInboundEdge(
    node: string | number,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInboundEdge(
    source: string | number,
    target: string | number,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutboundEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutboundEdge(
    node: string | number,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutboundEdge(
    source: string | number,
    target: string | number,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;

  mapEdges<T>(
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapEdges<T>(
    node: string | number,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapEdges<T>(
    source: string | number,
    target: string | number,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapUndirectedEdges<T>(
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapUndirectedEdges<T>(
    node: string | number,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapUndirectedEdges<T>(
    source: string | number,
    target: string | number,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapDirectedEdges<T>(
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapDirectedEdges<T>(
    node: string | number,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapDirectedEdges<T>(
    source: string | number,
    target: string | number,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapInEdges<T>(
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapInEdges<T>(
    node: string | number,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapInEdges<T>(
    source: string | number,
    target: string | number,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapOutEdges<T>(
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapOutEdges<T>(
    node: string | number,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapOutEdges<T>(
    source: string | number,
    target: string | number,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapInboundEdges<T>(
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapInboundEdges<T>(
    node: string | number,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapInboundEdges<T>(
    source: string | number,
    target: string | number,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapOutboundEdges<T>(
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapOutboundEdges<T>(
    node: string | number,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapOutboundEdges<T>(
    source: string | number,
    target: string | number,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;

  filterEdges(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterEdges(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterEdges(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterUndirectedEdges(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterUndirectedEdges(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterUndirectedEdges(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterDirectedEdges(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterDirectedEdges(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterDirectedEdges(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterInEdges(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterInEdges(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterInEdges(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterOutEdges(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterOutEdges(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterOutEdges(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterInboundEdges(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterInboundEdges(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterInboundEdges(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterOutboundEdges(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterOutboundEdges(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterOutboundEdges(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;

  reduceEdges<T>(
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceEdges<T>(
    node: string | number,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceEdges<T>(
    source: string | number,
    target: string | number,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceUndirectedEdges<T>(
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceUndirectedEdges<T>(
    node: string | number,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceUndirectedEdges<T>(
    source: string | number,
    target: string | number,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceDirectedEdges<T>(
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceDirectedEdges<T>(
    node: string | number,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceDirectedEdges<T>(
    source: string | number,
    target: string | number,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceInEdges<T>(
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceInEdges<T>(
    node: string | number,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceInEdges<T>(
    source: string | number,
    target: string | number,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceOutEdges<T>(
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceOutEdges<T>(
    node: string | number,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceOutEdges<T>(
    source: string | number,
    target: string | number,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceInboundEdges<T>(
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceInboundEdges<T>(
    node: string | number,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceInboundEdges<T>(
    source: string | number,
    target: string | number,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceOutboundEdges<T>(
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceOutboundEdges<T>(
    node: string | number,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceOutboundEdges<T>(
    source: string | number,
    target: string | number,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;

  findEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findUndirectedEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findUndirectedEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findUndirectedEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findDirectedEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findDirectedEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findDirectedEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInboundEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInboundEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInboundEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutboundEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutboundEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutboundEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;

  someEdge(callback: EdgePredicate<NodeAttributes, EdgeAttributes>): boolean;
  someEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someUndirectedEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someUndirectedEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someUndirectedEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someDirectedEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someDirectedEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someDirectedEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someInEdge(callback: EdgePredicate<NodeAttributes, EdgeAttributes>): boolean;
  someInEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someInEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someOutEdge(callback: EdgePredicate<NodeAttributes, EdgeAttributes>): boolean;
  someOutEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someOutEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someInboundEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someInboundEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someInboundEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someOutboundEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someOutboundEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someOutboundEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;

  everyEdge(callback: EdgePredicate<NodeAttributes, EdgeAttributes>): boolean;
  everyEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyUndirectedEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyUndirectedEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyUndirectedEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyDirectedEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyDirectedEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyDirectedEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyInEdge(callback: EdgePredicate<NodeAttributes, EdgeAttributes>): boolean;
  everyInEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyInEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyOutEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyOutEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyOutEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyInboundEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyInboundEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyInboundEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyOutboundEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyOutboundEdge(
    node: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyOutboundEdge(
    source: string | number,
    target: string | number,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;

  edgeEntries(): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  edgeEntries(
    node: string | number
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  edgeEntries(
    source: string | number,
    target: string | number
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  undirectedEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  undirectedEdgeEntries(
    node: string | number
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  undirectedEdgeEntries(
    source: string | number,
    target: string | number
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  directedEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  directedEdgeEntries(
    node: string | number
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  directedEdgeEntries(
    source: string | number,
    target: string | number
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inEdgeEntries(): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inEdgeEntries(
    node: string | number
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inEdgeEntries(
    source: string | number,
    target: string | number
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outEdgeEntries(): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outEdgeEntries(
    node: string | number
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outEdgeEntries(
    source: string | number,
    target: string | number
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inboundEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  inboundEdgeEntries(
    node: string | number
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inboundEdgeEntries(
    source: string | number,
    target: string | number
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outboundEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  outboundEdgeEntries(
    node: string | number
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outboundEdgeEntries(
    source: string | number,
    target: string | number
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;

  neighbors(node: string | number): Array<string>;
  undirectedNeighbors(node: string | number): Array<string>;
  directedNeighbors(node: string | number): Array<string>;
  inNeighbors(node: string | number): Array<string>;
  outNeighbors(node: string | number): Array<string>;
  inboundNeighbors(node: string | number): Array<string>;
  outboundNeighbors(node: string | number): Array<string>;

  forEachNeighbor(
    node: string | number,
    callback: NeighborIterationCallback<NodeAttributes>
  ): void;
  forEachUndirectedNeighbor(
    node: string | number,
    callback: NeighborIterationCallback<NodeAttributes>
  ): void;
  forEachDirectedNeighbor(
    node: string | number,
    callback: NeighborIterationCallback<NodeAttributes>
  ): void;
  forEachInNeighbor(
    node: string | number,
    callback: NeighborIterationCallback<NodeAttributes>
  ): void;
  forEachOutNeighbor(
    node: string | number,
    callback: NeighborIterationCallback<NodeAttributes>
  ): void;
  forEachInboundNeighbor(
    node: string | number,
    callback: NeighborIterationCallback<NodeAttributes>
  ): void;
  forEachOutboundNeighbor(
    node: string | number,
    callback: NeighborIterationCallback<NodeAttributes>
  ): void;

  mapNeighbors<T>(
    node: string | number,
    callback: NeighborMapper<T, NodeAttributes>
  ): Array<T>;
  mapUndirectedNeighbors<T>(
    node: string | number,
    callback: NeighborMapper<T, NodeAttributes>
  ): Array<T>;
  mapDirectedNeighbors<T>(
    node: string | number,
    callback: NeighborMapper<T, NodeAttributes>
  ): Array<T>;
  mapInNeighbors<T>(
    node: string | number,
    callback: NeighborMapper<T, NodeAttributes>
  ): Array<T>;
  mapOutNeighbors<T>(
    node: string | number,
    callback: NeighborMapper<T, NodeAttributes>
  ): Array<T>;
  mapInboundNeighbors<T>(
    node: string | number,
    callback: NeighborMapper<T, NodeAttributes>
  ): Array<T>;
  mapOutboundNeighbors<T>(
    node: string | number,
    callback: NeighborMapper<T, NodeAttributes>
  ): Array<T>;

  filterNeighbors(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): Array<string>;
  filterUndirectedNeighbors(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): Array<string>;
  filterDirectedNeighbors(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): Array<string>;
  filterInNeighbors(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): Array<string>;
  filterOutNeighbors(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): Array<string>;
  filterInboundNeighbors(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): Array<string>;
  filterOutboundNeighbors(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): Array<string>;

  reduceNeighbors<T>(
    node: string | number,
    callback: NeighborReducer<T, NodeAttributes>,
    initialValue: T
  ): T;
  reduceUndirectedNeighbors<T>(
    node: string | number,
    callback: NeighborReducer<T, NodeAttributes>,
    initialValue: T
  ): T;
  reduceDirectedNeighbors<T>(
    node: string | number,
    callback: NeighborReducer<T, NodeAttributes>,
    initialValue: T
  ): T;
  reduceInNeighbors<T>(
    node: string | number,
    callback: NeighborReducer<T, NodeAttributes>,
    initialValue: T
  ): T;
  reduceOutNeighbors<T>(
    node: string | number,
    callback: NeighborReducer<T, NodeAttributes>,
    initialValue: T
  ): T;
  reduceInboundNeighbors<T>(
    node: string | number,
    callback: NeighborReducer<T, NodeAttributes>,
    initialValue: T
  ): T;
  reduceOutboundNeighbors<T>(
    node: string | number,
    callback: NeighborReducer<T, NodeAttributes>,
    initialValue: T
  ): T;

  findNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): string | undefined;
  findUndirectedNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): string | undefined;
  findDirectedNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): string | undefined;
  findInNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): string | undefined;
  findOutNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): string | undefined;
  findInboundNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): string | undefined;
  findOutboundNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): string | undefined;

  someNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  someUndirectedNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  someDirectedNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  someInNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  someOutNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  someInboundNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  someOutboundNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;

  everyNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  everyUndirectedNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  everyDirectedNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  everyInNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  everyOutNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  everyInboundNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  everyOutboundNeighbor(
    node: string | number,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;

  neighborEntries(
    node: string | number
  ): IterableIterator<NeighborEntry<NodeAttributes>>;
  undirectedNeighborEntries(
    node: string | number
  ): IterableIterator<NeighborEntry<NodeAttributes>>;
  directedNeighborEntries(
    node: string | number
  ): IterableIterator<NeighborEntry<NodeAttributes>>;
  inNeighborEntries(
    node: string | number
  ): IterableIterator<NeighborEntry<NodeAttributes>>;
  outNeighborEntries(
    node: string | number
  ): IterableIterator<NeighborEntry<NodeAttributes>>;
  inboundNeighborEntries(
    node: string | number
  ): IterableIterator<NeighborEntry<NodeAttributes>>;
  outboundNeighborEntries(
    node: string | number
  ): IterableIterator<NeighborEntry<NodeAttributes>>;

  // Serialization methods
  export(): SerializedGraph<NodeAttributes, EdgeAttributes, GraphAttributes>;
  import(
    data: Partial<
      SerializedGraph<NodeAttributes, EdgeAttributes, GraphAttributes>
    >,
    merge?: boolean
  ): this;
  import(
    graph: AbstractGraph<NodeAttributes, EdgeAttributes, GraphAttributes>,
    merge?: boolean
  ): this;

  // Utils
  nullCopy(
    options?: Partial<GraphOptions>
  ): AbstractGraph<NodeAttributes, EdgeAttributes, GraphAttributes>;
  emptyCopy(
    options?: Partial<GraphOptions>
  ): AbstractGraph<NodeAttributes, EdgeAttributes, GraphAttributes>;
  copy(
    options?: Partial<GraphOptions>
  ): AbstractGraph<NodeAttributes, EdgeAttributes, GraphAttributes>;

  // Well-known methods
  toJSON(): SerializedGraph<NodeAttributes, EdgeAttributes, GraphAttributes>;
  toString(): string;
  inspect(): any;

  static from<
    NA extends Attributes = Attributes,
    EA extends Attributes = Attributes,
    GA extends Attributes = Attributes
  >(
    data: SerializedGraph<NA, EA, GA> | AbstractGraph<NA, EA, GA>,
    options?: GraphOptions
  ): AbstractGraph<NA, EA, GA>;
}

interface GraphConstructor<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
> {
  new (options?: GraphOptions): AbstractGraph<
    NodeAttributes,
    EdgeAttributes,
    GraphAttributes
  >;
}

export {
  AbstractGraph,
  GraphConstructor,
  Attributes,
  GraphType,
  GraphOptions,
  GraphEvents,
  AdjacencyEntry,
  NodeEntry,
  NodeMergeResult,
  NeighborEntry,
  EdgeEntry,
  EdgeMergeResult,
  AdjacencyIterationCallback,
  AdjacencyIterationCallbackWithOrphans,
  NodeIterationCallback,
  NodePredicate,
  NodeMapper,
  NodeReducer,
  NeighborIterationCallback,
  NeighborPredicate,
  NeighborMapper,
  NeighborReducer,
  EdgeIterationCallback,
  EdgePredicate,
  EdgeMapper,
  EdgeReducer,
  SerializedNode,
  SerializedEdge,
  SerializedGraph,
  AttributeUpdateType,
  AttributeUpdatePayload
};

export default AbstractGraph;
