var React = require('react');
var {Link} = require('react-router');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./AttendeesOverview.css');

const DEMO_ATTENDEES = [
  {
    id: 0,
    photoThumbnailUrl: 'http://placehold.it/50x50',
    name: 'Andreas Moser',
    affiliation: 'MIT Media Lab'
  },
  {
    id: 1,
    photoThumbnailUrl: 'http://placehold.it/50x50',
    name: 'Silya Mezyan',
    affiliation: 'Al Akhawayn University'
  },
  {
    id: 2,
    photoThumbnailUrl: 'http://placehold.it/50x50',
    name: 'Karina Wójcik',
    affiliation: 'Harvard School of Public Health'
  },
  {
    id: 3,
    photoThumbnailUrl: 'http://placehold.it/50x50',
    name: 'Biel Pérez',
    affiliation: 'University of Barcelona'
  }
];

var OverviewAttendees = React.createClass({

  propTypes: {
    attendees: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      photoThumbnailUrl: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      affiliation: React.PropTypes.string
    }))
  },

  getDefaultProps: function() {
    return {
      attendees: DEMO_ATTENDEES
    };
  },

  render: function() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          Attendees
        </div>

        <div className="panel-body row">
          {this.attendees.map(function(attendee) {
            return (
              <div key={attendee.id} className="col-sm-6 col-md-4 Attendee">
                <img 
                  src={attendee.photoThumbnailUrl} 
                  className="pull-left img-thumbnail Attendee-thumbnail"
                />

                <div className="Attendee-info">
                  <p className="Attendee-name">{attendee.name}</p>
                  <p className="Attendee-affiliation">{attendee.affiliation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

});

module.exports = AttendeesOverview;