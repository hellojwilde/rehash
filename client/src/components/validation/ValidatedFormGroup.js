var React = require('react');

var joinClasses = require('react/lib/joinClasses');

var ValidatedFormGroup = React.createClass({

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
        result && `has-${result}`,
        className
      )}>
        {children}
      </div>
    );
  }

});

module.exports = ValidatedFormGroup;