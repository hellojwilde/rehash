var React = require('react');

var joinClasses = require('react/lib/joinClasses');

require('3rdparty/bootstrap/css/bootstrap.css');

var Modal = React.createClass({

  render: function() {
    var {className, children} = this.props;

    return (
      <div className="modal" style={{display: 'block'}}>
        <div className={joinClasses('modal-dialog', className)}>
          <div className="modal-content">
            {children}
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Modal;