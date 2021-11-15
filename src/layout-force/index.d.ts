import Graph, {
  Attributes,
  NodePredicate,
  EdgePredicate
} from 'graphology-types';

type LayoutMapping = {[key: string]: {x: number; y: number}};

export type ForceLayoutSettings = {
  attraction?: number;
  repulsion?: number;
  gravity?: number;
  inertia?: number;
  maxMove?: number;
};

export type ForceLayoutParameters<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = {
  nodeXAttribute?: string;
  nodeYAttribute?: string;
  isNodeFixed?: string | NodePredicate<NodeAttributes>;
  shouldSkipNode?: NodePredicate<NodeAttributes>;
  shouldSkipEdge?: EdgePredicate<EdgeAttributes>;
  maxIterations?: number;
  settings?: ForceLayoutSettings;
};

interface IForceLayout<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> {
  (
    graph: Graph<NodeAttributes, EdgeAttributes>,
    maxIterations: number
  ): LayoutMapping;
  (
    graph: Graph,
    params: ForceLayoutParameters<NodeAttributes, EdgeAttributes>
  ): LayoutMapping;

  assign(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    maxIterations: number
  ): void;
  assign(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    params: ForceLayoutParameters<NodeAttributes, EdgeAttributes>
  ): void;
}

declare const forceLayout: IForceLayout;

export default forceLayout;
