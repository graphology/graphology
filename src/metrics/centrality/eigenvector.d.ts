import Graph from 'graphology-types';

type EigenvectorCentralityOptions = {
  attributes?: {
    centrality?: string;
    weight?: string;
  };
  maxIterations?: number;
  tolerance?: number;
  weighted?: boolean;
};

type EigenvectorCentralityMapping = {[node: string]: number};

interface EigenvectorCentrality {
  (
    graph: Graph,
    options?: EigenvectorCentralityOptions
  ): EigenvectorCentralityMapping;
  assign(graph: Graph, options?: EigenvectorCentralityOptions): void;
}

declare const eigenvectorCentrality: EigenvectorCentrality;

export default eigenvectorCentrality;
