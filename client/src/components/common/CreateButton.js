var CreateModal = require('modals/CreateModal');
var IconButton = require('components/common/IconButton');
var React = require('react');

var ensureCurrentUser = require('helpers/ensureCurrentUser');
var joinClasses = require('react/lib/joinClasses');

const CREATE_LOGIN_MESSSAGE = 
  'In order to create a new meeting, we\'ll need you to log in.';

var CreateButton = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  handleClick: function() {
    var modalActions = this.context.flux.getActions('modal');
    
    ensureCurrentUser(this.context.flux, CREATE_LOGIN_MESSSAGE)
      .then(() => modalActions.push(CreateModal, {}));
  },

  render: function() {
    var {className, ...otherProps} = this.props;

    return (
      <IconButton 
        {...otherProps} 
        className={joinClasses('btn-default', className)} 
        onClick={this.handleClick} 
        icon="plus">
        Create Rehash
      </IconButton>
    );
  }

});

module.exports = CreateButton;