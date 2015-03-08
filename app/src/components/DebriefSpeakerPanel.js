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

        <img
          className="img-responsive"
          src="http://placehold.it/300x200"
        />

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
      </div>
    );
  }

});

module.exports = DebriefSpeakerPanel;