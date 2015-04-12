var React = require('react');

var cardPropType = require('types/cardPropType');

require('./AgendaList.css');

var AgendaList = React.createClass({

  propTypes: {
    isHost: React.PropTypes.bool.isRequired,
    topics: React.PropTypes.arrayOf(cardPropType)
  },

  getDefaultProps: function() {
    return {
      topics: []
    };
  },

  render: function() {
    if (this.props.topics.length === 0) {
      return (
        <div className="AgendaList AgendaList--empty">
          <div>
            <p><span className="glyphicon glyphicon-list"/></p>
            <p>The host hasn't added an agenda yet.</p>
            <p>They should get on that.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="AgendaList">

      </div>
    );
  }

});

module.exports = AgendaList;