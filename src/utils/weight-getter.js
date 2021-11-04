/**
 * Graphology Weight Getter
 * =========================
 *
 * Function creating weight getters.
 */
exports.createWeightGetter = function (name) {
  var weightGetter = function (attr) {
    // If no name was provided, it means we don't want a weighted computation
    if (!name) return 1;

    var weight = attr[name];

    // Ensuring target value is a correct number
    if (typeof weight !== 'number' || isNaN(weight)) weight = 1;

    return weight;
  };

  return weightGetter;
};
