var ActionBlock = require('components/meeting/action/ActionBlock');
var BroadcastButton = require('components/meeting/action/BroadcastButton');
var PrepareBroadcastButton = require('components/meeting/action/PrepareBroadcastButton');
var React = require('react');

var meetingPropType = require('types/meetingPropType');
var meetingRelationPropType = require('types/meetingRelationPropType')

var HostActionBlock = React.createClass({

  propTypes: {
    meeting: meetingPropType.isRequired,
    meetingRelation: meetingRelationPropType.isRequired,
    webRTC: React.PropTypes.object.isRequired,
    onBroadcastStart: React.PropTypes.func.isRequired
  },

  render: function() {
    var isShowingPreview = !!this.props.webRTC.localStream;
    var meetingKey = this.props.meeting.key;
    var {onBroadcastStart} = this.props;

    return (
      <ActionBlock
        {...this.props}
        previewLabel="Preview"
        subscribersEmptyLabel="No subscribers yet. This'll be spontaneous."
        isShowingPreview={isShowingPreview}>
        {isShowingPreview 
          ? <BroadcastButton {...{meetingKey, onBroadcastStart}}/>
          : <PrepareBroadcastButton meetingKey={meetingKey}/>}

        <small className="text-muted">
          {'We\'ll show you a preview of your camera first.'}
        </small>
      </ActionBlock>
    );
  }

});

module.exports = HostActionBlock;