import {Attributes} from 'graphology-types';

export type TraversalCallback<N extends Attributes = Attributes> = (
  key: string,
  attributes: N,
  depth: number
) => boolean | void;
