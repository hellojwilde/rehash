var React = require('react');
var ActionBlock = require('components/meeting/action/ActionBlock');
var SubscribeButton = require('components/meeting/action/SubscribeButton');
var JoinButton = require('components/meeting/action/JoinButton');

var meetingPropType = require('types/meetingPropType');
var meetingRelationPropType = require('types/meetingRelationPropType')

var NonHostActionBlock = React.createClass({

  propTypes: {
    meeting: meetingPropType.isRequired,
    meetingRelation: meetingRelationPropType.isRequired,
    webRTC: React.PropTypes.object.isRequired,
    onBroadcastJoin: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      isPreviewClosed: false 
    };
  },

  handlePreviewClose: function() {
    this.setState({isPreviewClosed: true});
  },

  render: function() {
    var isShowingPreview = (
      !!this.props.webRTC.remoteStream && !this.state.isPreviewClosed
    );
    var meetingKey = this.props.meeting.key;
    var {isAttendee} = this.props.meetingRelation;

    return (
      <ActionBlock
        {...this.props}
        previewLabel="Live"
        subscribersEmptyLabel="Be the first to be notified about this event."
        isShowingPreview={isShowingPreview}
        onPreviewClose={this.handlePreviewClose}>
        {isShowingPreview 
          ? <JoinButton onClick={this.props.onBroadcastJoin}/>
          : <SubscribeButton {...{meetingKey, isAttendee}}/>}
      </ActionBlock>
    );
  }

});

module.exports = NonHostActionBlock;