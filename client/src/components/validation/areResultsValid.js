function areResultsValid(results) {
  var areValid = true;

  for (var k in results) {
    if (results.hasOwnProperty(k) && results[k] !== 'success') {
      areValid = false;
    }
  }

  return areValid;
}

module.exports = areResultsValid;