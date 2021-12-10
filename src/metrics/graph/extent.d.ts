import Graph, {Attributes} from 'graphology-types';

export type Extent = [number, number];
export type ExtentMapping = {[name: string]: Extent};

export function nodeExtent<NodeAttributes extends Attributes = Attributes>(
  graph: Graph<NodeAttributes>,
  attribute: keyof NodeAttributes
): Extent;

export function nodeExtent<NodeAttributes extends Attributes = Attributes>(
  graph: Graph<NodeAttributes>,
  attributes: Array<keyof NodeAttributes>
): ExtentMapping;

export function edgeExtent<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  attribute: keyof EdgeAttributes
): Extent;

export function edgeExtent<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  attributes: Array<keyof EdgeAttributes>
): ExtentMapping;
