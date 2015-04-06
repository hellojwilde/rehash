"use strict";

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react/addons");
var ComponentPropType = require("react-pick/lib/helpers/ComponentPropType");

var PureRenderMixin = React.addons.PureRenderMixin;

var moment = require("moment");

var CalendarHeader = React.createClass({
  displayName: "CalendarHeader",

  mixins: [PureRenderMixin],

  propTypes: {
    getHeadingId: React.PropTypes.func.isRequired,
    onMonthChange: React.PropTypes.func.isRequired,
    month: React.PropTypes.object.isRequired,
    buttonComponent: ComponentPropType
  },

  getDefaultProps: function getDefaultProps() {
    return {
      buttonComponent: "button"
    };
  },

  handleNextButtonClick: function handleNextButtonClick() {
    this.props.onMonthChange(moment(this.props.month).add(1, "months"));
  },

  handlePreviousButtonClick: function handlePreviousButtonClick() {
    this.props.onMonthChange(moment(this.props.month).subtract(1, "months"));
  },

  render: function render() {
    var ButtonComponent = this.props.buttonComponent;
    var _props = this.props;
    var getHeadingId = _props.getHeadingId;
    var month = _props.month;

    var otherProps = _objectWithoutProperties(_props, ["getHeadingId", "month"]);

    return React.createElement(
      "div",
      _extends({}, otherProps, { className: "CalendarHeader" }),
      React.createElement(
        ButtonComponent,
        {
          className: "CalendarHeader-previousButton",
          onClick: this.handlePreviousButtonClick,
          tabIndex: "0" },
        "◀"
      ),
      React.createElement(
        ButtonComponent,
        {
          className: "CalendarHeader-nextButton",
          onClick: this.handleNextButtonClick,
          tabIndex: "0" },
        "▶"
      ),
      React.createElement(
        "div",
        {
          "aria-live": "assertive",
          "aria-atomic": "true",
          className: "CalendarHeader-heading",
          id: getHeadingId(),
          role: "heading" },
        month.format("MMMM YYYY")
      )
    );
  }

});

module.exports = CalendarHeader;