var React = require('react');
var Validated = require('components/validation/Validated');
var ValidatedGroup = require('components/validation/ValidatedGroup');
var ValidationRules = require('components/validation/ValidationRules');

var areAllResultsValid = require('components/validation/areAllResultsValid');

require('./AgendaCardComposer.css');

var AgendaCardComposer = React.createClass({

  propTypes: {
    onComplete: React.PropTypes.func.isRequired,
    textareaRef: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      content: '',
      validationResults: {}
    };
  },

  handleChange: function(e) {
    this.setState({content: e.target.value});
  },

  handleClick: function() {
    this.props.onComplete(this.state.content);
  },

  handleValidationResults: function(validationResults) {
    this.setState({validationResults});
  },

  render: function() {
    var {onComplete, textareaRef, ...otherProps} = this.props;

    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <Validated 
            values={{content: this.state.content}}
            rules={{content: [ValidationRules.isRequired]}}
            onValidationResults={this.handleValidationResults}>
            <ValidatedGroup 
              resultsFor="content" 
              results={this.state.validationResults}>
              <textarea 
                {...otherProps}
                ref={textareaRef}
                className="form-control" 
                rows="3" 
                value={this.state.content} 
                onChange={this.handleChange}
              />
            </ValidatedGroup>
          </Validated>
        </div>
        <div className="panel-footer AgendaCardComposer-footer">
          <button 
            type="button"
            disabled={!areAllResultsValid(this.state.validationResults)} 
            className="btn btn-default btn-sm btn-primary" 
            onClick={this.handleClick}>
            Save
          </button>
        </div>
      </div>
    );
  }

});

module.exports = AgendaCardComposer;