var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');

var MeetingLayoutAside = React.createClass({

  render: function() {
    return (
      <div className="col-sm-5 col-md-4">
        {this.props.children}
      </div>
    );
  }

});

module.exports = MeetingLayoutAside;