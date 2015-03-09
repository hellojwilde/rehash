var React = require('react');
var {Link} = require('react-router');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./DebriefAttendeesPanel.css');

var DebriefAttendeesPanel = React.createClass({

  render: function() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          Attendees
        </div>

        <div className="panel-body row">
          <div className="col-sm-6 col-md-4 Attendee">
            <img 
              src="http://placehold.it/50x50" 
              className="pull-left img-thumbnail Attendee-thumbnail"
            />

            <div className="Attendee-info">
              <p className="Attendee-name">Andreas Moser</p>
              <p className="Attendee-affiliation">MIT Media Lab</p>
            </div>
          </div>
          <div className="col-sm-6 col-md-4 Attendee">
            <img 
              src="http://placehold.it/50x50" 
              className="pull-left img-thumbnail Attendee-thumbnail"
            />

            <div className="Attendee-info">
              <p className="Attendee-name">Silya Mezyan</p>
              <p className="Attendee-affiliation">Al Akhawayn University</p>
            </div>
          </div>
          <div className="col-sm-6 col-md-4 Attendee">
            <img 
              src="http://placehold.it/50x50" 
              className="pull-left img-thumbnail Attendee-thumbnail"
            />

            <div className="Attendee-info">
              <p className="Attendee-name">Karina Wójcik</p>
              <p className="Attendee-affiliation">Harvard School of Public Health</p>
            </div>
          </div>
          <div className="col-sm-6 col-md-4 Attendee">
            <img 
              src="http://placehold.it/50x50" 
              className="pull-left img-thumbnail Attendee-thumbnail"
            />

            <div className="Attendee-info">
              <p className="Attendee-name">Biel Pérez</p>
              <p className="Attendee-affiliation">University of Barcelona</p>
            </div>
          </div>
        </div>

        <ul className="list-group">
          <li className="list-group-item">
            <div className="JoinOption">
              <Link
                to="paid"
                role="button" 
                className="btn btn-success pull-left JoinOption-join">
                <span className="glyphicon glyphicon-plus"></span> Join
              </Link>

              <p className="JoinOption-cost pull-right">
                $1.99
              </p>

              <p className="JoinOption-details">
                Watch and ask questions live
              </p>
            </div>
          </li>
        </ul>
      </div>
    );
  }

});

module.exports = DebriefAttendeesPanel;