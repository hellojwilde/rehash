var {ValidResultTypes} = require('./ValidationConstants');

var _ = require('lodash');

function areAllResultsValid(results) {
  return _.every(
    results, 
    (result) => ValidResultTypes[result.type] === true
  );
}

module.exports = areAllResultsValid;