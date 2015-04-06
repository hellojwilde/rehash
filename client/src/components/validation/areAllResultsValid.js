var {ValidResultTypes} = require('./ValidationConstants');

function areAllResultsValid(results) {
  var valid = true;

  for (var k in results) {
    if (results.hasOwnProperty(k) && 
        ValidResultTypes[results[k].type] !== true) {
      valid = false;
    }
  }
  
  return valid;
}

module.exports = areAllResultsValid;