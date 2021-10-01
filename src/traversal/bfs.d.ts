import Graph, {Attributes, NodeKey} from 'graphology-types';
import {TraversalCallback} from './types';

export function bfs<N extends Attributes = Attributes>(graph: Graph<N>, callback: TraversalCallback<N>): void;
export function bfsFromNode<N extends Attributes = Attributes>(graph: Graph<N>, node: NodeKey, callback: TraversalCallback<N>): void;
