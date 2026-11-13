import Graph from 'graphology-types';

export default function complement(graph: Graph<
  GNodeAttributes | HNodeAttributes,
  GEdgeAttributes | HEdgeAttributes,
  GGraphAttributes & HGraphAttributes
>): Graph<
  GNodeAttributes | HNodeAttributes,
  GEdgeAttributes | HEdgeAttributes,
  GGraphAttributes & HGraphAttributes
>;
