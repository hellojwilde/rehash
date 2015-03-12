var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./ParagraphOverview.css');

var ParagraphOverview = React.createClass({

  render: function() {
    return (
      <div className="panel panel-default ParagraphOverview">
        <div className="panel-body">
          <p className="lead">
            Michael Evans will discuss how enabling policy makers and 
            regular people to parse tough data allows for better 
            decisions and informed communities.
          </p>
        </div>
      </div>
    );
  }

});

module.exports = ParagraphOverview;