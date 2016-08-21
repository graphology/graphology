/**
 * Graphology Serialization Utilities
 * ===================================
 *
 * Collection of functions used to validate import-export formats & to ouput
 * them from internal graph data.
 *
 * Serialized Node:
 * [key, ?attributes]
 *
 * Serialized Edge:
 */
import {isPlainObject} from './utils';

/**
 * Checks whether the given value is a serialized node.
 *
 * @param  {mixed} value - Target value.
 * @return {boolean}
 */
export function validateSerializedNode(value) {
  if (!Array.isArray(value))
    return {valid: false, reason: 'not-array'};

  if (value.length !== 1 && value.length !== 2)
    return {valid: false, reason: 'invalid-length'};

  if (value.length > 1 && value[1] !== null && !isPlainObject(value[1]))
    return {valid: false, reason: 'invalid-attributes'};

  return {valid: true};
}

/**
 * Checks whether the given value is a serialized edge.
 *
 * @param  {mixed} value - Target value.
 * @return {boolean}
 */
export function validateSerializedEdge(value) {
  if (!Array.isArray(value))
    return {valid: false, reason: 'not-array'};

  if (value.length !== 3 && value.length !== 4 && value.length !== 5)
    return {valid: false, reason: 'invalid-length'};

  if (value.length > 2 && value[3] !== null && !isPlainObject(value[3]))
    return {valid: false, reason: 'invalid-attributes'};

  if (value.length > 3 && value[4] !== null && typeof value[4] !== 'boolean')
    return {valid: false, reason: 'invalid-directedness'};

  return {valid: true};
}

/**
 * Checks whether the given value is a serialized graph.
 *
 * @param  {mixed} value - Target value.
 * @return {boolean}
 */
export function validateSerializedGraph(value) {
  if (!isPlainObject(value))
    return {valid: false, reason: 'not-object'};

  if (!Array.isArray(value.nodes))
    return {valid: false, reason: 'invalid-nodes'};

  if ('edges' in value && !Array.isArray(value.edges))
    return {valid: false, reason: 'invalid-edges'};

  return {valid: true};
}

/**
 * Formats internal node data into a serialized node.
 *
 * @param  {any}    key  - The node's key.
 * @param  {object} data - Internal node's data.
 * @return {array}       - The serialized node.
 */
export function serializeNode(key, data) {
  const serialized = [key];

  if (Object.keys(data.attributes).length)
    serialized.push(data.attributes);

  return serialized;
}

/**
 * Formats internal edge data into a serialized edge.
 *
 * @param  {any}    key  - The edge's key.
 * @param  {object} data - Internal edge's data.
 * @return {array}       - The serialized edge.
 */
export function serializeEdge(key, data) {
  const serialized = [
    key,
    data.source,
    data.target
  ];

  if (!data.undirected) {
    if (Object.keys(data.attributes).length)
      serialized.push(data.attributes);
  }
  else {
    serialized.push(data.attributes, true);
  }

  return serialized;
}
