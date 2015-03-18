var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./OverviewDescription.css');

const DEMO_DESCRIPTION = 
  'Coleen Jose will discuss the process of reporting on the rapid increase \
  in outsourcing operations in the Philippines and the impacts on \
  Philippine youth.';

var OverviewDescription = React.createClass({

  propTypes: {
    description: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      description: DEMO_DESCRIPTION
    };
  },

  render: function() {
    return (
      <div className="panel panel-default OverviewDescription">
        <div className="panel-body">
          <p className="lead">
            {this.props.description}
          </p>
        </div>
      </div>
    );
  }

});

module.exports = OverviewDescription;