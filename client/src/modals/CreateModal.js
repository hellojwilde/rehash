var Modal = require('components/modals/Modal');
var ModalBody = require('components/modals/ModalBody');
var ModalHeader = require('components/modals/ModalHeader');
var ModalFooter = require('components/modals/ModalFooter');
var {DateInput, TimeInput} = require('react-pick-datetime');
var React = require('react/addons');

require('react-pick/lib/styles.css');
require('react-pick-datetime/lib/styles.css');

var LinkedStateMixin = React.addons.LinkedStateMixin;

var moment = require('moment');

function getCompoundDateTime(date, time) {
  return moment(time).set({
    date: date.get('date'),
    month: date.month('month'),
    year: date.year('year')
  });
}

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
    var start = moment().add(2, 'hours');

    return {
      title: '',
      description: '',
      startDate: moment(start),
      startTime: moment(start)
    };
  },

  handleCreateClick: function() {
    var {title, description, startDate, startTime} = this.state;
    var meetingActions = this.context.flux.getActions('meeting');

    // TODO Validate the contents of this somehow.

    meetingActions.create({
      title: title,
      description: description,
      start: getCompoundDateTime(startDate, startTime)
    }).then((meetingId) => this.props.onComplete(meetingId));
  },

  render: function() {
    return (
      <Modal>
        <ModalHeader onCancel={this.props.onCancel}>
          Create Meeting
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label htmlFor="CreateModalTitle">Title</label>
            <input 
              name="CreateModalTitle"
              className="form-control"
              type="text"
              valueLink={this.linkState('title')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="CreateModalDescription">Description</label>
            <textarea 
              name="CreateModalDescription"
              className="form-control"
              valueLink={this.linkState('description')}
            />
          </div>

          <div className="row">
            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="CreateModalDate">Start Date</label>
                <div>
                  <DateInput 
                    name="CreateModalStartDate"
                    className="form-control"
                    value={this.state.startDate}
                    onChange={(startDate) => this.setState({startDate})}
                  />
                </div>
              </div>
            </div>

            <div className="col-xs-6">
              <div className="form-group">
                <label htmlFor="CreateModalTime">Start Time</label>
                <div>
                  <TimeInput 
                    name="CreateModalStartTime"
                    className="form-control"
                    value={this.state.startTime}
                    onChange={(startTime) => this.setState({startTime})}
                  />
                </div>
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