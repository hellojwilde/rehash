var React = require('react');

var joinClasses = require('react/lib/joinClasses');

require('./ArrowMask.css');

var ArrowMask = React.createClass({

  propTypes: {
    columns: React.PropTypes.number.isRequired,
    column: React.PropTypes.number.isRequired
  },

  render: function() {
    var {column, columns} = this.props;

    return (
      <div className="ArrowMask">
        <div className="ArrowMask-container-margin"/>
        <div className="container ArrowMask-container">
          <div className="row ArrowMask-row">
            <div className={joinClasses(
              'ArrowMask-row-left-margin',
              `ArrowMask-row-left-margin-col-${column}`,
              `ArrowMask-row-left-margin-cols-${columns}`
            )}/>
            <div className="col-md-4 col-sm-6 ArrowMask-cell">
              <div className="ArrowMask-cell-fill"/>
              <div className="ArrowMask-cell-arrow-left"/>
              <div className="ArrowMask-cell-arrow-right"/>
              <div className="ArrowMask-cell-fill"/>
            </div>
            <div className={joinClasses(
              'ArrowMask-row-right-margin',
              `ArrowMask-row-right-margin-col-${column}`,
              `ArrowMask-row-right-margin-cols-${columns}`
            )}/>
          </div>
        </div>
        <div className="ArrowMask-container-margin"/>
      </div>
    );
  }
});

module.exports = ArrowMask;