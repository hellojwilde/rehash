var React = require('react');

var ModalStack = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    stack: React.PropTypes.arrayOf(React.PropTypes.shape({
      component: React.PropTypes.func.isRequired,
      props: React.PropTypes.shape({
        message: React.PropTypes.string,
        onCancel: React.PropTypes.func,
        onComplete: React.PropTypes.func
      }).isRequired
    })).isRequired
  },

  handleModalCancel: function(onCancelCallback) {
    this.context.flux.getActions('modal').pop();
    onCancelCallback && onCancelCallback();
  },

  handleModalComplete: function(onCompleteCallback) {
    this.context.flux.getActions('modal').pop();
    onCompleteCallback && onCompleteCallback();
  },

  render: function() {
    return (
      <div className="ModalStack">
        {this.props.stack.map((modal, idx) => {
          var Component = modal.component;
          var {message, onCancel, onComplete} = modal.props;

          return (
            <Component 
              key={idx}
              message={message || null}
              onCancel={this.handleModalCancel.bind(this, onCancel)}
              onComplete={this.handleModalComplete.bind(this, onComplete)}
            />
          );
        })}
      </div>
    );
  }

});

module.exports = ModalStack;