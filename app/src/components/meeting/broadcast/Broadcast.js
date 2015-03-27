var React = require('react');

var Broadcast = React.createClass({

  // put all broadcast staff here! 
 //  componentDidMount(){
	// // React.findDOMNode(this)\
	// this.refs.localvideo.getDOMNode()
 //  }

  render: function() {
    return (
      <div className="well">
        <div id="localVideo">
        </div>
        Broadcast should appear here.
      </div>
    );
  }

});

module.exports = Broadcast;