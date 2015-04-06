"use strict";

var DateInput = require("../DateInput");
var React = require("react/addons");

var TestUtils = React.addons.TestUtils;
var Simulate = React.addons.TestUtils.Simulate;

var moment = require("moment");
var expect = require("expect");
var emptyFunction = require("react-pick/lib/helpers/emptyFunction");

describe("DateInput", function () {
  it("should propagate props like placeholder to the <input>", function () {
    var dateInput = TestUtils.renderIntoDocument(React.createElement(DateInput, {
      placeholder: "magic",
      onChange: emptyFunction,
      value: null
    }));

    var input = TestUtils.findRenderedDOMComponentWithTag(dateInput, "input");
    var inputAttributes = input.getDOMNode().attributes;

    expect(inputAttributes.placeholder.value).toBe("magic");
  });

  it("should show value in <input>, even when the value changes", function () {
    var date = moment();
    var dateInput = TestUtils.renderIntoDocument(React.createElement(DateInput, {
      onChange: emptyFunction,
      value: date
    }));

    var input = TestUtils.findRenderedDOMComponentWithTag(dateInput, "input");
    var inputNode = input.getDOMNode();

    expect(inputNode.value).toEqual(date.format("l"));

    var newDate = moment(date).add(1, "days");
    dateInput.setProps({ value: newDate });
    expect(inputNode.value).toEqual(newDate.format("l"));
  });
});