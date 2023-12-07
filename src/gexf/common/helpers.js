/**
 * Graphology Common GEXF Helpers
 * ===============================
 *
 * Miscellaneous helpers used by both instance of the code.
 */

var SPACE_PATTERN = /^\s$/;
// var COMMA_SPLITTER = /\s*,\s*/;
// var PIPE_SPLITTER = /\s*\|\s*/;

function isSpace(char) {
  return SPACE_PATTERN.test(char);
}

function parseListPieces(string) {
  var c, n, i, l;

  var inPiece = false;
  var escaping = false;
  var piece = undefined;
  var pieces = [];
  var quoting = '';

  for (i = 0, l = string.length; i < l; i++) {
    c = string[i];

    if (inPiece) {
      if (piece === undefined) {
        piece = '';
      }

      if (!quoting && c === ',') {
        i--;
        inPiece = false;
        continue;
      }

      if (!escaping && c === quoting) {
        inPiece = false;
        continue;
      }

      if (c === '\\') {
        if (i + 1 < l) {
          n = string[i + 1];

          if (n === 'r' || n === 't' || n === 'n' || n === '\\') {
            if (n === 'n') {
              piece += '\n';
            } else if (n === 't') {
              piece += '\t';
            } else if (n === 'r') {
              piece += '\r';
            } else {
              piece += '\\';
            }

            escaping = false;
            i++;
            continue;
          }
        }

        escaping = true;
      } else {
        piece += c;
        escaping = false;
      }
    } else {
      if (isSpace(c)) {
        continue;
      }

      if (c === ',') {
        if (piece !== undefined) {
          pieces.push(piece);
          piece = undefined;
        }

        continue;
      }

      if (c === '"' || c === "'") {
        quoting = c;
      } else {
        i--;
        quoting = '';
      }

      inPiece = true;
      escaping = false;
    }
  }

  // Flushing last piece
  if (piece !== undefined) {
    pieces.push(piece);
  }

  return pieces;
}

exports.parseListPieces = parseListPieces;

/**
 * Function used to cast a string value to the desired type.
 *
 * @param  {string} type - Value type.
 * @param  {string} type - String value.
 * @return {any}         - Parsed type.
 */
exports.cast = function (type, value) {
  switch (type) {
    case 'string':
      // NOTE: this is quite common so having this here
      // can speed things up a bit.
      return value;
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
