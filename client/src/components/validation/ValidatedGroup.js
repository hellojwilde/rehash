var React = require('react');
var {ResultTypes} = require('./ValidationConstants');

var joinClasses = require('react/lib/joinClasses');

var ResultTypeClassNames = {
  [ResultTypes.SUCCESS]: 'has-success',
  [ResultTypes.WARNING]: 'has-warning',
  [ResultTypes.ERROR]: 'has-error'
};

var ValidatedGroup = React.createClass({

  propTypes: {
    results: React.PropTypes.object.isRequired,
    resultsFor: React.PropTypes.string.isRequired
  },

  render: function() {
    var {className, children, results, resultsFor} = this.props;
    var result = results[resultsFor];

    return (
      <div className={joinClasses(
        'form-group',
        result && result.type && ResultTypeClassNames[result.type],
        className
      )}>
        {children}
      </div>
    );
  }

});

module.exports = ValidatedGroup;