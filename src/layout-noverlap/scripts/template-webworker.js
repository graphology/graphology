var fs = require('fs');

var iterate = fs.readFileSync('./iterate.js', 'utf-8');
var tpl = fs.readFileSync('./webworker.tpl.js', 'utf-8');

iterate = iterate.replace(/module\.exports/, 'moduleShim.exports');
var result = tpl.replace(/\/\/\s*<%= iterate %>/, iterate);

console.log(result);
