var React = require('react');

var HeaderLink = React.createClass({

  propTypes: {
    onClick: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      onClick: function() {}
    };
  },

  handleClick: function(e) {
    e.preventDefault();
    this.props.onClick();
  },

  render: function() {
    var {children, ...otherProps} = this.props;

    return (
      <a {...otherProps} href="#" role="button" onClick={this.handleClick}>
        {children}
      </a>
    );
  }

});

module.exports = HeaderLink;