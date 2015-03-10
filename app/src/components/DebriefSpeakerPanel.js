var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./DebriefSpeakerPanel.css');

var DebriefSpeakerPanel = React.createClass({

  render: function() {
    return (
      <div className="panel panel-default DebriefSpeakerPanel">
        <div className="panel-heading DebriefSpeakerPanel-heading">
          Michael Evans
        </div>

        <div className="panel-body" id="container">
          <div id="local">
            <video id="localVideo" autoplay="autoplay" muted="true"/>
          </div>   

        </div>
        
        <div className="panel-body">
          <p>
            Mike is a developer and previous Code for America captain 
            with development interests firmly in the civic sphere. 
            Founder of PishPosh.tv, he has worked with several startups 
            including Forrst, Creative Market and Loveland Technologies 
            developing products enabling people to learn new skills, and 
            about the world around them.
          </p>
        </div>

        <div id="remote">
          <video id="remoteVideo" autoplay="autoplay">
          </video>
          <div id="mini">
            <video id="miniVideo" autoplay="autoplay" muted="true"/>
          </div>   
        </div>
        <div id="infoDiv"></div>
        <div id="status"></div>
      </div>
    );
  }
});

module.exports = DebriefSpeakerPanel;