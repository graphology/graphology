import Graph from 'graphology';
import {Attributes} from 'graphology-types';

export type TransitiveIterationCallback<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = (
  inEdge: string,
  outEdge: string,
  inEdgeAttributes: EdgeAttributes,
  outEdgeAttributes: EdgeAttributes,
  source: string,
  node: string,
  target: string,
  sourceAttributes: NodeAttributes,
  nodeAttributes: NodeAttributes,
  targetAttributes: NodeAttributes
) => void;

export function forEachTransitiveRelation(
  graph: Graph,
  node: string,
  callback: TransitiveIterationCallback
): void;

export function bypassNode<NodeAttributes extends Attributes = Attributes>(
  graph: Graph<NodeAttributes>,
  node: string
): void;
