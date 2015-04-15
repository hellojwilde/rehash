var React = require('react');
var {ResultTypes, ResultTypePrecedence} = require('./ValidationConstants');

var _ = require('lodash');
var getResultForRules = require('./getResultForRules');

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
    this.results = _.map(this.props.values, () => ({
      type: ResultTypes.NOT_YET_VALIDATED, 
      detail: null
    }));

    this.props.onValidationResults(this.results);
  },

  componentWillReceiveProps: function(nextProps) {
    var areResultsChanged = false;
    var results = _.map(nextProps.values, (nextValue, key) => {
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
    return <div {...this.props} />;
  }

});

module.exports = Validated;