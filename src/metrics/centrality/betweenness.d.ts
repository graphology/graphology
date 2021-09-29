import Graph from 'graphology-types';

type BetweennessCentralityMapping = {[key: string]: number};

type BetweennessCentralityOptions = {
  attributes?: {
    centrality?: string,
    weight?: string
  },
  normalized?: boolean,
  weighted?: boolean
};

interface IBetweennessCentrality {
  (graph: Graph, options?: BetweennessCentralityOptions): BetweennessCentralityMapping;
  assign(graph: Graph, options?: BetweennessCentralityOptions): void;
}

declare const betweennessCentrality: IBetweennessCentrality;

export default betweennessCentrality;
