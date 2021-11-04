import Graph, {Attributes} from 'graphology-types';
import {ForceLayoutParameters} from './index';

export type ForceLayoutSupervisorParameters<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = Omit<
  ForceLayoutParameters<NodeAttributes, EdgeAttributes>,
  'maxIterations'
> & {
  onConverged?: () => void;
};

export default class ForceSupervisor<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> {
  constructor(
    graph: Graph,
    params?: ForceLayoutSupervisorParameters<NodeAttributes, EdgeAttributes>
  );

  isRunning(): boolean;
  start(): void;
  stop(): void;
  kill(): void;
}
