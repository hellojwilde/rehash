"use strict";

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var CalendarGrid = require("./CalendarGrid");
var CalendarHeader = require("./CalendarHeader");
var React = require("react/addons");

var PureRenderMixin = React.addons.PureRenderMixin;

var moment = require("moment");
var joinClasses = require("react/lib/joinClasses");
var getUniqueId = require("react-pick/lib/helpers/getUniqueId");

var Calendar = React.createClass({
  displayName: "Calendar",

  mixins: [PureRenderMixin],

  propTypes: {
    month: React.PropTypes.object.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onComplete: React.PropTypes.func.isRequired,
    onMonthChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      value: null
    };
  },

  getInitialState: function getInitialState() {
    return {
      id: getUniqueId("Calendar")
    };
  },

  getHeadingId: function getHeadingId() {
    return "" + this.state.id + "-heading";
  },

  focusOnGrid: function focusOnGrid() {
    this.refs.grid.getDOMNode().focus();
  },

  render: function render() {
    var _props = this.props;
    var buttonComponent = _props.buttonComponent;
    var className = _props.className;
    var month = _props.month;
    var value = _props.value;
    var onMonthChange = _props.onMonthChange;
    var onChange = _props.onChange;
    var onComplete = _props.onComplete;
    var onCancel = _props.onCancel;

    var otherProps = _objectWithoutProperties(_props, ["buttonComponent", "className", "month", "value", "onMonthChange", "onChange", "onComplete", "onCancel"]);

    return React.createElement(
      "div",
      _extends({}, otherProps, { className: joinClasses("Calendar", className) }),
      React.createElement(CalendarHeader, _extends({ month: month, onMonthChange: onMonthChange, buttonComponent: buttonComponent }, {
        getHeadingId: this.getHeadingId
      })),
      React.createElement(CalendarGrid, _extends({ month: month, value: value, onChange: onChange, onComplete: onComplete, onCancel: onCancel }, {
        ref: "grid",
        "aria-labelledby": this.getHeadingId(),
        tabIndex: "0"
      }))
    );
  }

});

module.exports = Calendar;