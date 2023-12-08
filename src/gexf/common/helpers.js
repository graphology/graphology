/**
 * Graphology Common GEXF Helpers
 * ===============================
 *
 * Miscellaneous helpers used by both instance of the code.
 */

var SPACE_PATTERN = /^\s$/;
var COMMA_SPLITTER = /\s*,\s*/;
var PIPE_SPLITTER = /\s*\|\s*/;

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

function parseScalarValue(type, string) {
  if (!type || type === 'string') {
    return string;
  }

  if (type === 'boolean') {
    return string === 'true';
  }

  // NOTE: long might cause issues at some point because
  // JavaScript does not handle 64bit integers.
  if (
    type === 'byte' ||
    type === 'short' ||
    type === 'integer' ||
    type === 'long' ||
    type === 'float' ||
    type === 'double'
  ) {
    return +string;
  }

  // NOTE: we fallback to raw string value
  return string;
}

function parseValue(type, string) {
  if (type.startsWith('list')) {
    var subtype = type.slice(4);
    var pieces;

    if (
      string.length >= 2 &&
      string[0] === '[' &&
      string[string.length - 1] === ']'
    ) {
      pieces = parseListPieces(string.slice(1, -1));
    } else if (string.includes('|')) {
      pieces = string.split(PIPE_SPLITTER);
    } else if (string.includes(',')) {
      pieces = string.split(COMMA_SPLITTER);
    } else {
      pieces = [string];
    }

    return pieces.map(function (piece) {
      return parseScalarValue(subtype, piece);
    });
  } else {
    return parseScalarValue(type, string);
  }
}

exports.parseListPieces = parseListPieces;
exports.parseScalarValue = parseScalarValue;
exports.parseValue = parseValue;

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
