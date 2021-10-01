import Graph, {Attributes, NodeKey, EdgeKey} from 'graphology-types';

export type CanvasRendererSettings<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = {
  batchSize?: number;
  margin?: number;
  width?: number;
  height?: number;
  nodes?: {
    defaultColor?: string;
    reducer?: (settings: CanvasRendererSettings, node: NodeKey, attributes: NodeAttributes) => Attributes;
  },
  edges?: {
    defaultColor?: string;
    reducer?: (settings: CanvasRendererSettings, edge: EdgeKey, attributes: EdgeAttributes) => Attributes;
  }
};

export function render<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph,
  context: CanvasRenderingContext2D,
  settings?: CanvasRendererSettings<NodeAttributes, EdgeAttributes>
): void;

export function renderAsync<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph,
  context: CanvasRenderingContext2D,
  settings: CanvasRendererSettings<NodeAttributes, EdgeAttributes>,
  callback: () => void
): void;

export function renderAsync<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph,
  context: CanvasRenderingContext2D,
  callback: () => void
): void;
