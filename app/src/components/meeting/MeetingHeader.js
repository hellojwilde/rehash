var Header = require('components/Header');
var MeetingJoinButton = require('components/meeting/MeetingJoinButton');
var React = require('react');
var {Link} = require('react-router');
var {ScrollListenerMixin} = require('react-scroll-components');

var moment = require('moment');
var getLinearInterpolation = require('helpers/getLinearInterpolation');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./MeetingHeader.css');

var MeetingHeader = React.createClass({

  mixins: [ScrollListenerMixin],

  propTypes: {
    id: React.PropTypes.number.isRequired,
    title: React.PropTypes.string.isRequired,
    start: React.PropTypes.object.isRequired,
    end: React.PropTypes.object.isRequired,
    isJoined: React.PropTypes.bool.isRequired,
  },

  getInitialState: function() {
    return {
      transitionStart: 0,
      transitionEnd: Infinity,
      transitionScale: 1
    };
  },

  componentDidMount: function() {
    var headerRect = this.refs.header.getDOMNode().getBoundingClientRect();
    var contentRect = this.refs.content.getDOMNode().getBoundingClientRect();
    var scrollTop = this.state.scrollTop;

    this.setState({
      transitionStart: (contentRect.top + scrollTop) - headerRect.height,
      transitionEnd: (contentRect.bottom + scrollTop) - headerRect.height,
      transitionScale: (0.8 * headerRect.height) / contentRect.height
    });
  },

  render: function() {
    var headerTextTop = getLinearInterpolation(
      this.state.scrollTop, 
      this.state.transitionStart,
      this.state.transitionEnd,
      40,
      0
    );
    var contentOpacity = getLinearInterpolation(
      this.state.scrollTop,
      this.state.transitionStart,
      this.state.transitionEnd,
      1,
      0
    ); 

    return (
      <div className="MeetingHeader">
        <Header ref="header" className="MeetingHeader-header">
          <p 
            className="navbar-text MeetingHeader-title"
            style={{top: headerTextTop}}>
            {this.props.title}
          </p>
        </Header>

        <div className="MeetingHeader-preview">
          <div className="container">
            <div className="MeetingHeader-content">
              <div 
                className="MeetingHeader-content-inner"
                style={{opacity: contentOpacity}}>
                <div ref="content">
                  <div className="MeetingHeader-join pull-right">
                    <MeetingJoinButton 
                      id={this.props.id}
                      isJoined={this.props.isJoined}
                    />
                  </div>

                  <h1>{this.props.title}</h1>
                  <p className="lead">
                    {this.props.start.calendar()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = MeetingHeader;
