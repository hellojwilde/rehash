var React = require('react');

require('./AgendaCardComposer.css');

var AgendaCardComposer = React.createClass({

  propTypes: {
    onComplete: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      content: '' 
    };
  },

  handleChange: function(e) {
    this.setState({content: e.target.value});
  },

  handleClick: function() {
    this.props.onComplete(this.state.content);
  },

  render: function() {
    var {onComplete, ...otherProps} = this.props;

    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <textarea 
            {...otherProps}
            className="form-control" 
            rows="3" 
            value={this.state.content} 
            onChange={this.handleChange}
          />
        </div>
        <div className="panel-footer AgendaCardComposer-footer">
          <button 
            type="button" 
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