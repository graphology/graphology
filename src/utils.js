/* eslint no-nested-ternary: 0 */
/**
 * Graphology Utilities
 * =====================
 *
 * Collection of helpful functions used by the implementation.
 */

/**
 * Very simple Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
export function assign(target, ...objects) {
  target = target || {};

  for (let i = 0, l = objects.length; i < l; i++) {
    if (!objects[i])
      continue;

    for (const k in objects[i])
      target[k] = objects[i][k];
  }

  return target;
}

/**
 * Class emulating a Set object & used internally to reduce memory footprint &
 * ensure ES5 compatibility.
 *
 * @constructor
 */
export class BasicSet {
  constructor(values) {
    this.entries = {};
    this.size = 0;

    if (values) {
      for (let i = 0, l = values.length; i < l; i++)
        this.add(values[i]);
    }
  }

  add(value) {
    if (!(value in this.entries)) {
      this.entries[value] = true;
      this.size++;
    }
  }

  delete(value) {
    delete this.entries[value];
    this.size--;
  }

  has(value) {
    return value in this.entries;
  }

  first() {
    for (const value in this.entries)
      return value;
  }

  values() {
    return Object.keys(this.entries);
  }

  inspect() {
    const values = this.values().map(v => JSON.stringify(v)).join(', ');

    return 'BasicSet { ' + values + ' }';
  }
}

/**
 * Checks whether the given value is a potential bunch.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
export function isBunch(value) {
  return (
    !!value &&
    typeof value === 'object' &&
    (
      (
        Array.isArray(value) ||
        (typeof Map === 'function' && value instanceof Map) ||
        (typeof Set === 'function' && value instanceof Set)
      ) ||
      (
        !(value instanceof Date) &&
        !(value instanceof RegExp)
      )
    )
  );
}

/**
 * Checks whether the given value is a Graph implementation instance.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
export function isGraph(value) {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof value.addUndirectedEdgeWithKey === 'function' &&
    typeof value.dropNode === 'function'
  );
}

/**
 * Checks whether the given value is a plain object.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
export function isPlainObject(value) {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof RegExp) &&
    !(typeof Map === 'function' && value instanceof Map) &&
    !(typeof Set === 'function' && value instanceof Set)
  );
}

/**
 * Iterates over the provided bunch.
 *
 * @param {object}   bunch    - Target bunch.
 * @param {function} callback - Function to call.
 */
export function overBunch(bunch, callback) {

  // Array iteration
  if (Array.isArray(bunch)) {
    for (let i = 0, l = bunch.length; i < l; i++) {
      const shouldBreak = callback(bunch[i], {}) === false;

      if (shouldBreak)
        break;
    }
  }

  // Map & Set iteration
  // TODO: use a while loop here!
  else if (typeof bunch.forEach === 'function') {
    for (const [k, v] of bunch.entries()) {
      let shouldBreak = false;

      if (v === k)
        shouldBreak = callback(v, {}) === false;
      else
        shouldBreak = callback(k, v) === false;

      if (shouldBreak)
        break;
    }
  }

  // Plain object iteration
  else {
    for (const key in bunch) {
      const attributes = bunch[key];

      const shouldBreak = callback(key, attributes);

      if (shouldBreak)
        break;
    }
  }
}

/**
 * Pretty prints the given integer.
 *
 * @param  {number}  integer - Target integer.
 * @return {string}          - The pretty string.
 */
export function prettyPrint(integer) {
  const string = '' + integer;

  let prettyString = '';

  for (let i = 0, l = string.length; i < l; i++) {
    const j = l - i - 1;

    prettyString = string[j] + prettyString;

    if (!((i - 2) % 3))
      prettyString = ',' + prettyString;
  }

  return prettyString;
}

/**
 * Creates a "private" property for the given member name by concealing it
 * using the `enumerable` option.
 *
 * @param {object} target - Target object.
 * @param {string} name   - Member name.
 */
export function privateProperty(target, name, value) {
  Object.defineProperty(target, name, {
    enumerable: false,
    configurable: false,
    writable: true,
    value
  });
}


/**
 * Creates a read-only property for the given member name & the given getter.
 *
 * @param {object}   target - Target object.
 * @param {string}   name   - Member name.
 * @param {mixed}    value  - The attached getter or fixed value.
 */
export function readOnlyProperty(target, name, value) {
  const descriptor = {
    enumerable: true,
    configurable: false
  };

  if (typeof value === 'function') {
    descriptor.get = value;
  }
  else {
    descriptor.value = value;
    descriptor.writable = false;
  }

  Object.defineProperty(target, name, descriptor);
}

/**
 * Function returning uuid v4 compressed into base62 to have 22 characters-long
 * ids easily copy-pastable or usable in a URL.
 *
 * @return {string} - The uuid.
 */
const RANDOM_BYTES = new Uint8Array(16),
      BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function rng() {
  for (let i = 0, r; i < 16; i++) {
    if ((i & 0x03) === 0)
      r = Math.random() * 0x100000000;
    RANDOM_BYTES[i] = r >>> ((i & 0x03) << 3) & 0xff;
  }

  return RANDOM_BYTES;
}

function uuidBytes() {
  const random = rng();

  random[6] = (random[6] & 0x0f) | 0x40;
  random[8] = (random[8] & 0x3f) | 0x80;

  return random;
}

function toBase62(bytes) {
  const digits = [0];

  for (let i = 0, l = bytes.length; i < l; i++) {
    let carry = bytes[i];

    for (let j = 0, m = digits.length; j < m; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 62;
      carry = (carry / 62) | 0;
    }

    while (carry > 0) {
      digits.push(carry % 62);
      carry = (carry / 62) | 0;
    }
  }

  let string = '';

  for (let i = 0, l = bytes.length; bytes[i] === 0 && i < l - 1; i++)
    string += BASE62[0];
  for (let i = digits.length - 1; i >= 0; i--)
    string += BASE62[digits[i]];

  while (string.length < 22)
    string += '0';

  return string;
}

export function uuid() {
  const bytes = uuidBytes();

  return toBase62(bytes);
}
