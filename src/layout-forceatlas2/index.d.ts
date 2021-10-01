import Graph from 'graphology-types';

type LayoutMapping = {[key: string]: {x: number, y: number}};

export type ForceAtlas2Settings = {
  linLogMode?: boolean,
  outboundAttractionDistribution?: boolean,
  adjustSizes?: boolean,
  edgeWeightInfluence?: number,
  scalingRatio?: number,
  strongGravityMode?: boolean,
  gravity?: number,
  slowDown?: number,
  barnesHutOptimize?: boolean,
  barnesHutTheta?: number
};

export type ForceAtlas2LayoutOptions = {
  iterations: number,
  settings?: ForceAtlas2Settings
};

interface IForceAtlas2Layout {
  (graph: Graph, iterations: number): LayoutMapping;
  (graph: Graph, options: ForceAtlas2LayoutOptions): LayoutMapping;

  assign(graph: Graph, iterations: number): void;
  assign(graph: Graph, options: ForceAtlas2LayoutOptions): void;

  inferSettings(order: number): ForceAtlas2Settings;
  inferSettings(graph: Graph): ForceAtlas2Settings;
}

declare const forceAtlas2: IForceAtlas2Layout;

export default forceAtlas2;
