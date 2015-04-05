"use strict";

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");
var ComponentPropType = require("react-pick/lib/helpers/ComponentPropType");

var joinClasses = require("react/lib/joinClasses");

var CalendarToggleButton = React.createClass({
  displayName: "CalendarToggleButton",

  propTypes: {
    buttonComponent: ComponentPropType
  },

  getDefaultProps: function getDefaultProps() {
    return {
      buttonComponent: "button"
    };
  },

  render: function render() {
    var ButtonComponent = this.props.buttonComponent;
    var _props = this.props;
    var className = _props.className;

    var otherProps = _objectWithoutProperties(_props, ["className"]);

    return React.createElement(
      ButtonComponent,
      _extends({}, otherProps, {
        className: joinClasses("CalendarToggleButton", className) }),
      "📅"
    );
  }

});

module.exports = CalendarToggleButton;