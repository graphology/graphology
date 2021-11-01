import Graph from 'graphology-types';

type PagerankOptions = {
  attributes?: {
    pagerank?: string;
    weight?: string;
  };
  alpha?: number;
  maxIterations?: number;
  tolerance?: number;
  weighted?: boolean;
};

type PagerankMapping = {[node: string]: number};

interface Pagerank {
  (graph: Graph, options?: PagerankOptions): PagerankMapping;
  assign(graph: Graph, options?: PagerankOptions): void;
}

declare const pagerank: Pagerank;

export default pagerank;
