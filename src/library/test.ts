import Graph from 'graphology';
import * as metrics from './metrics';
import * as lib from './';

const graph = new Graph();

graph.addNode(1);
graph.addNode(2);
graph.addNode(3);

graph.addEdge(1, 2);

const density = metrics.graph.density(graph);

console.log('Graph density:', density);
console.log('Same:', lib.metrics.graph.density(graph));
