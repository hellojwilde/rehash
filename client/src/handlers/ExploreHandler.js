var FluxComponent = require('flummox/component');
var Footer = require('components/explore/Footer');
var Header = require('components/explore/Header');
var ExploreLayout = require('components/explore/ExploreLayout');
var ExploreLayoutContent = require('components/explore/ExploreLayoutContent');
var React = require('react');
var TileGrid = require('components/explore/TileGrid');
var {RouteHandler} = require('react-router');

var _ = require('lodash');

var ExploreHandler = React.createClass({

  statics: {
    ensureDataAvailable: function(state, registry) {
      return registry.getActions('explore').fetch();
    }
  },

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  render: function() {
    var {meetingId} = this.context.router.getCurrentParams();

    return (
      <div className="ExploreHandler">
        <ExploreLayout>
          <ExploreLayoutContent>
            <FluxComponent 
              connectToStores={['currentUser']}
              render={({user}) => <Header currentUser={user}/>}
            />
            <FluxComponent
              connectToStores={['meeting']}
              stateGetter={([meetingStore]) => ({
                meetings: meetingStore.getAll()
              })}
              render={(state) => (
                <TileGrid 
                  {...state}
                  ref="grid"
                  detailMeetingId={meetingId}
                  detail={<RouteHandler/>}
                />
              )}
            />
          </ExploreLayoutContent>
          <Footer/>
        </ExploreLayout>
      </div>
    );
  }

});

module.exports = ExploreHandler;