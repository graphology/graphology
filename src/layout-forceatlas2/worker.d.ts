import Graph from 'graphology-types';
import {ForceAtlas2Settings} from './index';

export type FA2LayoutSupervisorParameters = {
  attributes?: {
    weight?: string;
  };
  settings?: ForceAtlas2Settings;
  weighted?: boolean;
};

export default class FA2LayoutSupervisor {
  constructor(graph: Graph, params?: FA2LayoutSupervisorParameters);

  isRunning(): boolean;
  start(): void;
  stop(): void;
  kill(): void;
}
