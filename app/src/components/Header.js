var React = require('react');

var joinClasses = require('react/lib/joinClasses');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./Header.css');

var Header = React.createClass({

  render: function() {
    var {children, className, ...otherProps} = this.props;

    return (
      <nav 
        {...otherProps}
        className={joinClasses(
          className, 
          'Header navbar navbar-default navbar-fixed-top'
        )}>
        <div className="container">
          <div className="navbar-header">
            <button 
              type="button" 
              className="navbar-toggle collapsed">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>

            <a className="navbar-brand Header-brand" href="#">Debrief</a>

            {this.props.children}
          </div>

          <div className="collapse navbar-collapse navbar-right">
            <ul className="nav navbar-nav">
              <li><a href="#">Logout</a></li>
            </ul>
          </div> 
        </div>
      </nav>
    );
  }

});

module.exports = Header;