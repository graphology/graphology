import Graph from 'graphology-types';
import {NoverlapSettings, NoverlapNodeReducer} from './index';

export type NoverlapLayoutSupervisorParameters = {
  inputReducer?: NoverlapNodeReducer;
  outputReducer?: NoverlapNodeReducer;
  onConverged?: () => void;
  settings?: NoverlapSettings;
};

export default class NoverlapLayoutSupervisor {
  converged: boolean;

  constructor(graph: Graph, params?: NoverlapLayoutSupervisorParameters);

  isRunning(): boolean;
  start(): void;
  stop(): void;
  kill(): void;
}
