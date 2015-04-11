var React = require('react');
var TileGridDetail = require('./TileGridDetail');
var Tile = require('./Tile');

var _ = require('lodash');

// TODO (jwilde): Eventually figure out how we're going to change the number
// of columns dynamically as the grid layout needs to change for different 
// screen sizes.
const COLUMNS = 3;

require('3rdparty/bootstrap/css/bootstrap.css');
require('./TileGrid.css');

var TileGrid = React.createClass({

  propTypes: {
    meetings: React.PropTypes.array,
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

  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.detail !== prevProps.detail &&
        this.refs['detail']) {
      var detailOffset = 0.1 * window.innerHeight;
      var detailRect = this.refs['detail'].getDOMNode().getBoundingClientRect();

      // XXX If we don't put this in a setTimeout, the scroll doesn't 
      // consistently fire. Unclear why this is the case.
      setTimeout(() => window.scrollBy(0, detailRect.top - detailOffset), 0);
    }
  },

  render: function() {
    var {meetings, detailMeetingId, detail} = this.props;
    var rows = _.chunk(meetings, COLUMNS);

    return (
      <div className="TileGrid">
        {rows.map((meetingsForRow, idx) => (
          <div className="TileGrid-row" key={idx}>
            <div className="container">
              <div className="row">
                <div className="col-xs-4">
                  {meetingsForRow.map((meeting, idx) => (
                    <Tile key={idx} {...meeting} />
                  ))}
                </div>
              </div>
            </div>

            {!!_.find(meetingsForRow, _.matchesProperty('id', detailMeetingId)) && (
              <TileGridDetail ref="detail" column={idx}>{detail}</TileGridDetail>
            )}
          </div>
        ))}
      </div>
    );
  }

});

module.exports = TileGrid;