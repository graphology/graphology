var assert = require('chai').assert;

function deepApproximatelyEqual(t, o, precision) {
  for (var k in t) {
    if (typeof t[k] === 'object') {
      deepApproximatelyEqual(t[k], o[k], precision);
      continue;
    }

    assert.approximately(t[k], o[k], precision || 1e-7);
  }
}

exports.deepApproximatelyEqual = deepApproximatelyEqual;
