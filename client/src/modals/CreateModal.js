var Modal = require('components/modal/Modal');
var ModalBody = require('components/modal/ModalBody');
var ModalHeader = require('components/modal/ModalHeader');
var ModalFooter = require('components/modal/ModalFooter');
var {DateInput, TimeInput} = require('react-pick-datetime');
var Validated = require('components/validation/Validated');
var ValidatedGroup = require('components/validation/ValidatedGroup');
var ValidationRules = require('components/validation/ValidationRules');;
var React = require('react/addons');

require('react-pick/lib/styles.css');
require('react-pick-datetime/lib/styles.css');

var LinkedStateMixin = React.addons.LinkedStateMixin;

var moment = require('moment');
var areAllResultsValid = require('components/validation/areAllResultsValid');

function getCompoundDateTime(date, time) {
  if (!date || !time) {
    return null;
  }

  return moment(time).set({
    'date': date.get('date'),
    'month': date.get('month'),
    'year': date.get('year')
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
      validationResults: {},
      title: '',
      description: '',
      startDate: moment(start),
      startTime: moment(start),
      start: start
    };
  },

  handleValidationResults: function(results) {
    this.setState({validationResults: results});
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

  handleStartDateChange: function(startDate) {
    this.setState({
      startDate: startDate,
      start: getCompoundDateTime(startDate, this.state.startTime)
    });
  },

  handleStartTimeChange: function(startTime) {
    this.setState({
      startTime: startTime,
      start: getCompoundDateTime(this.state.startDate, startTime)
    });
  },

  render: function() {
    return (
      <Modal>
        <ModalHeader onCancel={this.props.onCancel}>
          Create Meeting
        </ModalHeader>
        <ModalBody>
          <Validated 
            className="form-horizontal"
            values={{title: this.state.title, start: this.state.start}} 
            rules={{
              title: ValidationRules.isRequired, 
              start: [ValidationRules.isRequired, ValidationRules.isMomentInFuture]
            }}
            onValidationResults={this.handleValidationResults}>
            <ValidatedGroup resultsFor="title" results={this.state.validationResults}>
              <label 
                className="col-sm-2 control-label" 
                htmlFor="CreateModalTitle">
                Title
              </label>
              <div className="col-sm-10">
                <input 
                  name="CreateModalTitle"
                  className="form-control"
                  type="text"
                  valueLink={this.linkState('title')}
                />
              </div>
            </ValidatedGroup>

            <div className="form-group">
              <label 
                className="col-sm-2 control-label" 
                htmlFor="CreateModalSummary">
                Summary
              </label>
              <div className="col-sm-10">
                <textarea 
                  name="CreateModalSummary"
                  className="form-control"
                  rows="3"
                  valueLink={this.linkState('summary')}
                />
              </div>
            </div>

            <ValidatedGroup resultsFor="start" results={this.state.validationResults}>
              <label className="col-sm-2 control-label" htmlFor="CreateModalDate">Start</label>
              <div className="col-sm-10">
                <DateInput 
                  name="CreateModalStartDate"
                  className="form-control"
                  value={this.state.startDate}
                  onChange={this.handleStartDateChange}
                />
                <TimeInput 
                  name="CreateModalStartTime"
                  className="form-control"
                  value={this.state.startTime}
                  onChange={this.handleStartTimeChange}
                />
              </div>
            </ValidatedGroup>
          </Validated>
        </ModalBody>
        <ModalFooter>
          <button 
            className="btn btn-primary" 
            onClick={this.handleCreateClick}
            disabled={!areAllResultsValid(this.state.validationResults)}>
            Create Meeting
          </button>
        </ModalFooter>
      </Modal>
    );
  }

});

module.exports = CreateModal;