var HeaderExplain = require('components/explore/HeaderExplain');
var HeaderUserLinks = require('components/explore/HeaderUserLinks');
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

  handleToggleClick: function() {
    this.setState({isExpanded: !this.state.isExpanded});
  },

  render: function() {
    var {children, className, ...otherProps} = this.props;

    return (
      <div className="Header">
        <nav 
          {...otherProps}
          className={joinClasses(
            className, 
            'navbar navbar-default navbar-fixed-top'
          )}>
          <div className="container">
            <div className="navbar-header">
              <button
                aria-expanded={this.state.isExpanded+''}
                className="navbar-toggle collapsed"
                onClick={this.handleToggleClick}
                target={'#' + this.state.id}
                type="button">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>

              <a className="navbar-brand Header-brand" href="#">Rehash</a>
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

        {(this.props.currentUser === null) ? <HeaderExplain/> : null}
      </div>
    );
  }

});

module.exports = Header;