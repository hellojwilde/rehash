var React = require('react');

var HostNavLink = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  propTypes: {
    to: React.PropTypes.string
  },

  getHref: function() {
    return this.context.router.makeHref(
      this.props.to,
      this.context.router.getCurrentParams(),
      {}
    );
  },

  getIsActive: function() {
    return this.context.router.isActive(
      this.props.to,
      this.context.router.getCurrentParams(),
      {}
    );
  },

  render: function() {
    return (
      <li className={this.getIsActive() ? 'active' : ''}>
        <a href={this.getHref()}>
          {this.props.children}
        </a>
      </li>
    );
  }

});

module.exports = HostNavLink;