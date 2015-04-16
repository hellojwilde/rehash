var React = require('react');
var {ResultTypes, ResultTypePrecedence} = require('./ValidationConstants');

var _ = require('lodash');
var getResultForRules = require('./getResultForRules');
var getNormalizedRules = require('./getNormalizedRules');

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
    this.results = _.mapValues(this.props.rules, (rules, key) => {
      var normalized = getNormalizedRules(rules);

      if (normalized.validateInitialValue) {
        return getResultForRules(this.props.values[key], normalized);
      } else {
        return {
          type: ResultTypes.NOT_YET_VALIDATED, 
          detail: null
        };
      }  
    });

    this.props.onValidationResults(this.results);
  },

  componentWillReceiveProps: function(nextProps) {
    var areResultsChanged = false;
    var results = _.mapValues(nextProps.values, (nextValue, key) => {
      var normalized = getNormalizedRules(this.props.rules[key]);
      var value = this.props.values[key];

      if (nextValue !== value) {
        areResultsChanged = true;
        return getResultForRules(nextValue, normalized);
      }
      return this.results[key];
    });

    if (areResultsChanged) {
      this.results = results;
      this.props.onValidationResults(results);
    }
  },

  render: function() {
    return <div {...this.props} />;
  }

});

module.exports = Validated;