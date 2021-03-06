var React = require('react');
var CreateButton = require('components/common/CreateButton');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./HeaderExplain.css');

var HeaderExplain = React.createClass({

  propTypes: {
    createButtonRef: React.PropTypes.func
  },

  render: function() {
    return (
      <div className="HeaderExplain">
        <div className="container">
          <div className="row">
            <div className="col-sm-8">
              <h2 className="HeaderExplain-heading">
                Rehash brings you together with amazing people from around the
                world over video.
              </h2>
            </div>
            <div className="col-sm-4">
              <CreateButton 
                ref={this.props.createButtonRef} 
                className="HeaderExplain-button btn-lg btn-block"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = HeaderExplain;