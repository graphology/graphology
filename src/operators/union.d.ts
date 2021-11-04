import Graph from 'graphology-types';

export default function union<G extends Graph>(G: G, H: G): G;
