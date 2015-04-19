var React = require('react');
var Broadcast = require('components/meeting/broadcast/Broadcast');

require('./BroadcastPreview.css');

var BroadcastPreview = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <div className="BroadcastPreview">
        <Broadcast {...this.props} className="BroadcastPreview-video"/>

        {this.props.label && (
          <span className="BroadcastPreview-label label label-default">
            {this.props.label}
          </span>
        )}
      </div>
    );
  }

});

module.exports = BroadcastPreview;