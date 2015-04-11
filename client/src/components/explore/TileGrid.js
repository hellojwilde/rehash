var React = require('react');
var TileGridDetail = require('./TileGridDetail');
var Tile = require('./Tile');

var _ = require('lodash');

const COLUMNS = 3;

require('3rdparty/bootstrap/css/bootstrap.css');

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
              <TileGridDetail column={idx}>{detail}</TileGridDetail>
            )}
          </div>
        ))}
      </div>
    );
  }

});

module.exports = TileGrid;