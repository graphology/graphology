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
  hasNode(node: string): boolean;
  hasDirectedEdge(edge: string): boolean;
  hasDirectedEdge(source: string, target: string): boolean;
  hasUndirectedEdge(edge: string): boolean;
  hasUndirectedEdge(source: string, target: string): boolean;
  hasEdge(edge: string): boolean;
  hasEdge(source: string, target: string): boolean;
  directedEdge(source: string, target: string): string | undefined;
  undirectedEdge(source: string, target: string): string | undefined;
  edge(source: string, target: string): string | undefined;
  inDegree(node: string): number;
  outDegree(node: string): number;
  inboundDegree(node: string): number;
  outboundDegree(node: string): number;
  directedDegree(node: string): number;
  undirectedDegree(node: string): number;
  degree(node: string): number;
  inDegreeWithoutSelfLoops(node: string): number;
  outDegreeWithoutSelfLoops(node: string): number;
  inboundDegreeWithoutSelfLoops(node: string): number;
  outboundDegreeWithoutSelfLoops(node: string): number;
  directedDegreeWithoutSelfLoops(node: string): number;
  undirectedDegreeWithoutSelfLoops(node: string): number;
  degreeWithoutSelfLoops(node: string): number;
  source(edge: string): string;
  target(edge: string): string;
  extremities(edge: string): [string, string];
  opposite(node: string, edge: string): string;
  isUndirected(edge: string): boolean;
  isDirected(edge: string): boolean;
  isSelfLoop(edge: string): boolean;
  hasExtremity(edge: string, node: string): boolean;
  areNeighbors(source: string, target: string): boolean;
  areUndirectedNeighbors(source: string, target: string): boolean;
  areDirectedNeighbors(source: string, target: string): boolean;
  areInNeighbors(source: string, target: string): boolean;
  areOutNeighbors(source: string, target: string): boolean;
  areInboundNeighbors(source: string, target: string): boolean;
  areOutboundNeighbors(source: string, target: string): boolean;

  // Mutation methods
  addNode(node: string, attributes?: NodeAttributes): string;
  mergeNode(
    node: string,
    attributes?: Partial<NodeAttributes>
  ): NodeMergeResult;
  updateNode(
    node: string,
    updater?: (attributes: Partial<NodeAttributes>) => NodeAttributes
  ): NodeMergeResult;
  addEdge(
    source: string,
    target: string,
    attributes?: EdgeAttributes
  ): string;
  mergeEdge(
    source: string,
    target: string,
    attributes?: Partial<EdgeAttributes>
  ): EdgeMergeResult;
  updateEdge(
    source: string,
    target: string,
    updater?: (attributes: Partial<EdgeAttributes>) => EdgeAttributes
  ): EdgeMergeResult;
  addDirectedEdge(
    source: string,
    target: string,
    attributes?: EdgeAttributes
  ): string;
  mergeDirectedEdge(
    source: string,
    target: string,
    attributes?: Partial<EdgeAttributes>
  ): EdgeMergeResult;
  updateDirectedEdge(
    source: string,
    target: string,
    updater?: (attributes: Partial<EdgeAttributes>) => EdgeAttributes
  ): EdgeMergeResult;
  addUndirectedEdge(
    source: string,
    target: string,
    attributes?: EdgeAttributes
  ): string;
  mergeUndirectedEdge(
    source: string,
    target: string,
    attributes?: Partial<EdgeAttributes>
  ): EdgeMergeResult;
  updateUndirectedEdge(
    source: string,
    target: string,
    updater?: (attributes: Partial<EdgeAttributes>) => EdgeAttributes
  ): EdgeMergeResult;
  addEdgeWithKey(
    edge: string,
    source: string,
    target: string,
    attributes?: EdgeAttributes
  ): string;
  mergeEdgeWithKey(
    edge: string,
    source: string,
    target: string,
    attributes?: Partial<EdgeAttributes>
  ): EdgeMergeResult;
  updateEdgeWithKey(
    edge: string,
    source: string,
    target: string,
    updater?: (attributes: Partial<EdgeAttributes>) => EdgeAttributes
  ): EdgeMergeResult;
  addDirectedEdgeWithKey(
    edge: string,
    source: string,
    target: string,
    attributes?: EdgeAttributes
  ): string;
  mergeDirectedEdgeWithKey(
    edge: string,
    source: string,
    target: string,
    attributes?: Partial<EdgeAttributes>
  ): EdgeMergeResult;
  updateDirectedEdgeWithKey(
    edge: string,
    source: string,
    target: string,
    updater?: (attributes: Partial<EdgeAttributes>) => EdgeAttributes
  ): EdgeMergeResult;
  addUndirectedEdgeWithKey(
    edge: string,
    source: string,
    target: string,
    attributes?: EdgeAttributes
  ): string;
  mergeUndirectedEdgeWithKey(
    edge: string,
    source: string,
    target: string,
    attributes?: Partial<EdgeAttributes>
  ): EdgeMergeResult;
  updateUndirectedEdgeWithKey(
    edge: string,
    source: string,
    target: string,
    updater?: (attributes: Partial<EdgeAttributes>) => EdgeAttributes
  ): EdgeMergeResult;
  dropNode(node: string): void;
  dropEdge(edge: string): void;
  dropEdge(source: string, target: string): void;
  dropDirectedEdge(source: string, target: string): void;
  dropUndirectedEdge(source: string, target: string): void;
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
    node: string,
    name: AttributeName
  ): NodeAttributes[AttributeName];
  getNodeAttributes(node: string): NodeAttributes;
  hasNodeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string,
    name: AttributeName
  ): boolean;
  setNodeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string,
    name: AttributeName,
    value: NodeAttributes[AttributeName]
  ): this;
  updateNodeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string,
    name: AttributeName,
    updater: (
      value: NodeAttributes[AttributeName] | undefined
    ) => NodeAttributes[AttributeName]
  ): this;
  removeNodeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string,
    name: AttributeName
  ): this;
  replaceNodeAttributes(node: string, attributes: NodeAttributes): this;
  mergeNodeAttributes(node: string, attributes: Partial<NodeAttributes>): this;
  updateNodeAttributes(
    node: string,
    updater: (attributes: NodeAttributes) => NodeAttributes
  ): this;

  getSourceAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string,
    name: AttributeName
  ): NodeAttributes[AttributeName];
  getSourceAttributes(edge: string): NodeAttributes;
  hasSourceAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string,
    name: AttributeName
  ): boolean;
  setSourceAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string,
    name: AttributeName,
    value: NodeAttributes[AttributeName]
  ): this;
  updateSourceAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string,
    name: AttributeName,
    updater: (
      value: NodeAttributes[AttributeName] | undefined
    ) => NodeAttributes[AttributeName]
  ): this;
  removeSourceAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string,
    name: AttributeName
  ): this;
  replaceSourceAttributes(edge: string, attributes: NodeAttributes): this;
  mergeSourceAttributes(
    edge: string,
    attributes: Partial<NodeAttributes>
  ): this;
  updateSourceAttributes(
    edge: string,
    updater: (attributes: NodeAttributes) => NodeAttributes
  ): this;

  getTargetAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string,
    name: AttributeName
  ): NodeAttributes[AttributeName];
  getTargetAttributes(edge: string): NodeAttributes;
  hasTargetAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string,
    name: AttributeName
  ): boolean;
  setTargetAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string,
    name: AttributeName,
    value: NodeAttributes[AttributeName]
  ): this;
  updateTargetAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string,
    name: AttributeName,
    updater: (
      value: NodeAttributes[AttributeName] | undefined
    ) => NodeAttributes[AttributeName]
  ): this;
  removeTargetAttribute<AttributeName extends keyof NodeAttributes>(
    edge: string,
    name: AttributeName
  ): this;
  replaceTargetAttributes(edge: string, attributes: NodeAttributes): this;
  mergeTargetAttributes(
    edge: string,
    attributes: Partial<NodeAttributes>
  ): this;
  updateTargetAttributes(
    edge: string,
    updater: (attributes: NodeAttributes) => NodeAttributes
  ): this;

  getOppositeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string,
    edge: string,
    name: AttributeName
  ): NodeAttributes[AttributeName];
  getOppositeAttributes(node: string): NodeAttributes;
  hasOppositeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string,
    edge: string,
    name: AttributeName
  ): boolean;
  setOppositeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string,
    edge: string,
    name: AttributeName,
    value: NodeAttributes[AttributeName]
  ): this;
  updateOppositeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string,
    edge: string,
    name: AttributeName,
    updater: (
      value: NodeAttributes[AttributeName] | undefined
    ) => NodeAttributes[AttributeName]
  ): this;
  removeOppositeAttribute<AttributeName extends keyof NodeAttributes>(
    node: string,
    edge: string,
    name: AttributeName
  ): this;
  replaceOppositeAttributes(
    node: string,
    edge: string,
    attributes: NodeAttributes
  ): this;
  mergeOppositeAttributes(
    node: string,
    edge: string,
    attributes: Partial<NodeAttributes>
  ): this;
  updateOppositeAttributes(
    node: string,
    edge: string,
    updater: (attributes: NodeAttributes) => NodeAttributes
  ): this;

  updateEachNodeAttributes(
    updater: NodeMapper<NodeAttributes, NodeAttributes>,
    hints?: UpdateHints<NodeAttributes>
  ): void;

  // Edge attribute methods
  getEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: string,
    name: AttributeName
  ): EdgeAttributes[AttributeName];
  getEdgeAttributes(edge: string): EdgeAttributes;
  hasEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: string,
    name: AttributeName
  ): boolean;
  setEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: string,
    name: AttributeName,
    value: EdgeAttributes[AttributeName]
  ): this;
  updateEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: string,
    name: AttributeName,
    updater: (
      value: EdgeAttributes[AttributeName] | undefined
    ) => EdgeAttributes[AttributeName]
  ): this;
  removeEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: string,
    name: AttributeName
  ): this;
  replaceEdgeAttributes(edge: string, attributes: EdgeAttributes): this;
  mergeEdgeAttributes(edge: string, attributes: Partial<EdgeAttributes>): this;
  updateEdgeAttributes(
    edge: string,
    updater: (attributes: EdgeAttributes) => EdgeAttributes
  ): this;

  updateEachEdgeAttributes(
    updater: EdgeMapper<EdgeAttributes, NodeAttributes, EdgeAttributes>,
    hints?: UpdateHints<EdgeAttributes>
  ): void;

  // Edge attribute methods (source, target)
  getEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string,
    target: string,
    name: AttributeName
  ): EdgeAttributes[AttributeName];
  getEdgeAttributes(source: string, target: string): EdgeAttributes;
  hasEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string,
    target: string,
    name: AttributeName
  ): boolean;
  setEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string,
    target: string,
    name: AttributeName,
    value: EdgeAttributes[AttributeName]
  ): this;
  updateEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string,
    target: string,
    name: AttributeName,
    updater: (
      value: EdgeAttributes[AttributeName] | undefined
    ) => EdgeAttributes[AttributeName]
  ): this;
  removeEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string,
    target: string,
    name: AttributeName
  ): this;
  replaceEdgeAttributes(
    source: string,
    target: string,
    attributes: EdgeAttributes
  ): this;
  mergeEdgeAttributes(
    source: string,
    target: string,
    attributes: Partial<EdgeAttributes>
  ): this;
  updateEdgeAttributes(
    source: string,
    target: string,
    updater: (attributes: EdgeAttributes) => EdgeAttributes
  ): this;

  getDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string,
    target: string,
    name: AttributeName
  ): EdgeAttributes[AttributeName];
  getDirectedEdgeAttributes(source: string, target: string): EdgeAttributes;
  hasDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string,
    target: string,
    name: AttributeName
  ): boolean;
  setDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string,
    target: string,
    name: AttributeName,
    value: EdgeAttributes[AttributeName]
  ): this;
  updateDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string,
    target: string,
    name: AttributeName,
    updater: (
      value: EdgeAttributes[AttributeName] | undefined
    ) => EdgeAttributes[AttributeName]
  ): this;
  removeDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string,
    target: string,
    name: AttributeName
  ): this;
  replaceDirectedEdgeAttributes(
    source: string,
    target: string,
    attributes: EdgeAttributes
  ): this;
  mergeDirectedEdgeAttributes(
    source: string,
    target: string,
    attributes: Partial<EdgeAttributes>
  ): this;
  updateDirectedEdgeAttributes(
    source: string,
    target: string,
    updater: (attributes: EdgeAttributes) => EdgeAttributes
  ): this;

  getUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string,
    target: string,
    name: AttributeName
  ): EdgeAttributes[AttributeName];
  getUndirectedEdgeAttributes(source: string, target: string): EdgeAttributes;
  hasUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string,
    target: string,
    name: AttributeName
  ): boolean;
  setUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string,
    target: string,
    name: AttributeName,
    value: EdgeAttributes[AttributeName]
  ): this;
  updateUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string,
    target: string,
    name: AttributeName,
    updater: (
      value: EdgeAttributes[AttributeName] | undefined
    ) => EdgeAttributes[AttributeName]
  ): this;
  removeUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: string,
    target: string,
    name: AttributeName
  ): this;
  replaceUndirectedEdgeAttributes(
    source: string,
    target: string,
    attributes: EdgeAttributes
  ): this;
  mergeUndirectedEdgeAttributes(
    source: string,
    target: string,
    attributes: Partial<EdgeAttributes>
  ): this;
  updateUndirectedEdgeAttributes(
    source: string,
    target: string,
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
  edges(node: string): Array<string>;
  edges(source: string, target: string): Array<string>;
  undirectedEdges(): Array<string>;
  undirectedEdges(node: string): Array<string>;
  undirectedEdges(source: string, target: string): Array<string>;
  directedEdges(): Array<string>;
  directedEdges(node: string): Array<string>;
  directedEdges(source: string, target: string): Array<string>;
  inEdges(): Array<string>;
  inEdges(node: string): Array<string>;
  inEdges(source: string, target: string): Array<string>;
  outEdges(): Array<string>;
  outEdges(node: string): Array<string>;
  outEdges(source: string, target: string): Array<string>;
  inboundEdges(): Array<string>;
  inboundEdges(node: string): Array<string>;
  inboundEdges(source: string, target: string): Array<string>;
  outboundEdges(): Array<string>;
  outboundEdges(node: string): Array<string>;
  outboundEdges(source: string, target: string): Array<string>;

  forEachEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachEdge(
    node: string,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachEdge(
    source: string,
    target: string,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachUndirectedEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachUndirectedEdge(
    node: string,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachUndirectedEdge(
    source: string,
    target: string,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachDirectedEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachDirectedEdge(
    node: string,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachDirectedEdge(
    source: string,
    target: string,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInEdge(
    node: string,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInEdge(
    source: string,
    target: string,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutEdge(
    node: string,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutEdge(
    source: string,
    target: string,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInboundEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInboundEdge(
    node: string,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInboundEdge(
    source: string,
    target: string,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutboundEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutboundEdge(
    node: string,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutboundEdge(
    source: string,
    target: string,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;

  mapEdges<T>(
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapEdges<T>(
    node: string,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapEdges<T>(
    source: string,
    target: string,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapUndirectedEdges<T>(
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapUndirectedEdges<T>(
    node: string,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapUndirectedEdges<T>(
    source: string,
    target: string,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapDirectedEdges<T>(
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapDirectedEdges<T>(
    node: string,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapDirectedEdges<T>(
    source: string,
    target: string,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapInEdges<T>(
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapInEdges<T>(
    node: string,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapInEdges<T>(
    source: string,
    target: string,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapOutEdges<T>(
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapOutEdges<T>(
    node: string,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapOutEdges<T>(
    source: string,
    target: string,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapInboundEdges<T>(
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapInboundEdges<T>(
    node: string,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapInboundEdges<T>(
    source: string,
    target: string,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapOutboundEdges<T>(
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapOutboundEdges<T>(
    node: string,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;
  mapOutboundEdges<T>(
    source: string,
    target: string,
    callback: EdgeMapper<T, NodeAttributes, EdgeAttributes>
  ): Array<T>;

  filterEdges(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterEdges(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterEdges(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterUndirectedEdges(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterUndirectedEdges(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterUndirectedEdges(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterDirectedEdges(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterDirectedEdges(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterDirectedEdges(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterInEdges(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterInEdges(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterInEdges(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterOutEdges(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterOutEdges(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterOutEdges(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterInboundEdges(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterInboundEdges(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterInboundEdges(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterOutboundEdges(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterOutboundEdges(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;
  filterOutboundEdges(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): Array<string>;

  reduceEdges<T>(
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceEdges<T>(
    node: string,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceEdges<T>(
    source: string,
    target: string,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceUndirectedEdges<T>(
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceUndirectedEdges<T>(
    node: string,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceUndirectedEdges<T>(
    source: string,
    target: string,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceDirectedEdges<T>(
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceDirectedEdges<T>(
    node: string,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceDirectedEdges<T>(
    source: string,
    target: string,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceInEdges<T>(
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceInEdges<T>(
    node: string,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceInEdges<T>(
    source: string,
    target: string,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceOutEdges<T>(
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceOutEdges<T>(
    node: string,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceOutEdges<T>(
    source: string,
    target: string,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceInboundEdges<T>(
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceInboundEdges<T>(
    node: string,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceInboundEdges<T>(
    source: string,
    target: string,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceOutboundEdges<T>(
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceOutboundEdges<T>(
    node: string,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;
  reduceOutboundEdges<T>(
    source: string,
    target: string,
    callback: EdgeReducer<T, NodeAttributes, EdgeAttributes>,
    initialValue: T
  ): T;

  findEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findUndirectedEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findUndirectedEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findUndirectedEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findDirectedEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findDirectedEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findDirectedEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInboundEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInboundEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInboundEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutboundEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutboundEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutboundEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;

  someEdge(callback: EdgePredicate<NodeAttributes, EdgeAttributes>): boolean;
  someEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someUndirectedEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someUndirectedEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someUndirectedEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someDirectedEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someDirectedEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someDirectedEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someInEdge(callback: EdgePredicate<NodeAttributes, EdgeAttributes>): boolean;
  someInEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someInEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someOutEdge(callback: EdgePredicate<NodeAttributes, EdgeAttributes>): boolean;
  someOutEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someOutEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someInboundEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someInboundEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someInboundEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someOutboundEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someOutboundEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  someOutboundEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;

  everyEdge(callback: EdgePredicate<NodeAttributes, EdgeAttributes>): boolean;
  everyEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyUndirectedEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyUndirectedEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyUndirectedEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyDirectedEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyDirectedEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyDirectedEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyInEdge(callback: EdgePredicate<NodeAttributes, EdgeAttributes>): boolean;
  everyInEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyInEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyOutEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyOutEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyOutEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyInboundEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyInboundEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyInboundEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyOutboundEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyOutboundEdge(
    node: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;
  everyOutboundEdge(
    source: string,
    target: string,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): boolean;

  edgeEntries(): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  edgeEntries(
    node: string
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  edgeEntries(
    source: string,
    target: string
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  undirectedEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  undirectedEdgeEntries(
    node: string
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  undirectedEdgeEntries(
    source: string,
    target: string
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  directedEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  directedEdgeEntries(
    node: string
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  directedEdgeEntries(
    source: string,
    target: string
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inEdgeEntries(): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inEdgeEntries(
    node: string
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inEdgeEntries(
    source: string,
    target: string
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outEdgeEntries(): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outEdgeEntries(
    node: string
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outEdgeEntries(
    source: string,
    target: string
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inboundEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  inboundEdgeEntries(
    node: string
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inboundEdgeEntries(
    source: string,
    target: string
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outboundEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  outboundEdgeEntries(
    node: string
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outboundEdgeEntries(
    source: string,
    target: string
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;

  neighbors(node: string): Array<string>;
  undirectedNeighbors(node: string): Array<string>;
  directedNeighbors(node: string): Array<string>;
  inNeighbors(node: string): Array<string>;
  outNeighbors(node: string): Array<string>;
  inboundNeighbors(node: string): Array<string>;
  outboundNeighbors(node: string): Array<string>;

  forEachNeighbor(
    node: string,
    callback: NeighborIterationCallback<NodeAttributes>
  ): void;
  forEachUndirectedNeighbor(
    node: string,
    callback: NeighborIterationCallback<NodeAttributes>
  ): void;
  forEachDirectedNeighbor(
    node: string,
    callback: NeighborIterationCallback<NodeAttributes>
  ): void;
  forEachInNeighbor(
    node: string,
    callback: NeighborIterationCallback<NodeAttributes>
  ): void;
  forEachOutNeighbor(
    node: string,
    callback: NeighborIterationCallback<NodeAttributes>
  ): void;
  forEachInboundNeighbor(
    node: string,
    callback: NeighborIterationCallback<NodeAttributes>
  ): void;
  forEachOutboundNeighbor(
    node: string,
    callback: NeighborIterationCallback<NodeAttributes>
  ): void;

  mapNeighbors<T>(
    node: string,
    callback: NeighborMapper<T, NodeAttributes>
  ): Array<T>;
  mapUndirectedNeighbors<T>(
    node: string,
    callback: NeighborMapper<T, NodeAttributes>
  ): Array<T>;
  mapDirectedNeighbors<T>(
    node: string,
    callback: NeighborMapper<T, NodeAttributes>
  ): Array<T>;
  mapInNeighbors<T>(
    node: string,
    callback: NeighborMapper<T, NodeAttributes>
  ): Array<T>;
  mapOutNeighbors<T>(
    node: string,
    callback: NeighborMapper<T, NodeAttributes>
  ): Array<T>;
  mapInboundNeighbors<T>(
    node: string,
    callback: NeighborMapper<T, NodeAttributes>
  ): Array<T>;
  mapOutboundNeighbors<T>(
    node: string,
    callback: NeighborMapper<T, NodeAttributes>
  ): Array<T>;

  filterNeighbors(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): Array<string>;
  filterUndirectedNeighbors(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): Array<string>;
  filterDirectedNeighbors(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): Array<string>;
  filterInNeighbors(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): Array<string>;
  filterOutNeighbors(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): Array<string>;
  filterInboundNeighbors(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): Array<string>;
  filterOutboundNeighbors(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): Array<string>;

  reduceNeighbors<T>(
    node: string,
    callback: NeighborReducer<T, NodeAttributes>,
    initialValue: T
  ): T;
  reduceUndirectedNeighbors<T>(
    node: string,
    callback: NeighborReducer<T, NodeAttributes>,
    initialValue: T
  ): T;
  reduceDirectedNeighbors<T>(
    node: string,
    callback: NeighborReducer<T, NodeAttributes>,
    initialValue: T
  ): T;
  reduceInNeighbors<T>(
    node: string,
    callback: NeighborReducer<T, NodeAttributes>,
    initialValue: T
  ): T;
  reduceOutNeighbors<T>(
    node: string,
    callback: NeighborReducer<T, NodeAttributes>,
    initialValue: T
  ): T;
  reduceInboundNeighbors<T>(
    node: string,
    callback: NeighborReducer<T, NodeAttributes>,
    initialValue: T
  ): T;
  reduceOutboundNeighbors<T>(
    node: string,
    callback: NeighborReducer<T, NodeAttributes>,
    initialValue: T
  ): T;

  findNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): string | undefined;
  findUndirectedNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): string | undefined;
  findDirectedNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): string | undefined;
  findInNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): string | undefined;
  findOutNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): string | undefined;
  findInboundNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): string | undefined;
  findOutboundNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): string | undefined;

  someNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  someUndirectedNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  someDirectedNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  someInNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  someOutNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  someInboundNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  someOutboundNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;

  everyNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  everyUndirectedNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  everyDirectedNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  everyInNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  everyOutNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  everyInboundNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;
  everyOutboundNeighbor(
    node: string,
    callback: NeighborPredicate<NodeAttributes>
  ): boolean;

  neighborEntries(
    node: string
  ): IterableIterator<NeighborEntry<NodeAttributes>>;
  undirectedNeighborEntries(
    node: string
  ): IterableIterator<NeighborEntry<NodeAttributes>>;
  directedNeighborEntries(
    node: string
  ): IterableIterator<NeighborEntry<NodeAttributes>>;
  inNeighborEntries(
    node: string
  ): IterableIterator<NeighborEntry<NodeAttributes>>;
  outNeighborEntries(
    node: string
  ): IterableIterator<NeighborEntry<NodeAttributes>>;
  inboundNeighborEntries(
    node: string
  ): IterableIterator<NeighborEntry<NodeAttributes>>;
  outboundNeighborEntries(
    node: string
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
