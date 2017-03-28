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
 * Custom Map used internally to coerce keys on vital operations.
 *
 * @return {Map}
 */
export function createInternalMap() {
  const map = new Map();

  map.set = function(key, value) {
    key = '' + key;
    return Map.prototype.set.call(this, key, value);
  };

  map.get = function(key) {
    key = '' + key;
    return Map.prototype.get.call(this, key);
  };

  map.has = function(key) {
    key = '' + key;
    return Map.prototype.has.call(this, key);
  };

  map.delete = function(key) {
    key = '' + key;
    return Map.prototype.delete.call(this, key);
  };

  return map;
}

/**
 * Function consuming the given iterator.
 *
 * @param  {number}   size     - Size of the target.
 * @param  {Iterator} iterator - Target iterator.
 * @return {Array}
 */
export function consumeIterator(size, iterator) {
  const array = new Array(size);

  let i = 0,
      step;

  while ((step = iterator.next(), !step.done))
    array[i++] = step.value;

  return array;
}

/**
 * Function returning the first matching edge for given path.
 * Note: this function does not check the existence of source & target. This
 * must be performed by the caller.
 *
 * @param  {Graph}  graph  - Target graph.
 * @param  {any}    source - Source node.
 * @param  {any}    target - Target node.
 * @param  {string} type   - Type of the edge (mixed, directed or undirected).
 * @return {string|null}
 */
export function getMatchingEdge(graph, source, target, type) {
  const sourceData = graph._nodes.get(source);

  let edge = null;

  if (type === 'mixed') {
    edge = sourceData.out[target] || sourceData.undirected[target];
  }
  else if (type === 'directed') {
    edge = sourceData.out[target];
  }
  else {
    edge = sourceData.undirected[target];
  }

  return edge;
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
      const shouldBreak = callback(bunch[i], null) === false;

      if (shouldBreak)
        break;
    }
  }

  // Map & Set iteration
  else if (typeof bunch.forEach === 'function') {
    const iterator = bunch.entries();

    let shouldBreak = false,
        step;

    while (step = iterator.next()) {
      const {value, done} = step;

      if (done)
        break;

      const [k, v] = value;

      if (v === k)
        shouldBreak = callback(v, null) === false;
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

    if (!((i - 2) % 3) && i !== l - 1)
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
    configurable: true
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
