/**
 * Graphology Serialization Utilities
 * ===================================
 *
 * Collection of functions used to validate import-export formats & to ouput
 * them from internal graph data.
 *
 * Serialized Node:
 * {key, ?attributes}
 *
 * Serialized Edge:
 * {key?, source, target, attributes?, undirected?}
 *
 * Serialized Graph:
 * {nodes[], edges?[]}
 */
import {UndirectedEdgeData} from './data';
import {assign, isPlainObject} from './utils';

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
    serialized.attributes = assign({}, data.attributes);

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
    source: data.source.key,
    target: data.target.key
  };

  // We export the key unless if it was provided by the user
  if (!data.generatedKey)
    serialized.key = key;

  if (Object.keys(data.attributes).length)
    serialized.attributes = assign({}, data.attributes);

  if (data instanceof UndirectedEdgeData)
    serialized.undirected = true;

  return serialized;
}

/**
 * Checks whether the given value is a serialized node.
 *
 * @param  {mixed} value - Target value.
 * @return {string|null}
 */
export function validateSerializedNode(value) {
  if (!isPlainObject(value))
    return 'not-object';

  if (!('key' in value))
    return 'no-key';

  if ('attributes' in value &&
      (!isPlainObject(value.attributes) || value.attributes === null))
    return 'invalid-attributes';

  return null;
}

/**
 * Checks whether the given value is a serialized edge.
 *
 * @param  {mixed} value - Target value.
 * @return {string|null}
 */
export function validateSerializedEdge(value) {
  if (!isPlainObject(value))
    return 'not-object';

  if (!('source' in value))
    return 'no-source';

  if (!('target' in value))
    return 'no-target';

  if ('attributes' in value &&
      (!isPlainObject(value.attributes) || value.attributes === null))
    return 'invalid-attributes';

  if ('undirected' in value &&
      (typeof value.undirected !== 'boolean'))
    return 'invalid-undirected';

  return null;
}
