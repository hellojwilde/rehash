var React = require('react');

var joinClasses = require('react/lib/joinClasses');

require('3rdparty/bootstrap/css/bootstrap.css');

var MeetingLayout = React.createClass({

  render: function() {
    var {className, ...otherProps} = this.props;

    return (
      <div {...otherProps} className={joinClasses('container', className)}>
        <div className="row">
          {this.props.children}
        </div>
      </div>
    );
  }

});

module.exports = MeetingLayout;