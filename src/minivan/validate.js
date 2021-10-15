var Ajv = require('ajv');
var ajv = new Ajv();
var schemaValidation = ajv.compile(require('./schema.json'));

module.exports = function validate(bundle) {
  var valid = schemaValidation(bundle);

  if (valid) return null;

  return schemaValidation.errors;
};
