import Graph from 'graphology-types';

export {default as isGraph} from 'graphology-utils/is-graph';
export {default as isGraphConstructor} from 'graphology-utils/is-graph-constructor';
export function haveSameNodes(G: Graph, H: Graph): boolean;
export function haveSameNodesDeep(G: Graph, H: Graph): boolean;
export function areSameGraphs(G: Graph, H: Graph): boolean;
export function areSameGraphsDeep(G: Graph, H: Graph): boolean;
export function haveSameEdges(G: Graph, H: Graph): boolean;
export function haveSameEdgesDeep(G: Graph, H: Graph): boolean;
