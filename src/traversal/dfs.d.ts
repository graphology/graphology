import Graph, {Attributes} from 'graphology-types';
import {TraversalCallback, TraversalOptions} from './types';

export function dfs<N extends Attributes = Attributes>(
  graph: Graph<N>,
  callback: TraversalCallback<N>,
  options?: TraversalOptions
): void;
export function dfsFromNode<N extends Attributes = Attributes>(
  graph: Graph<N>,
  node: unknown,
  callback: TraversalCallback<N>,
  options?: TraversalOptions
): void;
