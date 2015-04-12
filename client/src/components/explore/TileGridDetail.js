var React = require('react');
var LinkNoClobber = require('components/common/LinkNoClobber');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./TileGridDetail.css');

const DEFAULT_HEIGHT = 500;

var TileGridDetail = React.createClass({

  propTypes: {
    column: React.PropTypes.number.isRequired
  },

  render: function() {
    var height = 0.8 * (window.innerHeight || DEFAULT_HEIGHT);

    return (
      <div className="TileGridDetail" style={{height}}>
        {this.props.children}

        <div className="TileGridDetail-header">
          {/* TODO (jwilde): Implement the arrow pointing at the tile... */}

          <div className="container">
            <LinkNoClobber to="explore" className="pull-right btn btn-link">
              <span className="glyphicon glyphicon-remove"></span>
            </LinkNoClobber>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = TileGridDetail;