var MeetingModal = require('modals/MeetingModal');
var React = require('react');

var CreateMeetingModal = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    onComplete: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired
  },

  handleComplete: function(value) {
    var meetingActions = this.context.flux.getActions('meeting');

    meetingActions.create(value)
      .then((result) => this.props.onComplete(result));
  },

  getDocumentTitle: function(value) {
    return value && value.title !== ''
      ? `Create "${value.title}" - Rehash`
      : 'Create - Rehash';
  },

  render: function() {
    return (
      <MeetingModal
        actionLabel="Create Rehash"
        getDocumentTitle={this.getDocumentTitle}
        title="Create Rehash"
        onCancel={this.props.onCancel}
        onComplete={this.handleComplete}
      />
    );
  }

});

module.exports = CreateMeetingModal;