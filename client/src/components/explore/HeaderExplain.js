var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./HeaderExplain.css');

var HeaderExplain = React.createClass({

  render: function() {
    return (
      <div className="HeaderExplain">
        <div className="container">
          <div className="row">
            <div className="col-xs-8">
              <h2 className="HeaderExplain-heading">
                Rehash brings you together with amazing people from around the
                world over video.
              </h2>
            </div>
            <div className="col-xs-4">
              <button className="HeaderExplain-button btn btn-block btn-default">
                <span 
                  aria-hidden="true" 
                  className="glyphicon glyphicon-plus">
                </span>
                {' '}
                Create Rehash
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = HeaderExplain;