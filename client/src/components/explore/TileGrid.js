var React = require('react/addons');
var TileGridDetail = require('./TileGridDetail');
var Tile = require('./Tile');

var {CSSTransitionGroup} = React.addons;

var _ = require('lodash');
var meetingPropType = require('types/meetingPropType');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./TileGrid.css');

function getColumnsForWindow() {
  var width = window.innerWidth;
  if (width > 768) {
    return 3;
  } else if (width > 992){
    return 2;
  } else {
    return 1;
  }
}

var TileGrid = React.createClass({

  propTypes: {
    meetings: React.PropTypes.arrayOf(meetingPropType),
    detailMeetingKey: React.PropTypes.string,
    detail: React.PropTypes.element
  },

  getDefaultProps: function() {
    return {
      meetings: [],
      detailMeetingKey: null,
      detail: null
    };
  },

  handleDetailRef: function(detail) {
    if (!detail) {
      return;
    }

    var detailNode = detail.getDOMNode();

    // XXX Sometimes the animation breaks when we call the scroll animation
    // without the requisite setTimeout, so adding a setTimeout around it.
    setTimeout(() => {
      $('body').animate({
        scrollTop: (
          $(detailNode).offset().top -
          (window.innerHeight - parseInt(detailNode.style.height, 10)) + 20
        )
      }, 300);
    }, 0);
  },

  render: function() {
    var {meetings, detailMeetingKey, detail} = this.props;
    var rows = _.chunk(meetings, getColumnsForWindow());

    return (
      <div className="TileGrid">
        {rows.map((meetingsForRow, idx) => {
          var rowDetailIndex = _.findIndex(
            meetingsForRow, 
            _.matchesProperty('key', detailMeetingKey)
          );

          return (
            <div className="TileGrid-row" key={idx}>
              <div className="container">
                <div className="row">
                  {meetingsForRow.map((meeting, idx) => (
                    <div key={idx} className="col-md-4 col-sm-6">
                      <Tile {...meeting} meetingKey={meeting.key} />
                    </div>
                  ))}
                </div>
              </div>

              <CSSTransitionGroup 
                className="TileGrid-transition"
                component="div"
                transitionName="TileGrid-transition">
                {rowDetailIndex !== -1 && (
                  <TileGridDetail 
                    ref={this.handleDetailRef}
                    key="detail" 
                    column={rowDetailIndex}>
                    {detail}
                  </TileGridDetail>
                )}
              </CSSTransitionGroup>
            </div>
          );
        })}
      </div>
    );
  }

});

module.exports = TileGrid;