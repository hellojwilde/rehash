var React = require('react');

var joinClasses = require('react/lib/joinClasses');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./AgendaOnline.css');

var AgendaOnline = React.createClass({

  render: function() {
    var {className, ...otherProps} = this.props;

    return (
      <div {...otherProps} className={joinClasses('AgendaOnline', className)}>
        <h3 className="AgendaOnline-title">Online</h3>

        <img 
          src="http://placehold.it/30x30" 
          className="img-thumbnail AgendaOnline-thumbnail"
        />
        <img 
          src="http://placehold.it/30x30" 
          className="img-thumbnail AgendaOnline-thumbnail"
        />
        <img 
          src="http://placehold.it/30x30" 
          className="img-thumbnail AgendaOnline-thumbnail"
        />
      </div>
    );
  }

});

module.exports = AgendaOnline;