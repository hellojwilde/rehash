var Modal = require('components/modals/Modal');
var ModalBody = require('components/modals/ModalBody');
var ModalHeader = require('components/modals/ModalHeader');
var ModalFooter = require('components/modals/ModalFooter');
var React = require('react/addons');

var LinkedStateMixin = React.addons.LinkedStateMixin;

var moment = require('moment');

var CreateModal = React.createClass({

  mixins: [LinkedStateMixin],

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    onComplete: React.PropTypes.func,
    onCancel: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      onComplete: function() {},
      onCancel: function() {}
    };
  },

  getInitialState: function() {
    return {
      title: '',
      description: '',
      startDate: '',
      startTime: '' 
    };
  },

  handleCreateClick: function() {
    var meetingActions = this.context.flux.getActions('meeting');

    meetingActions.create({
      title: this.state.title,
      description: this.state.title,
      start: moment(
        `${this.state.startDate} ${this.state.startTime}`, 
        'YYYY-MM-DD HH:mm:ss Z'
      )
    }).then((meetingId) => this.props.onComplete(meetingId));
  },

  render: function() {
    return (
      <Modal>
        <ModalHeader onCancel={this.props.onCancel}>Create Meeting</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label for="CreateModalTitle">Title</label>
            <input 
              name="CreateModalTitle"
              className="form-control"
              type="text"
              valueLink={this.linkState('title')}
            />
          </div>

          <div className="form-group">
            <label for="CreateModalDescription">Description</label>
            <textarea 
              name="CreateModalDescription"
              className="form-control"
              valueLink={this.linkState('description')}
            />
          </div>

          <div className="row">
            <div className="col-xs-6">
              <div className="form-group">
                <label for="CreateModalDate">Start Date</label>
                <input 
                  name="CreateModalStartDate"
                  className="form-control"
                  type="date"
                  valueLink={this.linkState('date')}
                />
              </div>
            </div>

            <div className="col-xs-6">
              <div className="form-group">
                <label for="CreateModalTime">Start Time</label>
                <input 
                  name="CreateModalStartTime"
                  className="form-control"
                  type="time"
                  valueLink={this.linkState('time')}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button 
            className="btn btn-primary" 
            onClick={this.handleCreateClick}>
            Create Meeting
          </button>
        </ModalFooter>
      </Modal>
    );
  }

});

module.exports = CreateModal;