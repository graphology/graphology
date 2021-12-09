import Graph, {Attributes} from 'graphology-types';
import {MinimalEdgeMapper} from 'graphology-utils/getters';

type EigenvectorCentralityOptions<
  EdgeAttributes extends Attributes = Attributes
> = {
  nodeCentralityAttribute?: string;
  getEdgeWeight?:
    | keyof EdgeAttributes
    | MinimalEdgeMapper<number, EdgeAttributes>
    | null;
  maxIterations?: number;
  tolerance?: number;
};

type EigenvectorCentralityMapping = {[node: string]: number};

interface EigenvectorCentrality {
  <
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: EigenvectorCentralityOptions<EdgeAttributes>
  ): EigenvectorCentralityMapping;
  assign<
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: EigenvectorCentralityOptions<EdgeAttributes>
  ): void;
}

declare const eigenvectorCentrality: EigenvectorCentrality;

export default eigenvectorCentrality;
