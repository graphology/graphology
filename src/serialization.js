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
 * Formats internal node data into a serialized node.
 *
 * @param  {any}    key  - The node's key.
 * @param  {object} data - Internal node's data.
 * @return {array}       - The serialized node.
 */
export function serializeNode(key, data) {
  const serialized = {key};

  if (Object.keys(data.attributes).length)
    serialized.attributes = data.attributes;

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
  const serialized = {
    key,
    source: data.source,
    target: data.target
  };

  if (Object.keys(data.attributes).length)
    serialized.attributes = data.attributes;

  if (data.undirected)
    serialized.undirected = true;

  return serialized;
}

/**
 * Checks whether the given value is a serialized node.
 *
 * @param  {mixed} value - Target value.
 * @return {boolean}
 */
export function validateSerializedNode(value) {
  if (!isPlainObject(value))
    return {valid: false, reason: 'not-object'};

  if (!('key' in value))
    return {valid: false, reason: 'no-key'};

  if ('attributes' in value &&
      (!isPlainObject(value.attributes) || value.attributes === null))
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
  if (!isPlainObject(value))
    return {valid: false, reason: 'not-object'};

  if (!('source' in value))
    return {valid: false, reason: 'no-source'};

  if (!('target' in value))
    return {valid: false, reason: 'no-target'};

  if ('attributes' in value &&
      (!isPlainObject(value.attributes) || value.attributes === null))
    return {valid: false, reason: 'invalid-attributes'};

  if ('undirected' in value &&
      (typeof value.undirected !== 'boolean'))
    return {valid: false, reason: 'invalid-undirected'};

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
