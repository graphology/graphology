import Graph from 'graphology-types';

type DegreeCentralityOptions = {
  nodeCentralityAttribute?: string;
};

type DegreeCentralityMapping = {[node: string]: number};

interface IDegreeCentralityBase {
  (graph: Graph, options?: DegreeCentralityOptions): DegreeCentralityMapping;
  assign(graph: Graph, options?: DegreeCentralityOptions): void;
}

declare const degreeCentrality: IDegreeCentralityBase;
declare const inDegreeCentrality: IDegreeCentralityBase;
declare const outDegreeCentrality: IDegreeCentralityBase;

export {degreeCentrality, inDegreeCentrality, outDegreeCentrality};
