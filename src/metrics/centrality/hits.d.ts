import Graph from 'graphology-types';

type HITSOptions = {
  attributes?: {
    authority?: string;
    hub?: string;
    weight?: string;
  };
  maxIterations?: number;
  normalize?: boolean;
  tolerance?: number;
};

type HITSResult = {
  converged: boolean;
  authorities: {[node: string]: number};
  hubs: {[node: string]: number};
};

interface HITS {
  (graph: Graph, options?: HITSOptions): HITSResult;
  assign(graph: Graph, options?: HITSOptions): void;
}

declare const hits: HITS;

export default hits;
