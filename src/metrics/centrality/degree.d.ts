import Graph from 'graphology-types';

type DegreeCentralityOptions = {
  attributes?: {
    centrality?: string
  }
};

type DegreeCentralityMapping = {[key: string]: number};

interface IDegreeCentralityBase {
  (graph: Graph, options?: DegreeCentralityOptions): DegreeCentralityMapping;
  assign(graph: Graph, options?: DegreeCentralityOptions): void;
}

interface IDegreeCentrality extends IDegreeCentralityBase {
  degreeCentrality: IDegreeCentralityBase,
  inDegreeCentrality: IDegreeCentralityBase,
  outDegreeCentrality: IDegreeCentralityBase
}

declare const degreeCentrality: IDegreeCentrality;

export default degreeCentrality;
