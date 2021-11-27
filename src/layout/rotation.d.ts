import Graph from 'graphology-types';

export type RotationOptions = {
  dimensions?: string[];
  centeredOnZero?: boolean;
  degrees?: boolean;
};

type LayoutMapping = {[node: string]: {[dimension: string]: number}};

interface IRotation {
  (graph: Graph, angle: number, options?: RotationOptions): LayoutMapping;
  assign(graph: Graph, angle: number, options?: RotationOptions): void;
}

declare const rotation: IRotation;

export default rotation;
