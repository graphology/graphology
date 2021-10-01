import Graph, {Attributes} from 'graphology-types';

type MergeEdgeFunction = (currentEdgeAttributes: Attributes, conflictingEdgeAttributes: Attributes) => Attributes;

type ToUndirectedOptions = {
  mergeEdge: MergeEdgeFunction
};

export default function toUndirected(graph: Graph, mergeEdge?: MergeEdgeFunction): Graph;
export default function toUndirected(graph: Graph, options?: ToUndirectedOptions): Graph;
