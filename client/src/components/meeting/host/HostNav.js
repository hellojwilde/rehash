var React = require('react');
var HostNavLink = require('components/meeting/host/HostNavLink');

require('./HostNav.css');

var HostNav = React.createClass({

  render: function() {
    return (
      <nav className="navbar navbar-default HostNav">
        <div className="container">
          <ul className="nav navbar-nav">
            <HostNavLink to="meeting-invite">Invite</HostNavLink>
            <HostNavLink to="meeting-broadcast">Broadcast</HostNavLink>
            <li><a href="#">Highlights</a></li>
          </ul>

           <ul className="nav navbar-nav pull-right">
            <li><a href="#">Attendees</a></li>
          </ul>
        </div>
      </nav>
    );
  }

});

module.exports = HostNav;