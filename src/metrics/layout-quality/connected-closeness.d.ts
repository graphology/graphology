import Graph from 'graphology-types';

export type ConnectedClosenessSettings = {
  epsilon?: number;
  gridSize?: number;
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
