/**
 * Graphology Common GEXF Helpers
 * ===============================
 *
 * Miscellaneous helpers used by both instance of the code.
 */

/**
 * Function used to cast a string value to the desired type.
 *
 * @param  {string} type - Value type.
 * @param  {string} type - String value.
 * @return {any}         - Parsed type.
 */
exports.cast = function (type, value) {
  switch (type) {
    case 'boolean':
      value = value === 'true';
      break;

    case 'integer':
    case 'long':
    case 'float':
    case 'double':
      value = +value;
      break;

    case 'liststring':
      value = value ? value.split('|') : [];
      break;

    default:
  }

  return value;
};

/**
 * Function deleting illegal characters from a potential tag name to avoid
 * generating invalid XML.
 *
 * @param  {string} type - Tag name.
 * @return {string}
 */
var SANITIZE_PATTERN = /["'<>&\s]/g;

exports.sanitizeTagName = function sanitizeTagName(tagName) {
  return tagName.replace(SANITIZE_PATTERN, '').trim();
};
