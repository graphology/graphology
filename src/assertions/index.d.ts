import Graph from 'graphology-types';

export {default as isGraph} from 'graphology-utils/is-graph';
export {default as isGraphConstructor} from 'graphology-utils/is-graph-constructor';
export function sameNodes(G: Graph, H: Graph): boolean;
export function sameNodesDeep(G: Graph, H: Graph): boolean;
