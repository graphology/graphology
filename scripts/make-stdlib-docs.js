const pkg = require('../package.json');

const stdlib = Object.keys(pkg.dependencies)
  .filter(key => key !== 'graphology')
  .map(key => key.replace(/^graphology-/, ''));

console.log(stdlib);
