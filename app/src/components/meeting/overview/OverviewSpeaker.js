var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./OverviewSpeaker.css');

var OverviewSpeaker = React.createClass({

  propTypes: {
    id: React.PropTypes.number.isRequired,
    photoUrl: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    bio: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <div className="panel panel-default OverviewSpeaker">
        <div className="panel-heading OverviewSpeaker-heading">
          {this.props.name}
        </div>

        <div className="panel-body" id="container">
          <img src={this.props.photoUrl} alt={`${this.props.name} (photo)`}/>
          <p>{this.props.bio}</p>
        </div>
      </div>
    );
  }
});

module.exports = OverviewSpeaker;