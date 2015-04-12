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
    detailMeetingId: React.PropTypes.number,
    detail: React.PropTypes.element
  },

  getDefaultProps: function() {
    return {
      meetings: [],
      detailMeetingId: null,
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
    var {meetings, detailMeetingId, detail} = this.props;
    var rows = _.chunk(meetings, getColumnsForWindow);

    return (
      <div className="TileGrid">
        {rows.map((meetingsForRow, idx) => {
          var rowContainsDetail = !!_.find(
            meetingsForRow, 
            _.matchesProperty('id', detailMeetingId)
          );

          return (
            <div className="TileGrid-row" key={idx}>
              <div className="container">
                <div className="row">
                  <div className="col-md-4 col-sm-6">
                    {meetingsForRow.map((meeting, idx) => (
                      <Tile key={idx} {...meeting} />
                    ))}
                  </div>
                </div>
              </div>

              <CSSTransitionGroup 
                className="TileGrid-transition"
                component="div"
                transitionName="TileGrid-transition">
                {rowContainsDetail && (
                  <TileGridDetail 
                    ref={this.handleDetailRef}
                    key="detail" 
                    column={idx}>
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