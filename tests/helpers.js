/**
 * Graphology Specs Helpers
 * =========================
 *
 * Miscellaneous helpers to test more easily.
 */

/**
 * Simplistic deep merger function.
 */
export function deepMerge(...objects) {
  const o = objects[0];

  let t,
      i,
      l,
      k;

  for (i = 1, l = objects.length; i < l; i++) {
    t = objects[i];

    for (k in t) {
      if (typeof t[k] === 'object') {
        o[k] = deepMerge(o[k] || {}, t[k]);
      }
      else {
        o[k] = t[k];
      }
    }
  }

  return o;
}

/**
 * Bunches constants.
 */
export const BUNCH_TYPES = [
  [],
  new Set(),
  {},
  new Map()
];

export const NON_BUNCH_TYPES = [
  null,
  false,
  'test',
  14
];

/**
 * Helper to perform bunch tests thoroughly.
 *
 * @param {object|array} target - target object to copy as different bunches.
 * @param {function}            - Assertion function to run on each type.
 */
export function testBunches(target, fn) {
  let bunches = [];

  if (Array.isArray(target)) {

    const map = new Map(),
          set = new Set(),
          object = {};

    for (let i = 0, l = target.length; i < l; i++) {
      const item = target[i];
      map.set(item, {});
      set.add(item);
      object[item] = {};
    }

    bunches = [
      [false, 'array', target],
      [false, 'set', set],
      [true, 'object', object],
      [true, 'map', map]
    ];
  }
  else {
    const map = new Map(),
          set = new Set(),
          array = [];

    for (const k in target) {
      array.push(k);
      set.add(k);
      map.set(k, target[k]);
    }

    bunches = [
      [false, 'array', array],
      [false, 'set', set],
      [true, 'object', target],
      [true, 'map', map]
    ];
  }

  bunches.forEach(type => {
    fn(...type);
  });
}
