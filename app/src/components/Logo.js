var React = require('react');
var {Link} = require('react-router');

var joinClasses = require('react/lib/joinClasses');

require('./Logo.css');

var Logo = React.createClass({

  render: function() {
    var {className, ...otherProps} = this.props; 

    return (
      <Link
        to="home" 
        {...otherProps}
        className={joinClasses(this.props.className, 'Logo')}>
        Debrief
      </Link>
    );
  }

});

module.exports = Logo;