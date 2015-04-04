var React = require('react');
var {Link} = require('react-router');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./InviteAttendees.css');

var InviteAttendees = React.createClass({

  propTypes: {
    attendees: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      photoThumbnailUrl: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      affiliation: React.PropTypes.string
    })).isRequired
  },

  render: function() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          Attendees
        </div>

        <div className="panel-body row">
          {this.props.attendees.map(function(attendee) {
            return (
              <div key={attendee.id} className="col-sm-6 col-md-4 Attendee">
                <img 
                  src={attendee.photoThumbnailUrl} 
                  width={60}
                  height={60}
                  className="pull-left img-thumbnail Attendee-thumbnail"
                />

                <div className="Attendee-info">
                  <p className="Attendee-name">{attendee.name}</p>
                  <p className="Attendee-affiliation">{attendee.affiliation}</p>
                </div>
              </div>
            );
          })}

          {/* TODO: Wire up a new join button here. */}
        </div>
      </div>
    );
  }

});

module.exports = InviteAttendees;
