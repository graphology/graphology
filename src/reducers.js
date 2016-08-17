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
