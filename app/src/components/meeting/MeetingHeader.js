var React = require('react');
var Header = require('components/Header');
var DebriefJoinButton = require('components/DebriefJoinButton');
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

var DebriefHeader = React.createClass({

  mixins: [ScrollListenerMixin],

  propTypes: {
    title: React.PropTypes.string,
    start: React.PropTypes.object,
    end: React.PropTypes.object,
    isJoined: React.PropTypes.bool,
    cost: React.PropTypes.string
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
      <span className="label label-danger DebriefHeader-live">
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
      <div className="DebriefHeader">
        <Header ref="header" className="DebriefHeader-header">
          <p 
            className="navbar-text DebriefHeader-title"
            style={{top: headerTextTop}}>
            {this.props.title}
            {liveNowBadge}
          </p>
        </Header>

        <div className="DebriefHeader-preview">
          <div className="container">
            <div className="DebriefHeader-content">
              <div 
                className="DebriefHeader-content-inner"
                style={{opacity: contentOpacity}}>
                <div ref="content">
                  <div className="DebriefHeader-join pull-right">
                    <DebriefJoinButton 
                      isJoined={true}
                      cost={this.props.cost}
                    />
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

module.exports = DebriefHeader;