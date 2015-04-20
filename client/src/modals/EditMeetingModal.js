var MeetingModal = require('modals/MeetingModal');
var React = require('react');

var _ = require('lodash');

var EditMeetingModal = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    meetingId: React.PropTypes.string.isRequired,
    onComplete: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    var meetingStore = this.context.flux.getStore('meeting');
    var meeting = meetingStore.getById(this.props.meetingId);

    return {
      initialValue: _.pick(meeting, ['title', 'description', 'start']),
    };
  },

  handleComplete: function(value) {
    var meetingActions = this.context.flux.getActions('meeting');
    var {meetingId} = this.props;

    meetingActions.update(meetingId, value)
      .then((result) => this.props.onComplete(result));
  },

  getDocumentTitle: function(value) {
    return `Edit "${value.title}" - Rehash`;
  },

  render: function() {
    return (
      <MeetingModal
        actionLabel="Edit Rehash"
        getDocumentTitle={this.getDocumentTitle}
        title="Edit Rehash"
        initialValue={this.state.initialValue}
        onCancel={this.props.onCancel}
        onComplete={this.handleComplete}
      />
    );
  }
});

module.exports = EditMeetingModal;