import Graph, {Attributes} from 'graphology-types';
import {MinimalEdgeMapper} from 'graphology-utils/getters';

type BetweennessCentralityMapping = {[node: string]: number};
type EdgeBetweennessCentralityMapping = {[edge: string]: number};

type BetweennessCentralityOptions<EdgeAttributes extends Attributes> = {
  nodeCentralityAttribute?: string;
  getEdgeWeight?:
    | keyof EdgeAttributes
    | MinimalEdgeMapper<number, EdgeAttributes>
    | null;
  normalized?: boolean;
};

type EdgeBetweennessCentralityOptions<EdgeAttributes extends Attributes> = {
  edgeCentralityAttribute?: string;
  getEdgeWeight?:
    | keyof EdgeAttributes
    | MinimalEdgeMapper<number, EdgeAttributes>
    | null;
  normalized?: boolean;
};

interface IBetweennessCentrality {
  <
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: BetweennessCentralityOptions<EdgeAttributes>
  ): BetweennessCentralityMapping;
  assign<
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: BetweennessCentralityOptions<EdgeAttributes>
  ): void;
}

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

declare const betweennessCentrality: IBetweennessCentrality;
declare const edgeBetweennessCentrality: IEdgeBetweennessCentrality;

export {betweennessCentrality, edgeBetweennessCentrality};
