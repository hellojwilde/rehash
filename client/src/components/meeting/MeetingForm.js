var React = require('react/addons');
var {DateInput, TimeInput} = require('react-pick-datetime');
var Validated = require('components/validation/Validated');
var ValidatedGroup = require('components/validation/ValidatedGroup');
var ValidationRules = require('components/validation/ValidationRules');

var {LinkedStateMixin} = React.addons;

var _ = require('lodash');
var moment = require('moment');
var getCompoundDateTime = require('helpers/getCompoundDateTime');

require('react-pick/lib/styles.css');
require('react-pick-datetime/lib/styles.css');

var MeetingForm = React.createClass({

  propTypes: {
    onValidationResults: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    validationResults: React.PropTypes.object,
    value: React.PropTypes.object,
    hasInitialValue: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      validationResults: {},
      value: {
        title: '',
        description: '',
        start: moment().add(2, 'hours')
      },
      hasInitialValue: false
    };
  },

  getValidationRules: function() {
    var {hasInitialValue} = this.props;
    var rules = {
      title: {
        rules: [ValidationRules.isRequired],
        validateInitialValue: false
      }, 
      start: {
        rules: [ValidationRules.isRequired, ValidationRules.isMomentInFuture],
        validateInitialValue: true
      }
    };

    return _.mapValues(rules, (ruleset) => {
      ruleset.validateInitialValue = 
        hasInitialValue || ruleset.validateInitialValue;
      return ruleset;
    });
  },

  handleTitleChange: function(event) {
    this.props.onChange(_.assign({}, this.props.value, {
      title: event.target.value
    }));
  },

  handleDescriptionChange: function(event) {
    this.props.onChange(_.assign({}, this.props.value, {
      description: event.target.value
    }));
  },

  handleStartDateChange: function(date) {
    this.props.onChange(_.assign({}, this.props.value, {
      start: getCompoundDateTime(date, this.props.value.start)
    }));
  },

  handleStartTimeChange: function(time) {
    this.props.onChange(_.assign({}, this.props.value, {
      start: getCompoundDateTime(this.props.value.start, time)
    }));
  },

  render: function() {
    var {value, validationResults, onValidationResults} = this.props;

    return (
      <Validated 
        className="form-horizontal"
        values={{title: value.title, start: value.start}} 
        rules={this.getValidationRules()}
        onValidationResults={onValidationResults}>
        <ValidatedGroup resultsFor="title" results={validationResults}>
          <label className="col-sm-2 control-label" htmlFor="MeetingTitle">
            Title
          </label>
          <div className="col-sm-10">
            <input 
              name="MeetingTitle"
              className="form-control"
              value={value.title}
              onChange={this.handleTitleChange}
            />
          </div>
        </ValidatedGroup>

        <div className="form-group">
          <label 
            className="col-sm-2 control-label" 
            htmlFor="MeetingDescription">
            Description
          </label>
          <div className="col-sm-10">
            <textarea 
              name="MeetingDescription"
              className="form-control"
              rows="3"
              value={value.description}
              onChange={this.handleDescriptionChange}
            />
          </div>
        </div>

        <ValidatedGroup resultsFor="start" results={validationResults}>
          <label className="col-sm-2 control-label" htmlFor="MeetingStart">
            Start
          </label>
          <div className="col-sm-10">
            <DateInput 
              name="MeetingStart"
              className="form-control"
              value={value.start}
              onChange={this.handleStartDateChange}
            />
            <TimeInput 
              name="MeetingStartTime"
              className="form-control"
              value={value.start}
              onChange={this.handleStartTimeChange}
            />
          </div>
        </ValidatedGroup>
      </Validated>
    );
  }

});

module.exports = MeetingForm;