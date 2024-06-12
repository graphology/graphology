import Graph from 'graphology-types';

type RNGFunction = () => number;

export type ConnectedClosenessSettings = {
  epsilon?: number;
  gridSize?: number;
  rng?: RNGFunction;
};

export type ConnectedClosenessResult =
  | {
      deltaMax: number;
      ePercentOfDeltaMax: number;
      pPercentOfDeltaMax: number;
      pEdgeOfDeltaMax: number;
      cMax: number;
    }
  | {
      deltaMax: undefined;
      ePercentOfDeltaMax: undefined;
      pPercentOfDeltaMax: undefined;
      pEdgeOfDeltaMax: undefined;
      cMax: number;
    };

export default function connectedCloseness(
  graph: Graph,
  settings?: ConnectedClosenessSettings
): ConnectedClosenessResult;
