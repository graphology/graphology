/**
 * Graphology CirclePack Layout
 * =============================
 *
 * Circlepack layout from d3-hierarchy/gephi.
 */
var resolveDefaults = require('graphology-utils/defaults');
var isGraph = require('graphology-utils/is-graph');
var shuffle = require('pandemonium/shuffle-in-place');

/**
 * Default options.
 */
var DEFAULTS = {
  attributes: {
    x: 'x',
    y: 'y'
  },
  center: 0,
  hierarchyAttributes: [],
  rng: Math.random,
  scale: 1
};

/**
 * Helpers.
 */
function CircleWrap(id, x, y, r, circleWrap) {
  this.wrappedCircle = circleWrap || null; //hacky d3 reference thing

  this.children = {};
  this.countChildren = 0;
  this.id = id || null;
  this.next = null;
  this.previous = null;

  this.x = x || null;
  this.y = y || null;
  if (circleWrap) this.r = 1010101;
  // for debugging purposes - should not be used in this case
  else this.r = r || 999;
}

CircleWrap.prototype.hasChildren = function () {
  return this.countChildren > 0;
};

CircleWrap.prototype.addChild = function (id, child) {
  this.children[id] = child;
  ++this.countChildren;
};

CircleWrap.prototype.getChild = function (id) {
  if (!this.children.hasOwnProperty(id)) {
    var circleWrap = new CircleWrap();
    this.children[id] = circleWrap;
    ++this.countChildren;
  }
  return this.children[id];
};

CircleWrap.prototype.applyPositionToChildren = function () {
  if (this.hasChildren()) {
    var root = this; // using 'this' in Object.keys.forEach seems a bad idea
    for (var key in root.children) {
      var child = root.children[key];
      child.x += root.x;
      child.y += root.y;
      child.applyPositionToChildren();
    }
  }
};

function setNode(/*Graph*/ graph, /*CircleWrap*/ parentCircle, /*Map*/ posMap) {
  for (var key in parentCircle.children) {
    var circle = parentCircle.children[key];
    if (circle.hasChildren()) {
      setNode(graph, circle, posMap);
    } else {
      posMap[circle.id] = {x: circle.x, y: circle.y};
    }
  }
}

function enclosesNot(/*CircleWrap*/ a, /*CircleWrap*/ b) {
  var dr = a.r - b.r;
  var dx = b.x - a.x;
  var dy = b.y - a.y;
  return dr < 0 || dr * dr < dx * dx + dy * dy;
}

function enclosesWeak(/*CircleWrap*/ a, /*CircleWrap*/ b) {
  var dr = a.r - b.r + 1e-6;
  var dx = b.x - a.x;
  var dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

function enclosesWeakAll(/*CircleWrap*/ a, /*Array<CircleWrap>*/ B) {
  for (var i = 0; i < B.length; ++i) {
    if (!enclosesWeak(a, B[i])) {
      return false;
    }
  }
  return true;
}

function encloseBasis1(/*CircleWrap*/ a) {
  return new CircleWrap(null, a.x, a.y, a.r);
}

function encloseBasis2(/*CircleWrap*/ a, /*CircleWrap*/ b) {
  var x1 = a.x,
    y1 = a.y,
    r1 = a.r,
    x2 = b.x,
    y2 = b.y,
    r2 = b.r,
    x21 = x2 - x1,
    y21 = y2 - y1,
    r21 = r2 - r1,
    l = Math.sqrt(x21 * x21 + y21 * y21);
  return new CircleWrap(
    null,
    (x1 + x2 + (x21 / l) * r21) / 2,
    (y1 + y2 + (y21 / l) * r21) / 2,
    (l + r1 + r2) / 2
  );
}

function encloseBasis3(/*CircleWrap*/ a, /*CircleWrap*/ b, /*CircleWrap*/ c) {
  var x1 = a.x,
    y1 = a.y,
    r1 = a.r,
    x2 = b.x,
    y2 = b.y,
    r2 = b.r,
    x3 = c.x,
    y3 = c.y,
    r3 = c.r,
    a2 = x1 - x2,
    a3 = x1 - x3,
    b2 = y1 - y2,
    b3 = y1 - y3,
    c2 = r2 - r1,
    c3 = r3 - r1,
    d1 = x1 * x1 + y1 * y1 - r1 * r1,
    d2 = d1 - x2 * x2 - y2 * y2 + r2 * r2,
    d3 = d1 - x3 * x3 - y3 * y3 + r3 * r3,
    ab = a3 * b2 - a2 * b3,
    xa = (b2 * d3 - b3 * d2) / (ab * 2) - x1,
    xb = (b3 * c2 - b2 * c3) / ab,
    ya = (a3 * d2 - a2 * d3) / (ab * 2) - y1,
    yb = (a2 * c3 - a3 * c2) / ab,
    A = xb * xb + yb * yb - 1,
    B = 2 * (r1 + xa * xb + ya * yb),
    C = xa * xa + ya * ya - r1 * r1,
    r = -(A ? (B + Math.sqrt(B * B - 4 * A * C)) / (2 * A) : C / B);
  return new CircleWrap(null, x1 + xa + xb * r, y1 + ya + yb * r, r);
}

function encloseBasis(/*Array<CircleWrap>*/ B) {
  switch (B.length) {
    case 1:
      return encloseBasis1(B[0]);
    case 2:
      return encloseBasis2(B[0], B[1]);
    case 3:
      return encloseBasis3(B[0], B[1], B[2]);
    default:
      throw new Error(
        'graphology-layout/circlepack: Invalid basis length ' + B.length
      );
  }
}

function extendBasis(/*Array<CircleWrap>*/ B, /*CircleWrap*/ p) {
  var i, j;

  if (enclosesWeakAll(p, B)) return [p];

  // If we get here then B must have at least one element.
  for (i = 0; i < B.length; ++i) {
    if (enclosesNot(p, B[i]) && enclosesWeakAll(encloseBasis2(B[i], p), B)) {
      return [B[i], p];
    }
  }

  // If we get here then B must have at least two elements.
  for (i = 0; i < B.length - 1; ++i) {
    for (j = i + 1; j < B.length; ++j) {
      if (
        enclosesNot(encloseBasis2(B[i], B[j]), p) &&
        enclosesNot(encloseBasis2(B[i], p), B[j]) &&
        enclosesNot(encloseBasis2(B[j], p), B[i]) &&
        enclosesWeakAll(encloseBasis3(B[i], B[j], p), B)
      ) {
        return [B[i], B[j], p];
      }
    }
  }

  // If we get here then something is very wrong.
  throw new Error('graphology-layout/circlepack: extendBasis failure !');
}

function score(/*CircleWrap*/ node) {
  var a = node.wrappedCircle;
  var b = node.next.wrappedCircle;
  var ab = a.r + b.r;
  var dx = (a.x * b.r + b.x * a.r) / ab;
  var dy = (a.y * b.r + b.y * a.r) / ab;
  return dx * dx + dy * dy;
}

function enclose(circles, shuffleFunc) {
  var i = 0;
  var circlesLoc = circles.slice();

  var n = circles.length;
  var B = [];
  var p;
  var e;
  shuffleFunc(circlesLoc);
  while (i < n) {
    p = circlesLoc[i];
    if (e && enclosesWeak(e, p)) {
      ++i;
    } else {
      B = extendBasis(B, p);
      e = encloseBasis(B);
      i = 0;
    }
  }
  return e;
}

function place(/*CircleWrap*/ b, /*CircleWrap*/ a, /*CircleWrap*/ c) {
  var dx = b.x - a.x,
    x,
    a2,
    dy = b.y - a.y,
    y,
    b2,
    d2 = dx * dx + dy * dy;
  if (d2) {
    a2 = a.r + c.r;
    a2 *= a2;
    b2 = b.r + c.r;
    b2 *= b2;
    if (a2 > b2) {
      x = (d2 + b2 - a2) / (2 * d2);
      y = Math.sqrt(Math.max(0, b2 / d2 - x * x));
      c.x = b.x - x * dx - y * dy;
      c.y = b.y - x * dy + y * dx;
    } else {
      x = (d2 + a2 - b2) / (2 * d2);
      y = Math.sqrt(Math.max(0, a2 / d2 - x * x));
      c.x = a.x + x * dx - y * dy;
      c.y = a.y + x * dy + y * dx;
    }
  } else {
    c.x = a.x + c.r;
    c.y = a.y;
  }
}

function intersects(/*CircleWrap*/ a, /*CircleWrap*/ b) {
  var dr = a.r + b.r - 1e-6,
    dx = b.x - a.x,
    dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

function packEnclose(/*Array<CircleWrap>*/ circles, shuffleFunc) {
  var n = circles.length;
  if (n === 0) return 0;

  var a, b, c, aa, ca, i, j, k, sj, sk;

  // Place the first circle.
  a = circles[0];
  a.x = 0;
  a.y = 0;
  if (n <= 1) return a.r;

  // Place the second circle.
  b = circles[1];
  a.x = -b.r;
  b.x = a.r;
  b.y = 0;
  if (n <= 2) return a.r + b.r;

  // Place the third circle.
  c = circles[2];
  place(b, a, c);

  // Initialize the front-chain using the first three circles a, b and c.
  a = new CircleWrap(null, null, null, null, a);
  b = new CircleWrap(null, null, null, null, b);
  c = new CircleWrap(null, null, null, null, c);
  a.next = c.previous = b;
  b.next = a.previous = c;
  c.next = b.previous = a;

  // Attempt to place each remaining circle…
  pack: for (i = 3; i < n; ++i) {
    c = circles[i];
    place(a.wrappedCircle, b.wrappedCircle, c);
    c = new CircleWrap(null, null, null, null, c);

    // Find the closest intersecting circle on the front-chain, if any.
    // “Closeness” is determined by linear distance along the front-chain.
    // “Ahead” or “behind” is likewise determined by linear distance.
    j = b.next;
    k = a.previous;
    sj = b.wrappedCircle.r;
    sk = a.wrappedCircle.r;
    do {
      if (sj <= sk) {
        if (intersects(j.wrappedCircle, c.wrappedCircle)) {
          b = j;
          a.next = b;
          b.previous = a;
          --i;
          continue pack;
        }
        sj += j.wrappedCircle.r;
        j = j.next;
      } else {
        if (intersects(k.wrappedCircle, c.wrappedCircle)) {
          a = k;
          a.next = b;
          b.previous = a;
          --i;
          continue pack;
        }
        sk += k.wrappedCircle.r;
        k = k.previous;
      }
    } while (j !== k.next);

    // Success! Insert the new circle c between a and b.
    c.previous = a;
    c.next = b;
    a.next = b.previous = b = c;

    // Compute the new closest circle pair to the centroid.
    aa = score(a);
    while ((c = c.next) !== b) {
      if ((ca = score(c)) < aa) {
        a = c;
        aa = ca;
      }
    }
    b = a.next;
  }

  // Compute the enclosing circle of the front chain.
  a = [b.wrappedCircle];
  c = b;
  var safety = 10000;
  while ((c = c.next) !== b) {
    if (--safety === 0) {
      break;
    }
    a.push(c.wrappedCircle);
  }
  c = enclose(a, shuffleFunc);

  // Translate the circles to put the enclosing circle around the origin.
  for (i = 0; i < n; ++i) {
    a = circles[i];
    a.x -= c.x;
    a.y -= c.y;
  }
  return c.r;
}

function packHierarchy(/*CircleWrap*/ parentCircle, shuffleFunc) {
  var r = 0;
  if (parentCircle.hasChildren()) {
    //pack the children first because the radius is determined by how the children get packed (recursive)
    for (var key in parentCircle.children) {
      var circle = parentCircle.children[key];
      if (circle.hasChildren()) {
        circle.r = packHierarchy(circle, shuffleFunc);
      }
    }
    //now that each circle has a radius set by its children, pack the circles at this level
    r = packEnclose(Object.values(parentCircle.children), shuffleFunc);
  }
  return r;
}

function packHierarchyAndShift(/*CircleWrap*/ parentCircle, shuffleFunc) {
  packHierarchy(parentCircle, shuffleFunc);
  for (var key in parentCircle.children) {
    var circle = parentCircle.children[key];
    circle.applyPositionToChildren();
  }
}

/**
 * Abstract function running the layout.
 *
 * @param  {Graph}    graph                   - Target  graph.
 * @param  {object}   [options]               - Options:
 * @param  {object}     [attributes]          - Attributes names to map.
 * @param  {number}     [center]              - Center of the layout.
 * @param  {string[]}   [hierarchyAttributes] - List of attributes used for the layout in decreasing order.
 * @param  {function}   [rng]                 - Custom RNG function to be used.
 * @param  {number}     [scale]               - Scale of the layout.
 * @return {object}                           - The positions by node.
 */
function genericCirclePackLayout(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout/circlepack: the given graph is not a valid graphology instance.'
    );

  options = resolveDefaults(options, DEFAULTS);

  var posMap = {},
    positions = {},
    nodes = graph.nodes(),
    center = options.center,
    hierarchyAttributes = options.hierarchyAttributes,
    shuffleFunc = shuffle.createShuffleInPlace(options.rng),
    scale = options.scale;

  var container = new CircleWrap();

  graph.forEachNode(function (key, attributes) {
    var r = attributes.size ? attributes.size : 1;
    var newCircleWrap = new CircleWrap(key, null, null, r);
    var parentContainer = container;

    hierarchyAttributes.forEach(function (v) {
      var attr = attributes[v];
      parentContainer = parentContainer.getChild(attr);
    });

    parentContainer.addChild(key, newCircleWrap);
  });
  packHierarchyAndShift(container, shuffleFunc);
  setNode(graph, container, posMap);
  var l = nodes.length,
    x,
    y,
    i;
  for (i = 0; i < l; i++) {
    var node = nodes[i];

    x = center + scale * posMap[node].x;
    y = center + scale * posMap[node].y;

    positions[node] = {
      x: x,
      y: y
    };

    if (assign) {
      graph.setNodeAttribute(node, options.attributes.x, x);
      graph.setNodeAttribute(node, options.attributes.y, y);
    }
  }
  return positions;
}

var circlePackLayout = genericCirclePackLayout.bind(null, false);
circlePackLayout.assign = genericCirclePackLayout.bind(null, true);

module.exports = circlePackLayout;
