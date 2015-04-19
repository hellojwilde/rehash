var ArrowMask = require('components/explore/ArrowMask');
var LinkNoClobber = require('components/common/LinkNoClobber');
var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./TileGridDetail.css');

const DEFAULT_HEIGHT = 500;

var TileGridDetail = React.createClass({

  propTypes: {
    columns: React.PropTypes.number.isRequired,
    column: React.PropTypes.number.isRequired
  },

  render: function() {
    var height = 0.8 * (window.innerHeight || DEFAULT_HEIGHT);
    var column = this.props.column;

    return (
      <div className="TileGridDetail" style={{height: height}}>
        <div style={{height: height}}>
          {this.props.children}
        </div>

        <div className="TileGridDetail-header">
          <ArrowMask columns={this.props.columns} column={this.props.column}/>

          <div className="container">
            <div className="TileGridDetail-header-controls">
              <LinkNoClobber to="explore" className="pull-right btn btn-link">
                <span className="glyphicon glyphicon-remove"></span>
              </LinkNoClobber>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = TileGridDetail;