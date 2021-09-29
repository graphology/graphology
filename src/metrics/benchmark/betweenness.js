/* eslint no-console: 0 */
var Graph = require('graphology');
var betweenness = require('../centrality/betweenness');
var data = require('./resources/betweenness.json');

var graph = Graph.UndirectedGraph.from(data);

console.time('betweenness');
betweenness(graph);
console.timeEnd('betweenness');
