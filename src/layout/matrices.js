/**
 * Sigma.js WebGL Matrices Helpers
 * ================================
 *
 * Matrices-related helper functions used by sigma's WebGL renderer.
 * @module
 */

exports.identity = function identity() {
  return Float64Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1);
};

exports.scale = function scale(m, x, y) {
  m[0] = x;
  m[4] = typeof y === 'number' ? y : x;

  return m;
};

exports.rotate = function rotate(m, r) {
  var s = Math.sin(r);
  var c = Math.cos(r);

  m[0] = c;
  m[1] = s;
  m[3] = -s;
  m[4] = c;

  return m;
};

exports.translate = function translate(m, x, y) {
  m[6] = x;
  m[7] = y;

  return m;
};

exports.multiply = function multiply(a, b) {
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a10 = a[3];
  var a11 = a[4];
  var a12 = a[5];
  var a20 = a[6];
  var a21 = a[7];
  var a22 = a[8];

  var b00 = b[0];
  var b01 = b[1];
  var b02 = b[2];
  var b10 = b[3];
  var b11 = b[4];
  var b12 = b[5];
  var b20 = b[6];
  var b21 = b[7];
  var b22 = b[8];

  a[0] = b00 * a00 + b01 * a10 + b02 * a20;
  a[1] = b00 * a01 + b01 * a11 + b02 * a21;
  a[2] = b00 * a02 + b01 * a12 + b02 * a22;

  a[3] = b10 * a00 + b11 * a10 + b12 * a20;
  a[4] = b10 * a01 + b11 * a11 + b12 * a21;
  a[5] = b10 * a02 + b11 * a12 + b12 * a22;

  a[6] = b20 * a00 + b21 * a10 + b22 * a20;
  a[7] = b20 * a01 + b21 * a11 + b22 * a21;
  a[8] = b20 * a02 + b21 * a12 + b22 * a22;

  return a;
};

exports.multiplyVec2 = function multiplyVec2(a, b) {
  var a00 = a[0];
  var a01 = a[1];
  var a10 = a[3];
  var a11 = a[4];
  var a20 = a[6];
  var a21 = a[7];

  var b0 = b.x;
  var b1 = b.y;

  b.x = b0 * a00 + b1 * a10 + a20;
  b.y = b0 * a01 + b1 * a11 + a21;
};
