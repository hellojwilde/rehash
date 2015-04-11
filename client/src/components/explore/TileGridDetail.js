var React = require('react');
var {Link} = require('react-router');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./TileGridDetail.css');

var TileGridDetail = React.createClass({

  propTypes: {
    column: React.PropTypes.number.isRequired
  },

  render: function() {
    return (
      <div className="TileGridDetail">
        {/* TODO (jwilde): Implement the arrow pointing at the tile... */}

        <div className="TileGridDetail-main">
          <div className="container">
            <Link to="explore" className="pull-right btn">
              <span className="glyphicon glyphicon-remove"></span>
            </Link>
          </div>

          {this.props.children}
        </div>
      </div>
    );
  }

});

module.exports = TileGridDetail;