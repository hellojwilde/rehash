var CreateModal = require('modals/CreateModal');
var IconButton = require('components/common/IconButton');
var React = require('react');

var ensureCurrentUser = require('helpers/ensureCurrentUser');
var joinClasses = require('react/lib/joinClasses');

var CreateButton = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  handleClick: function() {
    ensureCurrentUser(
      this.context.flux, 
      'In order to create a new meeting, we\'ll need you to log in.'
    );

    // TODO: In the logged in case, make it work.
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