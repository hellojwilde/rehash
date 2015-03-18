var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./OverviewSpeaker.css');

const DEMO_SPEAKER = {
  id: 7,
  photoUrl: 'http://placehold.it/200x170',
  name: 'Coleen Jose',
  bio: 
    'Coleen Jose is an American-Filipino multimedia journalist and \
    documentary photographer. She writes and shoots for publications in the \
    US and Philippines. She was a reporting fellow for E&E Publishing\'s \
    ClimateWire in Washington, DC.'
};

var OverviewSpeaker = React.createClass({

  propTypes: {
    id: React.PropTypes.number,
    photoUrl: React.PropTypes.string,
    name: React.PropTypes.string,
    bio: React.PropTypes.string
  },

  getDefaultProps: function() {
    return DEMO_SPEAKER;
  },

  render: function() {
    return (
      <div className="panel panel-default OverviewSpeaker">
        <div className="panel-heading OverviewSpeaker-heading">
          {this.props.name}
        </div>

        <div className="panel-body" id="container">
          <img src={this.props.photoUrl} alt={`this.props.name (photo)`}/>
          <p>{this.props.bio}</p>
        </div>
      </div>
    );
  }
});

module.exports = OverviewSpeaker;
