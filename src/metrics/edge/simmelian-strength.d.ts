import Graph from 'graphology-types';

type SimmelianStrengthMapping = {[edge: string]: number};

interface ISimmelianStrength {
  (graph: Graph): SimmelianStrengthMapping;
  assign(graph: Graph): void;
}

declare const simmelianStrength: ISimmelianStrength;

export default simmelianStrength;
