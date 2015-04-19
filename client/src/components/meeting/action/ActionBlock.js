var React = require('react');
var UserListPreview = require('components/common/UserListPreview');
var BroadcastPreview = require('components/meeting/broadcast/BroadcastPreview');

var _ = require('lodash');
var meetingPropType = require('types/meetingPropType');
var meetingRelationPropType = require('types/meetingRelationPropType');

const MAX_SUBSCRIBERS = 5;

var ActionBlock = React.createClass({

  propTypes: {
    meeting: meetingPropType.isRequired,
    meetingRelation: meetingRelationPropType.isRequired,
    webRTC: React.PropTypes.object.isRequired,
    subscribersEmptyLabel: React.PropTypes.string.isRequired,
    previewLabel: React.PropTypes.string.isRequired,
    isShowingPreview: React.PropTypes.bool.isRequired
  },

  render: function() {
    var {meetingRelation, webRTC} = this.props;
    var {attendees} = this.props.meeting;

    return (
      <div className="ActionsBlock">
        <h4>Subscribers</h4>
        <UserListPreview
          emptyLabel={this.props.subscribersEmptyLabel}
          attendeesToPreview={_.take(attendees, MAX_SUBSCRIBERS)}
          attendeeCount={attendees.length}
        />

        <div className="ActionsBlock-action">
          {this.props.isShowingPreview && (
            <div key="preview" className="ActionsBlock-action-preview">
              <BroadcastPreview {...{meetingRelation, webRTC}}/>
            </div>
          )}

          {this.props.children}
        </div>
      </div>
    );
  }

});

module.exports = ActionBlock;