/**
 * Graphology Reducer Description
 * ===============================
 *
 * Some handy decriptions constants about JavaScript common reducing patterns.
 */

/**
 * Helpers
 */
const identity = x => x,
      array = () => ([]),
      name = (method, plural) => element => method + element + (plural ? 's' : '');

/**
 * Standard reducers.
 */
export const REDUCERS = [
  {
    name: name('forEach', false),
    value: identity,
    reducer: callback => (current, element, index, graph) => {
      callback(element, index, graph);
      return current;
    }
  },
  {
    name: name('map', true),
    value: array,
    reducer: callback => (current, element, index, graph) => {
      current.push(callback(element, index, graph));
      return current;
    }
  },
  {
    name: name('filter', true),
    value: array,
    reducer: callback => (current, element, index, graph) => {
      if (callback(element, index, graph))
        current.push(element);
      return current;
    }
  }
];

/**
 * Breaking reducers.
 */
export const FINDERS = [
  {
    name: name('find', false),
    value: ([element]) => element
  },
  {
    name: name('some', false),
    value: ([, index]) => index !== -1
  },
  {
    name: name('every', false),
    value: ([, index]) => index === -1,
    reversed: true
  }
];

/**
 * Abstract reducer function.
 *
 * @param  {Map|Array|object} items        - Iteration target.
 * @param  {function}         callback     - Iteration callback.
 * @param  {mixed}            initialValue - Optional starting value.
 * @return {mixed}                         - Accumulation result.
 */
export function abstractReducer(items, callback, initialValue) {
  const initialValueProvided = arguments.length > 2;

  let current = initialValue,
      i = 0;

  // Map iteration
  if (typeof Map === 'function' && items instanceof Map) {
    items.forEach((_, item) => {
      if (!i && !initialValueProvided)
        current = item;
      else
        current = callback(current, item, i, this);

      i++;
    });
  }

  // Array iteration
  else if (Array.isArray(items)) {
    for (let j = 0, l = items.length; j < l; j++) {
      if (!j && !initialValueProvided)
        current = items[j];
      else
        current = callback(current, items[j], j, this);
    }
  }

  // Object iteration
  else {
    for (const item in items) {
      if (!i && !initialValueProvided)
        current = item;
      else
        current = callback(current, item, i, this);

      i++;
    }
  }

  return current;
}

/**
 * Abstract finder (breakable reducer) function.
 *
 * @param  {Map|Array|object} items     - Iteration target.
 * @param  {function}         predicate - Predicate function.
 * @return {array}                      - (Found item, index).
 */
export function abstractFinder(items, predicate, reversed = false) {
  let i = 0;

  // Map iteration
  if (typeof Map === 'function' && items instanceof Map) {
    for (const item of items.keys()) {
      let found = predicate(item, i++, this);

      if (reversed)
        found = !found;

      if (found)
        return [item, i];
    }
  }

  // Array iteration
  else if (Array.isArray(items)) {
    for (let j = 0, l = items.length; j < l; j++) {
      let found = predicate(items[j], j, this);

      if (reversed)
        found = !found;

      if (found)
        return [items[j], j];
    }
  }

  // Object iteration
  else {
    for (const item in items) {
      let found = predicate(item, i++, this);

      if (reversed)
        found = !found;

      if (found)
        return [item, i];
    }
  }

  return [undefined, -1];
}

