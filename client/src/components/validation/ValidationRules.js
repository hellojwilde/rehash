var {ResultTypes} = require('./ValidationConstants');

var moment = require('moment')

var ValidationRules = {
  isRequired: function(value) {
    if (value == null || value == '') {
      return {type: ResultTypes.ERROR, detail: null};
    }
    return {type: ResultTypes.VALID, detail: null};
  },

  isMomentInFuture: function(value) {
    if (value && moment().isAfter(value)) {
      return {type: ResultTypes.ERROR, detail: null};
    }
    return {type: ResultTypes.VALID, detail: null};
  }
};

module.exports = ValidationRules;