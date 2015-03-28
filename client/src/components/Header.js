var FluxComponent = require('flummox/component');
var HeaderUserNav = require('components/HeaderUserNav');
var React = require('react');

var joinClasses = require('react/lib/joinClasses');
var userPropType = require('types/userPropType');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./Header.css');

var Header = React.createClass({

  propTypes: {
    currentUser: userPropType
  },

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
            <HeaderUserNav currentUser={this.props.currentUser}/>
          </div> 
        </div>
      </nav>
    );
  }

});

module.exports = Header;