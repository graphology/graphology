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

type UpdateHints = {attributes?: Array<string>};

type GraphOptions = {
  allowSelfLoops?: boolean;
  multi?: boolean;
  type?: GraphType;
};

type AdjacencyEntry<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = [
  source: string,
  target: string,
  sourceAttributes: NodeAttributes,
  targetAttributes: NodeAttributes,
  edge: string,
  edgeAttributes: EdgeAttributes,
  undirected: boolean
];

type NodeEntry<NodeAttributes extends Attributes = Attributes> = [
  node: string,
  attributes: NodeAttributes
];

type EdgeEntry<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = [
  edge: string,
  attributes: EdgeAttributes,
  source: string,
  target: string,
  sourceAttributes: NodeAttributes,
  targetAttributes: NodeAttributes,
  undirected: boolean
];

type AdjacencyIterationCallback<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = (
  source: string,
  target: string,
  sourceAttributes: NodeAttributes,
  targetAttributes: NodeAttributes,
  edge: string,
  edgeAttributes: EdgeAttributes,
  undirected: boolean
) => void;

type AdjacencyPredicate<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = (
  source: string,
  target: string,
  sourceAttributes: NodeAttributes,
  targetAttributes: NodeAttributes,
  edge: string,
  edgeAttributes: EdgeAttributes,
  undirected: boolean
) => boolean | void;

type NodeIterationCallback<NodeAttributes extends Attributes = Attributes> = (
  node: string,
  attributes: NodeAttributes
) => void;

type NodePredicate<NodeAttributes extends Attributes = Attributes> = (
  node: string,
  attributes: NodeAttributes
) => boolean | void;

type NodeUpdateIterationCallback<
  NodeAttributes extends Attributes = Attributes
> = (node: string, attributes: NodeAttributes) => NodeAttributes;

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

type EdgeUpdateIterationCallback<
  EdgeAttributes extends Attributes = Attributes
> = (edge: string, attributes: EdgeAttributes) => EdgeAttributes;

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

type AttributeUpdateTypes = 'set' | 'remove' | 'replace' | 'merge';

interface GraphEvents<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
> {
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
  attributesUpdated(payload: {
    type: AttributeUpdateTypes;
    attributes: GraphAttributes;
    name: string;
    data: GraphAttributes;
  }): void;
  nodeAttributesUpdated(payload: {
    type: AttributeUpdateTypes;
    key: string;
    attributes: NodeAttributes;
    name: string;
    data: NodeAttributes;
  }): void;
  edgeAttributesUpdated(payload: {
    type: AttributeUpdateTypes;
    key: string;
    attributes: EdgeAttributes;
    name: string;
    data: EdgeAttributes;
  }): void;
  eachNodeAttributesUpdated(payload: {hints: UpdateHints}): void;
  eachEdgeAttributesUpdated(payload: {hints: UpdateHints}): void;
}

declare class EventEmitter<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
> {
  static listenerCount(emitter: EventEmitter, type: string | number): number;
  static defaultMaxListeners: number;

  eventNames(): Array<string | number>;
  setMaxListeners(n: number): this;
  getMaxListeners(): number;
  emit(type: string | number, ...args: any[]): boolean;
  addListener<
    Event extends keyof GraphEvents<
      NodeAttributes,
      EdgeAttributes,
      GraphAttributes
    >
  >(
    type: Event,
    listener: GraphEvents<
      NodeAttributes,
      EdgeAttributes,
      GraphAttributes
    >[Event]
  ): this;
  addListener(type: string | number, listener: Listener): this;
  on<
    Event extends keyof GraphEvents<
      NodeAttributes,
      EdgeAttributes,
      GraphAttributes
    >
  >(
    type: Event,
    listener: GraphEvents<
      NodeAttributes,
      EdgeAttributes,
      GraphAttributes
    >[Event]
  ): this;
  on(type: string | number, listener: Listener): this;
  once<
    Event extends keyof GraphEvents<
      NodeAttributes,
      EdgeAttributes,
      GraphAttributes
    >
  >(
    type: Event,
    listener: GraphEvents<
      NodeAttributes,
      EdgeAttributes,
      GraphAttributes
    >[Event]
  ): this;
  once(type: string | number, listener: Listener): this;
  prependListener<
    Event extends keyof GraphEvents<
      NodeAttributes,
      EdgeAttributes,
      GraphAttributes
    >
  >(
    type: Event,
    listener: GraphEvents<
      NodeAttributes,
      EdgeAttributes,
      GraphAttributes
    >[Event]
  ): this;
  prependListener(type: string | number, listener: Listener): this;
  prependOnceListener<
    Event extends keyof GraphEvents<
      NodeAttributes,
      EdgeAttributes,
      GraphAttributes
    >
  >(
    type: Event,
    listener: GraphEvents<
      NodeAttributes,
      EdgeAttributes,
      GraphAttributes
    >[Event]
  ): this;
  prependOnceListener(type: string | number, listener: Listener): this;
  removeListener<
    Event extends keyof GraphEvents<
      NodeAttributes,
      EdgeAttributes,
      GraphAttributes
    >
  >(
    type: Event,
    listener: GraphEvents<
      NodeAttributes,
      EdgeAttributes,
      GraphAttributes
    >[Event]
  ): this;
  removeListener(type: string | number, listener: Listener): this;
  off<
    Event extends keyof GraphEvents<
      NodeAttributes,
      EdgeAttributes,
      GraphAttributes
    >
  >(
    type: Event,
    listener: GraphEvents<
      NodeAttributes,
      EdgeAttributes,
      GraphAttributes
    >[Event]
  ): this;
  off(type: string | number, listener: Listener): this;
  removeAllListeners<
    Event extends keyof GraphEvents<
      NodeAttributes,
      EdgeAttributes,
      GraphAttributes
    >
  >(type?: Event): this;
  removeAllListeners(type?: string | number): this;
  listeners(type: string | number): Listener[];
  listenerCount(type: string | number): number;
  rawListeners(type: string | number): Listener[];
}

/**
 * Main interface.
 */
declare abstract class AbstractGraph<
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes,
    GraphAttributes extends Attributes = Attributes
  >
  extends EventEmitter<NodeAttributes, EdgeAttributes, GraphAttributes>
  implements Iterable<AdjacencyEntry<NodeAttributes, EdgeAttributes>>
{
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
  hasNode(node: unknown): boolean;
  hasDirectedEdge(edge: unknown): boolean;
  hasDirectedEdge(source: unknown, target: unknown): boolean;
  hasUndirectedEdge(edge: unknown): boolean;
  hasUndirectedEdge(source: unknown, target: unknown): boolean;
  hasEdge(edge: unknown): boolean;
  hasEdge(source: unknown, target: unknown): boolean;
  directedEdge(source: unknown, target: unknown): string | undefined;
  undirectedEdge(source: unknown, target: unknown): string | undefined;
  edge(source: unknown, target: unknown): string | undefined;
  inDegree(node: unknown, selfLoops?: boolean): number;
  outDegree(node: unknown, selfLoops?: boolean): number;
  directedDegree(node: unknown, selfLoops?: boolean): number;
  undirectedDegree(node: unknown, selfLoops?: boolean): number;
  degree(node: unknown, selfLoops?: boolean): number;
  source(edge: unknown): string;
  target(edge: unknown): string;
  extremities(edge: unknown): [string, string];
  opposite(node: unknown, edge: unknown): string;
  isUndirected(edge: unknown): boolean;
  isDirected(edge: unknown): boolean;
  isSelfLoop(edge: unknown): boolean;
  hasExtremity(edge: unknown, node: unknown): boolean;
  neighbors(source: unknown, target: unknown): boolean;
  undirectedNeighbors(source: unknown, target: unknown): boolean;
  directedNeighbors(source: unknown, target: unknown): boolean;
  inNeighbors(source: unknown, target: unknown): boolean;
  outNeighbors(source: unknown, target: unknown): boolean;
  inboundNeighbors(source: unknown, target: unknown): boolean;
  outboundNeighbors(source: unknown, target: unknown): boolean;

  // Mutation methods
  addNode(node: unknown, attributes?: NodeAttributes): string;
  mergeNode(node: unknown, attributes?: Partial<NodeAttributes>): string;
  updateNode(
    node: unknown,
    updater?: (attributes: NodeAttributes) => NodeAttributes
  ): string;
  addEdge(
    source: unknown,
    target: unknown,
    attributes?: EdgeAttributes
  ): string;
  mergeEdge(
    source: unknown,
    target: unknown,
    attributes?: Partial<EdgeAttributes>
  ): string;
  updateEdge(
    source: unknown,
    target: unknown,
    updater?: (attributes: EdgeAttributes) => EdgeAttributes
  ): string;
  addDirectedEdge(
    source: unknown,
    target: unknown,
    attributes?: EdgeAttributes
  ): string;
  mergeDirectedEdge(
    source: unknown,
    target: unknown,
    attributes?: Partial<EdgeAttributes>
  ): string;
  updateDirectedEdge(
    source: unknown,
    target: unknown,
    updater?: (attributes: EdgeAttributes) => EdgeAttributes
  ): string;
  addUndirectedEdge(
    source: unknown,
    target: unknown,
    attributes?: EdgeAttributes
  ): string;
  mergeUndirectedEdge(
    source: unknown,
    target: unknown,
    attributes?: Partial<EdgeAttributes>
  ): string;
  updateUndirectedEdge(
    source: unknown,
    target: unknown,
    updater?: (attributes: EdgeAttributes) => EdgeAttributes
  ): string;
  addEdgeWithKey(
    edge: unknown,
    source: unknown,
    target: unknown,
    attributes?: EdgeAttributes
  ): string;
  mergeEdgeWithKey(
    edge: unknown,
    source: unknown,
    target: unknown,
    attributes?: Partial<EdgeAttributes>
  ): string;
  updateEdgeWithKey(
    source: unknown,
    target: unknown,
    updater?: (attributes: EdgeAttributes) => EdgeAttributes
  ): string;
  addDirectedEdgeWithKey(
    edge: unknown,
    source: unknown,
    target: unknown,
    attributes?: EdgeAttributes
  ): string;
  mergeDirectedEdgeWithKey(
    edge: unknown,
    source: unknown,
    target: unknown,
    attributes?: Partial<EdgeAttributes>
  ): string;
  updateDirectedEdgeWithKey(
    source: unknown,
    target: unknown,
    updater?: (attributes: EdgeAttributes) => EdgeAttributes
  ): string;
  addUndirectedEdgeWithKey(
    edge: unknown,
    source: unknown,
    target: unknown,
    attributes?: EdgeAttributes
  ): string;
  mergeUndirectedEdgeWithKey(
    edge: unknown,
    source: unknown,
    target: unknown,
    attributes?: Partial<EdgeAttributes>
  ): string;
  updateUndirectedEdgeWithKey(
    source: unknown,
    target: unknown,
    updater?: (attributes: EdgeAttributes) => EdgeAttributes
  ): string;
  dropNode(node: unknown): void;
  dropEdge(edge: unknown): void;
  dropEdge(source: unknown, target: unknown): void;
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

  // Node attribute methods
  getNodeAttribute<AttributeName extends keyof NodeAttributes>(
    node: unknown,
    name: AttributeName
  ): NodeAttributes[AttributeName];
  getNodeAttributes(node: unknown): NodeAttributes;
  hasNodeAttribute<AttributeName extends keyof NodeAttributes>(
    node: unknown,
    name: AttributeName
  ): boolean;
  setNodeAttribute<AttributeName extends keyof NodeAttributes>(
    node: unknown,
    name: AttributeName,
    value: NodeAttributes[AttributeName]
  ): this;
  updateNodeAttribute<AttributeName extends keyof NodeAttributes>(
    node: unknown,
    name: AttributeName,
    updater: (
      value: NodeAttributes[AttributeName] | undefined
    ) => NodeAttributes[AttributeName]
  ): this;
  removeNodeAttribute<AttributeName extends keyof NodeAttributes>(
    node: unknown,
    name: AttributeName
  ): this;
  replaceNodeAttributes(node: unknown, attributes: NodeAttributes): this;
  mergeNodeAttributes(node: unknown, attributes: Partial<NodeAttributes>): this;

  updateEachNodeAttributes(
    updater: NodeUpdateIterationCallback<NodeAttributes>,
    hints?: UpdateHints
  ): void;

  // Edge attribute methods
  getEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: unknown,
    name: AttributeName
  ): EdgeAttributes[AttributeName];
  getEdgeAttributes(edge: unknown): EdgeAttributes;
  hasEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: unknown,
    name: AttributeName
  ): boolean;
  setEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: unknown,
    name: AttributeName,
    value: EdgeAttributes[AttributeName]
  ): this;
  updateEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: unknown,
    name: AttributeName,
    updater: (
      value: EdgeAttributes[AttributeName] | undefined
    ) => EdgeAttributes[AttributeName]
  ): this;
  removeEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: unknown,
    name: AttributeName
  ): this;
  replaceEdgeAttributes(edge: unknown, attributes: EdgeAttributes): this;
  mergeEdgeAttributes(edge: unknown, attributes: Partial<EdgeAttributes>): this;

  getDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: unknown,
    name: AttributeName
  ): EdgeAttributes[AttributeName];
  getDirectedEdgeAttributes(edge: unknown): EdgeAttributes;
  hasDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: unknown,
    name: AttributeName
  ): boolean;
  setDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: unknown,
    name: AttributeName,
    value: EdgeAttributes[AttributeName]
  ): this;
  updateDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: unknown,
    name: AttributeName,
    updater: (
      value: EdgeAttributes[AttributeName] | undefined
    ) => EdgeAttributes[AttributeName]
  ): this;
  removeDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: unknown,
    name: AttributeName
  ): this;
  replaceDirectedEdgeAttributes(
    edge: unknown,
    attributes: EdgeAttributes
  ): this;
  mergeDirectedEdgeAttributes(
    edge: unknown,
    attributes: Partial<EdgeAttributes>
  ): this;

  getUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: unknown,
    name: AttributeName
  ): EdgeAttributes[AttributeName];
  getUndirectedEdgeAttributes(edge: unknown): EdgeAttributes;
  hasUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: unknown,
    name: AttributeName
  ): boolean;
  setUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: unknown,
    name: AttributeName,
    value: EdgeAttributes[AttributeName]
  ): this;
  updateUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: unknown,
    name: AttributeName,
    updater: (
      value: EdgeAttributes[AttributeName] | undefined
    ) => EdgeAttributes[AttributeName]
  ): this;
  removeUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    edge: unknown,
    name: AttributeName
  ): this;
  replaceUndirectedEdgeAttributes(
    edge: unknown,
    attributes: EdgeAttributes
  ): this;
  mergeUndirectedEdgeAttributes(
    edge: unknown,
    attributes: Partial<EdgeAttributes>
  ): this;

  updateEachEdgeAttributes(
    updater: EdgeUpdateIterationCallback<EdgeAttributes>,
    hints?: UpdateHints
  ): void;

  // Edge attribute methods (source, target)
  getEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: unknown,
    target: unknown,
    name: AttributeName
  ): EdgeAttributes[AttributeName];
  getEdgeAttributes(source: unknown, target: unknown): EdgeAttributes;
  hasEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: unknown,
    target: unknown,
    name: AttributeName
  ): boolean;
  setEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: unknown,
    target: unknown,
    name: AttributeName,
    value: EdgeAttributes[AttributeName]
  ): this;
  updateEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: unknown,
    target: unknown,
    name: AttributeName,
    updater: (
      value: EdgeAttributes[AttributeName] | undefined
    ) => EdgeAttributes[AttributeName]
  ): this;
  removeEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: unknown,
    target: unknown,
    name: AttributeName
  ): this;
  replaceEdgeAttributes(
    source: unknown,
    target: unknown,
    attributes: EdgeAttributes
  ): this;
  mergeEdgeAttributes(
    source: unknown,
    target: unknown,
    attributes: Partial<EdgeAttributes>
  ): this;

  getDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: unknown,
    target: unknown,
    name: AttributeName
  ): EdgeAttributes[AttributeName];
  getDirectedEdgeAttributes(source: unknown, target: unknown): EdgeAttributes;
  hasDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: unknown,
    target: unknown,
    name: AttributeName
  ): boolean;
  setDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: unknown,
    target: unknown,
    name: AttributeName,
    value: EdgeAttributes[AttributeName]
  ): this;
  updateDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: unknown,
    target: unknown,
    name: AttributeName,
    updater: (
      value: EdgeAttributes[AttributeName] | undefined
    ) => EdgeAttributes[AttributeName]
  ): this;
  removeDirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: unknown,
    target: unknown,
    name: AttributeName
  ): this;
  replaceDirectedEdgeAttributes(
    source: unknown,
    target: unknown,
    attributes: EdgeAttributes
  ): this;
  mergeDirectedEdgeAttributes(
    source: unknown,
    target: unknown,
    attributes: Partial<EdgeAttributes>
  ): this;

  getUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: unknown,
    target: unknown,
    name: AttributeName
  ): EdgeAttributes[AttributeName];
  getUndirectedEdgeAttributes(source: unknown, target: unknown): EdgeAttributes;
  hasUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: unknown,
    target: unknown,
    name: AttributeName
  ): boolean;
  setUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: unknown,
    target: unknown,
    name: AttributeName,
    value: EdgeAttributes[AttributeName]
  ): this;
  updateUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: unknown,
    target: unknown,
    name: AttributeName,
    updater: (
      value: EdgeAttributes[AttributeName] | undefined
    ) => EdgeAttributes[AttributeName]
  ): this;
  removeUndirectedEdgeAttribute<AttributeName extends keyof EdgeAttributes>(
    source: unknown,
    target: unknown,
    name: AttributeName
  ): this;
  replaceUndirectedEdgeAttributes(
    source: unknown,
    target: unknown,
    attributes: EdgeAttributes
  ): this;
  mergeUndirectedEdgeAttributes(
    source: unknown,
    target: unknown,
    attributes: Partial<EdgeAttributes>
  ): this;

  // Iteration methods
  [Symbol.iterator](): IterableIterator<
    AdjacencyEntry<NodeAttributes, EdgeAttributes>
  >;
  forEach(
    callback: AdjacencyIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  find(
    callback: AdjacencyPredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  adjacency(): IterableIterator<AdjacencyEntry<NodeAttributes, EdgeAttributes>>;

  nodes(): Array<string>;
  forEachNode(callback: NodeIterationCallback<NodeAttributes>): void;
  findNode(callback: NodePredicate<NodeAttributes>): string | undefined;
  nodeEntries(): IterableIterator<NodeEntry<NodeAttributes>>;

  edges(): Array<string>;
  edges(node: unknown): Array<string>;
  edges(source: unknown, target: unknown): Array<string>;
  undirectedEdges(): Array<string>;
  undirectedEdges(node: unknown): Array<string>;
  undirectedEdges(source: unknown, target: unknown): Array<string>;
  directedEdges(): Array<string>;
  directedEdges(node: unknown): Array<string>;
  directedEdges(source: unknown, target: unknown): Array<string>;
  inEdges(): Array<string>;
  inEdges(node: unknown): Array<string>;
  inEdges(source: unknown, target: unknown): Array<string>;
  outEdges(): Array<string>;
  outEdges(node: unknown): Array<string>;
  outEdges(source: unknown, target: unknown): Array<string>;
  inboundEdges(): Array<string>;
  inboundEdges(node: unknown): Array<string>;
  inboundEdges(source: unknown, target: unknown): Array<string>;
  outboundEdges(): Array<string>;
  outboundEdges(node: unknown): Array<string>;
  outboundEdges(source: unknown, target: unknown): Array<string>;
  forEachEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachEdge(
    node: unknown,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachEdge(
    source: unknown,
    target: unknown,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachUndirectedEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachUndirectedEdge(
    node: unknown,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachUndirectedEdge(
    source: unknown,
    target: unknown,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachDirectedEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachDirectedEdge(
    node: unknown,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachDirectedEdge(
    source: unknown,
    target: unknown,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInEdge(
    node: unknown,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInEdge(
    source: unknown,
    target: unknown,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutEdge(
    node: unknown,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutEdge(
    source: unknown,
    target: unknown,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInboundEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInboundEdge(
    node: unknown,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInboundEdge(
    source: unknown,
    target: unknown,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutboundEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutboundEdge(
    node: unknown,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutboundEdge(
    source: unknown,
    target: unknown,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  findEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findEdge(
    node: unknown,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findEdge(
    source: unknown,
    target: unknown,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findUndirectedEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findUndirectedEdge(
    node: unknown,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findUndirectedEdge(
    source: unknown,
    target: unknown,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findDirectedEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findDirectedEdge(
    node: unknown,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findDirectedEdge(
    source: unknown,
    target: unknown,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInEdge(
    node: unknown,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInEdge(
    source: unknown,
    target: unknown,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutEdge(
    node: unknown,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutEdge(
    source: unknown,
    target: unknown,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInboundEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInboundEdge(
    node: unknown,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findInboundEdge(
    source: unknown,
    target: unknown,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutboundEdge(
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutboundEdge(
    node: unknown,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  findOutboundEdge(
    source: unknown,
    target: unknown,
    callback: EdgePredicate<NodeAttributes, EdgeAttributes>
  ): string | undefined;
  edgeEntries(): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  edgeEntries(
    node: unknown
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  edgeEntries(
    source: unknown,
    target: unknown
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  undirectedEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  undirectedEdgeEntries(
    node: unknown
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  undirectedEdgeEntries(
    source: unknown,
    target: unknown
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  directedEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  directedEdgeEntries(
    node: unknown
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  directedEdgeEntries(
    source: unknown,
    target: unknown
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inEdgeEntries(): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inEdgeEntries(
    node: unknown
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inEdgeEntries(
    source: unknown,
    target: unknown
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outEdgeEntries(): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outEdgeEntries(
    node: unknown
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outEdgeEntries(
    source: unknown,
    target: unknown
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inboundEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  inboundEdgeEntries(
    node: unknown
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inboundEdgeEntries(
    source: unknown,
    target: unknown
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outboundEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  outboundEdgeEntries(
    node: unknown
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outboundEdgeEntries(
    source: unknown,
    target: unknown
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;

  neighbors(node: unknown): Array<string>;
  undirectedNeighbors(node: unknown): Array<string>;
  directedNeighbors(node: unknown): Array<string>;
  inNeighbors(node: unknown): Array<string>;
  outNeighbors(node: unknown): Array<string>;
  inboundNeighbors(node: unknown): Array<string>;
  outboundNeighbors(node: unknown): Array<string>;
  forEachNeighbor(
    node: unknown,
    callback: NodeIterationCallback<NodeAttributes>
  ): void;
  forEachUndirectedNeighbor(
    node: unknown,
    callback: NodeIterationCallback<NodeAttributes>
  ): void;
  forEachDirectedNeighbor(
    node: unknown,
    callback: NodeIterationCallback<NodeAttributes>
  ): void;
  forEachInNeighbor(
    node: unknown,
    callback: NodeIterationCallback<NodeAttributes>
  ): void;
  forEachOutNeighbor(
    node: unknown,
    callback: NodeIterationCallback<NodeAttributes>
  ): void;
  forEachInboundNeighbor(
    node: unknown,
    callback: NodeIterationCallback<NodeAttributes>
  ): void;
  forEachOutboundNeighbor(
    node: unknown,
    callback: NodeIterationCallback<NodeAttributes>
  ): void;
  findNeighbor(
    node: unknown,
    callback: NodePredicate<NodeAttributes>
  ): string | undefined;
  findUndirectedNeighbor(
    node: unknown,
    callback: NodePredicate<NodeAttributes>
  ): string | undefined;
  findDirectedNeighbor(
    node: unknown,
    callback: NodePredicate<NodeAttributes>
  ): string | undefined;
  findInNeighbor(
    node: unknown,
    callback: NodePredicate<NodeAttributes>
  ): string | undefined;
  findOutNeighbor(
    node: unknown,
    callback: NodePredicate<NodeAttributes>
  ): string | undefined;
  findInboundNeighbor(
    node: unknown,
    callback: NodePredicate<NodeAttributes>
  ): string | undefined;
  findOutboundNeighbor(
    node: unknown,
    callback: NodePredicate<NodeAttributes>
  ): string | undefined;
  neighborEntries(node: unknown): IterableIterator<NodeEntry<NodeAttributes>>;
  undirectedNeighborEntries(
    node: unknown
  ): IterableIterator<NodeEntry<NodeAttributes>>;
  directedNeighborEntries(
    node: unknown
  ): IterableIterator<NodeEntry<NodeAttributes>>;
  inNeighborEntries(node: unknown): IterableIterator<NodeEntry<NodeAttributes>>;
  outNeighborEntries(
    node: unknown
  ): IterableIterator<NodeEntry<NodeAttributes>>;
  inboundNeighborEntries(
    node: unknown
  ): IterableIterator<NodeEntry<NodeAttributes>>;
  outboundNeighborEntries(
    node: unknown
  ): IterableIterator<NodeEntry<NodeAttributes>>;

  // Serialization methods
  exportNode(node: unknown): SerializedNode<NodeAttributes>;
  exportEdge(edge: unknown): SerializedEdge<EdgeAttributes>;
  export(): SerializedGraph<NodeAttributes, EdgeAttributes, GraphAttributes>;
  importNode(data: SerializedNode<NodeAttributes>, merge?: boolean): this;
  importEdge(data: SerializedEdge<EdgeAttributes>, merge?: boolean): this;
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
  nullCopy(): AbstractGraph<NodeAttributes, EdgeAttributes, GraphAttributes>;
  emptyCopy(): AbstractGraph<NodeAttributes, EdgeAttributes, GraphAttributes>;
  copy(): AbstractGraph<NodeAttributes, EdgeAttributes, GraphAttributes>;
  upgradeToMixed(): this;
  upgradeToMulti(): this;

  // Well-known methods
  toJSON(): SerializedGraph<NodeAttributes, EdgeAttributes, GraphAttributes>;
  toString(): string;
  inspect(): any;

  static from<
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes,
    GraphAttributes extends Attributes = Attributes
  >(
    data: SerializedGraph<NodeAttributes, EdgeAttributes, GraphAttributes>
  ): AbstractGraph<NodeAttributes, EdgeAttributes, GraphAttributes>;
  static from<
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes,
    GraphAttributes extends Attributes = Attributes
  >(
    graph: AbstractGraph<NodeAttributes, EdgeAttributes, GraphAttributes>
  ): AbstractGraph<NodeAttributes, EdgeAttributes, GraphAttributes>;
}

interface IGraphConstructor<
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

type GraphConstructor<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
> = IGraphConstructor<NodeAttributes, EdgeAttributes, GraphAttributes>;

export {
  AbstractGraph,
  Attributes,
  GraphType,
  GraphOptions,
  AdjacencyEntry,
  NodeEntry,
  EdgeEntry,
  AdjacencyIterationCallback,
  AdjacencyPredicate,
  NodeIterationCallback,
  NodePredicate,
  NodeUpdateIterationCallback,
  EdgeIterationCallback,
  EdgePredicate,
  EdgeUpdateIterationCallback,
  SerializedNode,
  SerializedEdge,
  SerializedGraph,
  GraphConstructor
};

export default AbstractGraph;
