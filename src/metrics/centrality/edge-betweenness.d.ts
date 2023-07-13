import Graph, {Attributes} from 'graphology-types';
import {MinimalEdgeMapper} from 'graphology-utils/getters';

type EdgeBetweennessCentralityMapping = {[edge: string]: number};

type EdgeBetweennessCentralityOptions<EdgeAttributes extends Attributes> = {
  edgeCentralityAttribute?: string;
  getEdgeWeight?:
    | keyof EdgeAttributes
    | MinimalEdgeMapper<number, EdgeAttributes>
    | null;
  normalized?: boolean;
};

interface IEdgeBetweennessCentrality {
  <
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: EdgeBetweennessCentralityOptions<EdgeAttributes>
  ): EdgeBetweennessCentralityMapping;
  assign<
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: EdgeBetweennessCentralityOptions<EdgeAttributes>
  ): void;
}

declare const edgeBetweennessCentrality: IEdgeBetweennessCentrality;

export default edgeBetweennessCentrality;
