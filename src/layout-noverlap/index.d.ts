import Graph from 'graphology-types';

type LayoutMapping = {[key: string]: {x: number; y: number}};

type NoverlapNodeAttributes = {x: number; y: number; size?: number};

export type NoverlapNodeReducer = (
  key: string,
  attr: NoverlapNodeAttributes
) => NoverlapNodeAttributes;

export type NoverlapSettings = {
  gridSize?: number;
  margin?: number;
  expansion?: number;
  ratio?: number;
  speed?: number;
};

export type NoverlapLayoutParameters = {
  maxIterations?: number;
  inputReducer?: NoverlapNodeReducer;
  outputReducer?: NoverlapNodeReducer;
  settings?: NoverlapSettings;
};

interface INoverlapLayout {
  (graph: Graph, maxIterations?: number): LayoutMapping;
  (graph: Graph, params: NoverlapLayoutParameters): LayoutMapping;

  assign(graph: Graph, maxIterations?: number): void;
  assign(graph: Graph, params: NoverlapLayoutParameters): void;
}

declare const noverlap: INoverlapLayout;

export default noverlap;
