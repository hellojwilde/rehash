var React = require('react');
var TimeInput = require('../src/TimeInput');
var DateInput = require('../src/DateInput');

require('react-pick/lib/styles.css');
require('../src/styles.css');

var App = React.createClass({

  getInitialState: function() {
    return {
      dateValue: null,
      timeValue: {inputValue: '', selectedValue: null}
    };
  },

  handleDateChange: function(dateValue) {
    this.setState({dateValue});
  },

  handleTimeChange: function(timeValue) {
    this.setState({timeValue});
  },

  render: function() {
    var {selectedTime} = this.state.timeValue;
    var selectedDate = this.state.dateValue;

    return (
      <div>
        <h1>react-pick-datetime</h1>

        <h2>DateInput</h2>
        <p>Selected Date: {selectedDate && selectedDate.format()}</p>
        <DateInput 
          placeholder="Pick a date..."
          value={selectedDate} 
          onChange={this.handleDateChange}
        />

        <h2>TimeInput</h2>
        <p>Selected Time: {selectedTime && selectedTime.value.format()}</p>
        <TimeInput 
          placeholder="Type a time..."
          value={this.state.timeValue} 
          onChange={this.handleTimeChange}
        />
        <div><button>something else to focus</button></div>
      </div>
    );
  }

});

React.render(<App/>, document.body);