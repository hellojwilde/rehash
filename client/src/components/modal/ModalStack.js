var React = require('react');

var ModalStack = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    stack: React.PropTypes.arrayOf(React.PropTypes.shape({
      component: React.PropTypes.func.isRequired,
      props: React.PropTypes.shape({
        onCancel: React.PropTypes.func,
        onComplete: React.PropTypes.func
      }).isRequired
    })).isRequired
  },

  handleModalCancel: function(onCancelCallback, ...args) {
    this.context.flux.getActions('modal').pop();
    onCancelCallback && onCancelCallback(...args);
  },

  handleModalComplete: function(onCompleteCallback, ...args) {
    this.context.flux.getActions('modal').pop();
    onCompleteCallback && onCompleteCallback(...args);
  },

  render: function() {
    return (
      <div className="ModalStack">
        {this.props.stack.map((modal, idx) => {
          var Component = modal.component;
          var {onCancel, onComplete, ...otherProps} = modal.props;

          return (
            <Component 
              key={idx}
              {...otherProps}
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