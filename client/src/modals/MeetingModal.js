var DocumentTitle = require('react-document-title');
var Modal = require('components/modal/Modal');
var ModalBody = require('components/modal/ModalBody');
var ModalFooter = require('components/modal/ModalFooter');
var ModalHeader = require('components/modal/ModalHeader');
var MeetingForm = require('components/meeting/MeetingForm');
var React = require('react');

var areAllResultsValid = require('components/validation/areAllResultsValid');

var MeetingModal = React.createClass({

  propTypes: {
    actionLabel: React.PropTypes.string.isRequired,
    getDocumentTitle: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onComplete: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired,
    initialValue: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      validationResults: {},
      value: this.props.initialValue,
      hasInitialValue: !!this.props.initialValue
    };
  },

  handleValidationResults: function(validationResults) {
    this.setState({validationResults});
  },

  handleChange: function(value) {
    this.setState({value});
  },

  render: function() {
    return (
      <DocumentTitle title={this.props.getDocumentTitle(this.state.value)}>
        <Modal>
          <ModalHeader onCancel={this.props.onCancel}>
            {this.props.title}
          </ModalHeader>
          <ModalBody>
            <MeetingForm 
              onValidationResults={this.handleValidationResults}
              onChange={this.handleChange}
              validationResults={this.state.validationResults}
              value={this.state.value}
              hasInitialValue={this.state.hasInitialValue}
            />    
          </ModalBody>
          <ModalFooter>
            <button 
              className="btn btn-primary" 
              onClick={() => this.props.onComplete(this.state.value)}
              disabled={!areAllResultsValid(this.state.validationResults)}>
              {this.props.actionLabel}
            </button>
          </ModalFooter>
        </Modal>
      </DocumentTitle>
    );
  }

});

module.exports = MeetingModal;