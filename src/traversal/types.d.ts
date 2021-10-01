import {NodeKey, Attributes} from 'graphology-types';

export type TraversalCallback<N extends Attributes = Attributes> = (key: NodeKey, attributes: N, depth: number) => void;
