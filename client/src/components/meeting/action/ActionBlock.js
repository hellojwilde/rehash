var React = require('react');
var UserListPreview = require('components/common/UserListPreview');
var BroadcastPreview = require('components/meeting/broadcast/BroadcastPreview');

var _ = require('lodash');
var meetingPropType = require('types/meetingPropType');
var meetingRelationPropType = require('types/meetingRelationPropType');

require('./ActionBlock.css');

const MAX_SUBSCRIBERS = 5;

var ActionBlock = React.createClass({

  propTypes: {
    meeting: meetingPropType.isRequired,
    meetingRelation: meetingRelationPropType.isRequired,
    webRTC: React.PropTypes.object.isRequired,
    subscribersEmptyLabel: React.PropTypes.string.isRequired,
    previewLabel: React.PropTypes.string.isRequired,
    isShowingPreview: React.PropTypes.bool.isRequired,
    onPreviewClose: React.PropTypes.func.isRequired
  },

  render: function() {
    var {meetingRelation, webRTC, previewLabel} = this.props;
    var {attendees} = this.props.meeting;

    return (
      <div className="ActionBlock">
        <h4 className="ActionBlock-subscribers-title">Subscribers</h4>
        <UserListPreview
          emptyLabel={this.props.subscribersEmptyLabel}
          attendeesToPreview={_.take(attendees, MAX_SUBSCRIBERS)}
          attendeeCount={attendees.length}
        />

        <div className="ActionBlock-action">
          {this.props.isShowingPreview && (
            <div key="preview" className="ActionBlock-action-preview">
              <BroadcastPreview 
                {...{meetingRelation, webRTC}}
                label={this.props.previewLabel}
              />

              <button 
                className="btn btn-link btn-sm ActionBlock-action-preview-close" 
                onClick={this.props.onPreviewClose}>
                <span className="glyphicon glyphicon-remove"/>
              </button>
            </div>
          )}

          {this.props.children}
        </div>
      </div>
    );
  }

});

module.exports = ActionBlock;