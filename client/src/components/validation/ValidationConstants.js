var keyMirror = require('react/lib/keyMirror');

var ResultTypes = keyMirror({
  NOT_YET_VALIDATED: null,
  VALID: null,
  SUCCESS: null,
  WARNING: null,
  ERROR: null
});

var ResultTypePrecedence = {
  [ResultTypes.NOT_YET_VALIDATED]: 0,
  [ResultTypes.VALID]: 1,
  [ResultTypes.SUCCESS]: 2,
  [ResultTypes.WARNING]: 3,
  [ResultTypes.ERROR]: 4
};

var ValidResultTypes = {
  [ResultTypes.VALID]: true,
  [ResultTypes.SUCCESS]: true
};

module.exports = {ResultTypes, ResultTypePrecedence, ValidResultTypes};
