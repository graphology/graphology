var chiSquareGSquare = require('./chi-square-g-square');

var chiSquare = chiSquareGSquare.bind(null, false, 'chiSquare');
chiSquare.assign = chiSquareGSquare.bind(null, true, 'chiSquare');
chiSquare.thresholds = chiSquareGSquare.thresholds;

module.exports = chiSquare;
