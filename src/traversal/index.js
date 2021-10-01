var bfsModule = require('./bfs.js');
var dfsModule = require('./dfs.js');

var k;

for (k in bfsModule)
  exports[k] = bfsModule[k];

for (k in dfsModule)
  exports[k] = dfsModule[k];
