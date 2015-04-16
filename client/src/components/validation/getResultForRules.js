var {ResultTypes, ResultTypePrecedence} = require('./ValidationConstants');

var _ = require('lodash');

function getResultForRules(value, normalized) {
  return normalized.rules.reduce((overallResult, rule) => {
    var result = rule(value);
    var {type, details} = overallResult;

    if (ResultTypePrecedence[result.type] > ResultTypePrecedence[type]) {
      type = result.type;
    }

    if (result.detail !== null) {
      details.push(result.detail);
    }

    return {type, details};
  }, {type: ResultTypes.VALID, details: []});
}

module.exports = getResultForRules;