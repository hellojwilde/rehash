var Header = require('components/Header');
var MeetingJoinButton = require('components/MeetingJoinButton');
var React = require('react');
var {Link} = require('react-router');
var {ScrollListenerMixin} = require('react-scroll-components');

var moment = require('moment');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./MeetingHeader.css');

function getLinearInterpolation(inx, in1, in2, out1, out2) {
  var outx = out1 + ((out2 - out1) * ((inx - in1) / (in2 - in1)));

  if (out1 > out2) {
    return Math.min(Math.max(outx, out2), out1);
  } else {
    return Math.min(Math.max(outx, out1), out2);
  }
}

var MeetingHeader = React.createClass({

  mixins: [ScrollListenerMixin],

  propTypes: {
    id: React.PropTypes.number,
    title: React.PropTypes.string,
    start: React.PropTypes.object,
    end: React.PropTypes.object
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
    var isLiveNow = moment().isBetween(this.props.start, this.props.end);
    var liveNowBadge = (
      <span className="label label-danger MeetingHeader-live">
        Live Now
      </span>
    );

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
            {liveNowBadge}
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
                    <MeetingJoinButton isJoined={true}/>
                  </div>

                  <h1>{this.props.title}</h1>
                  <p className="lead">
                    {this.props.start.calendar()}
                    {liveNowBadge}
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
