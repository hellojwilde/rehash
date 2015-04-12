var HeaderExplain = require('components/explore/HeaderExplain');
var LinkNoClobber = require('components/common/LinkNoClobber');
var LoginButton = require('components/common/LoginButton');
var CreateButton = require('components/common/CreateButton');
var React = require('react');
var ScrollListenerMixin = require('react-scroll-components/ScrollListenerMixin');
var Logo = require('components/common/Logo');

var getLinearInterpolation = require('helpers/getLinearInterpolation');
var getUniqueId = require('react-pick/lib/helpers/getUniqueId');
var joinClasses = require('react/lib/joinClasses');
var userPropType = require('types/userPropType');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./Header.css');

var Header = React.createClass({

  mixins: [ScrollListenerMixin],

  propTypes: {
    currentUser: userPropType
  },

  getInitialState: function() {
    return {
      id: getUniqueId('Header'),
      transition: {start: 0, end: Infinity, scale: 1},
      isExpanded: false
    };
  },

  handleCreateButtonRef: function(button) {
    if (!button) {
      return;
    }

    var headerRect = this.refs['header'].getDOMNode().getBoundingClientRect();
    var buttonRect = button.getDOMNode().getBoundingClientRect();
    var scrollTop = window.scrollY;

    this.setState({
      transition: {
        start: (buttonRect.top + scrollTop) - headerRect.height,
        end: (buttonRect.bottom + scrollTop) - headerRect.height,
        scale: headerRect.height / buttonRect.height
      }
    });
  },

  handleToggleClick: function() {
    this.setState({isExpanded: !this.state.isExpanded});
  },

  renderUserNav: function() {
    if (this.props.currentUser) {
      return [
        <li key="name">
          <p className="navbar-text">
            {this.props.currentUser.name}
          </p>
        </li>,
        <li key="logout"><a href="/user/logout">Log out</a></li>
      ];
    } else {
      return [
        <li key="login"><LoginButton/></li>
      ];
    }
  },

  renderCreateButton: function() {
    var buttonTop = getLinearInterpolation(
      this.state.scrollTop, 
      this.state.transition.start,
      this.state.transition.end,
      45,
      0
    );

    return (
      <li className="Header-create">
        <CreateButton 
          style={{top:buttonTop}} 
          className="Header-create-button navbar-btn"
        />
      </li>
    );
  },

  render: function() {
    var {children, className, ...otherProps} = this.props;

    return (
      <div className="Header">
        <nav 
          {...otherProps}
          ref="header"
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

              <Logo className="navbar-brand"/>
            </div>

            <div 
              aria-expanded={this.state.isExpanded+''}
              id={this.state.id} 
              className={joinClasses(
                'collapse navbar-collapse navbar-right',
                this.state.isExpanded && 'in'
              )}>
              <ul className="nav navbar-nav">
                {this.renderCreateButton()}
                {this.renderUserNav()}
              </ul>
            </div> 
          </div>
        </nav>

        {(this.props.currentUser === null) 
          ? <HeaderExplain createButtonRef={this.handleCreateButtonRef}/>
          : null}
      </div>
    );
  }

});

module.exports = Header;