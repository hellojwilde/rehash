var FluxComponent = require('flummox/component');
var HeaderUserLinks = require('components/common/HeaderUserLinks');
var React = require('react');

var getUniqueId = require('react-pick/lib/helpers/getUniqueId');
var joinClasses = require('react/lib/joinClasses');
var userPropType = require('types/userPropType');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./Header.css');

var Header = React.createClass({

  propTypes: {
    currentUser: userPropType
  },

  getInitialState: function() {
    return {
      id: getUniqueId('Header'),
      isExpanded: false
    };
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
              aria-expanded={this.state.isExpanded+''}
              target={'#' + this.state.id}
              type="button" 
              className="navbar-toggle collapsed">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>

            <a className="navbar-brand Header-brand" href="#">Rehash</a>

            {this.props.children}
          </div>

          <div 
            aria-expanded={this.state.isExpanded+''}
            id={this.state.id} 
            className={joinClasses(
              'collapse navbar-collapse navbar-right',
              this.state.isExpanded && 'in'
            )}>
            <HeaderUserLinks currentUser={this.props.currentUser}/>
          </div> 
        </div>
      </nav>
    );
  }

});

module.exports = Header;