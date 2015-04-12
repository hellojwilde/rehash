var React = require('react');

var joinClasses = require('react/lib/joinClasses');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./IconButton.css');

var IconButton = React.createClass({

  propTypes: {
    icon: React.PropTypes.string.isRequired
  },

  render: function() {
    var {children, className, icon, ...otherProps} = this.props;

    return (
      <button 
        {...otherProps}
        className={joinClasses(className, 'IconButton btn')}>
        <span 
          aria-hidden="true" 
          className={`glyphicon glyphicon-${icon}`}
        />
        {' '}
        {children}
      </button>
    );
  }

});

module.exports = IconButton;