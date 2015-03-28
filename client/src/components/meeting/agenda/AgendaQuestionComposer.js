var React = require('react/addons');
var {LinkedStateMixin} = React.addons;

require('3rdparty/bootstrap/css/bootstrap.css');

const ENTER_KEY = 13;
const MIN_POST_LENGTH = 1;

var AgendaQuestionComposer = React.createClass({

  mixins: [LinkedStateMixin],

  propTypes: {
    topicId: React.PropTypes.number,
    userId: React.PropTypes.number
  },

  getInitialState: function() {
    return {
      text: '' 
    };
  },

  handleKeyUp: function(e) {
    // TODO: Implement agenda actions for all of this.
        
    // var QuestionActions = this.context.flux.getActions('question');

    // if (e.keyCode === ENTER_KEY && this.state.text.length > MIN_POST_LENGTH) {
    //   QuestionActions.create(
    //     this.props.topicId,
    //     this.props.userId,
    //     this.state.text
    //   );

    //   this.setState({text: ''});
    // }
  },

  render: function() {
    return (
      <div className="media">
        <div className="media-body">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Type a question..."
            valueLink={this.linkState('text')}
            onKeyUp={this.handleKeyUp}
          />
        </div>
      </div>
    );
  }

});

module.exports = AgendaQuestionComposer;
