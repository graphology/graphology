/**
 * Graphology Weight Getter
 * =========================
 *
 * Function creating weight getters.
 */
function coerceWeight(value) {
  // Ensuring target value is a correct number
  if (typeof value !== 'number' || isNaN(value)) return 1;

  return value;
}

exports.createWeightGetter = function (name) {
  var weightGetter = function (attr) {
    // If no name was provided, it means we don't want a weighted computation
    if (!name) return 1;

    return coerceWeight(attr[name]);
  };

  return weightGetter;
};
