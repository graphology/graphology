import {Attributes} from 'graphology-types';

export type DotParserOptions = {
  addMissingNodes?: boolean;
};

export type NodeFormatter<
  NodeAttributes extends Attributes = Attributes,
  FormattedAttributes extends Attributes = Attributes
> = (key: string, attributes: NodeAttributes) => FormattedAttributes;

export type EdgeFormatter<
  EdgeAttributes extends Attributes = Attributes,
  FormattedAttributes extends Attributes = Attributes
> = (key: string, attributes: EdgeAttributes) => FormattedAttributes;

export type DotWriterOptions<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  FormattedNodeAttributes extends Attributes = Attributes,
  FormattedEdgeAttributes extends Attributes = Attributes
> = {
  formatNode?: NodeFormatter<NodeAttributes, FormattedNodeAttributes>;
  formatEdge?: EdgeFormatter<EdgeAttributes, FormattedEdgeAttributes>;
};
