var DocumentTitle = require('react-document-title');
var Modal = require('components/modal/Modal');
var ModalBody = require('components/modal/ModalBody');
var ModalHeader = require('components/modal/ModalHeader');
var AgendaList = require('components/meeting/agenda/AgendaList');
var React = require('react');
var FluxComponent = require('flummox/component');

var AgendaModal = React.createClass({

  propTypes: {
    meetingId: React.PropTypes.number.isRequired,
    onComplete: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired
  },

  render: function() {
    var {meetingId} = this.props;

    return (
      <DocumentTitle title="Agenda - Rehash">
        <Modal>
          <ModalHeader onCancel={this.props.onCancel}>Agenda</ModalHeader>
          <ModalBody>
            <FluxComponent 
              connectToStores={['meeting', 'topic']}
              stateGetter={([meetingStore, topicStore]) => ({
                topics: topicStore.getByMeetingId(meetingId),
                meetingId: meetingId,
                meetingRelation: 
                  meetingStore.getCurrentUserRelationById(meetingId)
              })}>
              <AgendaList/>
            </FluxComponent>
          </ModalBody>
        </Modal>
      </DocumentTitle>
    );
  }

});

module.exports = AgendaModal;