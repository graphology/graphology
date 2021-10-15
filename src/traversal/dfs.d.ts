import Graph, {Attributes} from 'graphology-types';
import {TraversalCallback} from './types';

export function dfs<N extends Attributes = Attributes>(
  graph: Graph<N>,
  callback: TraversalCallback<N>
): void;
export function dfsFromNode<N extends Attributes = Attributes>(
  graph: Graph<N>,
  node: unknown,
  callback: TraversalCallback<N>
): void;
