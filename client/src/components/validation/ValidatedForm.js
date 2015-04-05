var React = require('react');

function mapObject(obj, fn) {
  var newObj = {};
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      newObj[k] = fn(obj[k], k);
    }
  }
  return newObj;
}

var ValidatedForm = React.createClass({

  propTypes: {
    values: React.PropTypes.object,
    rules: React.PropTypes.object,
    onValidationResults: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      values: {},
      rules: {},
      onValidationResults: () => null
    };
  },

  getInitialState: function() {
    return {
      results: mapObject(this.props.values, () => null)
    };
  },

  componentWillMount: function() {
    this.props.onValidationResults(this.state.results);
  },

  componentWillReceiveProps: function(nextProps) {
    var areResultsChanged = false
    var newResults = mapObject(nextProps.values, (nextValue, key) => {
      var value = this.props.values[key];
      var rule = this.props.rules[key] || (value) => 'success';

      if (nextValue === value) {
        return this.state.results[key];
      }

      areResultsChanged = true;
      return rule(nextValue);
    });

    if (areResultsChanged) {
      this.setState({results: newResults});
      this.props.onValidationResults(newResults);
    }
  },

  render: function() {
    return (
      <div {...this.props} />
    );
  }

});

module.exports = ValidatedForm;