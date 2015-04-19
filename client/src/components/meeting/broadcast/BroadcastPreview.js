var React = require('react');
var Broadcast = require('components/meeting/broadcast/Broadcast');
var IconButton = require('components/common/IconButton');

require('./BroadcastPreview.css');

var BroadcastPreview = React.createClass({

  propTypes: {
    buttonLabel: React.PropTypes.string.isRequired,
    buttonIcon: React.PropTypes.string.isRequired,
    onButtonClick: React.PropTypes.func.isRequired
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
        <div className="BroadcastPreview-button">
          <IconButton 
            icon={this.props.buttonIcon}
            className="btn-lg btn-block btn-success"
            onClick={this.props.onButtonClick}>
            {this.props.buttonLabel}
          </IconButton>
        </div>
      </div>
    );
  }

});

module.exports = BroadcastPreview;