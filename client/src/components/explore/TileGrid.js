var React = require('react');
var TileGridDetail = require('./TileGridDetail');
var Tile = require('./Tile');

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

  scrollToDetail: function() {
    if (!this.refs['detail']) {
      return;
    }

    var detailOffset = 0.1 * window.innerHeight;
    var detailRect = this.refs['detail'].getDOMNode().getBoundingClientRect();

    // XXX If we don't put this in a setTimeout, the scroll doesn't 
    // consistently fire. Unclear why this is the case.
    setTimeout(() => window.scrollBy(0, detailRect.top - detailOffset), 0);
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

              {rowContainsDetail && (
                <TileGridDetail ref="detail" column={idx}>
                  {detail}
                </TileGridDetail>
              )}
            </div>
          );
        })}
      </div>
    );
  }

});

module.exports = TileGrid;