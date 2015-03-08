var React = require('react');

require('./DebriefUnpaid.css');

var DebriefUnpaid = React.createClass({

  render: function() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-5 col-md-4">
            <div className="panel panel-default SpeakerPanel">
              <div className="panel-heading SpeakerPanel-heading">
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
          </div>

          <div className="col-sm-7 col-md-8">
            <div className="panel panel-default">
              <div className="panel-body">
                <p className="lead">
                  Michael Evans will discuss how enabling policy makers and 
                  regular people to parse tough data allows for better 
                  decisions and informed communities.
                </p>
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">
                Agenda Highlights
              </div>

              <ul className="list-group">
                <li className="list-group-item">
                  Challenges with data analysis at Forrst
                </li>
                <li className="list-group-item">
                  What are the most common pitfalls with data-driven policy?
                </li>
                <li className="list-group-item">
                  Why is enabling regular people so important?
                </li>
              </ul>
            </div>

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
                    <a 
                      href="#" 
                      role="button" 
                      className="btn btn-success pull-left JoinOption-join">
                      <span className="glyphicon glyphicon-plus"></span> Join
                    </a>

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
          </div>
        </div>
      </div>
    );
  }

});

module.exports = DebriefUnpaid;