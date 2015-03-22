var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');

var MeetingNavigationLink = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  propTypes: {
    to: React.PropTypes.string.isRequired,
    meetingId: React.PropTypes.number.isRequired
  },

  getParams: function() {
    return {meetingId: this.props.meetingId};
  },

  getHref: function() {
    return this.context.router.makeHref(this.props.to, this.getParams(), {});
  },

  getActiveState: function() {
    return this.context.router.isActive(this.props.to, this.getParams(), {});
  },

  render: function() {
    var props = {role: 'presentation'};

    if (this.getActiveState()) {
      props.className = 'active';
    }

    return (
      <li {...props}>
        <a href={this.getHref()}>{this.props.children}</a>
      </li>
    );
  }

});

module.exports = MeetingNavigationLink;