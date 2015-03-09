var React = require('react');
var DebriefBroadcast = require('components/DebriefBroadcast');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./DebriefPaid.css');

var DebriefPaid = React.createClass({

  render: function() {
    return (
      <div className="DebriefPaid">
        <div className="DebriefAgendaHeader">
          <div className="pull-right DebriefAgendaHeader-online">
            <h3 className="DebriefAgendaHeader-online-title">Online</h3>

            <img 
              src="http://placehold.it/30x30" 
              className="img-thumbnail DebriefAgendaHeader-online-thumbnail"
            />
            <img 
              src="http://placehold.it/30x30" 
              className="img-thumbnail DebriefAgendaHeader-online-thumbnail"
            />
            <img 
              src="http://placehold.it/30x30" 
              className="img-thumbnail DebriefAgendaHeader-online-thumbnail"
            />
          </div>

          <h2 className="DebriefAgendaHeader-title">Agenda</h2>
        </div>

        <DebriefBroadcast/>

        <div className="panel panel-default">
          <div className="panel-body">
            <p className="lead">
              Challenges with data analysis at Forrst. 
              Discussion of how to balance quantitative and
              qualitative data in understanding audiences.
            </p>

            <h4>Questions</h4>

            <div className="media">
              <div className="media-left">
                <img 
                  src="http://placehold.it/50x50" 
                  className="img-thumbnail"
                />
              </div>

              <div className="media-body">
                <p>What are the most common pitfalls with data-driven policy?</p>
              </div>
            </div>

            <div className="media">
              <div className="media-left">
                <img 
                  src="http://placehold.it/50x50" 
                  className="img-thumbnail"
                />
              </div>

              <div className="media-body">
                <p>
                  Why is it so important to use both quanitative and 
                  qualitative measurement in developing policy? Why not just 
                  use one?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = DebriefPaid;