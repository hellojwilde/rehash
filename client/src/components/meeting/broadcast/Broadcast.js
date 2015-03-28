
require('3rdparty/bootstrap/css/bootstrap.css');
require('./Broadcast.css');
var React = require('react');

var video;


var Broadcast = React.createClass({

  componentDidMount: function() {
    this.initialize();
  },


  initialize: function(){
    video = React.findDOMNode(this.refs.broadcast_video);
    video.poster = "http://static1.squarespace.com/static/511b9e98e4b0d00cab6bb783/547a5522e4b0306d2b1e2c5f/547a574de4b0d64f97a6a39f/1417303893172/buffering-animation.gif?";
    //openChannel();
    //maybeRequestTurn();
  },

  render: function() {
    return (
      <div className="panel panel-default broadcast">
        <video className="broadcast_video" ref="broadcast_video">
        </video>
        Broadcast should appear here.
      </div>
    );
  }

});

module.exports = Broadcast;