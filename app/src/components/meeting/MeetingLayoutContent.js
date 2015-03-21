var React = require('react');

var MeetingLayoutContent = React.createClass({

  render: function() {
    return (
      <div className="col-sm-7 col-md-8">
        {this.props.children}
      </div>
    );
  }

});

module.exports = MeetingLayoutContent;