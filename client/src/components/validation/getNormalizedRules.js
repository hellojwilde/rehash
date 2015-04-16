var _ = require('lodash');

function getNormalizedRules(rules) {
  var normalized = {
    rules: [],
    validateInitialValue: false
  };

  if (_.isArray(rules)) {
    normalized.rules = rules;
  } else if (_.isFunction(rules)) {
    normalized.rules = [rules];
  } else if (_.isObject(rules)) {
    _.assign(normalized, rules);
  }
  
  return normalized;
}

module.exports = getNormalizedRules;