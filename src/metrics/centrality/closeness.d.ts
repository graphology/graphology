import Graph from 'graphology-types';

type ClosenessCentralityOptions = {
  nodeCentralityAttribute?: string;
  wassermanFaust?: boolean;
};

type ClosenessCentralityMapping = {[node: string]: number};

interface ClosenessCentrality {
  (
    graph: Graph,
    options?: ClosenessCentralityOptions
  ): ClosenessCentralityMapping;
  assign(graph: Graph, options?: ClosenessCentralityOptions): void;
}

declare const closenessCentrality: ClosenessCentrality;

export default closenessCentrality;
