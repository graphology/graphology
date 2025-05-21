var chiSquareGSquare = require('./chi-square-g-square');

var gSquare = chiSquareGSquare.bind(null, false, 'gSquare');
gSquare.assign = chiSquareGSquare.bind(null, true, 'gSquare');
gSquare.thresholds = chiSquareGSquare.thresholds;

module.exports = gSquare;
