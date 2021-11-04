import Graph, {Attributes} from 'graphology-types';

export default function disjointUnion<
  GNodeAttributes extends Attributes = Attributes,
  GEdgeAttributes extends Attributes = Attributes,
  GGraphAttributes extends Attributes = Attributes,
  HNodeAttributes extends Attributes = Attributes,
  HEdgeAttributes extends Attributes = Attributes,
  HGraphAttributes extends Attributes = Attributes
>(
  G: Graph<GNodeAttributes, GEdgeAttributes, GGraphAttributes>,
  H: Graph<HNodeAttributes, HEdgeAttributes, HGraphAttributes>
): Graph<
  GNodeAttributes | HNodeAttributes,
  GEdgeAttributes | HEdgeAttributes,
  GGraphAttributes & HGraphAttributes
>;
