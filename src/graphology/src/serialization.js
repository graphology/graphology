/**
 * Graphology Serialization Utilities
 * ===================================
 *
 * Collection of functions used by the graph serialization schemes.
 */
import {InvalidArgumentsGraphError} from './errors';
import {assign, isPlainObject, isEmpty} from './utils';

/**
 * Formats internal node data into a serialized node.
 *
 * @param  {any}    key  - The node's key.
 * @param  {object} data - Internal node's data.
 * @return {array}       - The serialized node.
 */
export function serializeNode(key, data) {
  const serialized = {key};

  if (!isEmpty(data.attributes))
    serialized.attributes = assign({}, data.attributes);

  return serialized;
}

/**
 * Formats internal edge data into a serialized edge.
 *
 * @param  {string} type - The graph's type.
 * @param  {any}    key  - The edge's key.
 * @param  {object} data - Internal edge's data.
 * @return {array}       - The serialized edge.
 */
export function serializeEdge(type, key, data) {
  const serialized = {
    key,
    source: data.source.key,
    target: data.target.key
  };

  if (!isEmpty(data.attributes))
    serialized.attributes = assign({}, data.attributes);

  if (type === 'mixed' && data.undirected) serialized.undirected = true;

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
    throw new InvalidArgumentsGraphError(
      'Graph.import: invalid serialized node. A serialized node should be a plain object with at least a "key" property.'
    );

  if (!('key' in value))
    throw new InvalidArgumentsGraphError(
      'Graph.import: serialized node is missing its key.'
    );

  if (
    'attributes' in value &&
    (!isPlainObject(value.attributes) || value.attributes === null)
  )
    throw new InvalidArgumentsGraphError(
      'Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.'
    );
}

/**
 * Checks whether the given value is a serialized edge.
 *
 * @param  {mixed} value - Target value.
 * @return {string|null}
 */
export function validateSerializedEdge(value) {
  if (!isPlainObject(value))
    throw new InvalidArgumentsGraphError(
      'Graph.import: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.'
    );

  if (!('source' in value))
    throw new InvalidArgumentsGraphError(
      'Graph.import: serialized edge is missing its source.'
    );

  if (!('target' in value))
    throw new InvalidArgumentsGraphError(
      'Graph.import: serialized edge is missing its target.'
    );

  if (
    'attributes' in value &&
    (!isPlainObject(value.attributes) || value.attributes === null)
  )
    throw new InvalidArgumentsGraphError(
      'Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.'
    );

  if ('undirected' in value && typeof value.undirected !== 'boolean')
    throw new InvalidArgumentsGraphError(
      'Graph.import: invalid undirectedness information. Undirected should be boolean or omitted.'
    );
}
