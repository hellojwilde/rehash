var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./DebriefSpeakerPanel.css');

var DebriefSpeakerPanel = React.createClass({

  render: function() {
    return (
      <div className="panel panel-default DebriefSpeakerPanel">
        <div className="panel-heading DebriefSpeakerPanel-heading">
          Michael Evans

          {' '}<span className="label label-danger">Live</span>
        </div>

        <div className="panel-body" id="container">
          <div id="local">
            <video id="localVideo" muted="true"/>
          </div>   
        </div>
      
        <div id="infoDiv"></div>
        <div className="panel-body" id="">
          <div id="remote">
            <video id="remoteVideo" muted="true"/>
          </div>
          <div id="mini">
            <video id="miniVideo" muted="true"/>
          </div>  
        </div>
        <div id="status"></div>
      </div>
    );
  }
});

module.exports = DebriefSpeakerPanel;