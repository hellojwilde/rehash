var React = require('react');
var Header = require('components/explore/Header');
var Footer = require('components/explore/Footer');
var FluxComponent = require('flummox/component');
var {RouteHandler} = require('react-router');

var _ = require('lodash');

var ExploreHandler = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  render: function() {
    var {meetingId} = this.context.router.getCurrentParams();

    return (
      <div className="ExploreHandler">
        <FluxComponent 
          connectToStores={['currentUser']}
          render={({user}) => <Header currentUser={user}/>}
        />
        <FluxComponent
          connectToStores={['meeting']}
          render={(meetings) => (
            <TileGrid 
              meetings={_.values(meetings)}
              detailMeetingId={meetingId}
              detail={<RouteHandler/>}
            />
          )}
        />
        <Footer/>
      </div>
    );
  }

});

module.exports = ExploreHandler;