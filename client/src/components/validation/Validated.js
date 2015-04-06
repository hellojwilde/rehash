var React = require('react');
var {ResultTypes, ResultTypePrecedence} = require('./ValidationConstants');

function mapObject(obj, fn) {
  var newObj = {};
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      newObj[k] = fn(obj[k], k);
    }
  }
  return newObj;
}

function getResultForRules(value, rules) {
  if (!rules) {
    rules = [];
  }

  if (!Array.isArray(rules)) {
    rules = [rules];
  }

  return rules.reduce(function(overallResult, rule) {
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

var Validated = React.createClass({

  propTypes: {
    values: React.PropTypes.object,
    rules: React.PropTypes.object,
    onValidationResults: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      values: {},
      rules: {},
      onValidationResults: () => {}
    };
  },

  componentWillMount: function() {
    this.results = mapObject(this.props.values, () => ({
      type: ResultTypes.NOT_YET_VALIDATED, 
      detail: null
    }));

    this.props.onValidationResults(this.results);
  },

  componentWillReceiveProps: function(nextProps) {
    var areResultsChanged = false;
    var results = mapObject(nextProps.values, (nextValue, key) => {
      var value = this.props.values[key];

      if (nextValue !== value) {
        areResultsChanged = true;
        return getResultForRules(nextValue, this.props.rules[key]);
      }

      return this.results[key];
    });

    if (areResultsChanged) {
      this.results = results;
      this.props.onValidationResults(results);
    }
  },

  render: function() {
    return (
      <div {...this.props} />
    );
  }

});

module.exports = Validated;