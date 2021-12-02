var Graph = require('graphology');
var complete = require('graphology-generators/classic/complete');
var forEachConnectedComponent = require('../').forEachConnectedComponent;

var K = complete(Graph.UndirectedGraph, 3500);

console.time('dfs');
forEachConnectedComponent(K, function (component) {
  console.log(component);
});
console.timeEnd('dfs');
