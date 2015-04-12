var React = require('react');
var LinkNoClobber = require('components/common/LinkNoClobber');

var joinClasses = require('react/lib/joinClasses');

require('./Logo.css');

var Logo = React.createClass({

  render: function() {
    var {className, ...otherProps} = this.props;

    return (
      <LinkNoClobber
        className={joinClasses('Logo', className)}
        to="explore">
        Rehash
      </LinkNoClobber>
    );
  }

});

module.exports = Logo;