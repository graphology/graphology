import Graph from 'graphology-types';
import {ForceAtlas2Settings} from './index';

export type FA2LayoutSupervisorParameters = {
  settings?: ForceAtlas2Settings
};

export default class FA2LayoutSupervisor {
  constructor(graph: Graph, params?: FA2LayoutSupervisorParameters);

  start(): void;
  stop(): void;
  kill(): void;
}
