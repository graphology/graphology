import Graph from 'graphology-types';

export type Clustering = {[node: string]: string | number};
export type Clusterings = Array<Clustering>;

export type Ambiguities = {[node: string]: number};

export default function clusteringAmbiguity(
  graph: Graph,
  clusterings: Clusterings
): Ambiguities;
