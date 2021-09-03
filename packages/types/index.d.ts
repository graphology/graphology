/**
 * Graphology Typings
 * ===================
 *
 * Graphology TypeScript declaration.
 */

/**
 * Miscellaneous types.
 */
type Attributes = {[key: string]: any};

type NodeKey = string | number;
type EdgeKey = string | number;

type GraphType = 'mixed' | 'directed' | 'undirected';

type UpdateHints = {attributes?: Array<string>};

type EdgeKeyGeneratorFunction<EdgeAttributes extends Attributes = Attributes> =
  (data: {
    undirected: boolean;
    source: string;
    target: string;
    attributes: EdgeAttributes;
  }) => EdgeKey;

type GraphOptions<EdgeAttributes extends Attributes = Attributes> = {
  allowSelfLoops?: boolean;
  edgeKeyGenerator?: EdgeKeyGeneratorFunction<EdgeAttributes>;
  multi?: boolean;
  type?: GraphType;
};

type AdjacencyEntry<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = [string, string, NodeAttributes, NodeAttributes, string, EdgeAttributes];

type NodeEntry<NodeAttributes extends Attributes = Attributes> = [
  string,
  NodeAttributes
];
type EdgeEntry<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = [string, EdgeAttributes, string, string, NodeAttributes, NodeAttributes];

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
  undirected: boolean,
  generatedKey: boolean
) => void;

type AdjacencyUntilIterationCallback<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = (
  source: string,
  target: string,
  sourceAttributes: NodeAttributes,
  targetAttributes: NodeAttributes,
  edge: string,
  edgeAttributes: EdgeAttributes,
  undirected: boolean,
  generatedKey: boolean
) => boolean | undefined;

type NodeIterationCallback<NodeAttributes extends Attributes = Attributes> = (
  node: string,
  attributes: NodeAttributes
) => void;

type NodeUntilIterationCallback<
  NodeAttributes extends Attributes = Attributes
> = (node: string, attributes: NodeAttributes) => boolean | undefined;

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
  undirected: boolean,
  generatedKey: boolean
) => void;

type EdgeUntilIterationCallback<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = (
  edge: string,
  attributes: EdgeAttributes,
  source: string,
  target: string,
  sourceAttributes: NodeAttributes,
  targetAttributes: NodeAttributes,
  undirected: boolean,
  generatedKey: boolean
) => boolean | undefined;

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

type SerializedGraphOptions = {
  allowSelfLoops?: boolean;
  multi?: boolean;
  type?: GraphType;
};

type SerializedGraph<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
> = {
  attributes?: GraphAttributes;
  options?: SerializedGraphOptions;
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
  constructor(options?: GraphOptions<EdgeAttributes>);

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
  hasNode(node: NodeKey): boolean;
  hasDirectedEdge(edge: EdgeKey): boolean;
  hasDirectedEdge(source: NodeKey, target: NodeKey): boolean;
  hasUndirectedEdge(edge: EdgeKey): boolean;
  hasUndirectedEdge(source: NodeKey, target: NodeKey): boolean;
  hasEdge(edge: EdgeKey): boolean;
  hasEdge(source: NodeKey, target: NodeKey): boolean;
  directedEdge(source: NodeKey, target: NodeKey): string | undefined;
  undirectedEdge(source: NodeKey, target: NodeKey): string | undefined;
  edge(source: NodeKey, target: NodeKey): string | undefined;
  inDegree(node: NodeKey, selfLoops?: boolean): number;
  outDegree(node: NodeKey, selfLoops?: boolean): number;
  directedDegree(node: NodeKey, selfLoops?: boolean): number;
  undirectedDegree(node: NodeKey, selfLoops?: boolean): number;
  degree(node: NodeKey, selfLoops?: boolean): number;
  source(edge: EdgeKey): string;
  target(edge: EdgeKey): string;
  extremities(edge: EdgeKey): [string, string];
  opposite(node: NodeKey, edge: EdgeKey): string;
  isUndirected(edge: EdgeKey): boolean;
  isDirected(edge: EdgeKey): boolean;
  isSelfLoop(edge: EdgeKey): boolean;
  hasExtremity(edge: EdgeKey, node: NodeKey): boolean;
  hasGeneratedKey(edge: EdgeKey): boolean;
  neighbors(source: NodeKey, target: NodeKey): boolean;
  undirectedNeighbors(source: NodeKey, target: NodeKey): boolean;
  directedNeighbors(source: NodeKey, target: NodeKey): boolean;
  inNeighbors(source: NodeKey, target: NodeKey): boolean;
  outNeighbors(source: NodeKey, target: NodeKey): boolean;
  inboundNeighbors(source: NodeKey, target: NodeKey): boolean;
  outboundNeighbors(source: NodeKey, target: NodeKey): boolean;

  // Mutation methods
  addNode(node: NodeKey, attributes?: NodeAttributes): string;
  mergeNode(node: NodeKey, attributes?: Partial<NodeAttributes>): string;
  updateNode(
    node: NodeKey,
    updater?: (attributes: NodeAttributes) => NodeAttributes
  ): string;
  addEdge(
    source: NodeKey,
    target: NodeKey,
    attributes?: EdgeAttributes
  ): string;
  mergeEdge(
    source: NodeKey,
    target: NodeKey,
    attributes?: Partial<EdgeAttributes>
  ): string;
  updateEdge(
    source: NodeKey,
    target: NodeKey,
    updater?: (attributes: EdgeAttributes) => EdgeAttributes
  ): string;
  addDirectedEdge(
    source: NodeKey,
    target: NodeKey,
    attributes?: EdgeAttributes
  ): string;
  mergeDirectedEdge(
    source: NodeKey,
    target: NodeKey,
    attributes?: Partial<EdgeAttributes>
  ): string;
  updateDirectedEdge(
    source: NodeKey,
    target: NodeKey,
    updater?: (attributes: EdgeAttributes) => EdgeAttributes
  ): string;
  addUndirectedEdge(
    source: NodeKey,
    target: NodeKey,
    attributes?: EdgeAttributes
  ): string;
  mergeUndirectedEdge(
    source: NodeKey,
    target: NodeKey,
    attributes?: Partial<EdgeAttributes>
  ): string;
  updateUndirectedEdge(
    source: NodeKey,
    target: NodeKey,
    updater?: (attributes: EdgeAttributes) => EdgeAttributes
  ): string;
  addEdgeWithKey(
    edge: EdgeKey,
    source: NodeKey,
    target: NodeKey,
    attributes?: EdgeAttributes
  ): string;
  mergeEdgeWithKey(
    edge: EdgeKey,
    source: NodeKey,
    target: NodeKey,
    attributes?: Partial<EdgeAttributes>
  ): string;
  updateEdgeWithKey(
    source: NodeKey,
    target: NodeKey,
    updater?: (attributes: EdgeAttributes) => EdgeAttributes
  ): string;
  addDirectedEdgeWithKey(
    edge: EdgeKey,
    source: NodeKey,
    target: NodeKey,
    attributes?: EdgeAttributes
  ): string;
  mergeDirectedEdgeWithKey(
    edge: EdgeKey,
    source: NodeKey,
    target: NodeKey,
    attributes?: Partial<EdgeAttributes>
  ): string;
  updateDirectedEdgeWithKey(
    source: NodeKey,
    target: NodeKey,
    updater?: (attributes: EdgeAttributes) => EdgeAttributes
  ): string;
  addUndirectedEdgeWithKey(
    edge: EdgeKey,
    source: NodeKey,
    target: NodeKey,
    attributes?: EdgeAttributes
  ): string;
  mergeUndirectedEdgeWithKey(
    edge: EdgeKey,
    source: NodeKey,
    target: NodeKey,
    attributes?: Partial<EdgeAttributes>
  ): string;
  updateUndirectedEdgeWithKey(
    source: NodeKey,
    target: NodeKey,
    updater?: (attributes: EdgeAttributes) => EdgeAttributes
  ): string;
  dropNode(node: NodeKey): void;
  dropEdge(edge: EdgeKey): void;
  dropEdge(source: NodeKey, target: NodeKey): void;
  clear(): void;
  clearEdges(): void;

  // Graph attribute methods
  getAttribute(name: string): any;
  getAttributes(): GraphAttributes;
  hasAttribute(name: string): boolean;
  setAttribute(name: string, value: any): this;
  updateAttribute(name: string, updater: (value: any) => any): this;
  removeAttribute(name: string): this;
  replaceAttributes(attributes: GraphAttributes): this;
  mergeAttributes(attributes: Partial<GraphAttributes>): this;

  // Node attribute methods
  getNodeAttribute(node: NodeKey, name: string): any;
  getNodeAttributes(node: NodeKey): NodeAttributes;
  hasNodeAttribute(node: NodeKey, name: string): boolean;
  setNodeAttribute(node: NodeKey, name: string, value: any): this;
  updateNodeAttribute(
    node: NodeKey,
    name: string,
    updater: (value: any) => any
  ): this;
  removeNodeAttribute(node: NodeKey, name: string): this;
  replaceNodeAttributes(node: NodeKey, attributes: NodeAttributes): this;
  mergeNodeAttributes(node: NodeKey, attributes: Partial<NodeAttributes>): this;
  updateEachNodeAttributes(
    updater: NodeUpdateIterationCallback<NodeAttributes>,
    hints?: UpdateHints
  ): void;

  // Edge attribute methods
  getEdgeAttribute(edge: EdgeKey, name: string): any;
  getEdgeAttributes(edge: EdgeKey): EdgeAttributes;
  hasEdgeAttribute(edge: EdgeKey, name: string): boolean;
  setEdgeAttribute(edge: EdgeKey, name: string, value: any): this;
  updateEdgeAttribute(
    edge: EdgeKey,
    name: string,
    updater: (value: any) => any
  ): this;
  removeEdgeAttribute(edge: EdgeKey, name: string): this;
  replaceEdgeAttributes(edge: EdgeKey, attributes: EdgeAttributes): this;
  mergeEdgeAttributes(edge: EdgeKey, attributes: Partial<EdgeAttributes>): this;
  updateEachEdgeAttributes(
    updater: EdgeUpdateIterationCallback<EdgeAttributes>,
    hints?: UpdateHints
  ): void;

  getEdgeAttribute(source: NodeKey, target: NodeKey, name: string): any;
  getEdgeAttributes(source: NodeKey, target: NodeKey): EdgeAttributes;
  hasEdgeAttribute(source: NodeKey, target: NodeKey, name: string): boolean;
  setEdgeAttribute(
    source: NodeKey,
    target: NodeKey,
    name: string,
    value: any
  ): this;
  updateEdgeAttribute(
    source: NodeKey,
    target: NodeKey,
    name: string,
    updater: (value: any) => any
  ): this;
  removeEdgeAttribute(source: NodeKey, target: NodeKey, name: string): this;
  replaceEdgeAttributes(
    source: NodeKey,
    target: NodeKey,
    attributes: EdgeAttributes
  ): this;
  mergeEdgeAttributes(
    source: NodeKey,
    target: NodeKey,
    attributes: Partial<EdgeAttributes>
  ): this;

  // Iteration methods
  [Symbol.iterator](): IterableIterator<
    AdjacencyEntry<NodeAttributes, EdgeAttributes>
  >;
  forEach(
    callback: AdjacencyIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachUntil(
    callback: AdjacencyUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  adjacency(): IterableIterator<AdjacencyEntry<NodeAttributes, EdgeAttributes>>;

  nodes(): Array<string>;
  forEachNode(callback: NodeIterationCallback<NodeAttributes>): void;
  forEachNodeUntil(
    callback: NodeUntilIterationCallback<NodeAttributes>
  ): boolean;
  nodeEntries(): IterableIterator<NodeEntry<NodeAttributes>>;

  edges(): Array<string>;
  edges(node: NodeKey): Array<string>;
  edges(source: NodeKey, target: NodeKey): Array<string>;
  undirectedEdges(): Array<string>;
  undirectedEdges(node: NodeKey): Array<string>;
  undirectedEdges(source: NodeKey, target: NodeKey): Array<string>;
  directedEdges(): Array<string>;
  directedEdges(node: NodeKey): Array<string>;
  directedEdges(source: NodeKey, target: NodeKey): Array<string>;
  inEdges(): Array<string>;
  inEdges(node: NodeKey): Array<string>;
  inEdges(source: NodeKey, target: NodeKey): Array<string>;
  outEdges(): Array<string>;
  outEdges(node: NodeKey): Array<string>;
  outEdges(source: NodeKey, target: NodeKey): Array<string>;
  inboundEdges(): Array<string>;
  inboundEdges(node: NodeKey): Array<string>;
  inboundEdges(source: NodeKey, target: NodeKey): Array<string>;
  outboundEdges(): Array<string>;
  outboundEdges(node: NodeKey): Array<string>;
  outboundEdges(source: NodeKey, target: NodeKey): Array<string>;
  forEachEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachEdge(
    node: NodeKey,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachEdge(
    source: NodeKey,
    target: NodeKey,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachUndirectedEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachUndirectedEdge(
    node: NodeKey,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachUndirectedEdge(
    source: NodeKey,
    target: NodeKey,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachDirectedEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachDirectedEdge(
    node: NodeKey,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachDirectedEdge(
    source: NodeKey,
    target: NodeKey,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInEdge(
    node: NodeKey,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInEdge(
    source: NodeKey,
    target: NodeKey,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutEdge(
    node: NodeKey,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutEdge(
    source: NodeKey,
    target: NodeKey,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInboundEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInboundEdge(
    node: NodeKey,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachInboundEdge(
    source: NodeKey,
    target: NodeKey,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutboundEdge(
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutboundEdge(
    node: NodeKey,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachOutboundEdge(
    source: NodeKey,
    target: NodeKey,
    callback: EdgeIterationCallback<NodeAttributes, EdgeAttributes>
  ): void;
  forEachEdgeUntil(
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachEdgeUntil(
    node: NodeKey,
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachEdgeUntil(
    source: NodeKey,
    target: NodeKey,
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachUndirectedEdgeUntil(
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachUndirectedEdgeUntil(
    node: NodeKey,
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachUndirectedEdgeUntil(
    source: NodeKey,
    target: NodeKey,
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachDirectedEdgeUntil(
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachDirectedEdgeUntil(
    node: NodeKey,
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachDirectedEdgeUntil(
    source: NodeKey,
    target: NodeKey,
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachInEdgeUntil(
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachInEdgeUntil(
    node: NodeKey,
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachInEdgeUntil(
    source: NodeKey,
    target: NodeKey,
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachOutEdgeUntil(
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachOutEdgeUntil(
    node: NodeKey,
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachOutEdgeUntil(
    source: NodeKey,
    target: NodeKey,
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachInboundEdgeUntil(
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachInboundEdgeUntil(
    node: NodeKey,
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachInboundEdgeUntil(
    source: NodeKey,
    target: NodeKey,
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachOutboundEdgeUntil(
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachOutboundEdgeUntil(
    node: NodeKey,
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  forEachOutboundEdgeUntil(
    source: NodeKey,
    target: NodeKey,
    callback: EdgeUntilIterationCallback<NodeAttributes, EdgeAttributes>
  ): boolean;
  edgeEntries(): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  edgeEntries(
    node: NodeKey
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  edgeEntries(
    source: NodeKey,
    target: NodeKey
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  undirectedEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  undirectedEdgeEntries(
    node: NodeKey
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  undirectedEdgeEntries(
    source: NodeKey,
    target: NodeKey
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  directedEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  directedEdgeEntries(
    node: NodeKey
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  directedEdgeEntries(
    source: NodeKey,
    target: NodeKey
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inEdgeEntries(): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inEdgeEntries(
    node: NodeKey
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inEdgeEntries(
    source: NodeKey,
    target: NodeKey
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outEdgeEntries(): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outEdgeEntries(
    node: NodeKey
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outEdgeEntries(
    source: NodeKey,
    target: NodeKey
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inboundEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  inboundEdgeEntries(
    node: NodeKey
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  inboundEdgeEntries(
    source: NodeKey,
    target: NodeKey
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outboundEdgeEntries(): IterableIterator<
    EdgeEntry<NodeAttributes, EdgeAttributes>
  >;
  outboundEdgeEntries(
    node: NodeKey
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;
  outboundEdgeEntries(
    source: NodeKey,
    target: NodeKey
  ): IterableIterator<EdgeEntry<NodeAttributes, EdgeAttributes>>;

  neighbors(node: NodeKey): Array<string>;
  undirectedNeighbors(node: NodeKey): Array<string>;
  directedNeighbors(node: NodeKey): Array<string>;
  inNeighbors(node: NodeKey): Array<string>;
  outNeighbors(node: NodeKey): Array<string>;
  inboundNeighbors(node: NodeKey): Array<string>;
  outboundNeighbors(node: NodeKey): Array<string>;
  forEachNeighbor(
    node: NodeKey,
    callback: NodeIterationCallback<NodeAttributes>
  ): void;
  forEachUndirectedNeighbor(
    node: NodeKey,
    callback: NodeIterationCallback<NodeAttributes>
  ): void;
  forEachDirectedNeighbor(
    node: NodeKey,
    callback: NodeIterationCallback<NodeAttributes>
  ): void;
  forEachInNeighbor(
    node: NodeKey,
    callback: NodeIterationCallback<NodeAttributes>
  ): void;
  forEachOutNeighbor(
    node: NodeKey,
    callback: NodeIterationCallback<NodeAttributes>
  ): void;
  forEachInboundNeighbor(
    node: NodeKey,
    callback: NodeIterationCallback<NodeAttributes>
  ): void;
  forEachOutboundNeighbor(
    node: NodeKey,
    callback: NodeIterationCallback<NodeAttributes>
  ): void;
  forEachNeighborUntil(
    node: NodeKey,
    callback: NodeUntilIterationCallback<NodeAttributes>
  ): boolean;
  forEachUndirectedNeighborUntil(
    node: NodeKey,
    callback: NodeUntilIterationCallback<NodeAttributes>
  ): boolean;
  forEachDirectedNeighborUntil(
    node: NodeKey,
    callback: NodeUntilIterationCallback<NodeAttributes>
  ): boolean;
  forEachInNeighborUntil(
    node: NodeKey,
    callback: NodeUntilIterationCallback<NodeAttributes>
  ): boolean;
  forEachOutNeighborUntil(
    node: NodeKey,
    callback: NodeUntilIterationCallback<NodeAttributes>
  ): boolean;
  forEachInboundNeighborUntil(
    node: NodeKey,
    callback: NodeUntilIterationCallback<NodeAttributes>
  ): boolean;
  forEachOutboundNeighborUntil(
    node: NodeKey,
    callback: NodeUntilIterationCallback<NodeAttributes>
  ): boolean;
  neighborEntries(node: NodeKey): IterableIterator<NodeEntry<NodeAttributes>>;
  undirectedNeighborEntries(
    node: NodeKey
  ): IterableIterator<NodeEntry<NodeAttributes>>;
  directedNeighborEntries(
    node: NodeKey
  ): IterableIterator<NodeEntry<NodeAttributes>>;
  inNeighborEntries(node: NodeKey): IterableIterator<NodeEntry<NodeAttributes>>;
  outNeighborEntries(
    node: NodeKey
  ): IterableIterator<NodeEntry<NodeAttributes>>;
  inboundNeighborEntries(
    node: NodeKey
  ): IterableIterator<NodeEntry<NodeAttributes>>;
  outboundNeighborEntries(
    node: NodeKey
  ): IterableIterator<NodeEntry<NodeAttributes>>;

  // Serialization methods
  exportNode(node: NodeKey): SerializedNode<NodeAttributes>;
  exportEdge(edge: EdgeKey): SerializedEdge<EdgeAttributes>;
  export(): SerializedGraph<NodeAttributes, EdgeAttributes, GraphAttributes>;
  importNode(data: SerializedNode<NodeAttributes>, merge?: boolean): this;
  importEdge(data: SerializedEdge<EdgeAttributes>, merge?: boolean): this;
  import(
    data: SerializedGraph<NodeAttributes, EdgeAttributes, GraphAttributes>,
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
  new (options?: GraphOptions<GraphAttributes>): AbstractGraph<
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
  NodeKey,
  EdgeKey,
  GraphType,
  EdgeKeyGeneratorFunction,
  GraphOptions,
  AdjacencyEntry,
  NodeEntry,
  EdgeEntry,
  AdjacencyIterationCallback,
  AdjacencyUntilIterationCallback,
  NodeIterationCallback,
  NodeUntilIterationCallback,
  NodeUpdateIterationCallback,
  EdgeIterationCallback,
  EdgeUntilIterationCallback,
  EdgeUpdateIterationCallback,
  SerializedNode,
  SerializedEdge,
  SerializedGraph,
  GraphConstructor
};

export default AbstractGraph;
