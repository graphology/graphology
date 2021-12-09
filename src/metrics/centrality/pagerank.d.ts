import Graph, {Attributes} from 'graphology-types';
import {MinimalEdgeMapper} from 'graphology-utils/getters';

type PagerankOptions<EdgeAttributes extends Attributes> = {
  nodePagerankAttribute?: string;
  getEdgeWeight:
    | keyof EdgeAttributes
    | MinimalEdgeMapper<number, EdgeAttributes>
    | null;
  alpha?: number;
  maxIterations?: number;
  tolerance?: number;
};

type PagerankMapping = {[node: string]: number};

interface Pagerank {
  <
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: PagerankOptions<EdgeAttributes>
  ): PagerankMapping;
  assign<
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: PagerankOptions<EdgeAttributes>
  ): void;
}

declare const pagerank: Pagerank;

export default pagerank;
