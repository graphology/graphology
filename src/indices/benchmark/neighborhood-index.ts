import Graph from 'graphology';
import {erdosRenyi} from 'graphology-generators/random';
import {OutboundNeighborhoodIndex} from '../neighborhood';
import seedrandom from 'seedrandom';

const rng = seedrandom('test');

const graph = erdosRenyi.sparse(Graph, {order: 10000, probability: 0.02, rng});

console.log(graph.order, graph.size);
console.log();

console.time('OutboundNeighborhoodIndex');
new OutboundNeighborhoodIndex(graph);
console.timeEnd('OutboundNeighborhoodIndex');
