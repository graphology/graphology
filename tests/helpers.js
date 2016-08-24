/**
 * Graphology Specs Helpers
 * =========================
 *
 * Miscellaneous helpers to test more easily.
 */

/**
 * Capitalize function.
 */
export function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}

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
 * Checking that two arrays have the same members.
 */
export function sameMembers(a1, a2) {
  if (a1.length !== a2.length)
    return false;

  const set = new Set(a1);

  for (let i = 0, l = a2.length; i < l; i++) {
    if (!set.has(a2[i]))
      return false;
  }

  return true;
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
 * Function spying on the execution of the provided function to ease some
 * tests, notably related to event handling.
 *
 * @param {function} target - Target function.
 * @param {function}        - The spy.
 */
export function spy(target) {
  const fn = function() {
    fn.called = true;
    fn.times++;

    if (typeof target === 'function')
      return target.apply(null, arguments);
  };

  fn.called = false;
  fn.times = 0;

  return fn;
}

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
      [target, false, 'array'],
      [set, false, 'set'],
      [object, true, 'object'],
      [map, true, 'map']
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
      [array, false, 'array'],
      [set, false, 'set'],
      [target, true, 'object'],
      [map, true, 'map']
    ];
  }

  bunches.forEach(type => {
    fn(...type);
  });
}
